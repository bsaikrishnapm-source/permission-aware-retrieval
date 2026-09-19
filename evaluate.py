"""Deterministic retrieval-policy test. No LLM, embeddings, or external service."""
import json
from pathlib import Path
data = json.loads(Path(__file__).with_name("data.json").read_text())
for guarded in (False, True):
    exact = leaks = stale = retrieved = 0
    for q in data["queries"]:
        hits = [d for d in data["documents"] if d["topic"] == q["topic"]]
        if guarded:
            hits = [d for d in hits if d["tenant"] == q["tenant"] and q["role"] in d["roles"] and d["active"]]
        ids = sorted(d["id"] for d in hits)
        exact += ids == sorted(q["expected"])
        leaks += sum(d["tenant"] != q["tenant"] or q["role"] not in d["roles"] for d in hits)
        stale += sum(not d["active"] for d in hits)
        retrieved += len(hits)
        print(("guarded" if guarded else "baseline"), q["id"], ids or "ABSTAIN")
    print(dict(guarded=guarded, exact=exact, total=8, forbidden_hits=leaks, stale_hits=stale, retrieved=retrieved))
    if guarded:
        assert exact == 8 and leaks == stale == 0
