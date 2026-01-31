"use client";

import { useState, useEffect } from 'react';

type PatternPart = {
  pattern: string;
  explanation: string;
  example?: string;
};

const patternExplanations: Record<string, PatternPart> = {
  '\\d': { pattern: '\\d', explanation: 'Matches any digit (0-9)', example: '"abc123" → matches 1, 2, 3' },
  '\\w': { pattern: '\\w', explanation: 'Matches any word character (letter, digit, underscore)', example: '"*ab12_" → matches a, b, 1, 2, _' },
  '\\s': { pattern: '\\s', explanation: 'Matches any whitespace character', example: '"a b\tc" → matches the space and tab' },
  '\\b': { pattern: '\\b', explanation: 'Matches a word boundary', example: '"hello world" → \\bworld matches at start of "world"' },
  '\\B': { pattern: '\\B', explanation: 'Matches a non-word boundary', example: '"hello" → \\Bllo matches "llo" inside the word' },
  '\\n': { pattern: '\\n', explanation: 'Matches a newline character', example: 'Matches line breaks' },
  '\\t': { pattern: '\\t', explanation: 'Matches a tab character', example: 'Matches horizontal tabs' },
  '.': { pattern: '.', explanation: 'Matches any character except newline', example: '"abc" → matches a, b, c' },

  '*': { pattern: '*', explanation: 'Matches 0 or more of the preceding character', example: '"a*" matches "" or "a" or "aaa"' },
  '+': { pattern: '+', explanation: 'Matches 1 or more of the preceding character', example: '"a+" matches "a" or "aaa" but not ""' },
  '?': { pattern: '?', explanation: 'Makes the preceding character optional', example: '"colou?r" matches "color" or "colour"' },
  '{': { pattern: '{n}', explanation: 'Matches exactly n occurrences of the preceding character', example: 'a{3} matches "aaa" but not "aa" or "aaaa"' },
  '}': { pattern: '}', explanation: 'Ends the count specification', example: '' },

  '{,}': { pattern: '{n,m}', explanation: 'Matches between n and m occurrences', example: 'a{2,4} matches "aa", "aaa", or "aaaa"' },
  '{,': { pattern: '{n,}', explanation: 'Matches n or more occurrences', example: 'a{2,} matches "aa", "aaa", "aaaa", etc.' },
  ',}': { pattern: '{,m}', explanation: 'Matches up to m occurrences', example: 'a{,3} matches "", "a", "aa", or "aaa"' },

  '^': { pattern: '^', explanation: 'Matches the start of a line', example: '^abc matches "abc" only at the start' },
  '$': { pattern: '$', explanation: 'Matches the end of a line', example: 'abc$ matches "abc" only at the end' },

  '[': { pattern: '[...]', explanation: 'Starts a character class - matches any single character within', example: '[aeiou] matches any vowel' },
  ']': { pattern: ']', explanation: 'Ends a character class', example: '' },

  '(': { pattern: '(...)', explanation: 'Starts a capturing group', example: '(ab)+ matches "ab" or "ababab"' },
  ')': { pattern: ')', explanation: 'Ends a capturing group', example: '' },

  '\\': { pattern: '\\', explanation: 'Escapes a special character', example: '\\. matches a literal dot' },
  '|': { pattern: '|', explanation: 'Matches either the pattern before or after', example: 'cat|dog matches "cat" or "dog"' }
};

interface PatternExplainerProps {
  pattern: string;
}

export function PatternExplainer({ pattern }: PatternExplainerProps) {
  const [explanations, setExplanations] = useState<PatternPart[]>([]);

  useEffect(() => {
    const parsePattern = (input: string) => {
      const parts: PatternPart[] = [];
      let i = 0;

      while (i < input.length) {
        // Handle escaped characters
        if (input[i] === '\\' && i + 1 < input.length) {
          const escaped = input.slice(i, i + 2);
          if (patternExplanations[escaped]) {
            parts.push(patternExplanations[escaped]);
            i += 2;
            continue;
          }
        }

        // Handle lookahead/lookbehind
        if (input[i] === '(' && input[i + 1] === '?') {
          let j = i + 2;
          let lookaheadType = '';

          if (input[j] === '=') {
            lookaheadType = 'Positive lookahead';
          } else if (input[j] === '!') {
            lookaheadType = 'Negative lookahead';
          } else if (input[j] === '<' && input[j + 1] === '=') {
            lookaheadType = 'Positive lookbehind';
            j++;
          } else if (input[j] === '<' && input[j + 1] === '!') {
            lookaheadType = 'Negative lookbehind';
            j++;
          } else if (input[j] === ':') {
            lookaheadType = 'Non-capturing group';
          }

          if (lookaheadType) {
            let depth = 1;
            let k = j + 1;
            while (k < input.length && depth > 0) {
              if (input[k] === '(') depth++;
              if (input[k] === ')') depth--;
              k++;
            }
            const fullPattern = input.slice(i, k);
            parts.push({
              pattern: fullPattern,
              explanation: `${lookaheadType}: asserts what follows/precedes without consuming`,
              example: lookaheadType === 'Non-capturing group'
                ? 'Groups without capturing for backreference'
                : `Asserts the condition without including in match`
            });
            i = k;
            continue;
          }
        }

        // Handle character classes
        if (input[i] === '[') {
          let j = i + 1;
          while (j < input.length && input[j] !== ']') j++;
          const classPattern = input.slice(i, j + 1);
          parts.push({
            pattern: classPattern,
            explanation: `Matches any character from: ${classPattern.slice(1, -1)}`,
            example: `"${classPattern}" matches any of these characters`
          });
          i = j + 1;
          continue;
        }

        // Handle count patterns
        if (input[i] === '{') {
          let j = i + 1;
          while (j < input.length && input[j] !== '}') j++;
          const countPattern = input.slice(i, j + 1);
          const [min, max] = countPattern.slice(1, -1).split(',').map(n => n.trim());

          let explanation = '';
          let example = '';

          if (!max && min) {
            explanation = `Matches exactly ${min} occurrences of the preceding character`;
            example = `a${countPattern} matches "${'a'.repeat(Number(min))}"`;
          } else if (min && max) {
            explanation = `Matches between ${min} and ${max} occurrences of the preceding character`;
            example = `a${countPattern} matches "${'a'.repeat(Number(min))}" to "${'a'.repeat(Number(max))}"`;
          } else if (!min && max) {
            explanation = `Matches up to ${max} occurrences of the preceding character`;
            example = `a${countPattern} matches anything from "" to "${'a'.repeat(Number(max))}"`;
          }

          parts.push({
            pattern: countPattern,
            explanation,
            example
          });
          i = j + 1;
          continue;
        }

        // Handle single characters
        if (patternExplanations[input[i]]) {
          parts.push(patternExplanations[input[i]]);
        } else {
          parts.push({
            pattern: input[i],
            explanation: `Matches the literal character "${input[i]}"`,
          });
        }
        i++;
      }

      return parts;
    };

    setExplanations(parsePattern(pattern));
  }, [pattern]);

  if (!pattern) return null;

  return (
    <div className="mt-4 p-4 bg-muted rounded-md">
      <h3 className="font-semibold mb-2">Pattern Breakdown:</h3>
      <div className="space-y-2">
        {explanations.map((part, index) => (
          <div key={index} className="text-sm">
            <div className="flex items-start gap-2">
              <code className="px-1 bg-background rounded">{part.pattern}</code>
              <span>{part.explanation}</span>
            </div>
            {part.example && (
              <div className="ml-6 text-xs text-muted-foreground mt-1">
                Example: {part.example}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
