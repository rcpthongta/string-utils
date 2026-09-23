# defaultIfBlank

Returns a default fallback value when the given input is empty, contains only whitespace, `null`, or `undefined`.

## Signature

```typescript
function defaultIfBlank(
  value: string | null | undefined,
  defaultValue: string
): string;
```

## Parameters

| Parameter      | Type                          | Description                                       |
|----------------|-------------------------------|---------------------------------------------------|
| `value`        | `string \| null \| undefined` | The string value to check.                        |
| `defaultValue` | `string`                      | The fallback value returned when `value` is blank.|

## Returns

`string` — The original `value` if it contains non-whitespace text; otherwise `defaultValue`.

## Examples

```typescript
import { defaultIfBlank } from "@rcpthongta/string-utils";

defaultIfBlank("Hello", "default");
// => "Hello"

defaultIfBlank("   ", "default");
// => "default" (whitespace is treated as blank)

defaultIfBlank("", "default");
// => "default"

defaultIfBlank(null, "default");
// => "default"

defaultIfBlank(undefined, "default");
// => "default"
```
