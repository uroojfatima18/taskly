from dotenv import load_dotenv ,find_dotenv
load_dotenv(find_dotenv())
from agents import RunConfig, OpenAIChatCompletionsModel, AsyncOpenAI
import os


external_client = AsyncOpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1"
)

Model = OpenAIChatCompletionsModel(
    model="stepfun/step-3.5-flash:free",
    openai_client=external_client,
)
run_config =RunConfig(
    model=Model,
    model_provider=external_client, 
)