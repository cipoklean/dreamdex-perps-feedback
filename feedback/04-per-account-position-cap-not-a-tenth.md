# Docs say the per-account position cap is "a tenth of open interest cap on most markets"; on-chain it is 1/10 on only 11 of 21 markets (ZEC is 100%)
Severity: normal
Area: docs

## Steps to reproduce
1. Read https://app.testnet.dreamdex.io/docs/developers/perps-testnet ("Each account has a position cap per market, a tenth of the market's open interest cap on most markets") and https://app.testnet.dreamdex.io/docs/trading/perps-testnet ("A single account is capped at a tenth of it on most markets").
2. Read `getPerpPoolParameters()` on every perp pool listed by `client.listPerpMarkets()` on Hideki (script: perps-feedback/repro/f.mjs; the ABI line is from markets-sdk 0.32.1 `readsAbi.js`):
```
function getPerpPoolParameters() view returns ((uint256 initialMarginBps, uint256 maintenanceMarginBps, uint256 closeOutMarginBps, uint256 maxOpenInterest, uint256 maxPositionSize, uint256 takerFeeBpsTimes1k, int256 makerFeeBpsTimes1k, uint256 insuranceFundShareBps))
```
3. Cross-check with `client.getMaxPerpOrderSize(...).maxPositionSize` (script: repro/e.mjs). It returns the same values.

## Expected
maxPositionSize / maxOpenInterest ≈ 0.1 on most markets, as documented.

## Actual
Only 11 of 21 markets are at 0.1. Nine are at about 0.2, BTC is at 0.364, and on ZEC one account may hold the entire market-wide open interest cap (ratio 1.0). That is the opposite of the protection the docs describe.

## Evidence
On-chain `getPerpPoolParameters()` (Hideki, 2026-10-20 ~01:25 UTC), in base units:
```
BTC       0x4181dd08e73bbcdd1ba3e615a18f6abd941b94c0 maxOI 275          maxPos 100        ratio 0.364
ZEC       0x2a73129f26917124bd2a47a9b355c395c537f050 maxOI 420          maxPos 420        ratio 1.000
ADA       0x34fa62909f77699a7a6278d992f72ff31c7a619d maxOI 2254678      maxPos 450934     ratio 0.200
AVAX      0xde9762b6b441133d1314c68864ae4e63a6ee45c7 maxOI 66672.2      maxPos 13334.4    ratio 0.200
BNB       0x3d2a99fe1e2bdeaa25024515a2d2202daf9531ad maxOI 693.975      maxPos 140        ratio 0.202
DOGE      0xc410012e39765cd5f772e84bacb19554aec040df maxOI 5613590      maxPos 1122700    ratio 0.200
LINK      0xf71b619450bafe953f47b9b556416a3a67b443b5 maxOI 42643.6      maxPos 8528.6     ratio 0.200
NEAR      0x1cd15ae8bff0fe0a7f49233be8b90734775ba454 maxOI 279000       maxPos 50000      ratio 0.179
SUI       0x1be21287cfb865a7c462ff3c4f275e70bcccefe4 maxOI 635009       maxPos 127000     ratio 0.200
XLM       0x74b05b9b8c8f180b53b7891018f3b254b3e658c9 maxOI 2677780      maxPos 535556     ratio 0.200
XRP       0x7058579f3248559963f79adb937c6de9f953e060 maxOI 344632       maxPos 68926.4    ratio 0.200
1000PEPE, ETH, HYPE, LIT, PUMP, SOL, TAO, VVV, WLD, ZRO           ratio 0.100
```
`getMaxPerpOrderSize` for a read-only account gives the same caps, e.g. `BTC "maxPositionSize":"10000000000"` (8 decimals = 100 BTC) and `ZEC maxPos 420`.

## Environment
@somnia-chain/markets-sdk 0.32.1 + viem. Network: Somnia Hideki testnet (chain 50383, RPC https://api.hideki2.infra.testnet.somnia.network). Wallet address: n/a (read-only; probe account 0x…dEaD)
