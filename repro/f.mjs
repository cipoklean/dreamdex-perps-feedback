import { createPublicClient, http, parseAbi } from "viem";
import fs from "fs";
const c=createPublicClient({transport:http("https://api.hideki2.infra.testnet.somnia.network")});
const abi=parseAbi(["function getPerpPoolParameters() view returns ((uint256 initialMarginBps, uint256 maintenanceMarginBps, uint256 closeOutMarginBps, uint256 maxOpenInterest, uint256 maxPositionSize, uint256 takerFeeBpsTimes1k, int256 makerFeeBpsTimes1k, uint256 insuranceFundShareBps))"]);
const ps=JSON.parse(fs.readFileSync("perps.json"));
for (const p of ps.sort((a,b)=>a.baseSymbol<b.baseSymbol?-1:1)) {
 const r=await c.readContract({address:p.poolAddress,abi,functionName:"getPerpPoolParameters"});
 const d=10**p.baseDecimals;
 console.log(p.baseSymbol.padEnd(9),p.poolAddress,"IM",r.initialMarginBps,"MM",r.maintenanceMarginBps,"CO",r.closeOutMarginBps,"maxOI",Number(r.maxOpenInterest)/d,"maxPos",Number(r.maxPositionSize)/d,"ratio",(Number(r.maxPositionSize)/Number(r.maxOpenInterest)).toFixed(3),"taker",r.takerFeeBpsTimes1k,"maker",r.makerFeeBpsTimes1k);
}
