from sqlmodel import SQLModel, Field, create_engine
from typing import Optional, Dict, Any
from datetime import datetime
import json


class ToolCall(SQLModel, table=True):
    """
    Represents an action taken by the chatbot to perform a task operation.
    Contains the tool name (add_task, list_tasks, etc.), parameters passed, and result returned.
    Tool calls are associated with assistant messages.
    """
    id: int = Field(default=None, primary_key=True)
    message_id: int = Field(index=True)  # Reference to the assistant message that triggered this tool call
    tool_name: str = Field(max_length=100)  # Name of the tool called (e.g., 'add_task', 'list_tasks')
    parameters: str = Field(default='{}')  # JSON string of parameters passed to the tool
    result: Optional[str] = Field(default=None)  # JSON string of the result from the tool
    success: bool = Field(default=False)  # Whether the tool call was successful
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    def set_parameters(self, params: Dict[str, Any]) -> None:
        """Helper method to set parameters as JSON string"""
        self.parameters = json.dumps(params)

    def get_parameters(self) -> Dict[str, Any]:
        """Helper method to get parameters as dictionary"""
        return json.loads(self.parameters) if self.parameters else {}

    def set_result(self, result_data: Dict[str, Any]) -> None:
        """Helper method to set result as JSON string"""
        self.result = json.dumps(result_data)

    def get_result(self) -> Dict[str, Any]:
        """Helper method to get result as dictionary"""
        return json.loads(self.result) if self.result else {}