# api/index.py
from backend.main import app  # adjust path if needed
from mangum import Mangum

handler = Mangum(app)
