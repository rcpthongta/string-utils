# redact

Censors sensitive string content using a masking character (such as `*`) while optionally preserving visible characters at the start and end.

## Signature

```typescript
function redact(value: string | null | undefined): string;
function redact(value: string | null | undefined, replacement: string): string;
function redact(value: string | null | undefined, visibleStart: number): string;
function redact(value: string | null | undefined, options: RedactOptions): string;
```

## Parameters

| Parameter | Type                                | Description                                                                           |
|-----------|-------------------------------------|---------------------------------------------------------------------------------------|
| `value`   | `string \| null \| undefined`       | The string to redact.                                                                 |
| `options` | `string \| number \| RedactOptions` | Replacement string, visible start character count, or a configuration options object. |

## Options

| Option         | Type                   | Default  | Description                                                                                        |
|----------------|------------------------|----------|----------------------------------------------------------------------------------------------------|
| `visibleStart` | `number`               | `0`      | Characters to keep visible at the start.                                                           |
| `visibleEnd`   | `number`               | `0`      | Characters to keep visible at the end.                                                             |
| `replacement`  | `string`               | `"*"`    | Replacement character or string for masked positions.                                              |
| `mode`         | `CharacterSegmentMode` | `"utf16"`| Determines how characters are counted and segmented (`"utf16"`, `"codePoint"`, or `"grapheme"`). |

## Returns

`string` — The redacted string, or an empty string `""` when `value` is empty, `null`, or `undefined`.

## Examples

```typescript
import { redact } from "@rcpthongta/string-utils";

// Full redaction (default)
redact("0812345678");
// => "**********"

// Keep start characters visible
redact("0812345678", 2);
// => "08********"

// Keep both start and end characters visible
redact("0812345678", { visibleStart: 3, visibleEnd: 2 });
// => "081*****78"

// Custom replacement character
redact("1234567890", { visibleStart: 4, visibleEnd: 4, replacement: "#" });
// => "1234##7890"

redact("");
// => ""

redact(null);
// => ""

redact(undefined);
// => ""
```
