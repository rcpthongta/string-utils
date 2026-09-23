# format / createFormatter

Template interpolation utility supporting positional placeholders and nested object/array dot-notation paths.

## `format`

Interpolates placeholders in a template with provided arguments.

### Signature

```typescript
function format(
  template: string | null | undefined,
  ...args: unknown[]
): string;
```

### Parameters

| Parameter  | Type                          | Description                                         |
|------------|-------------------------------|-----------------------------------------------------|
| `template` | `string \| null \| undefined` | The template string containing placeholders.        |
| `...args`  | `unknown[]`                   | The values used to resolve and replace placeholders.|

### Returns

`string` — The formatted string, or an empty string `""` when `template` is empty, `null`, or `undefined`.

### Examples

```typescript
import { format } from "@rcpthongta/string-utils";

// Positional arguments
format("Hello {0} {1}!", "John", "Doe");
// => "Hello John Doe!"

// Nested object property paths
format("User: {0.name} ({0.role})", { name: "Alice", role: "Admin" });
// => "User: Alice (Admin)"

// Deep nested array and object paths
format("{0.users.0.name}", { users: [{ name: "Bob" }] });
// => "Bob"

format("", "World");
// => ""

format(null, "World");
// => ""

format(undefined, "World");
// => ""
```

---

## `createFormatter`

Compiles a template once into a high-performance reusable formatting function. Ideal for high-frequency or loop formatting.

### Signature

```typescript
function createFormatter(template: string | null | undefined): (...args: unknown[]) => string;
```

### Parameters

| Parameter  | Type                          | Description                     |
|------------|-------------------------------|---------------------------------|
| `template` | `string \| null \| undefined` | The template string to compile. |

### Returns

`FormatFunction` — A reusable formatting function `(...args: unknown[]) => string`.

### Examples

```typescript
import { createFormatter } from "@rcpthongta/string-utils";

const greet = createFormatter("Hello {0.name}!");

greet({ name: "Alice" });
// => "Hello Alice!"

greet({ name: "Bob" });
// => "Hello Bob!"

greet("");
// => "Hello !"

greet(null);
// => "Hello null!"

greet(undefined);
// => "Hello undefined!"
```
