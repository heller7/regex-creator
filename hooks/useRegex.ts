"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  testPatternEnhanced,
  applyReplacement,
  buildFlagString,
} from '@/lib/regex-utils';
import type { FlagState, EnhancedMatchResult, ReplacementResult } from '@/types/regex';

export interface UseRegexOptions {
  initialPattern?: string;
  initialTestString?: string;
  initialFlags?: FlagState;
  debounceMs?: number;
}

export interface UseRegexReturn {
  // Pattern state
  pattern: string;
  setPattern: (pattern: string) => void;

  // Test string state
  testString: string;
  setTestString: (testString: string) => void;

  // Flags state
  flags: FlagState;
  setFlags: React.Dispatch<React.SetStateAction<FlagState>>;
  flagString: string;

  // Match results
  matches: EnhancedMatchResult[];
  matchCount: number;

  // Validation
  isValid: boolean;
  error: string | undefined;
  message: string;

  // Replacement
  replacement: string;
  setReplacement: (replacement: string) => void;
  replacementResult: ReplacementResult | null;
  performReplacement: (replaceAll?: boolean) => ReplacementResult;

  // Actions
  clear: () => void;
  test: () => void;
}

const defaultFlags: FlagState = {
  global: true,
  caseInsensitive: false,
  multiline: false,
};

/**
 * Comprehensive hook for regex pattern management
 */
export function useRegex(options: UseRegexOptions = {}): UseRegexReturn {
  const {
    initialPattern = '',
    initialTestString = '',
    initialFlags = defaultFlags,
    debounceMs = 150,
  } = options;

  // State
  const [pattern, setPattern] = useState(initialPattern);
  const [testString, setTestString] = useState(initialTestString);
  const [flags, setFlags] = useState<FlagState>(initialFlags);
  const [replacement, setReplacement] = useState('');

  // Results state
  const [matches, setMatches] = useState<EnhancedMatchResult[]>([]);
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [replacementResult, setReplacementResult] = useState<ReplacementResult | null>(null);

  // Debounce timer ref
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Derived state
  const flagString = useMemo(() => buildFlagString(flags), [flags]);
  const matchCount = matches.length;

  // Validation message
  const message = useMemo(() => {
    if (!pattern) return '';
    if (!isValid) return error || 'Invalid pattern';
    if (matchCount === 0) return 'Valid pattern, but no matches found';
    return `Found ${matchCount} match${matchCount === 1 ? '' : 'es'}`;
  }, [pattern, isValid, error, matchCount]);

  // Run test with current pattern, testString, and flags
  const runTest = useCallback((p: string, ts: string, f: FlagState) => {
    if (!p) {
      setMatches([]);
      setIsValid(true);
      setError(undefined);
      return;
    }

    const result = testPatternEnhanced(p, ts, f);
    setMatches(result.matches);
    setIsValid(result.valid);
    setError(result.error);
  }, []);

  // Debounced test that uses current state values
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      runTest(pattern, testString, flags);
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [pattern, testString, flags, debounceMs, runTest]);

  // Replacement function
  const performReplacement = useCallback(
    (replaceAll: boolean = true): ReplacementResult => {
      const result = applyReplacement(pattern, testString, replacement, flags, replaceAll);
      setReplacementResult(result);
      return result;
    },
    [pattern, testString, replacement, flags]
  );

  // Clear function
  const clear = useCallback(() => {
    setPattern('');
    setTestString('');
    setReplacement('');
    setMatches([]);
    setIsValid(true);
    setError(undefined);
    setReplacementResult(null);
  }, []);

  // Manual test function
  const test = useCallback(() => {
    runTest(pattern, testString, flags);
  }, [pattern, testString, flags, runTest]);

  return {
    pattern,
    setPattern,
    testString,
    setTestString,
    flags,
    setFlags,
    flagString,
    matches,
    matchCount,
    isValid,
    error,
    message,
    replacement,
    setReplacement,
    replacementResult,
    performReplacement,
    clear,
    test,
  };
}
