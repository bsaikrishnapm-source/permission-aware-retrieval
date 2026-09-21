# Product Requirements and Decision

## User and job

A support specialist needs an answer supported by the current policy they are authorized to access. The product must distinguish “no authorized evidence” from “no such policy exists.”

## Acceptance criteria

1. Apply tenant and role restrictions before exposing content to any generator.
2. Exclude archived versions and display the current document ID with each answer.
3. If no eligible evidence exists, abstain and offer a request for authorized assistance.
4. If policies conflict, withhold the answer and surface the conflict for review.
5. Log query reference, selected document IDs, policy version, and abstention reason; avoid logging full sensitive text.
6. Recheck access when opening a citation; retrieved access does not grant permanent access.

## Evaluation rubric

Exact-set match checks whether returned IDs equal the expected authorized evidence. Forbidden-hit count detects wrong-tenant or wrong-role material; stale-hit count detects archived content. Coverage is not the release objective if more answers expose forbidden evidence.

The original Python evaluation implements criteria 1–3 for structured fixtures. The browser demo additionally illustrates structured conflict handling, citation opening with current simulated access checks, and bounded in-memory audit history. These are local demonstrations, not authenticated authorization or audit services. See DEMO_GUIDE.md for implemented behavior and production gaps.

## Release decision

The guarded policy passes the fixture suite. Keep the product at prototype status until authorization is enforced server-side, permissions change during sessions are tested, and semantic retrieval is evaluated on representative data.

## Next experiment

Create a labeled set of paraphrases, conflicting policies, revoked permissions, and unsupported questions. Compare retrieval precision and abstention with independent reviewers. Freeze the set before changing retrieval logic.

