/**
 * Internationalization labels for the Regex Builder
 */

export type Language = 'en' | 'de';

export interface Labels {
  // General
  title: string;
  appName: string;

  // Building blocks
  buildingBlocks: string;
  complexBlocks: string;
  customInput: string;
  addPattern: string;

  // Block names
  "Any digit": string;
  "Non-digit": string;
  "Any letter": string;
  "Word character": string;
  "Non-word character": string;
  "Any whitespace": string;
  "Non-whitespace": string;
  "Any character": string;
  "Optional": string;
  "One or more": string;
  "Zero or more": string;
  "Start of line": string;
  "End of line": string;
  "Word boundary": string;
  "Capturing group": string;
  "Non-capturing group": string;
  "Or (alternation)": string;
  "Character class": string;
  "Negated class": string;

  // Pattern input
  enterPattern: string;
  copyPattern: string;
  clearPattern: string;
  undoAction: string;

  // Testing
  testRegex: string;
  testString: string;
  enterTestString: string;
  matches: string;
  noMatches: string;
  matchCount: string;
  matchPosition: string;
  captureGroups: string;

  // Common patterns
  commonPatterns: string;
  usePattern: string;

  // Saved patterns
  savedPatterns: string;
  patternName: string;
  savePattern: string;
  deletePattern: string;
  savedPatternsInfo: string;
  confirmDelete: string;
  cancelDelete: string;
  noSavedPatterns: string;

  // Replacement
  replacement: string;
  replacementPattern: string;
  replacementResult: string;
  replaceAll: string;
  replaceFirst: string;

  // Export
  exportCode: string;
  selectLanguage: string;
  copyCode: string;
  codeCopied: string;

  // Flags
  patternOptions: string;
  activeFlags: string;
  global: string;
  globalDesc: string;
  caseInsensitive: string;
  caseInsensitiveDesc: string;
  multiline: string;
  multilineDesc: string;

  // Pattern explanation
  patternBreakdown: string;
  example: string;

  // Pattern history
  patternHistory: string;
  clearHistory: string;
  noHistory: string;

  // Keyboard shortcuts
  keyboardShortcuts: string;
  testShortcut: string;
  saveShortcut: string;
  clearShortcut: string;

  // Quick test strings
  quickTestStrings: string;
  insertTestString: string;

  // Theme
  theme: string;
  light: string;
  dark: string;
  system: string;

  // Validation messages
  validPattern: string;
  invalidPattern: string;
  validPatternNoMatches: string;

  // Categories
  validation: string;
  datesAndTimes: string;
  numbers: string;
  textFormats: string;
  network: string;
  security: string;
  markupAndCode: string;
  international: string;
}

export const labels: Record<Language, Labels> = {
  en: {
    // General
    title: "Regex Builder",
    appName: "Regex Builder",

    // Building blocks
    buildingBlocks: "Building Blocks",
    complexBlocks: "Complex Blocks",
    customInput: "Custom Input",
    addPattern: "Add Pattern",

    // Block names
    "Any digit": "Any digit",
    "Non-digit": "Non-digit",
    "Any letter": "Any letter",
    "Word character": "Word character",
    "Non-word character": "Non-word character",
    "Any whitespace": "Any whitespace",
    "Non-whitespace": "Non-whitespace",
    "Any character": "Any character",
    "Optional": "Optional",
    "One or more": "One or more",
    "Zero or more": "Zero or more",
    "Start of line": "Start of line",
    "End of line": "End of line",
    "Word boundary": "Word boundary",
    "Capturing group": "Capturing group",
    "Non-capturing group": "Non-capturing group",
    "Or (alternation)": "Or (alternation)",
    "Character class": "Character class",
    "Negated class": "Negated class",

    // Pattern input
    enterPattern: "Enter your regex pattern",
    copyPattern: "Copy pattern",
    clearPattern: "Clear pattern",
    undoAction: "Undo",

    // Testing
    testRegex: "Test RegEx",
    testString: "Test String",
    enterTestString: "Enter test string",
    matches: "Matches",
    noMatches: "No matches found",
    matchCount: "Found {count} match(es)",
    matchPosition: "at position {start}-{end}",
    captureGroups: "Capture Groups",

    // Common patterns
    commonPatterns: "Common Patterns",
    usePattern: "Use pattern",

    // Saved patterns
    savedPatterns: "Saved Patterns",
    patternName: "Pattern Name",
    savePattern: "Save Pattern",
    deletePattern: "Delete",
    savedPatternsInfo: "Save your patterns for easy reuse. These are stored locally in your browser.",
    confirmDelete: "Are you sure you want to delete this pattern?",
    cancelDelete: "Cancel",
    noSavedPatterns: "No saved patterns yet",

    // Replacement
    replacement: "Replacement",
    replacementPattern: "Replacement pattern",
    replacementResult: "Result",
    replaceAll: "Replace All",
    replaceFirst: "Replace First",

    // Export
    exportCode: "Export Code",
    selectLanguage: "Select Language",
    copyCode: "Copy Code",
    codeCopied: "Code copied!",

    // Flags
    patternOptions: "Pattern Options",
    activeFlags: "Active flags",
    global: "Global",
    globalDesc: "Find all matches rather than stopping after the first match",
    caseInsensitive: "Case Insensitive",
    caseInsensitiveDesc: "Make the pattern case-insensitive",
    multiline: "Multiline",
    multilineDesc: "Make ^ and $ match the start/end of each line",

    // Pattern explanation
    patternBreakdown: "Pattern Breakdown",
    example: "Example",

    // Pattern history
    patternHistory: "Pattern History",
    clearHistory: "Clear History",
    noHistory: "No pattern history",

    // Keyboard shortcuts
    keyboardShortcuts: "Keyboard Shortcuts",
    testShortcut: "Test pattern",
    saveShortcut: "Save pattern",
    clearShortcut: "Clear pattern",

    // Quick test strings
    quickTestStrings: "Quick Test Strings",
    insertTestString: "Insert test string",

    // Theme
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    system: "System",

    // Validation messages
    validPattern: "Valid pattern",
    invalidPattern: "Invalid pattern",
    validPatternNoMatches: "Valid pattern, but no matches found",

    // Categories
    validation: "Validation",
    datesAndTimes: "Dates & Times",
    numbers: "Numbers",
    textFormats: "Text Formats",
    network: "Network",
    security: "Security",
    markupAndCode: "Markup & Code",
    international: "International",
  },
  de: {
    // General
    title: "Regex Builder",
    appName: "Regex Builder",

    // Building blocks
    buildingBlocks: "Bausteine",
    complexBlocks: "Komplexe Blöcke",
    customInput: "Benutzerdefinierte Eingabe",
    addPattern: "Muster hinzufügen",

    // Block names
    "Any digit": "Beliebige Ziffer",
    "Non-digit": "Keine Ziffer",
    "Any letter": "Beliebiger Buchstabe",
    "Word character": "Wortzeichen",
    "Non-word character": "Kein Wortzeichen",
    "Any whitespace": "Beliebiges Leerzeichen",
    "Non-whitespace": "Kein Leerzeichen",
    "Any character": "Beliebiges Zeichen",
    "Optional": "Optional",
    "One or more": "Eins oder mehr",
    "Zero or more": "Null oder mehr",
    "Start of line": "Zeilenanfang",
    "End of line": "Zeilenende",
    "Word boundary": "Wortgrenze",
    "Capturing group": "Erfassungsgruppe",
    "Non-capturing group": "Nicht-erfassende Gruppe",
    "Or (alternation)": "Oder (Alternation)",
    "Character class": "Zeichenklasse",
    "Negated class": "Negierte Klasse",

    // Pattern input
    enterPattern: "Geben Sie Ihr Regex-Muster ein",
    copyPattern: "Muster kopieren",
    clearPattern: "Muster löschen",
    undoAction: "Rückgängig",

    // Testing
    testRegex: "RegEx testen",
    testString: "Test-Text",
    enterTestString: "Test-Text eingeben",
    matches: "Treffer",
    noMatches: "Keine Treffer gefunden",
    matchCount: "{count} Treffer gefunden",
    matchPosition: "an Position {start}-{end}",
    captureGroups: "Erfassungsgruppen",

    // Common patterns
    commonPatterns: "Häufige Muster",
    usePattern: "Muster verwenden",

    // Saved patterns
    savedPatterns: "Gespeicherte Muster",
    patternName: "Name des Musters",
    savePattern: "Muster speichern",
    deletePattern: "Löschen",
    savedPatternsInfo: "Speichern Sie Ihre Muster für einfache Wiederverwendung. Diese werden lokal in Ihrem Browser gespeichert.",
    confirmDelete: "Möchten Sie dieses Muster wirklich löschen?",
    cancelDelete: "Abbrechen",
    noSavedPatterns: "Noch keine gespeicherten Muster",

    // Replacement
    replacement: "Ersetzung",
    replacementPattern: "Ersetzungsmuster",
    replacementResult: "Ergebnis",
    replaceAll: "Alle ersetzen",
    replaceFirst: "Erste ersetzen",

    // Export
    exportCode: "Code exportieren",
    selectLanguage: "Sprache auswählen",
    copyCode: "Code kopieren",
    codeCopied: "Code kopiert!",

    // Flags
    patternOptions: "Muster-Optionen",
    activeFlags: "Aktive Flags",
    global: "Global",
    globalDesc: "Alle Treffer finden, anstatt nach dem ersten aufzuhören",
    caseInsensitive: "Groß-/Kleinschreibung ignorieren",
    caseInsensitiveDesc: "Das Muster ignoriert Groß-/Kleinschreibung",
    multiline: "Mehrzeilig",
    multilineDesc: "^ und $ an Zeilenanfang/-ende matchen",

    // Pattern explanation
    patternBreakdown: "Muster-Analyse",
    example: "Beispiel",

    // Pattern history
    patternHistory: "Muster-Verlauf",
    clearHistory: "Verlauf löschen",
    noHistory: "Kein Muster-Verlauf",

    // Keyboard shortcuts
    keyboardShortcuts: "Tastenkürzel",
    testShortcut: "Muster testen",
    saveShortcut: "Muster speichern",
    clearShortcut: "Muster löschen",

    // Quick test strings
    quickTestStrings: "Schnelle Test-Texte",
    insertTestString: "Test-Text einfügen",

    // Theme
    theme: "Design",
    light: "Hell",
    dark: "Dunkel",
    system: "System",

    // Validation messages
    validPattern: "Gültiges Muster",
    invalidPattern: "Ungültiges Muster",
    validPatternNoMatches: "Gültiges Muster, aber keine Treffer",

    // Categories
    validation: "Validierung",
    datesAndTimes: "Datum & Zeit",
    numbers: "Zahlen",
    textFormats: "Textformate",
    network: "Netzwerk",
    security: "Sicherheit",
    markupAndCode: "Markup & Code",
    international: "International",
  }
};

export function getLabel(language: Language, key: keyof Labels): string {
  return labels[language][key];
}
