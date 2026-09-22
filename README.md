# arve-testbed-js

> [!WARNING]
> **INTENTIONALLY VULNERABLE CODE. DO NOT DEPLOY, DO NOT RUN ON A REACHABLE HOST,
> DO NOT COPY INTO REAL PROJECTS.**
> This repository contains deliberately planted SQL injection, command injection,
> path traversal, SSRF, code injection (eval), XSS, hardcoded
> credentials and vulnerable dependency pins. It exists only to evaluate the
> ARVE security scanner.

**All credentials in this repository and its Git history are synthetic.** They
were randomly generated and are correctly shaped, but they grant access to
nothing. No secret value appears in this README or in `EXPECTED_FINDINGS.md`,
which refer to file and line only.

## What it is

DocVault is a minimal Express (TypeScript, run with `tsx`) + `better-sqlite3` document service, with one static page in plain JS, with 7 endpoints (upload,
download, search, convert, import-url, settings import, preview). Each endpoint
hosts plants from the matrix below. `expected-findings.json` is the answer key.
Conventions shared with the JS/TS, PHP and Java testbeds are in
[`TESTBED_SPEC.md`](TESTBED_SPEC.md), and the full plan is in [`plan.md`](plan.md).

## Plants

Generated from `expected-findings.json` by `scripts/render_answer_key.py`. Do not edit.

<!-- BEGIN PLANT TABLE -->
| ID | Kind | Location | Expected engines | Rule IDs | CWE | Cross-engine group |
|---|---|---|---|---|---|---|
| SAST-01 | sast | `src/routes/search.ts:12` | codeql | `codeql: js/sql-injection` | CWE-89 | - |
| SAST-02 | sast | `src/routes/convert.ts:26` | semgrep, codeql | `semgrep: arve.javascript.command-injection`<br>`codeql: js/command-line-injection, js/shell-command-injection-from-environment, js/indirect-command-line-injection` | CWE-78 | - |
| SAST-03 | sast | `src/routes/docs.ts:58` | semgrep, codeql | `semgrep: arve.javascript.xss`<br>`codeql: js/reflected-xss` | CWE-79 | - |
| SAST-04 | sast | `public/app.js:15` | semgrep | `semgrep: arve.javascript.xss` | CWE-79 | - |
| SAST-05 | sast | `src/routes/settings.ts:11` | semgrep, codeql | `semgrep: arve.upstream.javascript.eval-injection`<br>`codeql: js/code-injection` | CWE-94 | - |
| SAST-06 | sast | `src/routes/docs.ts:41` | codeql | `codeql: js/path-injection` | CWE-22 | - |
| SAST-07 | sast | `src/routes/fetch.ts:18` | codeql | `codeql: js/request-forgery` | CWE-918 | - |
| SEC-01 | secret | `src/share.ts:7` | gitleaks, semgrep | `gitleaks: generic-api-key`<br>`semgrep: arve.generic.hardcoded-jwt-secret` | CWE-798 | C-01 |
| SEC-02 | secret | `config/export-key.js:3` | gitleaks, semgrep | `gitleaks: private-key`<br>`semgrep: arve.upstream.generic.private-key` | CWE-321 | C-02 |
| SEC-03 | secret | `.env.example:5` | gitleaks | `gitleaks: stripe-access-token` | CWE-798 | - |
| SEC-04 | secret | `.github/workflows/ci.yml:18` | gitleaks | `gitleaks: github-pat` | CWE-798 | - |
| SEC-05 | secret | `src/notify.ts` (history only) | gitleaks | `gitleaks: generic-api-key` | CWE-798 | - |
| SEC-06 | secret | `docs/runbook.md:18` | gitleaks | `gitleaks: slack-webhook-url` | CWE-798 | - |
| DEP-01 | dependency | `package-lock.json` (lodash==4.17.20) | osv | `osv: GHSA-29mw-wpgm-hmr9, GHSA-35jh-r3h4-6jhm, GHSA-f23m-r3pf-42rh, GHSA-r5fr-rjxr-66jc, GHSA-xxjr-mmjv-4gpg` | - | - |
| DEP-02 | dependency | `package-lock.json` (minimist==1.2.5) | osv | `osv: GHSA-xvch-5gv4-984h` | - | - |
| DEP-03 | dependency | `package-lock.json` (marked==4.0.9) | osv | `osv: GHSA-5v2h-r2cx-5xgj, GHSA-rrrm-qjm4-v8hf` | - | - |
| DEP-04 | dependency | `package-lock.json` (qs==6.10.1) | osv | `osv: GHSA-4mjr-xmp4-gh2g, GHSA-6rw7-vpxm-498p, GHSA-hrpp-h998-j3pp, GHSA-w7fw-mjwx-w883` | - | - |
| SAFE-01 | control | `src/repository.ts:5` | none (negative control) | - | - | - |
| SAFE-02 | control | `src/routes/convert.ts:28` | none (negative control) | - | - | - |
| SAFE-03 | control | `public/app.js:13` | none (negative control) | - | - | - |
<!-- END PLANT TABLE -->

## How to scan

Requirements: Docker, Python 3 (for the scripts), Node 20+ (only for `npx tsc --noEmit`), and a sibling checkout of ARVE at `../ARVE` for
the Semgrep rulepack. Override the path with `ARVE_RULES=<path to rules>`.

```bash
docker pull ghcr.io/gitleaks/gitleaks:v8.24.2
docker pull ghcr.io/google/osv-scanner:v1.9.2
docker pull semgrep/semgrep:1.90.0
docker build -t arve-codeql:2.27.1 ../ARVE/docker/codeql

python scripts/verify_plants.py --history          # all four engines + git history
python scripts/verify_plants.py --engines semgrep  # one engine
```

Each (plant, engine) prints `PASS`/`FAIL`, followed by `UNEXPECTED` findings and
`COUNT` mismatches against `expected_counts`. Raw reports land in `.scan/`.
Sanitised reference reports are committed in `baselines/`.

## How to score an ARVE run

Scan this repository (**including Git history**, since SEC-05 exists only there)
with ARVE, then compare its findings with `expected-findings.json`:

- **Recall**: each `positive` entry should be reported by each engine in
  `expected_engines`, at `file_path` within `line_start` … `line_start + line_span - 1`,
  under each rule in `rule_ids`. For DEP entries, match by package and version.
- **Correlation**: entries sharing a `cross_engine_group` are one secret seen by
  two engines. ARVE should correlate them rather than double-count.
- **False positives**: any finding on a `SAFE-*` line, or any finding not explained
  by an entry, is a false positive. `notes` in the key lists two known ARVE
  Semgrep false-positive patterns that the controls deliberately avoid.
- **Semgrep profile**: `-taint` rules exist only in ARVE's `extended` profile, and
  some rules are not in `ci`. Filter expectations by `semgrep_profile` and the
  rulepack manifest for the profile the run used.

## Maintenance

```bash
python scripts/render_answer_key.py           # markers -> JSON lines -> MD + this table
python scripts/seed_history.py --force        # rebuild the planted Git history (deletes .git)
python scripts/verify_plants.py --history --save-baselines
```
