"""
Gemini/OpenAI agent implementation for the chatbot integration.
Supports both OpenAI and Google Gemini models for chat completion with tool calling capabilities.
"""
import asyncio
import os
import json
from typing import Dict, Any, List, Optional
from abc import ABC, abstractmethod
import google.generativeai as genai
from openai import OpenAI
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from src.models.conversation import Message, Conversation
from src.models.tool_call import ToolCall
from src.services.mcp_server import MCPServer


class BaseAIAgent(ABC):
    """
    Abstract base class for AI agents that interact with the chatbot system.
    """

    @abstractmethod
    async def process_message(self, user_message: str, conversation_history: List[Dict[str, str]], user_id: str, mcp_server: MCPServer) -> Dict[str, Any]:
        """
        Process a user message and return the AI response.
        """
        pass


class OpenAIAgent(BaseAIAgent):
    """
    OpenAI-based agent using ChatCompletion API with function calling capabilities.
    """

    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable is required")

        self.client = OpenAI(api_key=api_key)
        self.model = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

    async def process_message(self, user_message: str, conversation_history: List[Dict[str, str]], user_id: str, mcp_server: MCPServer) -> Dict[str, Any]:
        """
        Process a user message using OpenAI's ChatCompletion API with tool calling.
        Includes retry logic and circuit breaker for API failures.
        """
        # Get available tools from MCP server
        available_tools = await mcp_server.get_available_tools()

        # Prepare tools in OpenAI format
        tools = []
        for tool in available_tools:
            tools.append({
                "type": "function",
                "function": {
                    "name": tool.name,
                    "description": tool.description,
                    "parameters": tool.parameters
                }
            })

        # Prepare messages for the API call
        messages = [{
            "role": "system",
            "content": """You are a helpful task management assistant. Help users manage their tasks using natural language.
            You can create, list, update, complete, and delete tasks using available tools.
            Always use the appropriate tool when a user wants to perform a task operation.
            Available tools: add_task, list_tasks, update_task, delete_task, complete_task"""
        }]

        # Add conversation history
        for msg in conversation_history:
            role = msg.get("role", "user")
            if role == "assistant":
                role = "assistant"
            elif role == "user":
                role = "user"
            else:
                role = "user"  # default to user

            messages.append({
                "role": role,
                "content": msg.get("content", "")
            })

        # Add the current user message
        messages.append({"role": "user", "content": user_message})

        max_retries = int(os.getenv("OPENAI_MAX_RETRIES", "3"))
        retry_delay = float(os.getenv("OPENAI_RETRY_DELAY", "1.0"))

        for attempt in range(max_retries + 1):
            try:
                # Call OpenAI API with tools
                response = await asyncio.get_event_loop().run_in_executor(
                    None,
                    lambda: self.client.chat.completions.create(
                        model=self.model,
                        messages=messages,
                        tools=tools if tools else None,
                        tool_choice="auto",  # Auto-select tools when needed
                        temperature=float(os.getenv("OPENAI_TEMPERATURE", "0.7")),
                        max_tokens=int(os.getenv("OPENAI_MAX_TOKENS", "1000")),
                    )
                )

                response_message = response.choices[0].message
                tool_calls = response_message.tool_calls

                # If the model wants to call tools
                if tool_calls:
                    # Process each tool call
                    for tool_call in tool_calls:
                        function_name = tool_call.function.name
                        function_args = json.loads(tool_call.function.arguments)

                        # Execute the tool via MCP server
                        tool_result = await mcp_server.execute_tool(function_name, function_args)

                        # Add tool result back to messages for the model to generate final response
                        messages.append({
                            "role": "tool",
                            "tool_call_id": tool_call.id,
                            "name": function_name,
                            "content": json.dumps(tool_result)
                        })

                    # Get final response from the model after tool execution
                    final_response = await asyncio.get_event_loop().run_in_executor(
                        None,
                        lambda: self.client.chat.completions.create(
                            model=self.model,
                            messages=messages,
                            temperature=float(os.getenv("OPENAI_TEMPERATURE", "0.7")),
                        )
                    )

                    ai_response = final_response.choices[0].message.content
                else:
                    # No tool calls, just return the model's response
                    ai_response = response_message.content

                return {
                    "success": True,
                    "response": ai_response,
                    "model_used": self.model,
                    "usage": {
                        "prompt_tokens": response.usage.prompt_tokens,
                        "completion_tokens": response.usage.completion_tokens,
                        "total_tokens": response.usage.total_tokens
                    },
                    "tool_calls": [tc.function.name for tc in tool_calls] if tool_calls else []
                }

            except Exception as e:
                # Check if it's a retryable error
                error_str = str(e)
                if "Rate limit" in error_str or "Too Many Requests" in error_str:
                    if attempt < max_retries:
                        # Exponential backoff
                        delay = retry_delay * (2 ** attempt)
                        await asyncio.sleep(delay)
                        continue
                    else:
                        return {
                            "success": False,
                            "error": f"Rate limit exceeded after {max_retries} retries: {error_str}"
                        }
                elif "Authentication" in error_str or "api-key" in error_str.lower():
                    # Authentication errors are not retryable
                    return {
                        "success": False,
                        "error": f"Authentication error: {error_str}"
                    }
                else:
                    # For other errors, try again if attempts remain
                    if attempt < max_retries:
                        delay = retry_delay * (2 ** attempt)
                        await asyncio.sleep(delay)
                        continue
                    else:
                        return {
                            "success": False,
                            "error": f"Error calling OpenAI API after {max_retries} retries: {error_str}"
                        }


class GeminiAgent(BaseAIAgent):
    """
    Google Gemini-based agent using Generative Language API with function calling capabilities.
    """

    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is required")

        genai.configure(api_key=api_key)
        self.model_name = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
        self.model = genai.GenerativeModel(self.model_name)

    async def process_message(self, user_message: str, conversation_history: List[Dict[str, str]], user_id: str, mcp_server: MCPServer) -> Dict[str, Any]:
        """
        Process a user message using Google's Gemini API with function calling.
        Includes retry logic and error handling.
        """
        max_retries = int(os.getenv("GEMINI_MAX_RETRIES", "3"))
        retry_delay = float(os.getenv("GEMINI_RETRY_DELAY", "1.0"))

        for attempt in range(max_retries + 1):
            try:
                # Get available tools from MCP server
                available_tools = await mcp_server.get_available_tools()

                # Prepare tools in Gemini format
                tool_configs = []
                for tool in available_tools:
                    tool_configs.append({
                        "function_declarations": [{
                            "name": tool.name,
                            "description": tool.description,
                            "parameters": tool.parameters
                        }]
                    })

                # Configure the model with tools
                generation_config = {
                    "temperature": float(os.getenv("GEMINI_TEMPERATURE", "0.7")),
                    "max_output_tokens": int(os.getenv("GEMINI_MAX_TOKENS", "1000")),
                }

                # Prepare the full prompt with conversation history
                system_context = """You are a helpful task management assistant. Help users manage their tasks using natural language.
                You can create, list, update, complete, and delete tasks using available tools.
                Always use the appropriate tool when a user wants to perform a task operation.
                Available tools: add_task, list_tasks, update_task, delete_task, complete_task"""

                # Create conversation history
                chat_history = []
                for msg in conversation_history:
                    role = "model" if msg.get("role") == "assistant" else "user"
                    chat_history.append({
                        "role": role,
                        "parts": [msg.get("content", "")]
                    })

                # Initialize the chat with history
                model = genai.GenerativeModel(
                    model_name=self.model_name,
                    tools=tool_configs
                )
                chat = model.start_chat(history=chat_history)

                # Send the message and get response
                response = await asyncio.get_event_loop().run_in_executor(
                    None,
                    lambda: chat.send_message(user_message, generation_config=generation_config)
                )

                # Check if the model wants to call functions
                ai_response = ""
                if hasattr(response.candidates[0], 'content') and response.candidates[0].content.parts:
                    parts = response.candidates[0].content.parts
                    for part in parts:
                        if hasattr(part, 'function_call'):
                            # Execute the function
                            function_call = part.function_call
                            function_name = function_call.name
                            function_args = {}
                            if hasattr(function_call, 'args'):
                                function_args = dict(function_call.args)

                            # Execute the tool via MCP server
                            tool_result = await mcp_server.execute_tool(function_name, function_args)

                            # Call the function again with the result
                            result_part = {
                                "function_response": {
                                    "name": function_name,
                                    "response": tool_result
                                }
                            }

                            # Get final response after function execution
                            final_response = await asyncio.get_event_loop().run_in_executor(
                                None,
                                lambda: chat.send_message(result_part)
                            )
                            ai_response = final_response.text
                            break
                        else:
                            # Regular text response
                            ai_response = response.text
                else:
                    ai_response = response.text

                return {
                    "success": True,
                    "response": ai_response,
                    "model_used": self.model_name,
                }

            except Exception as e:
                # Check if it's a retryable error
                error_str = str(e)
                if "Quota exceeded" in error_str or "Resource has been exhausted" in error_str:
                    if attempt < max_retries:
                        # Exponential backoff
                        delay = retry_delay * (2 ** attempt)
                        await asyncio.sleep(delay)
                        continue
                    else:
                        return {
                            "success": False,
                            "error": f"Quota exceeded after {max_retries} retries: {error_str}"
                        }
                elif "API key" in error_str or "authentication" in error_str.lower():
                    # Authentication errors are not retryable
                    return {
                        "success": False,
                        "error": f"Authentication error: {error_str}"
                    }
                else:
                    # For other errors, try again if attempts remain
                    if attempt < max_retries:
                        delay = retry_delay * (2 ** attempt)
                        await asyncio.sleep(delay)
                        continue
                    else:
                        return {
                            "success": False,
                            "error": f"Error calling Gemini API after {max_retries} retries: {error_str}"
                        }


class GeminiOpenAIAgent:
    """
    Unified agent that can use either OpenAI or Gemini based on configuration.
    """

    def __init__(self):
        self.openai_agent = None
        self.gemini_agent = None

        # Initialize the appropriate agent based on environment configuration
        if os.getenv("GEMINI_API_KEY"):
            self.gemini_agent = GeminiAgent()
            self.current_agent = "gemini"
        elif os.getenv("OPENAI_API_KEY"):
            self.openai_agent = OpenAIAgent()
            self.current_agent = "openai"
        else:
            raise ValueError("Either GEMINI_API_KEY or OPENAI_API_KEY must be set")

    async def process_message(self, user_message: str, conversation_history: List[Dict[str, str]], user_id: str, mcp_server: MCPServer) -> Dict[str, Any]:
        """
        Process a user message using the configured AI provider with tool calling support.
        """
        if self.current_agent == "openai":
            return await self.openai_agent.process_message(user_message, conversation_history, user_id, mcp_server)
        elif self.current_agent == "gemini":
            return await self.gemini_agent.process_message(user_message, conversation_history, user_id, mcp_server)
        else:
            return {
                "success": False,
                "error": "No AI agent configured"
            }