# SDK Perps guide quick start uses symbol "BTC/USDSO:USDSO", which throws InvalidInputError
Severity: major
Area: docs

## Steps to reproduce
1. Open the Somnia Markets SDK Perps guide: https://somnia-platform-docs.vercel.app/markets/somnia-markets/typescript/perps
2. Copy the "Quick start" calls, which all use the symbol `"BTC/USDSO:USDSO"` (`exchange.depositMargin("BTC/USDSO:USDSO", 1_000)`, `exchange.createOrder("BTC/USDSO:USDSO", ...)`, `exchange.fetchFundingRate("BTC/USDSO:USDSO")`). The page intro also says "Perps are live on testnet: BTC/USDSO:USDSO and ETH/USDSO:USDSO".
3. Run this read-only script with `@somnia-chain/markets-sdk@0.32.1` (the version the dreamDEX perps docs say the app runs) against the documented Hideki perps testnet:
```js
import { SOMNIA_HIDEKI_TESTNET_ADDRESSES, SomniaMarkets } from "@somnia-chain/markets-sdk";
import { hidekiTestnet } from "@somnia-chain/markets-sdk/chains";
const ex = new SomniaMarkets({ chain: hidekiTestnet, indexerUrl: "https://hideki-dev.smk.somnia.host/v1/graphql", addresses: SOMNIA_HIDEKI_TESTNET_ADDRESSES });
const ms = await ex.loadMarkets();
console.log(Object.keys(ms).filter(k => ms[k].type === "swap").slice(0,3));
for (const s of ["BTC/USDSO:USDSO", "BTC/USDso:USDso"]) {
  try { console.log(s, "->", ex.market(s).symbol); } catch (e) { console.log(s, "-> ERROR", e.constructor.name, e.message); }
}
await ex.fetchOrderBook("BTC/USDSO:USDSO", 1);
```
4. On the same page, the "One-shot reads" snippet calls `client.listPerpMarkets({ baseSymbol: "WBTC", limit: 20 })`.

## Expected
The documented symbol resolves to the BTC perp market, so the quick start runs as written. `listPerpMarkets({ baseSymbol: "WBTC" })` returns the BTC perp market. The list of live markets is current.

## Actual
- The SDK's real ccxt symbols use mixed case `USDso` (`BTC/USDso:USDso`). The uppercase symbol from the docs is rejected by every symbol-taking call, even after `loadMarkets()` has run.
- `baseSymbol: "WBTC"` returns 0 markets on both testnets. The perp base symbol is `BTC`.
- The page says only BTC and ETH perps are live. Hideki has 21 live perp markets, and Shannon has 19 active ones.

## Evidence
Script output (2026-10-20 ~01:27 UTC):
```
swap symbols sample: [ 'ZRO/USDso:USDso', 'LIT/USDso:USDso', 'VVV/USDso:USDso' ] count 21
BTC/USDSO:USDSO -> ERROR InvalidInputError @somnia-chain/markets-sdk: unknown symbol BTC/USDSO:USDSO — call loadMarkets() first
BTC/USDso:USDso -> BTC/USDso:USDso
fetchOrderBook upper ERROR InvalidInputError @somnia-chain/markets-sdk: unknown symbol BTC/USDSO:USDSO — call loadMarkets() first
```
`listPerpMarkets` base-symbol check (repro/k.mjs):
```
hideki baseSymbol WBTC -> 0 | BTC -> 1
shannon baseSymbol WBTC -> 0 | BTC -> 1
```
Doc text quoted from the Perps page: "Perps are live on testnet: BTC/USDSO:USDSO and ETH/USDSO:USDSO" and "await exchange.depositMargin("BTC/USDSO:USDSO", 1_000); ... await exchange.createOrder("BTC/USDSO:USDSO", "limit", "buy", 0.001, 62_000); ... const perps = await client.listPerpMarkets({ baseSymbol: "WBTC", limit: 20 });"

## Environment
@somnia-chain/markets-sdk 0.32.1, Node 22. Network: Somnia Hideki testnet (chain 50383, RPC https://api.hideki2.infra.testnet.somnia.network, indexer https://hideki-dev.smk.somnia.host/v1/graphql); also checked on Shannon (50312). Wallet address: n/a (read-only)
