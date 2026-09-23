import { DOT, EMPTY, FORMAT_PLACEHOLDER_REGEX, LEFT_BRACE } from "../../constants";

import { hasLength } from "../has-length";

/**
 * A reusable formatting function returned by {@link createFormatter}.
 */
export type FormatFunction = (...args: unknown[]) => string;

interface CompiledSegment {
  /** Text preceding the placeholder. */
  readonly leadingText: string;

  /** Zero-based argument index. */
  readonly argIndex: number;

  /** Property path after the argument index. */
  readonly pathSegments: readonly string[];
}

interface CompiledTemplate {
  /** Parsed placeholders and their preceding text. */
  readonly segments: readonly CompiledSegment[];

  /** Text following the last placeholder. */
  readonly suffix: string;
}

/**
 * Resolves a property path against an object or array.
 */
function resolvePath(value: unknown, segments: readonly string[]): unknown {
  const segmentCount: number = segments.length;
  let current: unknown = value;

  for (let segmentIndex: number = 0; segmentIndex < segmentCount; segmentIndex++) {
    if (current === null || current === undefined) {
      return undefined;
    }

    current = (current as Record<string, unknown>)[segments[segmentIndex]];
  }

  return current;
}

/**
 * Converts a value to its formatted string representation.
 *
 * Objects and arrays are serialized with `JSON.stringify()`. Unsupported values or serialization errors resolve to `"undefined"`.
 */
function resolveValue(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (value === null) {
    return "null";
  }

  if (value === undefined) {
    return "undefined";
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  try {
    return JSON.stringify(value) ?? "undefined";
  } catch {
    return "undefined";
  }
}

/**
 * Compiles a format template into reusable placeholder segments.
 */
function compileTemplate(template: string): CompiledTemplate {
  const segments: CompiledSegment[] = [];

  let lastIndex: number = 0;

  for (const match of template.matchAll(FORMAT_PLACEHOLDER_REGEX)) {
    const leadingText: string = template.slice(lastIndex, match.index);
    const pathParts: string[] = match[1].split(DOT);
    const argIndex: number = Number(pathParts[0]);
    const pathSegments: string[] = pathParts.slice(1);

    segments.push({ leadingText, argIndex, pathSegments });

    lastIndex = match.index + match[0].length;
  }

  return { segments, suffix: template.slice(lastIndex) };
}

/**
 * Formats a compiled template with the provided arguments.
 */
function formatCompiled(compiled: CompiledTemplate, args: readonly unknown[]): string {
  const { segments, suffix }: CompiledTemplate = compiled;
  const segmentCount: number = segments.length;

  if (segmentCount === 0) {
    return suffix;
  }

  let result: string = EMPTY;

  for (let segmentIndex: number = 0; segmentIndex < segmentCount; segmentIndex++) {
    const segment: CompiledSegment = segments[segmentIndex];

    result += segment.leadingText;

    const argValue: unknown = args[segment.argIndex];

    if (segment.pathSegments.length === 0) {
      result += resolveValue(argValue);
    } else {
      result += resolveValue(resolvePath(argValue, segment.pathSegments));
    }
  }

  return result + suffix;
}

/**
 * Formats a template by replacing indexed placeholders with argument values.
 *
 * Supports `{index}` placeholders and dot notation for nested properties,
 * such as `{0.name}` and `{0.items.0}`.
 *
 * @param template - The template to format.
 * @param args - The values used to resolve placeholders.
 * @returns The formatted string, or an empty string when `template` is empty, `null`, or `undefined`.
 *
 * @example
 *
 * format("Hello {0}!", "World");                            // "Hello World!"
 * format("Hello {0.name}!", { name: "Alice" });             // "Hello Alice!"
 * format("{0.users.0.name}", { users: [{ name: "Bob" }] }); // "Bob"
 */
export function format(template: string | null | undefined, ...args: unknown[]): string {
  if (!hasLength(template)) {
    return EMPTY;
  }

  if (!template.includes(LEFT_BRACE)) {
    return template;
  }

  const compiled: CompiledTemplate = compileTemplate(template);

  return formatCompiled(compiled, args);
}

/**
 * Creates a reusable formatter from a template.
 *
 * The template is compiled once when the formatter is created, making it efficient for repeated formatting with different arguments.
 *
 * @param template - The template to compile.
 * @returns A reusable formatter function.
 *
 * @example
 * const greet = createFormatter("Hello {0}!");
 *
 * greet("Alice");   // "Hello Alice!"
 * greet("Bob");     // "Hello Bob!"
 * greet("");        // "Hello !"
 * greet(null);      // "Hello null!"
 * greet(undefined); // "Hello undefined!"
 */
export function createFormatter(template: string | null | undefined): FormatFunction {
  if (!hasLength(template)) {
    return (): string => EMPTY;
  }

  if (!template.includes(LEFT_BRACE)) {
    return (): string => template;
  }

  const compiled: CompiledTemplate = compileTemplate(template);

  return (...args: unknown[]): string => formatCompiled(compiled, args);
}
