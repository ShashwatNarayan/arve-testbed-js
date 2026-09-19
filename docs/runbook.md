# DocVault runbook

## Start

    npm ci
    npm start

## Storage

Uploaded files live in `storage/` (override with `DOCVAULT_STORAGE`). The SQLite
database defaults to `docvault.db` (override with `DOCVAULT_DB`).

## Alerts

Conversion failures are posted to the #docvault-ops channel via this webhook:

<!-- TESTBED SEC-06 -->
    https://hooks.slack.com/services/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
