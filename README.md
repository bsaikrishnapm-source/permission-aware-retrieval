# Permission Aware Retrieval Evaluation

**Complete independent prototype | RAG product requirements and retrieval governance**

## Decision

Use tenant, role, and active-version filtering before a retrieved document can reach an answer generator. Abstain when no authorized evidence remains. Topic relevance alone is insufficient.

## Working artifact

Run `python3 evaluate.py` from the repository root. The program compares topic-only retrieval against an authorization-aware policy using five fictional documents and eight labeled queries. It prints the document IDs for every query and counts exact matches, forbidden hits, and stale hits.

This is a retrieval-policy prototype, not a full retrieval-augmented generation system. Topic matching is exact; there are no embeddings or LLM calls.

## Product problem

A shared knowledge assistant can retrieve a relevant policy from the wrong tenant, from a restricted function, or from an archived version. A fluent answer would conceal the evidence problem.

## Deliverables

- [Populated corpus and labeled queries](data.json)
- [Runnable evaluation](evaluate.py)
- [Requirements, release gates, and decision record](PRODUCT.md)

## Evidence boundary

All records are synthetic. Passing eight fixtures validates these policy cases only. It does not prove semantic retrieval quality, resistance to prompt injection, or production security. No customer interviews or deployment occurred.

## Run locally

Requires Python 3. No additional packages or API keys are needed.

```bash
git clone https://github.com/bsaikrishnapm-source/permission-aware-retrieval.git
cd permission-aware-retrieval
python3 evaluate.py
```

[View the full product management portfolio](https://github.com/bsaikrishnapm-source/bsaikrishnapm-source)
