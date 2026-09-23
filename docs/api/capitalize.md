# capitalize

Capitalizes the first character of a string while preserving its literal TypeScript type.

## Signature

```typescript
function capitalize<T extends string>(value: T): Capitalize<T>;
function capitalize(value: string | null | undefined): string;
```

## Parameters

| Parameter | Type                          | Description                     |
|-----------|-------------------------------|---------------------------------|
| `value`   | `string \| null \| undefined` | The input string to capitalize. |

## Returns

`Capitalize<T> | string` — The capitalized string, or an empty string `""` when `value` is empty, `null`, or `undefined`.

## Examples

```typescript
import { capitalize } from "@rcpthongta/string-utils";

capitalize("hello");
// => "Hello"

capitalize("helloWorld");
// => "HelloWorld"

capitalize("Hello");
// => "Hello"

capitalize("");
// => ""

capitalize(null);
// => ""

capitalize(undefined);
// => ""
```
