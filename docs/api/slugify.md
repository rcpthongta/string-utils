# slugify

Converts a string into a clean, URL-friendly slug. Removes diacritics/accents, replaces non-alphanumeric characters with separators, and normalizes casing.

## Signature

```typescript
function slugify(value: string | null | undefined, options?: SlugifyOptions): string;
```

## Parameters

| Parameter | Type                          | Description                               |
|-----------|-------------------------------|-------------------------------------------|
| `value`   | `string \| null \| undefined` | The string to transform into a slug.      |
| `options` | `SlugifyOptions`              | Optional configuration settings for slug. |

## Options

| Option      | Type      | Default | Description                                 |
|-------------|-----------|---------|---------------------------------------------|
| `separator` | `string`  | `"-"`   | Character(s) used to separate words.        |
| `lower`     | `boolean` | `true`  | Whether to convert the output to lowercase. |

## Returns

`string` — The slugified URL-safe string, or an empty string `""` when `value` is empty, `null`, or `undefined`.

## Examples

```typescript
import { slugify } from "@rcpthongta/string-utils";

slugify("Hello World!");
// => "hello-world"

// Accents and diacritics normalization
slugify("Déjà vu & Crème brûlée");
// => "deja-vu-and-creme-brulee"

// Custom separator
slugify("Hello World", { separator: "_" });
// => "hello_world"

// Preserving uppercase
slugify("Hello World", { lower: false });
// => "Hello-World"

slugify("");
// => ""

slugify(null);
// => ""

slugify(undefined);
// => ""
```
