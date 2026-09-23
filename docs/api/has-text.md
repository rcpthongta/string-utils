# hasText

TypeScript type guard that checks whether a value is a string containing at least one non-whitespace character.

## Signature

```typescript
function hasText(value: unknown): value is string;
```

## Parameters

| Parameter | Type      | Description         |
|-----------|-----------|---------------------|
| `value`   | `unknown` | The value to check. |

## Returns

`boolean` — `true` if `value` is a string with non-whitespace characters; otherwise `false`.

## Examples

```typescript
import { hasText } from "@rcpthongta/string-utils";

hasText("Hello World");
// => true

hasText("   ");
// => false (whitespace-only is rejected)

hasText("");
// => false

hasText(123);
// => false

hasText(null);
// => false

hasText(undefined);
// => false
```
