# API Reference

A complete overview of all utility functions provided by `@rcpthongta/string-utils`.

## Case Conversion

Convert strings between various identifier casing conventions.

| Function                             | Description                                     |
|--------------------------------------|-------------------------------------------------|
| [`camelCase`](/api/camel-case)       | Converts a string to `camelCase`.               |
| [`constantCase`](/api/constant-case) | Converts a string to uppercase `CONSTANT_CASE`. |
| [`kebabCase`](/api/kebab-case)       | Converts a string to `kebab-case`.              |
| [`pascalCase`](/api/pascal-case)     | Converts a string to `PascalCase`.              |
| [`snakeCase`](/api/snake-case)       | Converts a string to `snake_case`.              |

## Casing & Capitalization

Transform the first character casing while preserving literal TypeScript types.

| Function                            | Description                                            |
|-------------------------------------|--------------------------------------------------------|
| [`capitalize`](/api/capitalize)     | Capitalizes the first character of a string.           |
| [`uncapitalize`](/api/uncapitalize) | Converts the first character of a string to lowercase. |

## Formatting & Templating

Clean up, interpolate, and transform strings for display or URLs.

| Function                                         | Description                                                                                 |
|--------------------------------------------------|---------------------------------------------------------------------------------------------|
| [`collapseWhitespace`](/api/collapse-whitespace) | Normalizes consecutive whitespace into single spaces and trims edges.                       |
| [`format`](/api/format)                          | Formats a template string with positional or nested property placeholders.                  |
| [`createFormatter`](/api/format#createformatter) | Precompiles a reusable formatter function for high performance.                             |
| [`slugify`](/api/slugify)                        | Converts a string into a URL-friendly slug.                                                 |

## Pattern Masking

Apply pattern masks to format phone numbers, dates, credit cards, and postal codes.

| Function                             | Description                                                    |
|--------------------------------------|----------------------------------------------------------------|
| [`mask`](/api/mask)                  | Formats a string against custom pattern templates.             |
| [`createMask`](/api/mask#createmask) | Precompiles a reusable mask function for high performance.     |

## Validation & Fallback

Type guards and safe fallback utilities for strings.

| Function                                  | Description                                                               |
|-------------------------------------------|---------------------------------------------------------------------------|
| [`hasLength`](/api/has-length)            | Type guard checking whether a value is a non-empty string (`length > 0`). |
| [`hasText`](/api/has-text)                | Type guard checking whether a string has non-whitespace characters.       |
| [`defaultIfBlank`](/api/default-if-blank) | Returns a fallback value when input is blank (empty or whitespace-only).  |
| [`defaultIfEmpty`](/api/default-if-empty) | Returns a fallback value when input is empty (`length === 0`).            |

## Privacy & Redaction

Censor and mask sensitive information for security and privacy.

| Function                | Description                                                                                      |
|-------------------------|--------------------------------------------------------------------------------------------------|
| [`redact`](/api/redact) | Censors sensitive string content with custom visible boundaries and replacement characters.      |
