import { SOMNIA_HIDEKI_TESTNET_ADDRESSES, SOMNIA_TESTNET_ADDRESSES, SomniaMarkets } from "@somnia-chain/markets-sdk";
import { hidekiTestnet, somniaShannon } from "@somnia-chain/markets-sdk/chains";
for (const [n,chain,idx,addr] of [["hideki",hidekiTestnet,"https://hideki-dev.smk.somnia.host/v1/graphql",SOMNIA_HIDEKI_TESTNET_ADDRESSES],["shannon",somniaShannon,"https://dev.smk.somnia.host/v1/graphql",SOMNIA_TESTNET_ADDRESSES]]) {
 const ex = new SomniaMarkets({ chain, indexerUrl: idx, addresses: addr });
 const w = await ex.client.listPerpMarkets({ baseSymbol: "WBTC", limit: 20 });
 const b = await ex.client.listPerpMarkets({ baseSymbol: "BTC", limit: 20 });
 console.log(n, "baseSymbol WBTC ->", w.length, "| BTC ->", b.length);
}
process.exit(0)
