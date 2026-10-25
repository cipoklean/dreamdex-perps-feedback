# HTTP API returns no perp markets, but neither the API docs nor the perps docs say perps aren't served (bot kit README says addresses come from GET /v0/markets)
Severity: normal
Area: API

## Steps to reproduce
1. The testnet REST base is documented as `https://stg.api.dreamdex.io/v0` (https://app.dreamdex.io/docs/developers/http-api/ and quick start). The Developers overview says the HTTP API lets integrators "list the currently-available markets".
2. Query it for perps:
```
curl -s "https://stg.api.dreamdex.io/v0/markets"
curl -s "https://stg.api.dreamdex.io/v0/markets?kind=perp"
curl -s "https://stg.api.dreamdex.io/v0/markets/BTC-PERP/candles?interval=1m"
```
3. Read the bot kit README "Networks" section: "Contract addresses are in packages/core and always re-fetchable at runtime from `GET /v0/markets`."

## Expected
Either perp markets are listed (each market row already has a `kind` field), or the HTTP/WebSocket API docs and the perps developer page say clearly that perps are only reachable through the SDK / indexer on Hideki, with no REST or WS public feed.

## Actual
`/v0/markets` returns only the three spot markets, each with `"kind":"spot"`. `?kind=perp` is accepted and returns an empty list. Perp symbols return `market_not_found`. No REST base for Hideki is documented, and no page says perps are outside the HTTP/WS API. The bot kit README's "re-fetchable from GET /v0/markets" does not hold for the perp strategies, which read the GraphQL indexer instead.

## Evidence
```
$ curl -s "https://stg.api.dreamdex.io/v0/markets?kind=perp"
{"markets":[]}
$ curl -s "https://stg.api.dreamdex.io/v0/markets/BTC-PERP/candles?interval=1m"
{"description":"market not found: BTC-PERP","name":"market_not_found","status":404}
$ curl -s "https://stg.api.dreamdex.io/v0/markets"
{"markets":[{"base":"0x28f3…","kind":"spot",…,"symbol":"SOMI:USDso",…},{…"kind":"spot",…"symbol":"WBTC:USDso"…},{…"kind":"spot",…"symbol":"WETH:USDso"…}]}
```
grep across the HTTP API README, market-data.md, websocket real-time-feed.md and contracts/errors.md for "perp": no matches.

## Environment
REST https://stg.api.dreamdex.io/v0 (documented testnet base), 2026-10-20. Perps network per docs: Somnia Hideki testnet (50383). Wallet address: n/a (read-only)
