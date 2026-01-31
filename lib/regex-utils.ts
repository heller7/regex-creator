import type {
  FlagState,
  MatchResult,
  ValidationResult,
  TestResult,
  ReplacementResult,
  EnhancedMatchResult,
  CaptureGroup,
} from '@/types/regex';

/**
 * Validates a regex pattern string
 */
export function validatePattern(pattern: string): ValidationResult {
  if (!pattern) {
    return { valid: true };
  }

  try {
    new RegExp(pattern);
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Invalid pattern',
    };
  }
}

/**
 * Builds a flag string from FlagState
 */
export function buildFlagString(flags: FlagState): string {
  const flagMap: Record<keyof FlagState, string> = {
    global: 'g',
    caseInsensitive: 'i',
    multiline: 'm',
  };

  return Object.entries(flags)
    .filter(([, enabled]) => enabled)
    .map(([key]) => flagMap[key as keyof FlagState])
    .filter((flag): flag is string => flag !== undefined)
    .join('');
}

/**
 * Tests a pattern against input and returns match results
 */
export function testPattern(
  pattern: string,
  input: string,
  flags: FlagState
): TestResult {
  if (!pattern) {
    return { valid: true, matches: [] };
  }

  const validation = validatePattern(pattern);
  if (!validation.valid) {
    return { valid: false, error: validation.error, matches: [] };
  }

  const flagString = buildFlagString(flags);

  try {
    const regex = new RegExp(pattern, flagString);
    const matches: MatchResult[] = [];

    if (flagString.includes('g')) {
      let match: RegExpExecArray | null;
      while ((match = regex.exec(input)) !== null) {
        matches.push({
          text: match[0],
          start: match.index,
          end: match.index + match[0].length,
          groups: match.groups,
        });
        // Prevent infinite loops for zero-length matches
        if (match[0].length === 0) {
          regex.lastIndex++;
        }
      }
    } else {
      const match = regex.exec(input);
      if (match) {
        matches.push({
          text: match[0],
          start: match.index,
          end: match.index + match[0].length,
          groups: match.groups,
        });
      }
    }

    return { valid: true, matches };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Error testing pattern',
      matches: [],
    };
  }
}

/**
 * Escapes special regex characters in a string
 */
export function escapeForRegex(literal: string): string {
  return literal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Simple cache for compiled regex objects
 */
const regexCache = new Map<string, RegExp>();
const MAX_CACHE_SIZE = 100;

export function getCachedRegex(pattern: string, flags: string): RegExp | null {
  const key = `${pattern}::${flags}`;

  if (regexCache.has(key)) {
    return regexCache.get(key)!;
  }

  try {
    const regex = new RegExp(pattern, flags);

    // Evict oldest entries if cache is full
    if (regexCache.size >= MAX_CACHE_SIZE) {
      const firstKey = regexCache.keys().next().value;
      if (firstKey) {
        regexCache.delete(firstKey);
      }
    }

    regexCache.set(key, regex);
    return regex;
  } catch {
    return null;
  }
}

/**
 * Clears the regex cache
 */
export function clearRegexCache(): void {
  regexCache.clear();
}

/**
 * Apply replacement to input string using regex pattern
 * Supports standard replacement references: $1, $2, $&, $`, $', $$
 */
export function applyReplacement(
  pattern: string,
  input: string,
  replacement: string,
  flags: FlagState,
  replaceAll: boolean = true
): ReplacementResult {
  if (!pattern) {
    return { success: true, result: input, replacementCount: 0 };
  }

  const validation = validatePattern(pattern);
  if (!validation.valid) {
    return {
      success: false,
      result: input,
      replacementCount: 0,
      error: validation.error,
    };
  }

  try {
    // Build flag string, ensuring global flag if replaceAll is true
    let flagString = buildFlagString(flags);
    if (replaceAll && !flagString.includes('g')) {
      flagString += 'g';
    } else if (!replaceAll && flagString.includes('g')) {
      flagString = flagString.replace('g', '');
    }

    const regex = new RegExp(pattern, flagString);

    // Count matches before replacement
    const countRegex = new RegExp(pattern, flagString.includes('g') ? flagString : flagString + 'g');
    const matches = input.match(countRegex);
    const replacementCount = replaceAll
      ? (matches?.length || 0)
      : (matches && matches.length > 0 ? 1 : 0);

    const result = input.replace(regex, replacement);

    return {
      success: true,
      result,
      replacementCount,
    };
  } catch (error) {
    return {
      success: false,
      result: input,
      replacementCount: 0,
      error: error instanceof Error ? error.message : 'Error during replacement',
    };
  }
}

/**
 * Tests a pattern and returns enhanced match results with capture groups
 */
export function testPatternEnhanced(
  pattern: string,
  input: string,
  flags: FlagState
): { valid: boolean; error?: string; matches: EnhancedMatchResult[] } {
  if (!pattern) {
    return { valid: true, matches: [] };
  }

  const validation = validatePattern(pattern);
  if (!validation.valid) {
    return { valid: false, error: validation.error, matches: [] };
  }

  const flagString = buildFlagString(flags);

  try {
    const regex = new RegExp(pattern, flagString);
    const matches: EnhancedMatchResult[] = [];

    if (flagString.includes('g')) {
      let match: RegExpExecArray | null;
      let matchIndex = 0;
      while ((match = regex.exec(input)) !== null) {
        const captureGroups = extractCaptureGroups(match, input);
        matches.push({
          text: match[0],
          start: match.index,
          end: match.index + match[0].length,
          groups: match.groups,
          index: matchIndex++,
          captureGroups,
        });
        // Prevent infinite loops for zero-length matches
        if (match[0].length === 0) {
          regex.lastIndex++;
        }
      }
    } else {
      const match = regex.exec(input);
      if (match) {
        const captureGroups = extractCaptureGroups(match, input);
        matches.push({
          text: match[0],
          start: match.index,
          end: match.index + match[0].length,
          groups: match.groups,
          index: 0,
          captureGroups,
        });
      }
    }

    return { valid: true, matches };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Error testing pattern',
      matches: [],
    };
  }
}

/**
 * Extract capture groups from a regex match
 */
function extractCaptureGroups(
  match: RegExpExecArray,
  input: string
): CaptureGroup[] {
  const groups: CaptureGroup[] = [];

  // Numbered capture groups (skip index 0 which is the full match)
  for (let i = 1; i < match.length; i++) {
    if (match[i] !== undefined) {
      // Find the position of this capture group in the input
      const groupValue = match[i];
      const groupStart = input.indexOf(groupValue, match.index);

      groups.push({
        index: i,
        value: groupValue,
        start: groupStart >= 0 ? groupStart : match.index,
        end: groupStart >= 0 ? groupStart + groupValue.length : match.index + groupValue.length,
      });
    }
  }

  // Named capture groups
  if (match.groups) {
    Object.entries(match.groups).forEach(([name, value]) => {
      if (value !== undefined) {
        const groupStart = input.indexOf(value, match.index);
        // Check if this is a new group (not already added as numbered)
        const existingGroup = groups.find(g => g.value === value && !g.name);
        if (existingGroup) {
          existingGroup.name = name;
        } else {
          groups.push({
            index: groups.length + 1,
            name,
            value,
            start: groupStart >= 0 ? groupStart : match.index,
            end: groupStart >= 0 ? groupStart + value.length : match.index + value.length,
          });
        }
      }
    });
  }

  return groups;
}

/**
 * Get replacement reference documentation
 */
export function getReplacementReferences(): Array<{ reference: string; description: string; example: string }> {
  return [
    { reference: '$&', description: 'Inserts the matched substring', example: '"cat" → "[$&]" → "[cat]"' },
    { reference: '$`', description: 'Inserts the portion before the match', example: '"abcat" → "$`X" → "abX"' },
    { reference: "$'", description: 'Inserts the portion after the match', example: '"catxy" → "X$\'" → "Xxy"' },
    { reference: '$$', description: 'Inserts a literal "$"', example: '"cat" → "$$5" → "$5"' },
    { reference: '$1, $2, ...', description: 'Inserts the nth captured group', example: '"(\\w+)" → "$1s" → "cats"' },
    { reference: '$<name>', description: 'Inserts a named captured group', example: '"(?<word>\\w+)" → "$<word>s"' },
  ];
}
