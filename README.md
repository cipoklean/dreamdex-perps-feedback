# dreamDEX Perps Feedback

Feedback-track submission for the [dreamDEX Perps Builder Bounty](https://dorahacks.io/hackathon/dreamdex-perps-bounty/detail) (Oct 19 to Nov 1, 2026).

Each issue is its own Markdown file in [`feedback/`](feedback), in the bounty's template (title, severity, area, steps to reproduce, expected, actual, evidence, environment). Every item was reproduced against live dreamDEX endpoints and the Somnia Tokyo (Hideki, chain 50383) testnet on Oct 20, 2026.

## Items

| # | Title | Severity | Area |
|---|---|---|---|
| 01 | [SDK perps guide quick start symbol `BTC/USDSO:USDSO` throws](feedback/01-sdk-perps-guide-symbol-casing-throws.md) | major | docs |
| 02 | [Unknown-symbol error says "call loadMarkets() first" even after it ran](feedback/02-sdk-unknown-symbol-error-misleading.md) | normal | SDK |
| 03 | [Errors page lists no perp / MarginBank errors](feedback/03-errors-page-missing-perp-errors.md) | normal | docs |
| 04 | [Per-account position cap is not "a tenth of OI cap" on most markets](feedback/04-per-account-position-cap-not-a-tenth.md) | normal | docs |
| 05 | [Wrong OI caps for BTC-PERP and NEAR-PERP in market table](feedback/05-oi-cap-table-stale-btc-near.md) | normal | docs |
| 06 | [Docs disagree on which testnet perps run on (Shannon vs Hideki)](feedback/06-testnet-perps-hideki-vs-shannon-docs-conflict.md) | normal | docs |
| 07 | [Bot kit README omits Hideki (chain 50383)](feedback/07-bot-kit-readme-networks-missing-hideki.md) | normal | docs |
| 08 | [Bot kit pins markets-sdk 0.31.0; perps guide code needs 0.32.1](feedback/08-bot-kit-sdk-0.31-cannot-run-perps-guide.md) | normal | SDK |
| 09 | [`perp:doctor` prints annualised funding as a bare %](feedback/09-perp-doctor-funding-unlabelled-apr.md) | normal | SDK |
| 10 | [HTTP API returns no perp markets, undocumented](feedback/10-rest-api-no-perps-undocumented.md) | normal | API |

## Repro scripts

[`repro/`](repro) holds the scripts used to confirm the items. They use the Somnia Markets SDK (`@somnia-chain/markets-sdk` 0.32.1) against the Hideki testnet indexer and RPC. `e.mjs` and `f.mjs` also read a saved copy of the perps docs page (path inside the script). All are read-only; no private key is needed except `doc.ts`, which is the perps guide's own example.

```bash
npm install
node repro/j.mjs        # item 01: quick-start symbol casing throws, correct casing works
npx tsx repro/doc.ts    # the official perps guide example, compiled against 0.32.1
```

## Environment

- Network: Somnia Tokyo / Hideki testnet, chain ID 50383
- SDK: `@somnia-chain/markets-sdk` 0.32.1 (and 0.31.0 as pinned by dreamdex-bot-kit, for item 08)
- Wallet: n/a (read-only)
