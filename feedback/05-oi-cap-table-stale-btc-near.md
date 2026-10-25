# Perps market table shows wrong open interest caps for BTC-PERP and NEAR-PERP
Severity: normal
Area: docs

## Steps to reproduce
1. Open https://app.testnet.dreamdex.io/docs/trading/perps-testnet (market table; the note says "These figures are read from the live markets").
2. Read `getPerpPoolParameters().maxOpenInterest` from the BTC and NEAR perp pools on Hideki (script: perps-feedback/repro/f.mjs):
   - BTC-PERP pool `0x4181dd08e73bbcdd1ba3e615a18f6abd941b94c0` (baseDecimals 8)
   - NEAR-PERP pool `0x1cd15ae8bff0fe0a7f49233be8b90734775ba454` (baseDecimals 24)

## Expected
The table matches the live caps, as it does for the other 19 markets.

## Actual
| Market | Docs OI cap | On-chain maxOpenInterest |
|---|---|---|
| BTC-PERP | 246.81545 BTC | 275 BTC |
| NEAR-PERP | 250,410 NEAR | 279,000 NEAR |

Every other value in the table matched live data in the same check (leverage, IM, tick, min size, base decimals and the other 19 OI caps).

## Evidence
```
BTC       0x4181dd08e73bbcdd1ba3e615a18f6abd941b94c0 IM 500n MM 250n CO 125n maxOI 275 maxPos 100 ...
NEAR      0x1cd15ae8bff0fe0a7f49233be8b90734775ba454 IM 1000n MM 500n CO 250n maxOI 279000 maxPos 50000 ...
```
Doc rows:
```
| **BTC-PERP** | 20x | 5% / 2.5% | 0.1 | 0.00013 BTC | 246.81545 BTC | Yes |
| **NEAR-PERP** | 10x | 10% / 5% | 0.0001 | 5.1 NEAR | 250,410 NEAR | Yes |
```
Checked 2026-10-20 ~01:25 UTC.

## Environment
viem + @somnia-chain/markets-sdk 0.32.1. Network: Somnia Hideki testnet (chain 50383). Wallet address: n/a (read-only)
