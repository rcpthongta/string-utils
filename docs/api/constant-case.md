# constantCase

Converts any string to uppercase `CONSTANT_CASE`. Supports standard separators, acronyms, numbers, and Unicode characters.

## Signature

```typescript
function constantCase(value: string | null | undefined): string;
```

## Parameters

| Parameter | Type                          | Description                  |
|-----------|-------------------------------|------------------------------|
| `value`   | `string \| null \| undefined` | The input string to convert. |

## Returns

`string` — The CONSTANT_CASE formatted string, or an empty string `""` when `value` is empty, `null`, `undefined`, or contains no extractable words.

## Examples

```typescript
import { constantCase } from "@rcpthongta/string-utils";

constantCase("foo bar");
// => "FOO_BAR"

constantCase("fooBar");
// => "FOO_BAR"

constantCase("--foo-bar--");
// => "FOO_BAR"

constantCase("XMLHttpRequest");
// => "XML_HTTP_REQUEST"

constantCase("version 2.0");
// => "VERSION_20"

constantCase("");
// => ""

constantCase(null);
// => ""

constantCase(undefined);
// => ""
```
