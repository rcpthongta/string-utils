# snakeCase

Converts any string to `snake_case`. Supports standard separators, acronyms, numbers, and Unicode characters.

## Signature

```typescript
function snakeCase(value: string | null | undefined): string;
```

## Parameters

| Parameter | Type                          | Description                  |
|-----------|-------------------------------|------------------------------|
| `value`   | `string \| null \| undefined` | The input string to convert. |

## Returns

`string` — The snake_case formatted string, or an empty string `""` when `value` is empty, `null`, `undefined`, or contains no extractable words.

## Examples

```typescript
import { snakeCase } from "@rcpthongta/string-utils";

snakeCase("Foo Bar");
// => "foo_bar"

snakeCase("fooBar");
// => "foo_bar"

snakeCase("--foo-bar--");
// => "foo_bar"

snakeCase("XMLHttpRequest");
// => "xml_http_request"

snakeCase("version 2.0");
// => "version_20"

snakeCase("");
// => ""

snakeCase(null);
// => ""

snakeCase(undefined);
// => ""
```
