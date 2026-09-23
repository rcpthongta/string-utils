# uncapitalize

Converts the first character of a string to lowercase while preserving its literal TypeScript type.

## Signature

```typescript
function uncapitalize<T extends string>(value: T): Uncapitalize<T>;
function uncapitalize(value: string | null | undefined): string;
```

## Parameters

| Parameter | Type                          | Description                       |
|-----------|-------------------------------|-----------------------------------|
| `value`   | `string \| null \| undefined` | The input string to uncapitalize. |

## Returns

`Uncapitalize<T> | string` — The uncapitalized string, or an empty string `""` when `value` is empty, `null`, or `undefined`.

## Examples

```typescript
import { uncapitalize } from "@rcpthongta/string-utils";

uncapitalize("Hello");
// => "hello"

uncapitalize("HelloWorld");
// => "helloWorld"

uncapitalize("hello");
// => "hello"

uncapitalize("");
// => ""

uncapitalize(null);
// => ""

uncapitalize(undefined);
// => ""
```
