# Getting Started

`@rcpthongta/string-utils` provides a collection of type-safe, lightweight, and performant string utilities.

## Quick Example

Import the named functions you need directly:

```typescript
import {
  camelCase,
  capitalize,
  defaultIfBlank,
  mask,
  redact,
  slugify
} from "@rcpthongta/string-utils";

// Capitalize first character
capitalize("hello world");
// => "Hello world"

// Convert to camelCase
camelCase("user_profile_id");
// => "userProfileId"

// Convert to URL-friendly slug
slugify("Hello World & Special Characters!");
// => "hello-world-and-special-characters"

// Fallback value for blank or whitespace strings
defaultIfBlank("   ", "default value");
// => "default value"

// Pattern-based masking
mask("0812345678", "(###) ###-####");
// => "(081) 234-5678"

// Sensitive string redaction
redact("0812345678", { visibleStart: 3, visibleEnd: 2 });
// => "081*****78"
```

## CommonJS Support

CommonJS environments (such as older Node.js scripts) are fully supported out-of-the-box:

```javascript
const { capitalize, slugify } = require("@rcpthongta/string-utils");

console.log(capitalize("hello"));
// => "Hello"
```

## Tree-Shaking

The package declares `"sideEffects": false` in its `package.json`. Bundlers such as Vite, Rollup, Webpack, and esbuild will automatically eliminate any unused functions from your production build.

```typescript
// Only `capitalize` will be included in your bundle!
import { capitalize } from "@rcpthongta/string-utils";
```

## Next Steps

Explore the individual utility functions in the sidebar or dive into specific categories:

- [Case Conversion](/api/camel-case)
- [Casing & Capitalization](/api/capitalize)
- [Formatting & Templating](/api/format)
- [Pattern Masking](/api/mask)
- [Validation & Fallback](/api/has-length)
- [Privacy & Redaction](/api/redact)
