import { SOMNIA_HIDEKI_TESTNET_ADDRESSES, SomniaMarkets } from "@somnia-chain/markets-sdk";
import { hidekiTestnet } from "@somnia-chain/markets-sdk/chains";
const ex = new SomniaMarkets({ chain: hidekiTestnet, indexerUrl: "https://hideki-dev.smk.somnia.host/v1/graphql", addresses: SOMNIA_HIDEKI_TESTNET_ADDRESSES });
const ms = await ex.loadMarkets();
const swaps=Object.keys(ms).filter(k=>ms[k].type==="swap"); console.log("swap symbols sample:", swaps.slice(0,3), "count", swaps.length);
for (const s of ["BTC/USDSO:USDSO","BTC/USDso:USDso"]) { try { const m=ex.market(s); console.log(s,"->",m.symbol);} catch(e){console.log(s,"-> ERROR",e.constructor.name,e.message.slice(0,200));} }
try { const ob=await ex.fetchOrderBook("BTC/USDSO:USDSO",1); console.log("fetchOrderBook upper ok", ob.symbol);} catch(e){console.log("fetchOrderBook upper ERROR",e.constructor.name,e.message.slice(0,200));}
process.exit(0)
