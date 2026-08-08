"""Tests for the markdown guard applied to the synthesize node's answer."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from graph import _strip_markdown_structure  # noqa: E402


def test_leading_heading_is_removed():
    assert _strip_markdown_structure("# Title\n\nBody text here.") == "Body text here."


def test_bold_run_is_unwrapped():
    assert _strip_markdown_structure("**Saint Cyril of Alexandria**") == "Saint Cyril of Alexandria"


def test_bullet_marker_is_removed():
    assert _strip_markdown_structure("- item") == "item"


def test_plain_prose_is_unchanged():
    prose = "Theosis is the life God shares with us.\n\nThe Fathers call it participation."
    assert _strip_markdown_structure(f"\n{prose}\n") == prose
