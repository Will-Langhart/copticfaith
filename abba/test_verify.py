"""Tests for the verify gate: scripture refs and citation work titles must be grounded.

Run with:  python -m unittest test_verify
"""
from __future__ import annotations

import asyncio
import unittest
from unittest.mock import patch

import graph

ATHANASIUS_SAINT_QUOTE = "The Son of God became man so that we might become God."


def _run_verify(state: dict) -> dict:
    with patch.object(graph, "get_stream_writer", lambda: lambda payload: None):
        return asyncio.run(graph.verify(state))


class ScriptureGroundingTest(unittest.TestCase):
    def test_ungrounded_reference_is_dropped(self):
        state = {
            "retrieved": [
                {"type": "scripture", "title": "The Burning Bush",
                 "source": "Exodus 3:1\u20135", "text": "And the angel of the Lord appeared unto him."},
            ],
            "proposed": {"scripture": ["Exodus 3:1-5", "John 3:16"]},
        }
        self.assertEqual(_run_verify(state)["scripture"], ["Exodus 3:1-5"])

    def test_reference_in_chunk_text_survives(self):
        state = {
            "retrieved": [{"type": "doctrine", "title": "Baptism", "source": "",
                           "text": "Born of water and the Spirit (John 3:5)."}],
            "proposed": {"scripture": ["John 3:5"]},
        }
        self.assertEqual(_run_verify(state)["scripture"], ["John 3:5"])

    def test_no_retrieval_means_no_scripture(self):
        state = {"retrieved": [], "proposed": {"scripture": ["John 3:16"]}}
        self.assertEqual(_run_verify(state)["scripture"], [])


class CitationProvenanceTest(unittest.TestCase):
    def _citation(self, records=None) -> dict:
        state = {"retrieved": [], "proposed": {
            "citations": [{"attribution": "St. Athanasius", "quote": ATHANASIUS_SAINT_QUOTE}]}}
        if records is None:
            result = _run_verify(state)
        else:
            with patch.object(graph, "_VERIFIED_QUOTES", records):
                result = _run_verify(state)
        self.assertEqual(len(result["citations"]), 1)
        return result["citations"][0]

    def test_work_is_a_work_title_not_a_name(self):
        citation = self._citation()
        self.assertEqual(citation["work"], "On the Incarnation, \u00a754")
        self.assertEqual(citation["name"], "Saint Athanasius the Apostolic")
        self.assertNotEqual(citation["work"], citation["name"])

    def test_work_is_empty_without_a_father_quote_record(self):
        saint_only = [r for r in graph._VERIFIED_QUOTES if r.get("type") == "saint_quote"]
        citation = self._citation(saint_only)
        self.assertEqual(citation["work"], "")

    def test_every_corpus_record_yields_a_work_that_is_not_the_name(self):
        for record in graph._VERIFIED_QUOTES:
            resolved = graph._prefer_father_quote(record)
            work = graph._work_title(resolved)
            name = (resolved.get("metadata") or {}).get("attribution", "")
            self.assertNotEqual(work, name, record["id"])


if __name__ == "__main__":
    unittest.main()
