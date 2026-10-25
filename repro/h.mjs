import { SOMNIA_HIDEKI_TESTNET_ADDRESSES, SomniaMarkets } from "@somnia-chain/markets-sdk";
import { hidekiTestnet } from "@somnia-chain/markets-sdk/chains";
const m = new SomniaMarkets({ chain: hidekiTestnet, indexerUrl: "https://hideki-dev.smk.somnia.host/v1/graphql", addresses: SOMNIA_HIDEKI_TESTNET_ADDRESSES });
const ps = await m.client.listPerpMarkets(); const now=Math.floor(Date.now()/1000);
console.log("now",now,new Date().toISOString());
let mx=0;
for (const p of ps.sort((a,b)=>a.baseSymbol<b.baseSymbol?-1:1)) {
  const s=await m.client.getPerpHealthSnapshot(p.poolAddress);
  if(!s.priceable){console.log(p.baseSymbol,"unpriceable");continue;}
  const row=Number(p.markPrice)/1e18, live=Number(s.markPrice)/1e18, gap=(row-live)/live*100; mx=Math.max(mx,Math.abs(gap));
  console.log(p.baseSymbol.padEnd(9),"row",row,"rowAge(min)",((now-Number(p.markPriceUpdatedAt))/60).toFixed(0),"chain",live,"gap%",gap.toFixed(3));
}
console.log("max gap %",mx.toFixed(3)); process.exit(0)
