---
title: Fetching Data
tags: SDK, developer-guides, documentation
---

Looking for a <Link to='/docs/v2/javascript-SDK/quick-start'>quickstart</Link>?

While the SDK is fully self-contained, there are two cases where it needs _on-chain data_ to function. This guide will detail both of these cases, and offer some strategies that you can use to fetch this data.

# Case 1: Tokens

Unsurprisingly, the SDK needs some notion of an ERC-20 token to be able to function. This immediately raises the question of _where data about tokens comes from_.

As an example, let's try to represent DOC in a format the SDK can work with. To do so, we need at least 3 pieces of data: a **chainId**, a **token address**, and how many **decimals** the token has. We also may be interested in the **symbol** and/or **name** of the token.

## Identifying Data

The first two pieces of data — **chainId** and **token address** — must be provided by us. Thinking about it, this makes sense, as there's really no other way to unambiguously identify a token.

So, in the case of DOC, we know that the **chainId** is `30` (we're on mainnet), and the **token address** is `0xE700691Da7B9851F2F35f8b8182C69C53ccad9DB`. Note that it's very important to externally verify token addresses. Don't use addresses from sources you don't trust!

## Required Data

The next piece of data we need is **decimals**.

### Provided by the User

One option here is to simply pass in the correct value, which we may know is `18`. At this point, we're ready to represent DOC as a <Link to='/docs/v2/SDK/token'>Token</Link>:

```typescript
import { ChainId, Token } from '@thinkanddev/uniswap-sdk-rsk'

const chainId = ChainId.RSK_MAINNET
const tokenAddress = '0xE700691Da7B9851F2F35f8b8182C69C53ccad9DB' // must be checksummed
const decimals = 18

const DOC = new Token(chainId, tokenAddress, decimals)
```

If we don't know or don't want to hardcode the value, we could look it up ourselves via any method of retrieving on-chain data in a function that looks something like:

```typescript
import { ChainId } from '@thinkanddev/uniswap-sdk-rsk'

async function getDecimals(chainId: ChainId, tokenAddress: string): Promise<number> {
  // implementation details
}
```

### Fetched by the SDK

If we don't want to provide or look up the value ourselves, we can ask the SDK to look it up for us with <Link to='/docs/v2/SDK/token#fetchdata'>Token.fetchData</Link>:

```typescript
import { ChainId, Token } from '@thinkanddev/uniswap-sdk-rsk'

const chainId = ChainId.RSK_MAINNET
const tokenAddress = '0xE700691Da7B9851F2F35f8b8182C69C53ccad9DB' // must be checksummed

// note that you may want/need to handle this async code differently,
// for example if top-level await is not an option
const DOC = await Token.fetchData(chainId, tokenAddress)
```

By default, this method will use the [default provider defined by ethers.js](https://docs.ethers.io/v5/api/providers/#providers-getDefaultProvider). If you're already using ethers.js in your application, you may pass in your provider as a 3rd argument. If you're using another library, you'll have to fetch the data separately.

## Optional Data

Finally, we can talk about **symbol** and **name**. Because these fields aren't used anywhere in the SDK itself, they're optional, and can be provided if you want to use them in your application. However, the SDK will not fetch them for you, so you'll have to provide them:

```typescript
import { ChainId, Token } from '@thinkanddev/uniswap-sdk-rsk'

const DOC = new Token(
  ChainId.RSK_MAINNET,
  '0xE700691Da7B9851F2F35f8b8182C69C53ccad9DB',
  18,
  'DOC',
  'Dollar on Chain'
)
```

or:

```typescript
import { ChainId, Token } from '@thinkanddev/uniswap-sdk-rsk'

// note that you may want/need to handle this async code differently,
// for example if top-level await is not an option
const DOC = await Token.fetchData(
  ChainId.RSK_MAINNET,
  '0xE700691Da7B9851F2F35f8b8182C69C53ccad9DB',
  undefined,
  'DOC',
  'Dollar on Chain'
)
```

# Case 2: Pairs

Now that we've explored how to define a token, let's talk about pairs. To read more about what Uniswap pairs are, see <Link to='/docs/v2/smart-contracts/pair'>Pair</Link>.

As an example, let's try to represent the DOC-WRBTC pair.

## Identifying Data

Each pair consists of two tokens (see previous section). Note that WRBTC used by the router is <Link to='/docs/v2/SDK/other-exports/#weth'>exported by the SDK</Link>.

## Required Data

The data we need is the _reserves_ of the pair. To read more about reserves, see <Link to='/docs/v2/smart-contracts/pair#getreserves'>getReserves</Link>.

### Provided by the User

One option here is to simply pass in values which we've fetched ourselves to create a <Link to='/docs/v2/SDK/pair'>Pair</Link>:

```typescript
import { ChainId, Token, WETH, Pair, TokenAmount } from '@thinkanddev/uniswap-sdk-rsk'

const DOC = new Token(ChainId.RSK_MAINNET, '0xE700691Da7B9851F2F35f8b8182C69C53ccad9DB', 18)

async function getPair(): Promise<Pair> {
  const pairAddress = Pair.getAddress(DOC, WETH[DOC.chainId])

  const reserves = [/* use pairAddress to fetch reserves here */]
  const [reserve0, reserve1] = reserves

  const tokens = [DOC, WETH[DOC.chainId]]
  const [token0, token1] = tokens[0].sortsBefore(tokens[1]) ? tokens : [tokens[1], tokens[0]]

  const pair = new Pair(new TokenAmount(token0, reserve0), new TokenAmount(token1, reserve1))
  return pair
}
```

Note that these values can change as frequently as every block, and should be kept up-to-date.

### Fetched by the SDK

If we don't want to look up the value ourselves, we can ask the SDK to look them up for us with <Link to='/docs/v2/SDK/token#fetchdata'>Pair.fetchData</Link>:

```typescript
import { ChainId, Token, WETH, Pair } from '@thinkanddev/uniswap-sdk-rsk'

const DOC = new Token(ChainId.RSK_MAINNET, '0xE700691Da7B9851F2F35f8b8182C69C53ccad9DB', 18)

// note that you may want/need to handle this async code differently,
// for example if top-level await is not an option
const pair = await Pair.fetchData(DOC, WETH[DOC.chainId])
```

By default, this method will use the [default provider defined by ethers.js](https://docs.ethers.io/v5/api/providers/#providers-getDefaultProvider). If you're already using ethers.js in your application, you may pass in your provider as a 3rd argument. If you're using another library, you'll have to fetch the data separately.

Note that these values can change as frequently as every block, and should be kept up-to-date.
