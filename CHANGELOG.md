# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/)
and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.0.1] - 2026-09-24

### Added

- **Documentation Website**
  - Interactive documentation site powered by VitePress deployed to GitHub Pages.
  - Dedicated Getting Started and Installation guides with CDN/IIFE, ESM, and CommonJS examples.
  - Comprehensive API Reference pages for all 16 utility modules and exported types.
  - Complete parameter tables, options breakdowns, return types, and empty/null/undefined edge-case examples.
  - Built-in local search and responsive layout with custom brand theme.

- **CI / CD**
  - Automated GitHub Pages deployment job in `.github/workflows/release.yml` that runs upon successful npm publishing.

- **Package Metadata**
  - Added `homepage` URL to `package.json` pointing to the official documentation site.
  - Updated `README.md` with links to the live documentation website.

## [1.0.0] - 2026-09-23

### Added

- **String Inspection**
  - `hasText` — check if a string contains non-whitespace characters
  - `hasLength` — check if a string contains one or more characters
  - `defaultIfBlank` — return a fallback when a string is blank
  - `defaultIfEmpty` — return a fallback when a string is empty

- **Case Conversion**
  - `capitalize` — uppercase the first character
  - `uncapitalize` — lowercase the first character
  - `camelCase` — convert a string to camelCase
  - `pascalCase` — convert a string to PascalCase
  - `kebabCase` — convert a string to kebab-case
  - `snakeCase` — convert a string to snake_case
  - `constantCase` — convert a string to CONSTANT_CASE

- **String Transformation**
  - `collapseWhitespace` — normalize consecutive whitespace to single spaces
  - `slugify` — convert a string to a URL-friendly slug
  - `format` — format strings using templates and placeholders
  - `mask` — mask portions of a string using a pattern
  - `redact` — redact sensitive string content

- **Constants & Patterns**
  - Reusable string constants such as `EMPTY`, `SPACE`, `HYPHEN`, `UNDERSCORE`, `DOT`, `ASTERISK`, and `HASH`
  - Unicode-aware regular expression patterns for words, digits, letters, and diacritics

- **Package Distribution**
  - ESM, CJS, and IIFE builds powered by tsup
  - TypeScript type declarations
  - Dual `import` / `require` package exports

- **Development & CI**
  - Vitest for unit tests, benchmarks, and coverage
  - ESLint and Prettier for code quality and formatting
  - Husky, lint-staged, and commitlint for Git hooks and commit validation
  - GitHub Actions workflows for linting and test coverage

[1.0.1]: https://github.com/rcpthongta/string-utils/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/rcpthongta/string-utils/releases/tag/v1.0.0
