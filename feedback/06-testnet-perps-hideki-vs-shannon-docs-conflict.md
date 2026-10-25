# Docs disagree on which testnet perps are on: SDK docs point "testnet" to Shannon, dreamDEX docs say Hideki, and Shannon's own perp deployment is undocumented
Severity: normal
Area: docs

## Steps to reproduce
1. dreamDEX perps developer guide (https://app.testnet.dreamdex.io/docs/developers/perps-testnet): "Testnet perps run on the **Hideki** testnet chain", chain `50383`, MarginBank `0x478769E1177C0773c43A593DCCc4Ad15F15F1394`, using `SOMNIA_HIDEKI_TESTNET_ADDRESSES`.
2. Somnia Markets SDK guide (https://somnia-platform-docs.vercel.app/markets/somnia-markets/typescript): "For testnet, swap all four: https://dev.smk.somnia.host/v1/graphql, somniaShannon, wss://api.infra.testnet.somnia.network/ws, and SOMNIA_TESTNET_ADDRESSES." `SOMNIA_HIDEKI_TESTNET_ADDRESSES` is not mentioned. The SDK Perps page also says "Perps are live on testnet" without naming the chain.
3. Follow the SDK docs and list perps on Shannon (script: perps-feedback/repro/g.mjs and repro/i.mjs, markets-sdk 0.32.1):
```js
const m = new SomniaMarkets({ chain: somniaShannon, indexerUrl: "https://dev.smk.somnia.host/v1/graphql", addresses: SOMNIA_TESTNET_ADDRESSES });
await m.client.listPerpMarkets();
await m.client.getPerpSystemConfig("0xdd4A14A2763FDa39b9759D2D4150DB0e0f085C4E");
```

## Expected
One consistent answer to "which testnet do I build perps on". If Shannon also hosts perps, the dreamDEX docs should list its addresses and limits and say it is not the network the app and Perps Arena use.

## Actual
- Following the SDK docs puts a developer on a second, separate perp deployment on Shannon (chain 50312). It has a different MarginBank (`0xdd4A…5C4E`), a different collateral token (`0x9c32…b171`) and `maxLeverageLimit` 50. It returns 24 perp markets.
- This deployment includes test markets the docs never mention (SWSOL, SWBNB, SWDOGE, SWBTCD active; SWETH, SWBTC, SWBTCA/B/C inactive). They run at 2.5% initial margin (40x), above the 20x maximum the dreamDEX docs state. Some still carry open interest with marks up to 1097 h stale.
- Positions and vouchers on Shannon are not the app/Perps Arena accounts, which live on Hideki. Nothing in either doc set warns about this.

## Evidence
```
shannon perps 24 50312
SWSOL  ... markAge h 0.0 lastTrade h 249.1 OI 1200000000
SWBTCB 0xf18d319f823759c3f1dcd6de9268b89ac74bf0a9 ... markAge h 1097.2 lastTrade h 1764.2 OI 200900000
SWBTC  0x961e81c074f2269be3afd6b7b8b5a8a729ed1423 ... markAge h 1097.2 lastTrade h 1764.2 OI 459100000
BTC    0x3892a5179f8ea0c810c45d1630546c0317b0e5b6 ... (Shannon BTC-PERP, distinct from Hideki's 0x4181dd08…)
```
```
{"marginBank":"0xdd4A14A2763FDa39b9759D2D4150DB0e0f085C4E","collateralToken":"0x9c32F3827A1a99f0cf9B213de8b53eC3d57bb171","perpPoolFactory":"0x516d2cb6de41bE98444e887793946E65989Ba07b","liquidationEngine":"0xe01ef816783DC5f95B1982cacF9d0E3DB1bC2f28","insuranceFund":"0xac9c074A0E4BDc7ceA0993F0764853cA1C5AFB1B",...,"maxLeverageLimit":50,"fullyWired":true}
SWSOL/USDso:USDso active true IMbps 250
SWBNB/USDso:USDso active true IMbps 250
SWDOGE/USDso:USDso active true IMbps 250
SWBTCD/USDso:USDso active true IMbps 250
SWETH/USDso:USDso active false IMbps 250
```
For comparison, Hideki `getPerpSystemConfig(0x4787…1394)` returns `"maxLeverageLimit":20` and collateral `0xed7993A7…4F72`, matching the dreamDEX docs.

## Environment
@somnia-chain/markets-sdk 0.32.1. Networks: Somnia Hideki testnet (50383) and Somnia Shannon testnet (50312, RPC https://api.infra.testnet.somnia.network). Checked 2026-10-20 ~01:30 UTC. Wallet address: n/a (read-only)
