# Evidence Review — product walkthrough

## Implemented user value

Structured conflict detection, explicit version precedence, source opening with current demo access checks, local escalation records, and a bounded text-free audit buffer.

## Five-minute review

Retrieve normal refund evidence; revoke access and open D1; restore access and choose conflicting policies; compare a consistent duplicate and higher version.

Choose **Save comparison snapshot** to retain up to five result snapshots in the current tab. **Download evidence JSON** exports the current result and captured snapshots. Refreshing clears all session state. Exports describe synthetic data and local actions only.

## Architecture

| File | Responsibility |
| --- | --- |
| demo/index.html | Page structure, local script references and evidence boundary |
| demo/style.css | Responsive workspace, focus styles and readable tables |
| demo/data.js | Bundled synthetic fixture data; no network requests |
| demo/engine.js | Pure decision functions and in-memory workflow state |
| demo/app.js | Labeled controls, local actions, result rendering and downloads |
| test_demo.cjs | Node built-in behavioral tests against the decision engine |

The UI inserts scenario text through textContent. CSV exports, where present, quote fields and neutralize formula-like leading characters. No external libraries, trackers, authentication credentials or model endpoints are used.

## Product scope and trade-offs

Identity and access controls are simulated in the browser. There is no authenticated backend, identity provider, semantic search, embeddings, LLM, prompt-injection evaluation, or production audit store. Structured value conflicts do not establish semantic contradiction detection.

## Review criteria

A reviewer should be able to explain the decision, change an assumption, inspect a failure path and export the evidence. A successful prototype test demonstrates only the declared fixture behavior; it does not establish production readiness.

## Run verification

Requires Node.js 18 or newer for the built-in test runner (the demo itself requires only a browser).

```bash
node --test test_demo.cjs
```

Expected: 8 passing decision tests. The existing Python entry point remains available in the main README.

## Accessibility design

Controls use visible labels, keyboard focus outlines and native buttons/selects. Error text uses an alert region; metric updates and snapshot counts use polite live regions. A skip link targets scenario controls. Tables scroll inside the result panel on narrow displays. Browser rendering and assistive-technology testing have not been completed in this environment.

## Data and retention

Use synthetic records only. Demo decisions and logs live in memory, with no localStorage or remote persistence. Downloading evidence explicitly writes a file through the user's browser. Clearing a buffer or refreshing does not delete a previously downloaded export.

## Structured conflict and access contract

Eligible documents are filtered by tenant, role and active status before grouping by policy_key. Highest numeric version wins within each key. Different structured values at the same highest version return CONFLICT; consistent duplicates do not. Source metadata is limited to eligible sources. Open rechecks the current simulated identity and revocation flag; denied results contain no document text. Escalation records a local event without sending a message. Audit entries retain event number, policy version, allowed source IDs and reason; no query or source body. At most 50 entries are held; Clear audit removes the buffer.

A real service must resolve identity server-side, recheck authorization on citation access, apply log access/retention/deletion policies, and independently evaluate semantic behavior. The prototype does not satisfy that production gate.
