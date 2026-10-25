# Errors page linked from the perps developer guide lists no perp/MarginBank errors
Severity: normal
Area: docs

## Steps to reproduce
1. Open https://app.testnet.dreamdex.io/docs/developers/perps-testnet. It says: "The full list of order errors is on the [Errors](../contracts/errors.md#order-rejection) page."
2. The same perps page names several perp reverts: `InsufficientCollateral()` (`0x3a23d825`), `IsolatedMarketBlocked`, `MaxPositionSizeExceeded()` (`0x714b36d6`), and the paper-USDso "voucherBlocked" case.
3. Open the linked page: https://app.testnet.dreamdex.io/docs/developers/contracts/errors.md (identical on app.dreamdex.io).
4. Search it for those errors:
```
curl -s https://app.testnet.dreamdex.io/docs/developers/contracts/errors.md | grep -n -i "InsufficientCollateral\|IsolatedMarket\|MaxPositionSize\|Voucher\|perp\|MarginBank\|StaleMark"
```

## Expected
The Errors page the perps guide calls "the full list" includes the perp-specific errors (PerpPool, MarginBank, voucher, stale mark), with selectors and causes, as it does for SpotPool.

## Actual
The page only has "SpotPool errors", "SpotStopOrderRegistry errors" and "Preflight (HTTP API) reverts". The grep finds no perp, MarginBank, voucher, `InsufficientCollateral`, `IsolatedMarketBlocked` or `MaxPositionSizeExceeded` entries. The only near-match is the spot `InsufficientVaultBalance()`. `IsolatedMarketBlocked` has no selector anywhere in the dreamDEX docs.

The SDK 0.32.1 bundle does know these errors (`IsolatedMarketBlocked`, `VoucherMarketNotAllowed`, `InsufficientCollateral`, `MaxPositionSizeExceeded`, `StaleMark` all appear in `node_modules/@somnia-chain/markets-sdk/dist`). So the docs have a gap that a developer decoding a raw `placeOrderFor` revert will hit.

## Evidence
Section headings of errors.md:
```
## Decoding a revert
## SpotPool errors
### Order validation
### Order rejection
### Funding and vault
### Gas
### Order lifecycle
### Batch and amend
### Operators and authorization
### Builder codes
## SpotStopOrderRegistry errors
## Preflight (HTTP API) reverts
```
grep for perp terms returns only:
```
125:| `0x14ecd6c7` | `InsufficientVaultBalance()` | Owner's SpotPool vault balance does not cover the order's collateral at creation time. |
```
Selectors computed with viem `keccak256(toHex(sig)).slice(0,10)`:
```
InsufficientCollateral() 0x3a23d825
MaxPositionSizeExceeded() 0x714b36d6
IsolatedMarketBlocked() 0xaa4fc774   (assumes no args; the docs don't give the signature)
```

## Environment
Docs as served 2026-10-20. @somnia-chain/markets-sdk 0.32.1. Network: Somnia Hideki testnet (chain 50383). Wallet address: n/a (read-only)
