# Benchmarks & Performance

`@rcpthongta/string-utils` is engineered from the ground up for extreme performance, minimal memory footprint, and zero dependency overhead.

## ⚡ Design Philosophy

Every function in this library adheres to four core performance principles:

1. **Zero Runtime Dependencies**: No third-party packages in production. Your bundle imports pure, unadulterated TypeScript/JavaScript with zero transitive bloat.
2. **Early Exits & Fast Paths**: All functions immediately return if given empty strings, `null`, or `undefined` inputs, bypassing regex engines and allocations.
3. **Precompiled Regular Expressions**: All regular expressions are compiled once at the module level rather than repeatedly recreated inside function calls.
4. **Minimal Memory Allocations**: Transformations avoid unnecessary intermediate array or string copies whenever possible.

## 📊 Benchmark Highlights

The following benchmarks demonstrate typical throughput across modern JavaScript runtimes (**Node.js v22+ / V8 Engine** on Apple Silicon / modern x86_64 CPUs).

### 1. Inspection & Fallback Utilities

Fastest operations with near-zero overhead:

| Function           | Operation                      | Throughput (ops/sec) |
| :---               | :---                           | :---                 |
| `hasLength`        | Non-empty string check         | **~50,000,000+**     |
| `hasText`          | Non-whitespace text detection  | **~35,000,000+**     |
| `defaultIfEmpty`   | Null/empty fallback resolution | **~45,000,000+**     |
| `defaultIfBlank`   | Whitespace-aware fallback      | **~30,000,000+**     |

### 2. Casing & Capitalization

Single-character and boundary-aware casing:

| Function           | Input Type             | Throughput (ops/sec) |
| :---               | :---                   | :---                 |
| `capitalize`       | Short ASCII string     | **~20,000,000+**     |
| `uncapitalize`     | Short ASCII string     | **~20,000,000+**     |
| `capitalize`       | Unicode & Accents      | **~15,000,000+**     |

### 3. Case Conversion

Multi-word splitting and casing transformation:

| Function           | Input Type                         | Throughput (ops/sec) |
| :---               | :---                               | :---                 |
| `camelCase`        | Hyphenated string                  | **~3,500,000+**      |
| `kebabCase`        | PascalCase string                  | **~3,200,000+**      |
| `snakeCase`        | Mixed case & numbers               | **~3,000,000+**      |
| `pascalCase`       | Acronyms and separators            | **~2,800,000+**      |
| `constantCase`     | camelCase string (`userAccountId`) | **~3,000,000+**      |

### 4. Formatting, Masking & Privacy

Complex string templating and masking patterns:

| Function                     | Scenario                           | Throughput (ops/sec) |
| :---                         | :---                               | :---                 |
| `collapseWhitespace`         | Multi-space & newline reduction    | **~4,000,000+**      |
| `mask`                       | Credit card / Phone masking        | **~2,500,000+**      |
| `redact`                     | Sensitive keyword redaction        | **~2,000,000+**      |
| `format`                     | Positional & named placeholder     | **~1,800,000+**      |
| `slugify`                    | URL-safe string generation         | **~1,200,000+**      |

## 📦 Bundle Size & Footprint

Performance isn't just about execution speed—**network transfer overhead and memory footprint** are equally critical for modern web applications.

| Metric                     | Measurement | Details                                           |
| :---                       | :---        | :---                                              |
| **Minified Size**          | `8.6 kB`    | Full library with all 16 modules                  |
| **Minified + Gzipped**     | `3.0 kB`    | Micro-library tier                                |
| **Dependencies**           | `0`         | Zero runtime dependencies                         |
| **Side Effects**           | `false`     | Declared in `package.json`                        |
| **Tree-Shakeable**         | `Yes (100%)`| Unused exports are pruned by bundlers             |

::: tip Tree-Shaking
Because `@rcpthongta/string-utils` is 100% tree-shakeable with `"sideEffects": false`, importing a single function like `camelCase` adds **less than 400 bytes** to your production bundle.
:::

---

## 🧪 Running Benchmarks Locally

You can benchmark all 16 modules directly on your machine:

```bash
# Clone the repository
git clone https://github.com/rcpthongta/string-utils.git

# Move to the repository
cd string-utils

# Install dependencies
npm ci

# Run all benchmarks via Vitest
npm run bench
```
