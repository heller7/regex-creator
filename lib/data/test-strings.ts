/**
 * Pre-populated test strings for common pattern categories
 */

export interface TestStringGroup {
  categoryId: string;
  categoryName: string;
  strings: TestString[];
}

export interface TestString {
  id: string;
  label: string;
  value: string;
  matchingPatterns?: string[];
}

export const testStringGroups: TestStringGroup[] = [
  {
    categoryId: "emails",
    categoryName: "Email Addresses",
    strings: [
      {
        id: "valid-emails",
        label: "Valid emails",
        value: "john@example.com\njane.doe@company.org\nuser+tag@gmail.com\ninfo@sub.domain.co.uk",
        matchingPatterns: ["email"]
      },
      {
        id: "invalid-emails",
        label: "Invalid emails",
        value: "notanemail\n@nodomain.com\nmissing@.com\nspaces in@email.com",
        matchingPatterns: ["email"]
      }
    ]
  },
  {
    categoryId: "urls",
    categoryName: "URLs",
    strings: [
      {
        id: "valid-urls",
        label: "Valid URLs",
        value: "https://www.example.com\nhttp://api.example.org/path?query=1\nhttps://sub.domain.co.uk/page#section",
        matchingPatterns: ["url"]
      }
    ]
  },
  {
    categoryId: "phones",
    categoryName: "Phone Numbers",
    strings: [
      {
        id: "us-phones",
        label: "US phone numbers",
        value: "+1 (234) 567-8900\n234-567-8900\n(234) 567-8900\n234.567.8900",
        matchingPatterns: ["phone"]
      },
      {
        id: "international-phones",
        label: "International phones",
        value: "+44 20 7946 0958\n+49 30 12345678\n+81 3 1234 5678",
        matchingPatterns: ["phone-international"]
      }
    ]
  },
  {
    categoryId: "dates",
    categoryName: "Dates",
    strings: [
      {
        id: "iso-dates",
        label: "ISO dates",
        value: "2024-01-15\n2023-12-31\n2025-06-30",
        matchingPatterns: ["date-iso"]
      },
      {
        id: "us-dates",
        label: "US dates (MM/DD/YYYY)",
        value: "01/15/2024\n12/31/2023\n06/30/2025",
        matchingPatterns: ["date-us"]
      },
      {
        id: "eu-dates",
        label: "EU dates (DD.MM.YYYY)",
        value: "15.01.2024\n31.12.2023\n30.06.2025",
        matchingPatterns: ["date-eu"]
      }
    ]
  },
  {
    categoryId: "times",
    categoryName: "Times",
    strings: [
      {
        id: "24h-times",
        label: "24-hour times",
        value: "00:00\n12:30\n23:59\n08:15",
        matchingPatterns: ["time-24h"]
      },
      {
        id: "12h-times",
        label: "12-hour times",
        value: "12:30 PM\n8:15 AM\n11:59 pm\n1:00 AM",
        matchingPatterns: ["time-12h"]
      }
    ]
  },
  {
    categoryId: "numbers",
    categoryName: "Numbers",
    strings: [
      {
        id: "integers",
        label: "Integers",
        value: "42\n-17\n0\n1000000\n-999",
        matchingPatterns: ["integer"]
      },
      {
        id: "decimals",
        label: "Decimal numbers",
        value: "3.14159\n-0.5\n100.00\n0.001",
        matchingPatterns: ["decimal"]
      },
      {
        id: "currencies",
        label: "Currency values",
        value: "$1,234.56\n$99.99\n$1,000,000.00\n1.234,56 €",
        matchingPatterns: ["currency", "currency-eu"]
      }
    ]
  },
  {
    categoryId: "network",
    categoryName: "Network",
    strings: [
      {
        id: "ipv4",
        label: "IPv4 addresses",
        value: "192.168.1.1\n10.0.0.255\n172.16.0.1\n255.255.255.0",
        matchingPatterns: ["ipv4"]
      },
      {
        id: "mac-addresses",
        label: "MAC addresses",
        value: "00:1A:2B:3C:4D:5E\n00-1A-2B-3C-4D-5E\nAA:BB:CC:DD:EE:FF",
        matchingPatterns: ["mac-address"]
      },
      {
        id: "domains",
        label: "Domain names",
        value: "example.com\nwww.example.org\nsub.domain.co.uk\napi.v2.example.io",
        matchingPatterns: ["domain"]
      }
    ]
  },
  {
    categoryId: "identifiers",
    categoryName: "Identifiers",
    strings: [
      {
        id: "uuids",
        label: "UUIDs",
        value: "123e4567-e89b-12d3-a456-426614174000\na1b2c3d4-e5f6-7890-abcd-ef1234567890",
        matchingPatterns: ["uuid"]
      },
      {
        id: "usernames",
        label: "Usernames",
        value: "john_doe\nuser123\nmy-username\n_private_user",
        matchingPatterns: ["username"]
      },
      {
        id: "slugs",
        label: "URL slugs",
        value: "my-blog-post\nhello-world\nproduct-123\nsome-page-title",
        matchingPatterns: ["slug"]
      }
    ]
  },
  {
    categoryId: "colors",
    categoryName: "Colors",
    strings: [
      {
        id: "hex-colors",
        label: "Hex colors",
        value: "#FF0000\n#00FF00\n#0000FF\n#FFF\n#ABC123",
        matchingPatterns: ["hex-color"]
      },
      {
        id: "rgb-colors",
        label: "RGB colors",
        value: "rgb(255, 0, 0)\nrgb(0, 128, 255)\nrgb(100, 100, 100)",
        matchingPatterns: ["rgb-color"]
      }
    ]
  },
  {
    categoryId: "code",
    categoryName: "Code Snippets",
    strings: [
      {
        id: "js-imports",
        label: "JavaScript imports",
        value: "import React from 'react'\nimport { useState, useEffect } from 'react'\nimport * as utils from './utils'",
        matchingPatterns: ["js-import"]
      },
      {
        id: "html-tags",
        label: "HTML tags",
        value: '<div class="container">Hello</div>\n<span id="text">World</span>\n<input type="text" />',
        matchingPatterns: ["html-tag"]
      },
      {
        id: "markdown-links",
        label: "Markdown links",
        value: "[Click here](https://example.com)\n[Documentation](./docs/readme.md)\n![Logo](images/logo.png)",
        matchingPatterns: ["markdown-link", "markdown-image"]
      }
    ]
  },
  {
    categoryId: "social",
    categoryName: "Social Media",
    strings: [
      {
        id: "hashtags",
        label: "Hashtags",
        value: "Check out #JavaScript and #WebDev! #100DaysOfCode is trending. #React",
        matchingPatterns: ["hashtag"]
      },
      {
        id: "mentions",
        label: "Mentions",
        value: "Thanks @john_doe and @jane! cc @team_lead",
        matchingPatterns: ["mention"]
      }
    ]
  },
  {
    categoryId: "mixed",
    categoryName: "Mixed Content",
    strings: [
      {
        id: "sample-text",
        label: "Sample paragraph",
        value: "Hello World! Contact us at support@example.com or call +1 (555) 123-4567. Visit https://example.com for more info. Price: $99.99",
        matchingPatterns: []
      },
      {
        id: "log-entry",
        label: "Log entry",
        value: "[2024-01-15T10:30:00Z] INFO: User john_doe (192.168.1.100) logged in from session abc123-def456",
        matchingPatterns: []
      }
    ]
  }
];

/**
 * Get all test strings as a flat array
 */
export function getAllTestStrings(): TestString[] {
  return testStringGroups.flatMap(group => group.strings);
}

/**
 * Get test strings that match a specific pattern ID
 */
export function getTestStringsForPattern(patternId: string): TestString[] {
  return getAllTestStrings().filter(
    ts => ts.matchingPatterns?.includes(patternId)
  );
}

/**
 * Get test string groups for a pattern category
 */
export function getTestStringGroupsByCategory(categoryId: string): TestStringGroup | undefined {
  return testStringGroups.find(group => group.categoryId === categoryId);
}
