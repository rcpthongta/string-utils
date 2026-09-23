# pascalCase

Converts any string to `PascalCase`. Supports standard separators, acronyms, numbers, and Unicode characters.

## Signature

```typescript
function pascalCase(value: string | null | undefined): string;
```

## Parameters

| Parameter | Type                          | Description                  |
|-----------|-------------------------------|------------------------------|
| `value`   | `string \| null \| undefined` | The input string to convert. |

## Returns

`string` — The PascalCase formatted string, or an empty string `""` when `value` is empty, `null`, `undefined`, or contains no extractable words.

## Examples

```typescript
import { pascalCase } from "@rcpthongta/string-utils";

pascalCase("foo bar");
// => "FooBar"

pascalCase("--foo-bar--");
// => "FooBar"

pascalCase("FOO_BAR");
// => "FooBar"

pascalCase("XMLHttpRequest");
// => "XmlHttpRequest"

pascalCase("version 2.0");
// => "Version20"

pascalCase("");
// => ""

pascalCase(null);
// => ""

pascalCase(undefined);
// => ""
```
