/** Regular expression to match the camel case pattern. */
export const CAMEL_CASE_PATTERN: RegExp = /([a-z])([A-Z])/g;

/** Regular expression to match combining diacritical marks. */
export const DIACRITICS_PATTERN: RegExp = /[\u0300-\u036f]/g;

/** Regular expression to match the very first character of a string. */
export const FIRST_CHAR_PATTERN: RegExp = /^(.)/;

/** Regular expression to match non-alphanumeric characters. */
export const NON_ALPHANUMERIC_PATTERN: RegExp = /[^a-z0-9]+/g;

/** Regular expression to find non-alphanumeric separators (hyphens, underscores, spaces) and capture the next character. */
export const SEPARATOR_PATTERN: RegExp = /[-_\s]+(.)?/g;

/** Regular expression to match leading and trailing hyphens. */
export const TRIM_HYPHENS_PATTERN: RegExp = /^-+|-+$/g;
