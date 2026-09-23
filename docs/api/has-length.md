# hasLength

TypeScript type guard that checks whether a value is a non-empty string (`length > 0`).

## Signature

```typescript
function hasLength(value: unknown): value is string;
```

## Parameters

| Parameter | Type      | Description         |
|-----------|-----------|---------------------|
| `value`   | `unknown` | The value to check. |

## Returns

`boolean` — `true` if `value` is a string with `length > 0`; otherwise `false`. Acts as a TypeScript type guard narrowing `unknown` to `string`.

## Examples

```typescript
import { hasLength } from "@rcpthongta/string-utils";

hasLength("Hello World");
// => true

hasLength("   ");
// => true (whitespace counts as length)

hasLength("");
// => false

hasLength(123);
// => false

hasLength(null);
// => false

hasLength(undefined);
// => false

// TypeScript type narrowing example
function processInput(val: unknown) {
  if (hasLength(val)) {
    // val is automatically narrowed to `string`
    console.log(val.toUpperCase());
  }
}
```
