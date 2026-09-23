# mask / createMask

Formats raw strings against custom pattern templates such as phone numbers, credit cards, dates, and postal codes.

## Pattern Tokens

| Token      | Matches                                 | Description                                                                          |
|------------|-----------------------------------------|--------------------------------------------------------------------------------------|
| `#`        | Digits (`0-9`, Unicode digits)          | Slot for numeric characters.                                                         |
| `A`        | Letters (`a-z`, `A-Z`, Unicode letters) | Slot for alphabetic characters.                                                      |
| `*`        | Any character                           | Wildcard slot accepting any character.                                               |
| *Literal*  | Exact character                         | Any other character (e.g. `(`, `)`, `-`, `/`, spaces) is kept as a literal delimiter.|

---

## Options

| Option             | Type                                   | Default  | Description                                                                                                          |
|--------------------|----------------------------------------|----------|----------------------------------------------------------------------------------------------------------------------|
| `fallbackPatterns` | `string[]`                             | `[]`     | Additional mask patterns to evaluate when the input does not match the primary pattern. Evaluated in declaration order.|
| `mode`             | `CharacterSegmentMode`                 | `"utf16"`| Determines how characters are counted and segmented (`"utf16"`, `"codePoint"`, or `"grapheme"`).                    |

---

## `mask`

Formats a single value using a pattern.

### Signature

```typescript
function mask(value: string | null | undefined, pattern: string): string;
function mask(value: string | null | undefined, pattern: string, options: MaskOptions): string;
```

### Parameters

| Parameter | Type                          | Description                     |
|-----------|-------------------------------|---------------------------------|
| `value`   | `string \| null \| undefined` | The string to mask.             |
| `pattern` | `string`                      | The mask template pattern.      |
| `options` | `MaskOptions`                 | Optional masking configuration. |

### Returns

`string` — The formatted string, or an empty string `""` when `value` is empty, `null`, or `undefined`.

### Examples

```typescript
import { mask } from "@rcpthongta/string-utils";

// Phone numbers
mask("0812345678", "(###) ###-####");
// => "(081) 234-5678"

// Credit cards
mask("1234567890123456", "#### #### #### ####");
// => "1234 5678 9012 3456"

// Dates
mask("20260924", "####-##-##");
// => "2026-09-24"

// Mixed tokens
mask("K9V1B2", "A#A #A#");
// => "K9V 1B2"

// Fallback patterns (e.g. 9-digit landline vs 10-digit mobile)
mask("021234567", "(###) ###-####", {
  fallbackPatterns: ["(##) ###-####"]
});
// => "(02) 123-4567"

// Unicode characters with codePoint mode
mask("😀😀123", "**-###", { mode: "codePoint" });
// => "😀😀-123"

mask("", "(###) ###-####");
// => ""

mask(null, "(###) ###-####");
// => ""

mask(undefined, "(###) ###-####");
// => ""
```

---

## `createMask`

Precompiles the pattern for high-performance repeated formatting.

### Signature

```typescript
function createMask(pattern: string): (value: string | null | undefined) => string;
function createMask(pattern: string, options: MaskOptions): (value: string | null | undefined) => string;
```

### Parameters

| Parameter | Type          | Description                     |
|-----------|---------------|---------------------------------|
| `pattern` | `string`      | The primary mask pattern.       |
| `options` | `MaskOptions` | Optional masking configuration. |

### Returns

`MaskFunction` — A reusable masking function `(value: string | null | undefined) => string`.

### Examples

```typescript
import { createMask } from "@rcpthongta/string-utils";

// Standard compiled mask
const formatPhone = createMask("(###) ###-####");

formatPhone("0812345678");
// => "(081) 234-5678"

formatPhone("0898765432");
// => "(089) 987-6543"

formatPhone("");
// => ""

formatPhone(null);
// => ""

formatPhone(undefined);
// => ""

// Precompiled mask with fallback patterns
const formatFlexiblePhone = createMask("(###) ###-####", {
  fallbackPatterns: ["(##) ###-####"]
});

formatFlexiblePhone("021234567");
// => "(02) 123-4567"

formatFlexiblePhone("0812345678");
// => "(081) 234-5678"
```
