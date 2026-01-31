/**
 * Common regex patterns library with expanded categories
 */

import type { PatternGroup, PatternCategory } from '@/types/regex';

export const commonPatternCategories: PatternGroup[] = [
  {
    name: "Validation",
    category: "validation",
    patterns: [
      {
        id: "email",
        pattern: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
        description: "Matches valid email addresses",
        example: "test@example.com",
        category: "validation",
        difficulty: "beginner",
        tags: ["email", "validation"]
      },
      {
        id: "url",
        pattern: "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)",
        description: "Matches URLs (http or https)",
        example: "https://www.example.com",
        category: "validation",
        difficulty: "intermediate",
        tags: ["url", "web", "validation"]
      },
      {
        id: "phone",
        pattern: "^[\\+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$",
        description: "Matches phone numbers in various formats",
        example: "+1 (234) 567-8900",
        category: "validation",
        difficulty: "intermediate",
        tags: ["phone", "validation"]
      },
      {
        id: "password",
        pattern: "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$",
        description: "Matches strong passwords (min 8 chars, uppercase, lowercase, number)",
        example: "TestPass123",
        category: "validation",
        difficulty: "advanced",
        tags: ["password", "security", "validation"]
      },
      {
        id: "zip-us",
        pattern: "^\\d{5}(-\\d{4})?$",
        description: "Matches US ZIP codes (5 digits or ZIP+4)",
        example: "12345 or 12345-6789",
        category: "validation",
        difficulty: "beginner",
        tags: ["zip", "postal", "us"]
      },
      {
        id: "ssn",
        pattern: "^\\d{3}-\\d{2}-\\d{4}$",
        description: "Matches US Social Security Numbers",
        example: "123-45-6789",
        category: "validation",
        difficulty: "beginner",
        tags: ["ssn", "us"]
      }
    ]
  },
  {
    name: "Dates & Times",
    category: "datetime",
    patterns: [
      {
        id: "date-iso",
        pattern: "^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$",
        description: "Matches dates in YYYY-MM-DD format",
        example: "2024-03-14",
        category: "datetime",
        difficulty: "intermediate",
        tags: ["date", "iso"]
      },
      {
        id: "date-us",
        pattern: "^(0[1-9]|1[0-2])\\/(0[1-9]|[12][0-9]|3[01])\\/\\d{4}$",
        description: "Matches dates in MM/DD/YYYY format",
        example: "03/14/2024",
        category: "datetime",
        difficulty: "intermediate",
        tags: ["date", "us"]
      },
      {
        id: "date-eu",
        pattern: "^(0[1-9]|[12][0-9]|3[01])\\.(0[1-9]|1[0-2])\\.\\d{4}$",
        description: "Matches dates in DD.MM.YYYY format",
        example: "14.03.2024",
        category: "datetime",
        difficulty: "intermediate",
        tags: ["date", "eu", "german"]
      },
      {
        id: "time-24h",
        pattern: "^([01]\\d|2[0-3]):([0-5]\\d)$",
        description: "Matches 24-hour time format",
        example: "23:59",
        category: "datetime",
        difficulty: "beginner",
        tags: ["time", "24h"]
      },
      {
        id: "time-12h",
        pattern: "^(0?[1-9]|1[0-2]):[0-5][0-9]\\s?(AM|PM|am|pm)$",
        description: "Matches 12-hour time format with AM/PM",
        example: "11:30 PM",
        category: "datetime",
        difficulty: "intermediate",
        tags: ["time", "12h", "am/pm"]
      },
      {
        id: "datetime-iso",
        pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})?$",
        description: "Matches ISO 8601 datetime format",
        example: "2024-03-14T15:30:00Z",
        category: "datetime",
        difficulty: "advanced",
        tags: ["datetime", "iso", "timezone"]
      }
    ]
  },
  {
    name: "Numbers",
    category: "numbers",
    patterns: [
      {
        id: "integer",
        pattern: "^-?\\d+$",
        description: "Matches whole numbers (positive or negative)",
        example: "-123, 456",
        category: "numbers",
        difficulty: "beginner",
        tags: ["number", "integer"]
      },
      {
        id: "decimal",
        pattern: "^-?\\d*\\.?\\d+$",
        description: "Matches decimal numbers",
        example: "-123.45, 0.789",
        category: "numbers",
        difficulty: "beginner",
        tags: ["number", "decimal", "float"]
      },
      {
        id: "currency",
        pattern: "^\\$\\d{1,3}(,\\d{3})*(\\.\\d{2})?$",
        description: "Matches US currency format",
        example: "$1,234.56",
        category: "numbers",
        difficulty: "intermediate",
        tags: ["currency", "money", "us"]
      },
      {
        id: "currency-eu",
        pattern: "^\\d{1,3}(\\.\\d{3})*(,\\d{2})?\\s?€$",
        description: "Matches European currency format",
        example: "1.234,56 €",
        category: "numbers",
        difficulty: "intermediate",
        tags: ["currency", "money", "eu"]
      },
      {
        id: "percentage",
        pattern: "^-?\\d+(\\.\\d+)?%$",
        description: "Matches percentage values",
        example: "75%, -12.5%",
        category: "numbers",
        difficulty: "beginner",
        tags: ["percentage", "number"]
      },
      {
        id: "scientific",
        pattern: "^-?\\d+(\\.\\d+)?[eE][+-]?\\d+$",
        description: "Matches scientific notation",
        example: "1.23e-4, 5E10",
        category: "numbers",
        difficulty: "intermediate",
        tags: ["scientific", "number", "exponent"]
      }
    ]
  },
  {
    name: "Text Formats",
    category: "text",
    patterns: [
      {
        id: "username",
        pattern: "^[a-zA-Z0-9_-]{3,16}$",
        description: "Matches common username format (3-16 characters)",
        example: "user_123",
        category: "text",
        difficulty: "beginner",
        tags: ["username", "user"]
      },
      {
        id: "slug",
        pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
        description: "Matches URL-friendly slugs",
        example: "my-page-title",
        category: "text",
        difficulty: "beginner",
        tags: ["slug", "url"]
      },
      {
        id: "hex-color",
        pattern: "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
        description: "Matches hex color codes",
        example: "#FF0000, #F00",
        category: "text",
        difficulty: "beginner",
        tags: ["color", "hex", "css"]
      },
      {
        id: "rgb-color",
        pattern: "^rgb\\(\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*\\)$",
        description: "Matches RGB color format",
        example: "rgb(255, 128, 0)",
        category: "text",
        difficulty: "intermediate",
        tags: ["color", "rgb", "css"]
      },
      {
        id: "uuid",
        pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$",
        description: "Matches UUID format",
        example: "123e4567-e89b-12d3-a456-426614174000",
        category: "text",
        difficulty: "intermediate",
        tags: ["uuid", "id"]
      },
      {
        id: "hashtag",
        pattern: "#[a-zA-Z][a-zA-Z0-9_]*",
        description: "Matches hashtags",
        example: "#JavaScript",
        category: "text",
        difficulty: "beginner",
        tags: ["hashtag", "social"]
      },
      {
        id: "mention",
        pattern: "@[a-zA-Z][a-zA-Z0-9_]*",
        description: "Matches @mentions",
        example: "@username",
        category: "text",
        difficulty: "beginner",
        tags: ["mention", "social"]
      }
    ]
  },
  {
    name: "Network",
    category: "network",
    patterns: [
      {
        id: "ipv4",
        pattern: "^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$",
        description: "Matches IPv4 addresses",
        example: "192.168.1.1",
        category: "network",
        difficulty: "intermediate",
        tags: ["ip", "ipv4", "network"]
      },
      {
        id: "ipv6",
        pattern: "^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$",
        description: "Matches full IPv6 addresses",
        example: "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
        category: "network",
        difficulty: "advanced",
        tags: ["ip", "ipv6", "network"]
      },
      {
        id: "mac-address",
        pattern: "^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$",
        description: "Matches MAC addresses",
        example: "00:1A:2B:3C:4D:5E",
        category: "network",
        difficulty: "intermediate",
        tags: ["mac", "network"]
      },
      {
        id: "domain",
        pattern: "^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}$",
        description: "Matches domain names",
        example: "example.com, sub.domain.org",
        category: "network",
        difficulty: "intermediate",
        tags: ["domain", "web"]
      },
      {
        id: "port",
        pattern: "^(6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{0,3})$",
        description: "Matches valid port numbers (1-65535)",
        example: "80, 443, 8080",
        category: "network",
        difficulty: "intermediate",
        tags: ["port", "network"]
      }
    ]
  },
  {
    name: "Security",
    category: "security",
    patterns: [
      {
        id: "credit-card",
        pattern: "^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})$",
        description: "Matches common credit card numbers (Visa, MC, Amex, Discover)",
        example: "4111111111111111",
        category: "security",
        difficulty: "advanced",
        tags: ["credit-card", "payment"]
      },
      {
        id: "jwt",
        pattern: "^[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]*$",
        description: "Matches JWT token format",
        example: "eyJhbG.eyJzdW.SflKx",
        category: "security",
        difficulty: "intermediate",
        tags: ["jwt", "token", "auth"]
      },
      {
        id: "api-key",
        pattern: "^[A-Za-z0-9]{32,}$",
        description: "Matches common API key format",
        example: "abcd1234efgh5678ijkl9012mnop3456",
        category: "security",
        difficulty: "beginner",
        tags: ["api-key", "auth"]
      },
      {
        id: "base64",
        pattern: "^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$",
        description: "Matches Base64 encoded strings",
        example: "SGVsbG8gV29ybGQ=",
        category: "security",
        difficulty: "intermediate",
        tags: ["base64", "encoding"]
      }
    ]
  },
  {
    name: "Markup & Code",
    category: "markup",
    patterns: [
      {
        id: "html-tag",
        pattern: "<([a-z]+)([^<]+)*(?:>(.*)<\\/\\1>|\\s+\\/>)",
        description: "Matches HTML tags with content",
        example: "<div class=\"foo\">content</div>",
        category: "markup",
        difficulty: "advanced",
        tags: ["html", "tag"]
      },
      {
        id: "html-comment",
        pattern: "<!--[\\s\\S]*?-->",
        description: "Matches HTML comments",
        example: "<!-- This is a comment -->",
        category: "markup",
        difficulty: "beginner",
        tags: ["html", "comment"]
      },
      {
        id: "markdown-link",
        pattern: "\\[([^\\]]+)\\]\\(([^)]+)\\)",
        description: "Matches Markdown links",
        example: "[text](url)",
        category: "markup",
        difficulty: "beginner",
        tags: ["markdown", "link"]
      },
      {
        id: "markdown-image",
        pattern: "!\\[([^\\]]+)\\]\\(([^)]+)\\)",
        description: "Matches Markdown images",
        example: "![alt](image.png)",
        category: "markup",
        difficulty: "beginner",
        tags: ["markdown", "image"]
      },
      {
        id: "markdown-heading",
        pattern: "^#{1,6}\\s+.+$",
        description: "Matches Markdown headings",
        example: "## Heading",
        category: "markup",
        difficulty: "beginner",
        tags: ["markdown", "heading"]
      },
      {
        id: "variable-name",
        pattern: "^[a-zA-Z_][a-zA-Z0-9_]*$",
        description: "Matches valid variable names (most languages)",
        example: "myVariable, _private, count123",
        category: "markup",
        difficulty: "beginner",
        tags: ["variable", "code"]
      },
      {
        id: "function-call",
        pattern: "\\b([a-zA-Z_][a-zA-Z0-9_]*)\\s*\\(",
        description: "Matches function calls",
        example: "myFunction(",
        category: "markup",
        difficulty: "beginner",
        tags: ["function", "code"]
      },
      {
        id: "js-import",
        pattern: "^import\\s+(?:{[^}]+}|\\*\\s+as\\s+\\w+|\\w+)\\s+from\\s+['\"][^'\"]+['\"]",
        description: "Matches JavaScript import statements",
        example: "import { foo } from 'bar'",
        category: "markup",
        difficulty: "intermediate",
        tags: ["import", "javascript", "es6"]
      },
      {
        id: "css-class",
        pattern: "\\.[a-zA-Z_][a-zA-Z0-9_-]*",
        description: "Matches CSS class selectors",
        example: ".my-class, .button_primary",
        category: "markup",
        difficulty: "beginner",
        tags: ["css", "class", "selector"]
      },
      {
        id: "json-key",
        pattern: "\"([^\"]+)\"\\s*:",
        description: "Matches JSON object keys",
        example: "\"name\":",
        category: "markup",
        difficulty: "beginner",
        tags: ["json", "key"]
      }
    ]
  },
  {
    name: "International",
    category: "validation",
    patterns: [
      {
        id: "phone-international",
        pattern: "^\\+[1-9]\\d{1,14}$",
        description: "Matches international phone numbers (E.164 format)",
        example: "+14155552671",
        category: "validation",
        difficulty: "intermediate",
        tags: ["phone", "international"]
      },
      {
        id: "iban",
        pattern: "^[A-Z]{2}\\d{2}[A-Z0-9]{1,30}$",
        description: "Matches IBAN format (basic validation)",
        example: "DE89370400440532013000",
        category: "validation",
        difficulty: "intermediate",
        tags: ["iban", "banking", "eu"]
      },
      {
        id: "postal-code-de",
        pattern: "^\\d{5}$",
        description: "Matches German postal codes",
        example: "10115",
        category: "validation",
        difficulty: "beginner",
        tags: ["postal", "germany"]
      },
      {
        id: "postal-code-uk",
        pattern: "^[A-Z]{1,2}\\d[A-Z\\d]?\\s?\\d[A-Z]{2}$",
        description: "Matches UK postal codes",
        example: "SW1A 1AA",
        category: "validation",
        difficulty: "intermediate",
        tags: ["postal", "uk"]
      }
    ]
  }
];

/**
 * Get all patterns as a flat array
 */
export function getAllPatterns() {
  return commonPatternCategories.flatMap(category => category.patterns);
}

/**
 * Find a pattern by ID
 */
export function getPatternById(id: string) {
  return getAllPatterns().find(pattern => pattern.id === id);
}

/**
 * Get patterns by category
 */
export function getPatternsByCategory(category: PatternCategory) {
  return getAllPatterns().filter(pattern => pattern.category === category);
}

/**
 * Search patterns by tags or description
 */
export function searchPatterns(query: string) {
  const lowerQuery = query.toLowerCase();
  return getAllPatterns().filter(pattern =>
    pattern.description.toLowerCase().includes(lowerQuery) ||
    pattern.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    pattern.id.toLowerCase().includes(lowerQuery)
  );
}
