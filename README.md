# Permission Aware Retrieval Evaluation

## Product decision at a glance

**User need:** Help a knowledge user inspect current, authorized evidence before trusting an answer.

**Decision:** Filter evidence by access and version, and abstain when the eligible policies conflict.

**Inspect:** [Requirements and release gates](PRODUCT.md) · [Guided demo](DEMO_GUIDE.md) · [Validation boundaries](VALIDATION.md).

**Evidence:** The original Python evaluation covers eight queries against five synthetic documents. The browser demo adds structured conflicts and simulated access revocation; authenticated server enforcement and semantic retrieval evaluation remain open.

## Interactive product demo — implemented

**Evidence Review:** Structured conflict detection, explicit version precedence, source opening with current demo access checks, local escalation records, and a bounded text-free audit buffer.

### Open the product

1. On this repository, select **Code → Download ZIP**.
2. Extract the ZIP folder.
3. Open **demo/index.html** in your browser.

No installation, API key or login is required for the demo. GitHub's Code tab displays source; it does not run HTML applications. Keep the demo folder's files together. This is a local browser experience, not a hosted service.

[Demo walkthrough and architecture](DEMO_GUIDE.md) · [Browser source](demo/index.html) · [Decision logic](demo/engine.js) · [Verification](VALIDATION.md)


[Product brief & roadmap](ROADMAP.md) · [Requirements](PRODUCT.md) · [Prioritized backlog](https://github.com/bsaikrishnapm-source/permission-aware-retrieval/issues) · [Run the evaluation](#run-locally)

## Start here

**Problem:** Check that a knowledge assistant uses only current documents the user is allowed to see.

**What is built:** The interactive demo above, plus the original Python case study, product documents and synthetic data.

**Code to run:** `python3 evaluate.py`

**What you will see:** Compares topic-only and permission-aware retrieval across eight queries, counting unauthorized and outdated results.

**Scope:** Includes a local browser demo plus the original Python command-line analysis. No live customer integration, hosted deployment, or real AI model call is included.


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

[Full PM portfolio](https://github.com/bsaikrishnapm-source/bsaikrishnapm-source) · [Portfolio roadmap](https://github.com/bsaikrishnapm-source/bsaikrishnapm-source/blob/main/ROADMAP.md) · [Project backlog](https://github.com/bsaikrishnapm-source/permission-aware-retrieval/issues) · [Planning board](https://github.com/users/bsaikrishnapm-source/projects/1)

## Inspect the data in Excel

```bash
python3 export_data.py --output exports
```

Creates CSV tables from the bundled synthetic data. The terminal output identifies each table and its row count. For a different JSON file, add `--input path/to/data.json`. Existing table CSV files in the output directory are replaced. These exports contain scenario inputs, not production results.

