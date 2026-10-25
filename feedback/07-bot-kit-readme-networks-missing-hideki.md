# Bot kit README's Networks table and quick start omit Hideki (chain 50383), the network the perp strategies need
Severity: normal
Area: docs

## Steps to reproduce
1. Open the dreamBot Kit README (repo root `README.md`, somnia-chain/dreamdex-bot-kit main).
2. "What's inside" says the `perp-*` strategies run "on the **Hideki testnet**".
3. The "Quick start" says: "Start on **Shannon testnet** (`NETWORK=testnet`, chain `50312`) ... Get testnet funds at testnet.somnia.network."
4. The "Networks" table has only two columns: Mainnet (5031) and "Shannon testnet" (50312, RPC `https://dream-rpc.somnia.network`).
5. Compare with `packages/perp-core/src/config.ts` and `docs/perps.md`: perps default to `NETWORK=hideki`, chain `50383`, RPC `https://api.hideki2.infra.testnet.somnia.network`, indexer `https://hideki-dev.smk.somnia.host/v1/graphql`. The config comment calls Hideki "the Tokyo testnet". The app's perps URLs use the slug `tokyo` (`/trade/perps/tokyo/BTC-PERP`), and the bounty page calls it "Somnia Tokyo testnet".
6. Confirm chain IDs:
```
curl -s -X POST -H 'content-type: application/json' --data '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}' https://api.hideki2.infra.testnet.somnia.network
curl -s -X POST -H 'content-type: application/json' --data '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}' https://dream-rpc.somnia.network
```

## Expected
The README's Networks table lists Hideki (50383) with its RPC, WS and indexer. It says perps need `NETWORK=hideki`, that "Hideki", "Tokyo" and the app's "DreamDEX region" are the same chain, and that the Shannon quick start is for spot/EC.

## Actual
A perps builder following the README quick start ends up on Shannon (`NETWORK=testnet`). That chain has a different, undocumented perp deployment (see the separate item), not the app/Perps Arena accounts. Hideki's endpoints appear only in `docs/perps.md` and source code, and three names (Hideki, Tokyo, DreamDEX region) are used for one chain with no mapping anywhere.

## Evidence
README excerpts:
```
| [`strategies/perp-*`](strategies) | **Perpetual futures** on the Hideki testnet: ...
Start on **Shannon testnet** (`NETWORK=testnet`, chain `50312`) with small size before you touch mainnet (`5031`).
| | Mainnet | Shannon testnet |
| Chain ID | `5031` | `50312` |
| RPC | `https://api.infra.mainnet.somnia.network` | `https://dream-rpc.somnia.network` |
```
`packages/perp-core/src/config.ts`:
```
// already read. Perps run on two test networks: `hideki` (the Tokyo testnet,
// where the app's testnet accounts and Perps Arena live) and `testnet` (Shannon).
  hideki: { rpc: "https://api.hideki2.infra.testnet.somnia.network", ... chainId: 50383 },
```
RPC results:
```
{"jsonrpc":"2.0","id":1,"result":"0xc4cf"}   # hideki2 → 50383
{"jsonrpc":"2.0","id":1,"result":"0xc488"}   # dream-rpc → 50312
```
App redirect: `curl -sI https://app.testnet.dreamdex.io/perps` → `location: /trade/perps/tokyo/BTC-PERP`

## Environment
dreamdex-bot-kit (main, codeload tarball, perp-core 0.1.0, markets-sdk 0.31.0 per lockfile). Networks: Somnia Hideki testnet (50383) / Shannon (50312). Wallet address: n/a (read-only)
