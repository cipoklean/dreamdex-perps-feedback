# Bot kit locks markets-sdk 0.31.0, so the official perps developer guide (written for 0.32.1) won't compile in it
Severity: normal
Area: SDK

## Steps to reproduce
1. In dreamdex-bot-kit, `packages/perp-core/package.json` declares `"@somnia-chain/markets-sdk": "^0.31.0"`, and `package-lock.json` resolves `packages/perp-core/node_modules/@somnia-chain/markets-sdk` to `markets-sdk-0.31.0.tgz`. `npm ci` installs 0.31.0.
2. The dreamDEX perps developer guide (https://app.testnet.dreamdex.io/docs/developers/perps-testnet) says "this page uses version 0.32.1, the one the app runs". Its snippets use `SOMNIA_HIDEKI_TESTNET_ADDRESSES`, `client.getPerpVoucherEligibility` and `trader.claimPerpVoucher`.
3. Put the guide's "Connect", "Get test funds" and "Size and place an order" snippets in one file (perps-feedback/repro/doc.ts) and typecheck against each version:
```
# against 0.32.1
npx tsc -p .        # exit 0
# against 0.31.0 (the bot kit's locked version)
npx tsc -p .
```

## Expected
The official bot kit tracks the SDK version the docs and app use, so the guide's code (and the paper-USDso voucher claim) works inside the kit.

## Actual
Against 0.31.0:
```
doc.ts(1,10): error TS2724: '"@somnia-chain/markets-sdk"' has no exported member named 'SOMNIA_HIDEKI_TESTNET_ADDRESSES'. Did you mean 'SOMNIA_TESTNET_ADDRESSES'?
doc.ts(15,42): error TS2339: Property 'getPerpVoucherEligibility' does not exist on type 'SomniaMarketsClientWithObservations'.
doc.ts(17,24): error TS2339: Property 'claimPerpVoucher' does not exist on type 'Trader'.
```
Against 0.32.1 the same file typechecks cleanly (exit 0). `npm view @somnia-chain/markets-sdk dist-tags` reports `latest: '0.32.1'`. The kit also has to hard-code Hideki endpoints and the OperatorPermissionsRegistry in `perp-core/src/config.ts`. The voucher/paper-USDso flow the docs describe as the main way to get perp margin can't be called from the kit's SDK version.

## Evidence
package-lock.json excerpt:
```
"packages/perp-core/node_modules/@somnia-chain/markets-sdk": {
  "resolved": "https://registry.npmjs.org/@somnia-chain/markets-sdk/-/markets-sdk-0.31.0.tgz",
```
The tsc output is above. The kit's own perp code typechecks on 0.31.0 (`npx tsc --noEmit` passes for perp-core and all four perp strategies; perp-core vitest 31/31 pass), so the gap is the version drift from the docs, not a broken build.

## Environment
dreamdex-bot-kit main (codeload tarball), markets-sdk 0.31.0 vs 0.32.1, TypeScript 5.x, Node 22. Network: Somnia Hideki testnet (50383). Wallet address: n/a (read-only)
