import { SOMNIA_TESTNET_ADDRESSES, SomniaMarkets } from "@somnia-chain/markets-sdk";
import { somniaShannon } from "@somnia-chain/markets-sdk/chains";
const m = new SomniaMarkets({ chain: somniaShannon, indexerUrl: "https://dev.smk.somnia.host/v1/graphql", addresses: SOMNIA_TESTNET_ADDRESSES });
const ps = await m.client.listPerpMarkets();
const now=Date.now()/1000;
console.log("shannon perps", ps.length, somniaShannon.id, JSON.stringify(somniaShannon.rpcUrls));
for (const p of ps) console.log(p.baseSymbol, p.poolAddress, p.marginBank, "markAge h", ((now-Number(p.markPriceUpdatedAt))/3600).toFixed(1), "lastTrade h", p.lastTradeAt? ((now-Number(p.lastTradeAt))/3600).toFixed(1):null, "OI", p.openInterest);
process.exit(0)
