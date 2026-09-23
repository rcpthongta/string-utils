# collapseWhitespace

Collapses consecutive whitespace characters (including tabs, newlines, non-breaking spaces, and ideographic spaces) into a single space and trims leading and trailing whitespace.

## Signature

```typescript
function collapseWhitespace(value: string | null | undefined): string;
```

## Parameters

| Parameter | Type                          | Description                    |
|-----------|-------------------------------|--------------------------------|
| `value`   | `string \| null \| undefined` | The input string to normalize. |

## Returns

`string` — The normalized string with single spaces, or an empty string `""` when `value` is empty, `null`, or `undefined`.

## Examples

```typescript
import { collapseWhitespace } from "@rcpthongta/string-utils";

collapseWhitespace("Hello    World");
// => "Hello World"

collapseWhitespace("  \t\n  Hello World  \n ");
// => "Hello World"

// Non-breaking space (NBSP) support
collapseWhitespace("Hello\u00A0World");
// => "Hello World"

collapseWhitespace("");
// => ""

collapseWhitespace(null);
// => ""

collapseWhitespace(undefined);
// => ""
```
