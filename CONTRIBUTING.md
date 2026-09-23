# Contributing

Thank you for considering contributing to `@rcpthongta/string-utils`!
This document outlines the development workflow, coding standards, and guidelines for submitting contributions.

## Prerequisites

- [Node.js](https://nodejs.org/) >= 22
- [npm](https://www.npmjs.com/)

## Getting Started

1. [Fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo) the repository and clone your fork.
2. Create a new branch from `develop`.
3. Install dependencies:

```bash
npm install
```

## Project Structure

```text
src/
├── constants/          # Shared string constants and regex patterns
├── types/              # Shared TypeScript type definitions
├── libs/
│   └── <feature>/
│       ├── <feature>.lib.ts         # Implementation
│       ├── <feature>.lib.spec.ts    # Unit tests
│       ├── <feature>.lib.bench.ts   # Benchmarks
│       └── index.ts                 # Public export
└── index.ts            # Package entry point
```

## Development Workflow

### Branching

All work should be done in a feature branch created from `develop` in your fork.
Please use the following branch naming conventions:

- `feat/<feature-name>`
- `fix/<issue-name>`
- `chore/<task-name>`
- `docs/<topic>`
- `perf/<feature-name>`

> **Note:** Do not push branches directly to the upstream repository.

### Commit Messages

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification, enforced by commitlint.
All commit messages must use the following format:

```text
<type>(<scope>): <description>
```

**Allowed types:**

`feat` `fix` `docs` `style` `refactor` `perf` `test` `build` `ci` `chore` `revert` `merge`

**Examples:**

```text
feat(capitalize): add locale-aware capitalization option
test(slugify): add edge case tests for unicode input
fix(mask): handle empty string input
```

### Available Scripts

| Command                 | Description                                           |
| ----------------------- | ----------------------------------------------------- |
| `npm run build`         | Clean and build ESM, CJS, IIFE, and type declarations |
| `npm run test`          | Run all unit tests                                    |
| `npm run test:watch`    | Run tests in watch mode                               |
| `npm run test:coverage` | Run tests with coverage report                        |
| `npm run bench`         | Run benchmarks                                        |
| `npm run lint`          | Check for lint errors                                 |
| `npm run lint:fix`      | Auto-fix lint errors                                  |

### Git Hooks

Git hooks are managed by [Husky](https://typicode.github.io/husky/) and run automatically:

- **pre-commit** — runs lint-staged to auto-fix staged files via ESLint
- **commit-msg** — validates the commit message format via commitlint
- **pre-push** — runs the full test suite and build to prevent broken pushes

## Development Standards

All contributions must follow the project's coding, linting, testing, and benchmarking standards.

Before submitting a pull request, please review the following guidelines:

- **Core Principles & Coding Standards** — Performance, memory usage, TypeScript typing, architecture, null safety, function design, and JSDoc requirements.
- **Linting & Code Quality Standards** — Naming conventions, explicit type definitions, unused code, regular expressions, and complexity limits.
- **Testing & Benchmarking Standards** — Vitest test organization, coverage requirements, test case design, and benchmark structure.

These standards apply to both new utilities and changes to existing utilities.

## Adding a New Utility

1. Create a new directory under `src/libs/<feature-name>/`.
2. Add the following files:

```text
<feature-name>.lib.ts         # Implementation
<feature-name>.lib.spec.ts    # Unit tests
<feature-name>.lib.bench.ts   # Benchmarks
index.ts                      # Re-export the public API
```

3. Register the new utility by exporting it from:

```text
src/libs/index.ts
src/index.ts
```

4. Verify that all tests pass and coverage remains at **100%**.

## Testing

All contributions must include unit tests.
This project enforces **100%** code coverage thresholds across:

- Statements
- Branches
- Functions
- Lines

To verify coverage locally:

```bash
npm run test:coverage
```

## Submitting a Pull Request

Before opening a pull request, please ensure the following:

1. Your branch is up to date with the upstream `develop` branch.
2. All linting, tests, and builds pass locally:

```bash
npm run lint
npm run test
npm run build
```

3. Push your branch to your fork:

```bash
git push origin <branch-name>
```

4. Open a pull request from your fork targeting the upstream `develop` branch.
5. Write a clear and concise description of the changes and their motivation.
6. Keep each pull request focused on a single concern.
7. Respond to review feedback promptly.

All CI checks must pass before a pull request can be merged.

## License

By contributing to this project, you agree that your contributions will be licensed under the [MIT License](LICENSE.md).
