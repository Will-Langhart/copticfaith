import sys
from pathlib import Path

# The service is a flat module layout (`import settings`), so abba/ must be importable.
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
