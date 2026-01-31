"use client";

import { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { labels } from "@/lib/data/labels";

// Hooks
import { useRegex } from "@/hooks/useRegex";
import { usePatternHistory } from "@/hooks/usePatternHistory";
import { useKeyboardShortcuts, createDefaultShortcuts } from "@/hooks/useKeyboardShortcuts";

// Components
import { PatternInput } from "./regex/PatternInput";
import { TestArea } from "./regex/TestArea";
import { MatchesDisplay } from "./regex/MatchesDisplay";
import { ReplacementArea } from "./regex/ReplacementArea";
import { BuildingBlocks } from "./regex/BuildingBlocks";
import { CommonPatterns } from "./regex/CommonPatterns";
import { SavedPatterns } from "./regex/SavedPatterns";
import { PatternHistory } from "./regex/PatternHistory";
import { ExportModal } from "./regex/ExportModal";
import { PatternExplainer } from "./regex/PatternExplainer";
import { RegexFlags } from "./regex/RegexFlags";
import type { FlagState } from "@/types/regex";

export const RegexBuilder = () => {
  const { language } = useLanguage();
  const t = labels[language];
  const [blocks, setBlocks] = useState<string[]>([]);

  // Core regex state
  const {
    pattern,
    setPattern,
    testString,
    setTestString,
    flags,
    setFlags,
    matches,
    isValid,
    message,
    replacement,
    setReplacement,
    replacementResult,
    performReplacement,
    clear,
  } = useRegex();

  // Pattern history
  const { addToHistory } = usePatternHistory();

  // Handle adding a block to the pattern
  const handleAddBlock = useCallback((blockPattern: string) => {
    setPattern(pattern + blockPattern);
    setBlocks(prev => [...prev, blockPattern]);
  }, [pattern, setPattern]);

  // Handle undo
  const handleUndo = useCallback(() => {
    if (blocks.length > 0) {
      const newBlocks = blocks.slice(0, -1);
      setBlocks(newBlocks);
      setPattern(newBlocks.join(''));
    }
  }, [blocks, setPattern]);

  // Handle pattern selection from saved/common patterns
  const handleSelectPattern = useCallback((selectedPattern: string, selectedFlags?: FlagState) => {
    setPattern(selectedPattern);
    setBlocks([selectedPattern]);
    if (selectedFlags) {
      setFlags(selectedFlags);
    }
    addToHistory(selectedPattern, selectedFlags || flags);
  }, [setPattern, setFlags, addToHistory, flags]);

  // Handle save (for keyboard shortcut)
  const handleSave = useCallback(() => {
    if (pattern) {
      addToHistory(pattern, flags);
    }
  }, [pattern, flags, addToHistory]);

  // Keyboard shortcuts
  useKeyboardShortcuts(
    createDefaultShortcuts({
      onClear: clear,
      onSave: handleSave,
      onUndo: handleUndo,
    })
  );

  return (
    <div className="flex gap-4 p-4 max-w-7xl mx-auto">
      {/* Left Sidebar */}
      <div className="w-72 space-y-4 shrink-0">
        <BuildingBlocks onAddBlock={handleAddBlock} />
        <CommonPatterns onSelectPattern={handleSelectPattern} />
      </div>

      {/* Main Content */}
      <Card className="flex-1 min-w-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t.title}</CardTitle>
            <div className="flex items-center gap-2">
              <PatternHistory onSelectPattern={handleSelectPattern} />
              <ExportModal
                pattern={pattern}
                flags={flags}
                testString={testString}
                replacement={replacement}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <PatternInput
            pattern={pattern}
            onChange={(newPattern) => {
              setPattern(newPattern);
              setBlocks([newPattern]);
            }}
            isValid={isValid}
            message={message}
            onUndo={handleUndo}
            canUndo={blocks.length > 0}
          />

          <TestArea
            testString={testString}
            onChange={setTestString}
            pattern={pattern}
          />

          <MatchesDisplay matches={matches} />

          <ReplacementArea
            replacement={replacement}
            onReplacementChange={setReplacement}
            onReplace={performReplacement}
            result={replacementResult}
            isValid={isValid && !!pattern}
          />

          <RegexFlags flags={flags} setFlags={setFlags} pattern={pattern} />

          <PatternExplainer pattern={pattern} />
        </CardContent>
      </Card>

      {/* Right Sidebar */}
      <div className="w-64 shrink-0">
        <SavedPatterns
          onSelectPattern={handleSelectPattern}
          currentPattern={pattern}
          currentFlags={flags}
        />
      </div>
    </div>
  );
};
