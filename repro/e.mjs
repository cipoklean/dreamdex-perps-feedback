import { SOMNIA_HIDEKI_TESTNET_ADDRESSES, SomniaMarkets } from "@somnia-chain/markets-sdk";
import { hidekiTestnet } from "@somnia-chain/markets-sdk/chains";
import fs from "fs";
const m = new SomniaMarkets({ chain: hidekiTestnet, indexerUrl: "https://hideki-dev.smk.somnia.host/v1/graphql", addresses: SOMNIA_HIDEKI_TESTNET_ADDRESSES });
const perps = await m.client.listPerpMarkets();
const doc={};
for (const l of fs.readFileSync("../perpsdocs/app.testnet.dreamdex.io_docs_trading_perps-testnet_README.md","utf8").split("\n")) if(l.startsWith("| **")&&l.includes("PERP")){const c=l.split("|").map(s=>s.trim());doc[c[1].replace(/\*/g,"").replace("-PERP","")]=Number(c[6].split(" ")[0].replace(/,/g,""));}
const acct="0x000000000000000000000000000000000000dEaD";
for (const p of perps.sort((a,b)=>a.baseSymbol<b.baseSymbol?-1:1)) {
  const r=await m.client.getMaxPerpOrderSize({pool:p.poolAddress,marginBank:p.marginBank,account:acct,isBid:true,price:BigInt(p.markPrice)});
  const mps=Number(r.maxPositionSize)/10**p.baseDecimals; const oi=doc[p.baseSymbol];
  console.log(p.baseSymbol.padEnd(9),"maxPos",mps,"docOIcap",oi,"ratio",(mps/oi).toFixed(4));
}
process.exit(0)
