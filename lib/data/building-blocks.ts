/**
 * Building blocks for regex construction
 */

export interface BuildingBlock {
  id: string;
  name: string;
  pattern: string;
  info: string;
  category: 'character' | 'quantifier' | 'anchor' | 'group';
}

export const buildingBlocks: BuildingBlock[] = [
  // Character classes
  {
    id: 'digit',
    name: 'Any digit',
    pattern: '\\d',
    info: 'Matches any single digit (0-9)',
    category: 'character'
  },
  {
    id: 'non-digit',
    name: 'Non-digit',
    pattern: '\\D',
    info: 'Matches any character that is not a digit',
    category: 'character'
  },
  {
    id: 'letter',
    name: 'Any letter',
    pattern: '[a-zA-Z]',
    info: 'Matches any single letter, case-sensitive',
    category: 'character'
  },
  {
    id: 'word-char',
    name: 'Word character',
    pattern: '\\w',
    info: 'Matches any word character (letter, digit, underscore)',
    category: 'character'
  },
  {
    id: 'non-word-char',
    name: 'Non-word character',
    pattern: '\\W',
    info: 'Matches any non-word character',
    category: 'character'
  },
  {
    id: 'whitespace',
    name: 'Any whitespace',
    pattern: '\\s',
    info: 'Matches any whitespace character (spaces, tabs, line breaks)',
    category: 'character'
  },
  {
    id: 'non-whitespace',
    name: 'Non-whitespace',
    pattern: '\\S',
    info: 'Matches any non-whitespace character',
    category: 'character'
  },
  {
    id: 'any-char',
    name: 'Any character',
    pattern: '.',
    info: 'Matches any character except newline',
    category: 'character'
  },

  // Quantifiers
  {
    id: 'optional',
    name: 'Optional',
    pattern: '?',
    info: 'Makes the preceding character or group optional (0 or 1)',
    category: 'quantifier'
  },
  {
    id: 'one-or-more',
    name: 'One or more',
    pattern: '+',
    info: 'Matches one or more occurrences of the preceding character or group',
    category: 'quantifier'
  },
  {
    id: 'zero-or-more',
    name: 'Zero or more',
    pattern: '*',
    info: 'Matches zero or more occurrences of the preceding character or group',
    category: 'quantifier'
  },

  // Anchors
  {
    id: 'start',
    name: 'Start of line',
    pattern: '^',
    info: 'Matches the start of a line or string',
    category: 'anchor'
  },
  {
    id: 'end',
    name: 'End of line',
    pattern: '$',
    info: 'Matches the end of a line or string',
    category: 'anchor'
  },
  {
    id: 'word-boundary',
    name: 'Word boundary',
    pattern: '\\b',
    info: 'Matches a word boundary (between word and non-word characters)',
    category: 'anchor'
  },

  // Groups
  {
    id: 'group',
    name: 'Capturing group',
    pattern: '()',
    info: 'Creates a capturing group - put cursor inside to add pattern',
    category: 'group'
  },
  {
    id: 'non-capturing-group',
    name: 'Non-capturing group',
    pattern: '(?:)',
    info: 'Groups without capturing - useful for alternation',
    category: 'group'
  },
  {
    id: 'alternation',
    name: 'Or (alternation)',
    pattern: '|',
    info: 'Matches either the pattern before or after',
    category: 'group'
  },
  {
    id: 'char-class',
    name: 'Character class',
    pattern: '[]',
    info: 'Matches any single character within the brackets',
    category: 'group'
  },
  {
    id: 'negated-class',
    name: 'Negated class',
    pattern: '[^]',
    info: 'Matches any character NOT in the brackets',
    category: 'group'
  },
];

export const complexPatterns = [
  {
    id: 'number-range',
    name: 'Custom Number Range',
    generatePattern: (input: string) => {
      const numbers = input.split(',').map(n => n.trim());
      return `[${numbers[0]}-${numbers[1]}]`;
    },
    placeholder: 'Enter range (e.g., 1,9)',
    info: 'Creates a pattern matching any single digit in the specified range'
  },
  {
    id: 'repeated-pattern',
    name: 'Repeated Pattern',
    generatePattern: (input: string) => `(${input})+`,
    placeholder: 'Enter pattern to repeat',
    info: 'Matches one or more occurrences of the specified pattern'
  },
  {
    id: 'optional-pattern',
    name: 'Optional Pattern',
    generatePattern: (input: string) => `(${input})?`,
    placeholder: 'Enter optional pattern',
    info: 'Makes the specified pattern optional'
  },
  {
    id: 'exact-count',
    name: 'Exact Count',
    generatePattern: (input: string) => `{${input}}`,
    placeholder: 'Enter count (e.g., 3)',
    info: 'Matches exactly n occurrences of the preceding character'
  },
  {
    id: 'count-range',
    name: 'Count Range',
    generatePattern: (input: string) => `{${input}}`,
    placeholder: 'Enter range (e.g., 2,4)',
    info: 'Matches between n and m occurrences of the preceding character'
  },
];
