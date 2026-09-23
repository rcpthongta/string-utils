# @rcpthongta/string-utils

A lightweight, type-safe, dependency-free string utility library for TypeScript and modern JavaScript applications.

---

## Features

- 🪶 **Zero Dependencies**: Pure vanilla TypeScript with zero third-party runtime dependencies.
- 🌲 **Tree-Shakeable**: Side-effect free, allowing bundlers to include only the functions you actually use.
- 🛡️ **Type-Safe**: Written in strict TypeScript with comprehensive type definitions.
- 📦 **Universal Modules**: Supports ESM, CommonJS, and browser global (IIFE) via CDN.
- ⚡ **High Performance**: Optimized implementations benchmarked and thoroughly tested.

---

## Documentation

> 📖 **Interactive Documentation & API Playground**
>
> Full API references, interactive examples, and detailed guides are available on our official website:
>
> 👉 **[Visit Documentation Website](https://github.com/rcpthongta/string-utils#readme)** *(Link to docs site)*

---

## Installation

Install using your favorite package manager:

```bash
# npm
npm install @rcpthongta/string-utils

# pnpm
pnpm add @rcpthongta/string-utils

# yarn
yarn add @rcpthongta/string-utils

# bun
bun add @rcpthongta/string-utils
```

### CDN / Direct Browser Usage

For quick prototyping or environments without a build step:

```html
<!-- jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/@rcpthongta/string-utils/dist/iife/index.global.js"></script>

<!-- unpkg -->
<script src="https://unpkg.com/@rcpthongta/string-utils/dist/iife/index.global.js"></script>

<script>
  const { capitalize, camelCase, slugify } = window.stringUtils;
</script>
```

---

## Quick Start

Import only the utilities you need:

```typescript
import {
  camelCase,
  capitalize,
  defaultIfBlank,
  mask,
  redact,
  slugify
} from "@rcpthongta/string-utils";

// Case transformation
capitalize("hello world"); // "Hello world"
camelCase("user_profile_id"); // "userProfileId"

// Sanitization & URL
slugify("Hello World & Special Characters!"); // "hello-world-and-special-characters"

// Validation & Fallback
defaultIfBlank("   ", "default value"); // "default value"

// Formatting with mask pattern
mask("0812345678", "(###) ###-####"); // "(081) 234-5678"
mask("1234567890123456", "#### #### #### ####"); // "1234 5678 9012 3456"

// Privacy & Censoring
redact("0812345678", { visibleStart: 3, visibleEnd: 2 }); // "081*****78"
```

CommonJS is also fully supported:

```javascript
const { capitalize, slugify } = require("@rcpthongta/string-utils");
```

---

## Overview of Available Utilities

Below is a summary of the utility functions available in this package:

| Category                    | Functions                                                           |
|-----------------------------|---------------------------------------------------------------------|
| **Case Conversion**         | `camelCase`, `constantCase`, `kebabCase`, `pascalCase`, `snakeCase` |
| **Casing & Capitalization** | `capitalize`, `uncapitalize`                                        |
| **Formatting & Templating** | `collapseWhitespace`, `format`, `createFormatter`, `slugify`        |
| **Pattern Masking**         | `mask`, `createMask`                                                |
| **Validation & Fallback**   | `hasLength`, `hasText`, `defaultIfBlank`, `defaultIfEmpty`          |
| **Privacy & Redaction**     | `redact` |

*(Refer to the [Documentation Website](https://github.com/rcpthongta/string-utils#readme) for full parameter signatures, options, and live demos).*

---

## Contributing

Contributions are always welcome! Please check out our [Contributing Guide](CONTRIBUTING.md) before submitting a Pull Request.

---

## Security

If you discover any security-related issues, please review our [Security Policy](SECURITY.md).

---

## License

This project is licensed under the [MIT License](LICENSE.md) &copy; [rcpthongta](https://github.com/rcpthongta).
