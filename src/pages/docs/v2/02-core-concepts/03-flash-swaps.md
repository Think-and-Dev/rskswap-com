---
title: Flash Swaps
tags: flash-swaps, documentation
---

Rsk Swap flash swaps allow you to withdraw up to the full reserves of any ERC20 token on Rsk Swap and execute arbitrary logic at no upfront cost, provided that by the end of the transaction you either:

- pay for the withdrawn ERC20 tokens with the corresponding pair tokens
- return the withdrawn ERC20 tokens along with a small fee

Flash swaps are incredibly useful because they obviate upfront capital requirements and unnecessary order-of-operations constraints for multi-step transactions involving Rak Swap.

# Examples

## Capital Free Arbitrage

One particularly interesting use case for flash swaps is capital-free arbitrage. It's well-known that an integral part of Rsk Swap's design is to create incentives for arbitrageurs to trade the Rsk Swap price to a "fair" market price. While game-theoretically sound, this strategy is accessible only to those with sufficient capital to take advantage of arbitrage opportunities. Flash swaps remove this barrier entirely, effectively democratizing arbitrage.

Imagine a scenario where the cost of buying 1 RBTC on Rsk Swap is 200 DOC (which is calculated by calling `getAmountIn` with 1 RBTC specified as an exact output), and on Money on Chain 1 RBTC buys 220 DOC. To anyone with 200 DOC available, this situation represents a risk-free profit of 20 DOC. Unfortunately, you may not have 200 DOC lying around. With flash swaps, however, this risk-free profit is available for anyone to take as long as they're able to pay gas fees.

### Withdrawing RBTC from Rsk Swap

The first step is to _optimistically_ withdraw 1 RBTC from Rsk Swap via a flash swap. This will serve as the capital that we use to execute our arbitrage. Note that in this scenario, we're assuming that:

- 1 RBTC is the pre-calculated profit-maximizing trade
- The price has not changed on Rsk Swap or Money on Chain since our calculation

It may be the case that we'd like to calculate the profit-maximizing trade on-chain at the moment of execution, which is robust to price movements. This can be somewhat complex, depending on the strategy being executed. However, one common strategy is trading as profitably as possible _against a fixed external price_. If the Rsk Swap market price is far enough above or below this external price, the following example contains code that calculates the amount to trade over Rsk Swap for maximum profit: [`ExampleSwapToPrice.sol`](https://github.com/Think-and-Dev/rskswap-periphery/blob/master/contracts/examples/ExampleSwapToPrice.sol).

<Github href="https://github.com/Think-and-Dev/rskswap-periphery/blob/master/contracts/examples/ExampleSwapToPrice.sol">ExampleSwapToPrice.sol</Github>

### Trade at External Venue

Once we've obtained our temporary capital of 1 RBTC from Rsk Swap, we now can trade this for 220 DOC on Money on Chain. Once we've received the DOC, we need to pay Uniswap back. We've mentioned that the amount required to cover 1 RBTC is 200 DOC, calculated via `getAmountIn`. So, after sending 200 of the DOC back to the Rsk Swap pair, you're left with 20 DOC of profit!

## Instant Leverage

Flash swaps can be used to improve the efficiency of levering up using lending protocols and Uniswap.

Consider Maker in its simplest form: a system which accepts RBTC as collateral and allows DOC to be minted against it while ensuring that the value of the RBTC never drops below 150% of the value of the DOC.

Say we use this system to deposit a principal amount of 3 RBTC, and mint the maximum amount of DOC. At a price of 1 RBTC / 200 DOC, we receive 400 DOC. In theory, we could lever this position up by selling the DOC for more RBTC, depositing this RBTC, minting the maximum amount of DOC (which would be less this time), and repeating until we've reached our desired leverage level.

It's quite simple to use Uniswap as a liquidity source for the DOC-to-RBTC component of this process. However, looping through protocols in this way isn't particularly elegant, and can be gas-intensive.

Luckily, flash swaps enable us to withdraw the _full_ RBTC amount upfront. If we wanted 2x leverage against our 3 RBTC principal, we could simply request 3 RBTC in a flash swap and deposit 6 RBTC into Moeny on Chain. This gives us the ability to mint 800 DOC. If we mint as much as we need to cover our flash swap (say 605), the remainder serves as a safety margin against price movements.

# Developer resources

- To see how to integrate a flash swap in your smart contract read [Using Flash Swaps](/docs/v2/smart-contract-integration/using-flash-swaps/).
