# SDK "unknown symbol ... call loadMarkets() first" error is shown even after loadMarkets() succeeded
Severity: normal
Area: SDK

## Steps to reproduce
1. `npm i @somnia-chain/markets-sdk@0.32.1 viem`
2. Run:
```js
import { SOMNIA_HIDEKI_TESTNET_ADDRESSES, SomniaMarkets } from "@somnia-chain/markets-sdk";
import { hidekiTestnet } from "@somnia-chain/markets-sdk/chains";
const ex = new SomniaMarkets({ chain: hidekiTestnet, indexerUrl: "https://hideki-dev.smk.somnia.host/v1/graphql", addresses: SOMNIA_HIDEKI_TESTNET_ADDRESSES });
await ex.loadMarkets();                 // succeeds, 21 swap markets loaded
ex.market("BTC/USDSO:USDSO");           // wrong case only
```

## Expected
The error says the symbol is not a known market. Ideally it suggests the close match (`BTC/USDso:USDso`), or symbol lookup ignores case, since the casing differs only in the quote code.

## Actual
The error tells the developer to call `loadMarkets()` first, even though it already ran and loaded the market under a differently-cased symbol. That points the developer at the wrong fix. The SDK's own Perps guide uses the uppercase form (see the related docs item), so this is the first error many people will hit.

## Evidence
```
BTC/USDSO:USDSO -> ERROR InvalidInputError @somnia-chain/markets-sdk: unknown symbol BTC/USDSO:USDSO — call loadMarkets() first
BTC/USDso:USDso -> BTC/USDso:USDso
```
(The same `loadMarkets()` call returned 21 swap markets: `[ 'ZRO/USDso:USDso', 'LIT/USDso:USDso', 'VVV/USDso:USDso', ... ]`.) Script: perps-feedback/repro/j.mjs.

## Environment
@somnia-chain/markets-sdk 0.32.1, Node 22, Somnia Hideki testnet (chain 50383). Wallet address: n/a (read-only)
