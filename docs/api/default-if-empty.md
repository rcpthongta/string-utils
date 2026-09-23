# defaultIfEmpty

Returns a default fallback value when the given input is empty (`length === 0`), `null`, or `undefined`. Unlike `defaultIfBlank`, whitespace strings are preserved.

## Signature

```typescript
function defaultIfEmpty(
  value: string | null | undefined,
  defaultValue: string
): string;
```

## Parameters

| Parameter      | Type                          | Description                                       |
|----------------|-------------------------------|---------------------------------------------------|
| `value`        | `string \| null \| undefined` | The string value to check.                        |
| `defaultValue` | `string`                      | The fallback value returned when `value` is empty.|

## Returns

`string` — The original `value` if it is non-empty; otherwise `defaultValue`.

## Examples

```typescript
import { defaultIfEmpty } from "@rcpthongta/string-utils";

defaultIfEmpty("Hello", "default");
// => "Hello"

defaultIfEmpty("   ", "default");
// => "   " (whitespace string has length > 0, so it is preserved)

defaultIfEmpty("", "default");
// => "default"

defaultIfEmpty(null, "default");
// => "default"

defaultIfEmpty(undefined, "default");
// => "default"
```
