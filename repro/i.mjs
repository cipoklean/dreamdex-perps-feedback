import { SOMNIA_TESTNET_ADDRESSES, SomniaMarkets } from "@somnia-chain/markets-sdk";
import { somniaShannon } from "@somnia-chain/markets-sdk/chains";
const J=(o)=>JSON.stringify(o,(k,v)=>typeof v==="bigint"?v.toString():v);
const m = new SomniaMarkets({ chain: somniaShannon, indexerUrl: "https://dev.smk.somnia.host/v1/graphql", addresses: SOMNIA_TESTNET_ADDRESSES });
console.log(J(await m.client.getPerpSystemConfig("0xdd4A14A2763FDa39b9759D2D4150DB0e0f085C4E")));
const u = await m.loadMarkets(true);
for (const x of Object.values(u)) if (x.type==="swap" && x.symbol.startsWith("SW")) console.log(x.symbol, "active", x.active, "IMbps", x.info.initialMarginBps, "maxLev", x.limits?.leverage?.max);
process.exit(0)
