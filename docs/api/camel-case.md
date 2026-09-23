# camelCase

Converts any string to `camelCase`. Supports standard separators, acronyms, numbers, and Unicode characters.

## Signature

```typescript
function camelCase(value: string | null | undefined): string;
```

## Parameters

| Parameter | Type                          | Description                  |
|-----------|-------------------------------|------------------------------|
| `value`   | `string \| null \| undefined` | The input string to convert. |

## Returns

`string` — The camelCase formatted string, or an empty string `""` when `value` is empty, `null`, `undefined`, or contains no extractable words.

## Examples

```typescript
import { camelCase } from "@rcpthongta/string-utils";

camelCase("Foo Bar");
// => "fooBar"

camelCase("--foo-bar--");
// => "fooBar"

camelCase("FOO_BAR");
// => "fooBar"

camelCase("XMLHttpRequest");
// => "xmlHttpRequest"

camelCase("version 2.0");
// => "version20"

camelCase("Привет Мир");
// => "приветМир"

camelCase("");
// => ""

camelCase(null);
// => ""

camelCase(undefined);
// => ""
```
