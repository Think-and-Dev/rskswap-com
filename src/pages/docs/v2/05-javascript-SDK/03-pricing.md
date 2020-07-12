---
title: Pricing
tags: SDK, developer-guides, documentation
---

Looking for a <Link to='/docs/v2/javascript-SDK/quick-start'>quickstart</Link>?

Let's talk pricing. This guide will focus on the two most important Uniswap prices: the **mid price** and the **execution price**.
You will see that we mention **WETH** this is to keep the naming convention of the Uniswap Protocol on Ethereum. Despite the name this is actually **WRBTC** on RSK.

# Mid Price

The mid price, in the context of Uniswap, is the price that reflects the _ratio of reserves in one or more pairs_. There are three ways we can think about this price. Perhaps most simply, it defines the relative value of one token in terms of the other. It also represents the price at which you could theoretically trade an infinitesimal amount (ε) of one token for the other. Finally, it can be interpreted as the current _market-clearing or fair value price_ of the assets.

Let's consider the mid price for DOC-WRBTC (that is, the amount of DOC per 1 WETH).

## Direct

The simplest way to get the DOC-WRBTC mid price is to observe the pair directly:

```typescript
import { ChainId, Token, WETH, Pair } from '@thinkanddev/uniswap-sdk-rsk'

const DOC = new Token(ChainId.RSK_MAINNET, '0xE700691Da7B9851F2F35f8b8182C69C53ccad9DB', 18)

// note that you may want/need to handle this async code differently,
// for example if top-level await is not an option
const pair = await Pair.fetchData(DOC, WETH[DOC.chainId])

const route = new Route([pair], WETH[DOC.chainId])

console.log(route.midPrice.toSignificant(6)) // 201.306
console.log(route.midPrice.invert().toSignificant(6)) // 0.00496756
```

You may be wondering why we have to construct a _route_ to get the mid price, as opposed to simply getting it from the pair (which, after all, includes all the necessary data). The reason is simple: a route forces us to be opinionated about the _direction_ of trading. Routes consist of one or more pairs, and an input token (which fully defines a trading path). In this case, we passed WRBTC as the input token, meaning we're interested in a WRBTC -> DOC trade.

Now we understand that the mid price is going to be defined in terms of DOC/WETH. Not to worry though, if we need the WETH/DOC price, we can easily invert.

Finally, you may have noticed that we're formatting the price to 6 significant digits. This is because internally, prices are stored as exact-precision fractions, which can be converted to other representations on demand. For a full list of options, see <Link to='/docs/v2/SDK/fractions#price'>Price</Link>.

## Indirect

For the sake of example, let's imagine a direct pair between DOC and WRBTC _doesn't exist_. In order to get a DOC-WRBTC mid price we'll need to pick a valid route. Imagine both DOC and WRBTC have pairs with a third token, RIF. In that case, we can calculate an indirect mid price through the RIF pairs: 

```typescript
import { ChainId, Token, WETH, Pair } from '@thinkanddev/uniswap-sdk-rsk'

const RIF = new Token(ChainId.RSK_MAINNET, '0x2aCc95758f8b5F583470bA265Eb685a8f45fC9D5', 18)
const DOC = new Token(ChainId.RSK_MAINNET, '0xE700691Da7B9851F2F35f8b8182C69C53ccad9DB', 18)

// note that you may want/need to handle this async code differently,
// for example if top-level await is not an option
const RIFWRBTCPair = await Pair.fetchData(RIF, WETH[RIF.chainId])
const DOCRIFPair = await Pair.fetchData(DOC, RIF)

const route = new Route([RIFWRBTCPair, DOCRIFPair], WETH[RIF.chainId])

console.log(route.midPrice.toSignificant(6)) // 202.081
console.log(route.midPrice.invert().toSignificant(6)) // 0.00494851
```

# Execution Price

Mid prices are great representations of the _current_ state of a route, but what about trades? It turns out that it makes sense to define another price, the _execution_ price of a trade, as the ratio of assets sent/received.

Imagine we're interested in trading 1 WRBTC for DOC:

```typescript
import { ChainId, Token, WETH, Pair, Trade } from '@thinkanddev/uniswap-sdk-rsk'

const DOC = new Token(ChainId.RSK_MAINNET, '0xE700691Da7B9851F2F35f8b8182C69C53ccad9DB', 18)

// note that you may want/need to handle this async code differently,
// for example if top-level await is not an option
const pair = await Pair.fetchData(DOC, WETH[DOC.chainId])

const route = new Route([pair], WETH[DOC.chainId])

const trade = new Trade(route, new TokenAmount(WETH[DOC.chainId], '1000000000000000000'), TradeType.EXACT_INPUT)

console.log(trade.executionPrice.toSignificant(6))
console.log(trade.nextMidPrice.toSignificant(6))
```

Notice that we're constructing a trade of 1 WRBTC for as much DOC as possible, _given the current reserves of the direct pair_. The execution price represents the average DOC/WRBTC price for this trade. Of course, the reserves of any pair can change every block, which would affect the execution price.

Also notice that we're able to access the _next_ mid price, if the trade were to complete successfully before the reserves changed.
