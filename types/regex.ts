/**
 * Type definitions for Regex Builder
 */

// Block types for the building blocks feature
export type RegexBlockType =
  | 'digit'
  | 'letter'
  | 'whitespace'
  | 'quantifier'
  | 'anchor'
  | 'group'
  | 'character-class'
  | 'alternation'
  | 'predefined'
  | 'wizard';

export interface RegexBlock {
  type: RegexBlockType;
  value: string;
}

// Regex flags
export type RegexFlagId = 'global' | 'caseInsensitive' | 'multiline';

export interface RegexFlagConfig {
  id: RegexFlagId;
  flag: string;
  label: string;
  description: string;
}

export type FlagState = Record<RegexFlagId, boolean>;

// Pattern validation and matching
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export interface MatchResult {
  text: string;
  start: number;
  end: number;
  groups?: Record<string, string>;
}

export interface TestResult {
  valid: boolean;
  error?: string;
  matches: MatchResult[];
}

// Pattern library
export type PatternCategory =
  | 'validation'
  | 'datetime'
  | 'numbers'
  | 'text'
  | 'network'
  | 'security'
  | 'markup';

export interface Pattern {
  id: string;
  pattern: string;
  description: string;
  example?: string;
  category: PatternCategory;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
}

export interface PatternGroup {
  name: string;
  category: PatternCategory;
  patterns: Pattern[];
}

// Pattern explanation
export interface PatternPart {
  pattern: string;
  explanation: string;
  example?: string;
}

export interface PatternExplanation {
  parts: PatternPart[];
  fullExplanation: string;
}

// Saved patterns
export interface SavedPattern {
  id: string;
  name: string;
  pattern: string;
  flags: FlagState;
  createdAt: string;
  updatedAt?: string;
}

// Wizard types
export interface WizardOption {
  label: string;
  pattern: string;
}

export interface WizardStep {
  id: string;
  question: string;
  options: WizardOption[];
}

// Component props
export interface PatternInputProps {
  pattern: string;
  onChange: (pattern: string) => void;
  error?: string;
  onCopy?: () => void;
}

export interface TestAreaProps {
  testString: string;
  onChange: (value: string) => void;
  matches: MatchResult[];
  pattern: string;
}

export interface RegexFlagsProps {
  flags: FlagState;
  onChange: (flags: FlagState) => void;
}

export interface BuildingBlocksProps {
  onAddBlock: (block: RegexBlock) => void;
}

export interface CommonPatternsProps {
  onSelectPattern: (pattern: string) => void;
}

export interface SavedPatternsProps {
  patterns: SavedPattern[];
  onSelectPattern: (pattern: SavedPattern) => void;
  onDeletePattern?: (id: string) => void;
}

// Replacement types
export interface ReplacementResult {
  success: boolean;
  result: string;
  replacementCount: number;
  error?: string;
}

// Export configuration
export type ExportLanguage = 'javascript' | 'python' | 'java' | 'go' | 'rust' | 'csharp';

export interface ExportConfig {
  language: ExportLanguage;
  pattern: string;
  flags: FlagState;
  testString?: string;
  replacement?: string;
  includeTest?: boolean;
  includeReplacement?: boolean;
}

export interface ExportResult {
  code: string;
  language: ExportLanguage;
  filename: string;
}

// Pattern history
export interface PatternHistoryEntry {
  id: string;
  pattern: string;
  timestamp: number;
  flags?: FlagState;
}

// Theme types
export type Theme = 'light' | 'dark' | 'system';

// Enhanced match result with capture groups
export interface EnhancedMatchResult extends MatchResult {
  index: number;
  captureGroups: CaptureGroup[];
}

export interface CaptureGroup {
  index: number;
  name?: string;
  value: string;
  start: number;
  end: number;
}
