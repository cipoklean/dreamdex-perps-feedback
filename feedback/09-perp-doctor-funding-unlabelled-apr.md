# perp:doctor prints annualised funding as a bare "%", which reads like the per-period rate (BTC "funding 126.153%")
Severity: normal
Area: SDK

## Steps to reproduce
1. In dreamdex-bot-kit: `npm ci` (no .env, no key needed).
2. `NETWORK=hideki npx tsx scripts/perp-doctor.ts` (same as `npm run perp:doctor`).

## Expected
The funding figure is labelled with its period (e.g. "10.95% APR" or "0.01% / 8h"), matching how the dreamDEX Funding docs quote it: the rate is per 8-hour window, and each hourly settlement applies 1/8 (https://app.testnet.dreamdex.io/docs/trading/perps-testnet/funding.md).

## Actual
The doctor prints `funding 10.950% (pays shorts)` for markets whose on-chain rate is 0.01% per 8 h, and `funding 126.153%` for BTC. Nothing says these are annualised. `scripts/perp-doctor.ts` line 127 prints `(funding.apr * 100).toFixed(3)%`. A user comparing against the app or the docs' "0.08%" example will think BTC funding is about 126% per period.

## Evidence
Output, 2026-10-20 ~01:28 UTC:
```
network  : hideki (chain 50383)
markets  : 21 live
ZRO-PERP   mark=1.86 · funding 10.950% (pays shorts) · book[bid=1.86 ask=1.87] · tick=0.0001 lot=0.1 minQty=5.1 IM=2000bps
...
BTC-PERP   mark=81341.17 · funding 126.153% (pays shorts) · book[bid=81554.80 ask=81572.40] · tick=0.1 lot=0.00001 minQty=0.00013 IM=500bps
```
Raw row value for ZRO from `listPerpMarkets()`: `"fundingRate": "100000000000000"` (1e14 / 1e18 = 0.0001 = 0.01% per window), `"fundingWindowSec": 28800`. 0.0001 × 3 × 365 = 10.95%, so the printed figure is an APR.
Source: `scripts/perp-doctor.ts`:
```
`... funding ${funding.known ? `${(funding.apr * 100).toFixed(3)}% (pays ${funding.paidSide}s)` : "unreadable"} · ` +
```

## Environment
dreamdex-bot-kit main, markets-sdk 0.31.0 (lockfile), Node 22, tsx. Network: Somnia Hideki testnet (50383). Wallet address: n/a (read-only)
