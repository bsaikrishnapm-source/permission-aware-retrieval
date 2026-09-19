# Product roadmap · Permission-Aware Retrieval

> Independent portfolio prototype · Synthetic data · Proposed roadmap, not a customer delivery commitment

## Product brief

**User:** A support specialist searching a shared policy knowledge base.
**Problem:** A relevant document can still belong to the wrong tenant, require a different role, or be out of date.
**Product goal:** Return usable, current, authorized evidence; explain when the product must abstain.
**Current decision:** Keep the product at prototype stage. Do not connect protected customer information.

## Delivery overview

| Stage | Deliverable | Evidence or exit criterion |
| --- | --- | --- |
| Delivered prototype | Tenant, role, active-version filtering and abstention on structured fixtures | [Evaluation code](evaluate.py), five documents and eight labeled queries in [data.json](data.json) |
| Delivered documentation | Requirements, evaluation rubric, release decision | [Product requirements](PRODUCT.md) |
| Delivered utility | Export synthetic inputs to CSV | [Export code](export_data.py) |
| Next: define trust controls | Authenticated access rechecks and conflict handling | P0 acceptance criteria reviewed and implemented before any protected-data pilot |
| Later: expand usefulness | Frozen semantic evaluation and evidence-review experience | Documented results and a new release decision; not yet implemented |

## Prioritized backlog

P0 means a prerequisite for a protected-data pilot; P1 means a subsequent experiment or design extension. Priorities are reasoned judgments, not fabricated customer scores.

| Priority | User outcome | Work item | Current status |
| --- | --- | --- | --- |
| P0 | Revoked access cannot expose evidence | [Access rechecks](https://github.com/bsaikrishnapm-source/permission-aware-retrieval/issues/1) | Proposed |
| P0 | Conflicting policies lead to review | [Conflict handling](https://github.com/bsaikrishnapm-source/permission-aware-retrieval/issues/2) | Proposed |
| P1 | Paraphrases retrieve useful authorized evidence | [Semantic evaluation](https://github.com/bsaikrishnapm-source/permission-aware-retrieval/issues/3) | Proposed |
| P1 | Users understand evidence and abstention | [Evidence review and audit trail](https://github.com/bsaikrishnapm-source/permission-aware-retrieval/issues/4) | Proposed |

## Product metrics

| Metric | Definition | How to use it |
| --- | --- | --- |
| Exact-set match | Queries returning exactly the expected document IDs / all evaluation queries | Check the structured fixture policy |
| Forbidden hits | Returned documents violating tenant or role rules | Any observed violation blocks release |
| Stale hits | Archived documents returned | Any observed stale evidence blocks release |
| Authorized coverage | Queries returning eligible evidence / all evaluation queries | Interpret with accuracy; do not maximize coverage alone |
| Explanation comprehension | Users correctly explaining a result or abstention / observed sessions | Future usability measure; no sessions conducted |

## Key trade-offs

- Apply access restrictions before evidence reaches an answer generator.
- Prefer an explicit abstention to exposing an unauthorized source.
- Keep the current exact-topic baseline reproducible before adding model dependencies.
- Evaluate usefulness and access safety separately; a relevant answer is not necessarily permissible.

## Proposed workflow

Backlog → Ready → In progress → Review → Done.

A work item is Ready only when its user story, acceptance criteria, dependencies, and measurement are clear. It is Done only when implementation, validation evidence, and documentation agree. Current open issues are proposed work; no live delivery activity is implied.

## Where to navigate

- **Code:** README, requirements, datasets and working Python.
- **Issues:** Prioritized user stories and acceptance criteria.
- **Projects:** GitHub's separate planning-board feature. No native board is linked yet.
