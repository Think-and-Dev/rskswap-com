---
title: SDK Quick start
tags: SDK, developer-guides, documentation
---

The Rsk Swap SDK exists to help developers build on top of Rsk Swap. It's designed to run in any environment that can execute JavaScript (think websites, node scripts, etc.). While simple enough to use in a hackathon project, it's also robust enough to power production applications.

# Installation

The easiest way to consume the SDK is via NPM. To install it in your project, simply run `yarn add @thinkanddev/rskswap-sdk` (or `npm install @thinkanddev/rskswap-sdk`).

# Usage

To run code from the SDK in your application, use an `import` or `require` statement, depending on which your environment supports. Note that the guides following this page will use ES6 syntax.

## ES6 (import)

```typescript
import { ChainId } from '@thinkanddev/rskswap-sdk'
console.log(`The chainId of mainnet is ${ChainId.RSK_MAINNET}.`)
```

## CommonJS (require)

```typescript
const RSKSWAP = require('@thinkanddev/rskswap-sdk')
console.log(`The chainId of mainnet is ${RSKSWAP.ChainId.RSK_MAINNET}.`)
```

# Reference

Comprehensive reference material for the SDK is available <Link to='/docs/v2/SDK'>here</Link>.
