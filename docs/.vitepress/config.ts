import { defineConfig } from "vitepress";

export default defineConfig({
  base: "/string-utils/",
  title: "@rcpthongta/string-utils",
  description:
    "A lightweight, type-safe, dependency-free string utility library for TypeScript and modern JavaScript applications.",
  themeConfig: {
    nav: [
      {
        text: "Guide",
        link: "/guide/getting-started"
      },
      {
        text: "API Reference",
        link: "/api/"
      },
      {
        text: "Changelog",
        link: "https://github.com/rcpthongta/string-utils/blob/main/CHANGELOG.md"
      }
    ],
    sidebar: [
      {
        text: "Guide",
        items: [
          {
            text: "Getting Started",
            link: "/guide/getting-started"
          },
          {
            text: "Installation",
            link: "/guide/installation"
          }
        ]
      },
      {
        text: "API Reference",
        items: [
          {
            text: "Overview",
            link: "/api/"
          }
        ]
      },
      {
        text: "Case Conversion",
        collapsed: false,
        items: [
          {
            text: "camelCase",
            link: "/api/camel-case"
          },
          {
            text: "constantCase",
            link: "/api/constant-case"
          },
          {
            text: "kebabCase",
            link: "/api/kebab-case"
          },
          {
            text: "pascalCase",
            link: "/api/pascal-case"
          },
          {
            text: "snakeCase",
            link: "/api/snake-case"
          }
        ]
      },
      {
        text: "Casing & Capitalization",
        collapsed: false,
        items: [
          {
            text: "capitalize",
            link: "/api/capitalize"
          },
          {
            text: "uncapitalize",
            link: "/api/uncapitalize"
          }
        ]
      },
      {
        text: "Formatting & Templating",
        collapsed: false,
        items: [
          {
            text: "collapseWhitespace",
            link: "/api/collapse-whitespace"
          },
          {
            text: "format / createFormatter",
            link: "/api/format"
          },
          {
            text: "slugify",
            link: "/api/slugify"
          }
        ]
      },
      {
        text: "Pattern Masking",
        collapsed: false,
        items: [
          {
            text: "mask / createMask",
            link: "/api/mask"
          }
        ]
      },
      {
        text: "Validation & Fallback",
        collapsed: false,
        items: [
          {
            text: "hasLength",
            link: "/api/has-length"
          },
          {
            text: "hasText",
            link: "/api/has-text"
          },
          {
            text: "defaultIfBlank",
            link: "/api/default-if-blank"
          },
          {
            text: "defaultIfEmpty",
            link: "/api/default-if-empty"
          }
        ]
      },
      {
        text: "Privacy & Redaction",
        collapsed: false,
        items: [
          {
            text: "redact",
            link: "/api/redact"
          }
        ]
      }
    ],
    search: {
      provider: "local"
    },
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/rcpthongta/string-utils"
      },
      {
        icon: "npm",
        link: "https://www.npmjs.com/package/@rcpthongta/string-utils"
      }
    ],
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2026 rcpthongta"
    }
  }
});
