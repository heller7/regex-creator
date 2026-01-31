import { describe, it, expect } from 'vitest';
import {
  validatePattern,
  buildFlagString,
  testPattern,
  escapeForRegex,
  applyReplacement,
  testPatternEnhanced,
} from '@/lib/regex-utils';

describe('validatePattern', () => {
  it('should return valid for empty pattern', () => {
    const result = validatePattern('');
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should return valid for correct regex', () => {
    const result = validatePattern('\\d+');
    expect(result.valid).toBe(true);
  });

  it('should return invalid for unclosed bracket', () => {
    const result = validatePattern('[abc');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should return invalid for unclosed parenthesis', () => {
    const result = validatePattern('(abc');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should return invalid for invalid quantifier', () => {
    const result = validatePattern('*abc');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });
});

describe('buildFlagString', () => {
  it('should return empty string for no flags', () => {
    const result = buildFlagString({
      global: false,
      caseInsensitive: false,
      multiline: false,
    });
    expect(result).toBe('');
  });

  it('should return "g" for global flag only', () => {
    const result = buildFlagString({
      global: true,
      caseInsensitive: false,
      multiline: false,
    });
    expect(result).toBe('g');
  });

  it('should return "gi" for global and case insensitive', () => {
    const result = buildFlagString({
      global: true,
      caseInsensitive: true,
      multiline: false,
    });
    expect(result).toBe('gi');
  });

  it('should return all flags when all enabled', () => {
    const result = buildFlagString({
      global: true,
      caseInsensitive: true,
      multiline: true,
    });
    expect(result).toBe('gim');
  });
});

describe('testPattern', () => {
  it('should return empty matches for empty pattern', () => {
    const result = testPattern('', 'test string', {
      global: true,
      caseInsensitive: false,
      multiline: false,
    });
    expect(result.valid).toBe(true);
    expect(result.matches).toEqual([]);
  });

  it('should find matches with global flag', () => {
    const result = testPattern('\\d+', 'abc123def456', {
      global: true,
      caseInsensitive: false,
      multiline: false,
    });
    expect(result.valid).toBe(true);
    expect(result.matches).toHaveLength(2);
    expect(result.matches[0].text).toBe('123');
    expect(result.matches[0].start).toBe(3);
    expect(result.matches[0].end).toBe(6);
    expect(result.matches[1].text).toBe('456');
    expect(result.matches[1].start).toBe(9);
    expect(result.matches[1].end).toBe(12);
  });

  it('should find only first match without global flag', () => {
    const result = testPattern('\\d+', 'abc123def456', {
      global: false,
      caseInsensitive: false,
      multiline: false,
    });
    expect(result.valid).toBe(true);
    expect(result.matches).toHaveLength(1);
    expect(result.matches[0].text).toBe('123');
  });

  it('should respect case insensitive flag', () => {
    const result = testPattern('hello', 'HELLO hello HeLLo', {
      global: true,
      caseInsensitive: true,
      multiline: false,
    });
    expect(result.valid).toBe(true);
    expect(result.matches).toHaveLength(3);
  });

  it('should return no matches when pattern does not match', () => {
    const result = testPattern('xyz', 'abc123', {
      global: true,
      caseInsensitive: false,
      multiline: false,
    });
    expect(result.valid).toBe(true);
    expect(result.matches).toHaveLength(0);
  });

  it('should return error for invalid pattern', () => {
    const result = testPattern('[invalid', 'test', {
      global: true,
      caseInsensitive: false,
      multiline: false,
    });
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.matches).toEqual([]);
  });
});

describe('escapeForRegex', () => {
  it('should escape special characters', () => {
    expect(escapeForRegex('hello.world')).toBe('hello\\.world');
    expect(escapeForRegex('a*b+c?')).toBe('a\\*b\\+c\\?');
    expect(escapeForRegex('[test]')).toBe('\\[test\\]');
    expect(escapeForRegex('(group)')).toBe('\\(group\\)');
    expect(escapeForRegex('$100')).toBe('\\$100');
    expect(escapeForRegex('^start')).toBe('\\^start');
    expect(escapeForRegex('a|b')).toBe('a\\|b');
    expect(escapeForRegex('path\\to\\file')).toBe('path\\\\to\\\\file');
  });

  it('should not escape regular characters', () => {
    expect(escapeForRegex('hello')).toBe('hello');
    expect(escapeForRegex('abc123')).toBe('abc123');
  });
});

describe('applyReplacement', () => {
  const defaultFlags = { global: true, caseInsensitive: false, multiline: false };

  it('should return original string for empty pattern', () => {
    const result = applyReplacement('', 'test string', 'replacement', defaultFlags);
    expect(result.success).toBe(true);
    expect(result.result).toBe('test string');
    expect(result.replacementCount).toBe(0);
  });

  it('should replace all matches with global flag', () => {
    const result = applyReplacement('\\d+', 'abc123def456', 'NUM', defaultFlags, true);
    expect(result.success).toBe(true);
    expect(result.result).toBe('abcNUMdefNUM');
    expect(result.replacementCount).toBe(2);
  });

  it('should replace first match only when replaceAll is false', () => {
    const result = applyReplacement('\\d+', 'abc123def456', 'NUM', defaultFlags, false);
    expect(result.success).toBe(true);
    expect(result.result).toBe('abcNUMdef456');
    expect(result.replacementCount).toBe(1);
  });

  it('should support $& replacement reference', () => {
    const result = applyReplacement('\\d+', 'abc123', '[$&]', defaultFlags);
    expect(result.success).toBe(true);
    expect(result.result).toBe('abc[123]');
  });

  it('should support capture group replacement $1', () => {
    const result = applyReplacement('(\\d+)', 'abc123', 'num:$1', defaultFlags);
    expect(result.success).toBe(true);
    expect(result.result).toBe('abcnum:123');
  });

  it('should return error for invalid pattern', () => {
    const result = applyReplacement('[invalid', 'test', 'replacement', defaultFlags);
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should handle empty replacement', () => {
    const result = applyReplacement('\\d+', 'abc123def', '', defaultFlags);
    expect(result.success).toBe(true);
    expect(result.result).toBe('abcdef');
  });
});

describe('testPatternEnhanced', () => {
  const defaultFlags = { global: true, caseInsensitive: false, multiline: false };

  it('should return enhanced match results with positions', () => {
    const result = testPatternEnhanced('\\d+', 'abc123def456', defaultFlags);
    expect(result.valid).toBe(true);
    expect(result.matches).toHaveLength(2);
    expect(result.matches[0].index).toBe(0);
    expect(result.matches[0].start).toBe(3);
    expect(result.matches[0].end).toBe(6);
    expect(result.matches[1].index).toBe(1);
  });

  it('should capture groups', () => {
    const result = testPatternEnhanced('(\\d+)-(\\d+)', '123-456', defaultFlags);
    expect(result.valid).toBe(true);
    expect(result.matches).toHaveLength(1);
    expect(result.matches[0].captureGroups).toHaveLength(2);
    expect(result.matches[0].captureGroups[0].value).toBe('123');
    expect(result.matches[0].captureGroups[1].value).toBe('456');
  });

  it('should handle named capture groups', () => {
    const result = testPatternEnhanced('(?<year>\\d{4})-(?<month>\\d{2})', '2024-01', defaultFlags);
    expect(result.valid).toBe(true);
    expect(result.matches).toHaveLength(1);
    expect(result.matches[0].groups).toBeDefined();
    expect(result.matches[0].groups?.year).toBe('2024');
    expect(result.matches[0].groups?.month).toBe('01');
  });

  it('should return empty matches for empty pattern', () => {
    const result = testPatternEnhanced('', 'test', defaultFlags);
    expect(result.valid).toBe(true);
    expect(result.matches).toEqual([]);
  });

  it('should return error for invalid pattern', () => {
    const result = testPatternEnhanced('[invalid', 'test', defaultFlags);
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });
});
