# kebabCase

Converts any string to `kebab-case`. Supports standard separators, acronyms, numbers, and Unicode characters.

## Signature

```typescript
function kebabCase(value: string | null | undefined): string;
```

## Parameters

| Parameter | Type                          | Description                  |
|-----------|-------------------------------|------------------------------|
| `value`   | `string \| null \| undefined` | The input string to convert. |

## Returns

`string` — The kebab-case formatted string, or an empty string `""` when `value` is empty, `null`, `undefined`, or contains no extractable words.

## Examples

```typescript
import { kebabCase } from "@rcpthongta/string-utils";

kebabCase("Foo Bar");
// => "foo-bar"

kebabCase("fooBar");
// => "foo-bar"

kebabCase("FOO_BAR");
// => "foo-bar"

kebabCase("XMLHttpRequest");
// => "xml-http-request"

kebabCase("version 2.0");
// => "version-20"

kebabCase("");
// => ""

kebabCase(null);
// => ""

kebabCase(undefined);
// => ""
```
