import { describe, it, expect } from 'vitest';
import { generateCode, getExportLanguages } from '@/lib/regex-export';
import type { FlagState } from '@/types/regex';

const defaultFlags: FlagState = {
  global: true,
  caseInsensitive: false,
  multiline: false,
};

describe('getExportLanguages', () => {
  it('should return all supported languages', () => {
    const languages = getExportLanguages();
    expect(languages).toHaveLength(6);
    expect(languages.map(l => l.id)).toContain('javascript');
    expect(languages.map(l => l.id)).toContain('python');
    expect(languages.map(l => l.id)).toContain('java');
    expect(languages.map(l => l.id)).toContain('go');
    expect(languages.map(l => l.id)).toContain('rust');
    expect(languages.map(l => l.id)).toContain('csharp');
  });
});

describe('generateCode', () => {
  describe('JavaScript', () => {
    it('should generate basic JavaScript code', () => {
      const result = generateCode({
        language: 'javascript',
        pattern: '\\d+',
        flags: defaultFlags,
      });
      expect(result.code).toContain('const regex = /\\d+/g;');
      expect(result.language).toBe('javascript');
      expect(result.filename).toBe('regex_example.js');
    });

    it('should include test code when includeTest is true', () => {
      const result = generateCode({
        language: 'javascript',
        pattern: '\\d+',
        flags: defaultFlags,
        testString: 'abc123',
        includeTest: true,
      });
      expect(result.code).toContain('const testString');
      expect(result.code).toContain('.match(regex)');
    });

    it('should include replacement when includeReplacement is true', () => {
      const result = generateCode({
        language: 'javascript',
        pattern: '\\d+',
        flags: defaultFlags,
        testString: 'abc123',
        replacement: 'NUM',
        includeTest: true,
        includeReplacement: true,
      });
      expect(result.code).toContain('.replace(regex, replacement)');
    });

    it('should handle case insensitive flag', () => {
      const result = generateCode({
        language: 'javascript',
        pattern: 'test',
        flags: { ...defaultFlags, caseInsensitive: true },
      });
      expect(result.code).toContain('/test/gi');
    });
  });

  describe('Python', () => {
    it('should generate basic Python code', () => {
      const result = generateCode({
        language: 'python',
        pattern: '\\d+',
        flags: defaultFlags,
      });
      expect(result.code).toContain('import re');
      expect(result.code).toContain("pattern = r'\\d+'");
      expect(result.language).toBe('python');
      expect(result.filename).toBe('regex_example.py');
    });

    it('should handle case insensitive flag', () => {
      const result = generateCode({
        language: 'python',
        pattern: 'test',
        flags: { ...defaultFlags, caseInsensitive: true },
      });
      expect(result.code).toContain('re.IGNORECASE');
    });

    it('should include test code', () => {
      const result = generateCode({
        language: 'python',
        pattern: '\\d+',
        flags: defaultFlags,
        testString: 'abc123',
        includeTest: true,
      });
      expect(result.code).toContain('findall');
    });
  });

  describe('Java', () => {
    it('should generate basic Java code', () => {
      const result = generateCode({
        language: 'java',
        pattern: '\\d+',
        flags: defaultFlags,
      });
      expect(result.code).toContain('import java.util.regex.Pattern');
      expect(result.code).toContain('Pattern.compile');
      expect(result.filename).toBe('regex_example.java');
    });

    it('should escape backslashes properly', () => {
      const result = generateCode({
        language: 'java',
        pattern: '\\d+',
        flags: defaultFlags,
      });
      expect(result.code).toContain('"\\\\d+"');
    });
  });

  describe('Go', () => {
    it('should generate basic Go code', () => {
      const result = generateCode({
        language: 'go',
        pattern: '\\d+',
        flags: defaultFlags,
      });
      expect(result.code).toContain('package main');
      expect(result.code).toContain('"regexp"');
      expect(result.code).toContain('regexp.MustCompile');
      expect(result.filename).toBe('regex_example.go');
    });

    it('should embed flags in pattern', () => {
      const result = generateCode({
        language: 'go',
        pattern: 'test',
        flags: { ...defaultFlags, caseInsensitive: true },
      });
      expect(result.code).toContain('(?i)test');
    });
  });

  describe('Rust', () => {
    it('should generate basic Rust code', () => {
      const result = generateCode({
        language: 'rust',
        pattern: '\\d+',
        flags: defaultFlags,
      });
      expect(result.code).toContain('use regex::Regex');
      expect(result.code).toContain('Regex::new');
      expect(result.filename).toBe('regex_example.rs');
    });
  });

  describe('C#', () => {
    it('should generate basic C# code', () => {
      const result = generateCode({
        language: 'csharp',
        pattern: '\\d+',
        flags: defaultFlags,
      });
      expect(result.code).toContain('using System.Text.RegularExpressions');
      expect(result.code).toContain('new Regex');
      expect(result.filename).toBe('regex_example.cs');
    });

    it('should handle flags', () => {
      const result = generateCode({
        language: 'csharp',
        pattern: 'test',
        flags: { ...defaultFlags, caseInsensitive: true, multiline: true },
      });
      expect(result.code).toContain('RegexOptions.IgnoreCase');
      expect(result.code).toContain('RegexOptions.Multiline');
    });
  });
});
