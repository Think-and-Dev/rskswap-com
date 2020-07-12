---
title: Other Exports
tags: sdk, documentation
---

# JSBI

```typescript
import { JSBI } from '@thinkanddev/uniswap-sdk-rsk'
// import JSBI from 'jsbi'
```

The default export from [jsbi](https://github.com/GoogleChromeLabs/jsbi).

# BigintIsh

```typescript
import { BigintIsh } from '@thinkanddev/uniswap-sdk-rsk'
// type BigintIsh = JSBI | bigint | string
```

A union type comprised of all types that can be cast to a JSBI instance.

# ChainId

```typescript
import { ChainId } from '@thinkanddev/uniswap-sdk-rsk'
// enum ChainId {
//   MAINNET = 1,
//   ROPSTEN = 3,
//   RINKEBY = 4,
//   GÖRLI = 5,
//   KOVAN = 42,
//   RSK_MAINNET = 30,
//   RSK_TESTNET = 31,
// }
```

A enum denominating supported chain IDs.

# ChainId

```typescript
import { TradeType } from '@thinkanddev/uniswap-sdk-rsk'
// enum TradeType {
//   EXACT_INPUT,
//   EXACT_OUTPUT
// }
```

A enum denominating supported trade types.

# Rounding

```typescript
import { Rounding } from '@thinkanddev/uniswap-sdk-rsk'
// enum Rounding {
//   ROUND_DOWN,
//   ROUND_HALF_UP,
//   ROUND_UP
// }
```

A enum denominating supported rounding options.

# FACTORY_ADDRESS

```typescript
import { FACTORY_ADDRESS } from '@thinkanddev/uniswap-sdk-rsk'
```

The <Link to='/docs/v2/smart-contracts/factory/#address'>factory address</Link>.

# INIT_CODE_HASH

```typescript
import { INIT_CODE_HASH } from '@thinkanddev/uniswap-sdk-rsk'
```

See <Link to='/docs/v2/smart-contracts/factory/#address'>Pair Addresses</Link>.

# MINIMUM_LIQUIDITY

```typescript
import { MINIMUM_LIQUIDITY } from '@thinkanddev/uniswap-sdk-rsk'
```

See <Link to='/docs/v2/smart-contracts/architecture/#minimum-liquidity'>Minimum Liquidity</Link>.

# InsufficientReservesError

```typescript
import { InsufficientReservesError } from '@thinkanddev/uniswap-sdk-rsk'
```

# InsufficientInputAmountError

```typescript
import { InsufficientInputAmountError } from '@thinkanddev/uniswap-sdk-rsk'
```

# WETH

```typescript
import { WETH } from '@thinkanddev/uniswap-sdk-rsk'
```

An object whose values are <Link to='/docs/v2/smart-contracts/router/#weth'>WRBTC</Link> <Link to='/docs/v2/SDK/token'>Token</Link> instances, indexed by [ChainId](#chainid). The name may be confusing as it's the one used by the Uniswap Protocol on Ethereum.
