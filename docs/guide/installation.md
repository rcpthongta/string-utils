# Installation

You can install `@rcpthongta/string-utils` using your package manager of choice:

::: code-group

```bash [npm]
npm install @rcpthongta/string-utils
```

```bash [pnpm]
pnpm add @rcpthongta/string-utils
```

```bash [yarn]
yarn add @rcpthongta/string-utils
```

```bash [bun]
bun add @rcpthongta/string-utils
```

:::

## Requirements

- **Node.js**: `>= 22`
- **TypeScript**: `>= 5.0` (Optional, recommended for type safety)

## CDN / Direct Browser Usage

If you are not using a build tool, you can load the library directly via CDN:

::: code-group

```html [jsDelivr]
<script src="https://cdn.jsdelivr.net/npm/@rcpthongta/string-utils/dist/iife/index.global.js"></script>
<script>
  const { capitalize, camelCase, slugify } = window.stringUtils;

  console.log(capitalize("hello world"));
  // => "Hello world"
</script>
```

```html [unpkg]
<script src="https://unpkg.com/@rcpthongta/string-utils/dist/iife/index.global.js"></script>
<script>
  const { capitalize, camelCase, slugify } = window.stringUtils;

  console.log(capitalize("hello world"));
  // => "Hello world"
</script>
```

:::
