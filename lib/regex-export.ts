/**
 * Export regex patterns to various programming languages
 */

import type { ExportConfig, ExportLanguage, ExportResult, FlagState } from '@/types/regex';

interface LanguageConfig {
  name: string;
  extension: string;
  comment: string;
  multilineComment: [string, string];
}

const languageConfigs: Record<ExportLanguage, LanguageConfig> = {
  javascript: { name: 'JavaScript', extension: 'js', comment: '//', multilineComment: ['/*', '*/'] },
  python: { name: 'Python', extension: 'py', comment: '#', multilineComment: ['"""', '"""'] },
  java: { name: 'Java', extension: 'java', comment: '//', multilineComment: ['/*', '*/'] },
  go: { name: 'Go', extension: 'go', comment: '//', multilineComment: ['/*', '*/'] },
  rust: { name: 'Rust', extension: 'rs', comment: '//', multilineComment: ['/*', '*/'] },
  csharp: { name: 'C#', extension: 'cs', comment: '//', multilineComment: ['/*', '*/'] },
};

function buildFlagStringForExport(flags: FlagState): string {
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

function escapePatternForLanguage(pattern: string, language: ExportLanguage): string {
  switch (language) {
    case 'javascript':
      // In JS regex literal, forward slashes need escaping
      return pattern.replace(/\//g, '\\/');
    case 'python':
      // Python raw strings handle most escaping
      return pattern;
    case 'java':
    case 'csharp':
      // Need to escape backslashes in string literals
      return pattern.replace(/\\/g, '\\\\');
    case 'go':
      // Go raw strings (backticks) don't need escaping, but we'll use regular strings
      return pattern.replace(/\\/g, '\\\\');
    case 'rust':
      // Rust raw strings handle escaping
      return pattern;
    default:
      return pattern;
  }
}

function generateJavaScript(config: ExportConfig): string {
  const { pattern, flags, testString, replacement, includeTest, includeReplacement } = config;
  const flagString = buildFlagStringForExport(flags);
  const escapedPattern = escapePatternForLanguage(pattern, 'javascript');

  let code = `// Regex Pattern\nconst regex = /${escapedPattern}/${flagString};\n`;

  if (includeTest && testString) {
    const escapedTestString = testString.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
    code += `\n// Test string\nconst testString = '${escapedTestString}';\n`;
    code += `\n// Find all matches\nconst matches = testString.match(regex);\nconsole.log('Matches:', matches);\n`;
    code += `\n// Test if pattern matches\nconst isMatch = regex.test(testString);\nconsole.log('Is match:', isMatch);\n`;

    if (flags.global) {
      code += `\n// Get match details with exec\nlet match;\nwhile ((match = regex.exec(testString)) !== null) {\n  console.log('Match:', match[0], 'at index:', match.index);\n}\n`;
    }
  }

  if (includeReplacement && replacement !== undefined) {
    const escapedReplacement = replacement.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    code += `\n// Replacement\nconst replacement = '${escapedReplacement}';\nconst result = testString.replace(regex, replacement);\nconsole.log('Result:', result);\n`;
  }

  return code;
}

function generatePython(config: ExportConfig): string {
  const { pattern, flags, testString, replacement, includeTest, includeReplacement } = config;

  const flagsList: string[] = [];
  if (flags.caseInsensitive) flagsList.push('re.IGNORECASE');
  if (flags.multiline) flagsList.push('re.MULTILINE');
  const flagsArg = flagsList.length > 0 ? `, ${flagsList.join(' | ')}` : '';

  let code = `import re\n\n# Regex Pattern\npattern = r'${pattern}'\nregex = re.compile(pattern${flagsArg})\n`;

  if (includeTest && testString) {
    const escapedTestString = testString.replace(/'/g, "\\'").replace(/\n/g, '\\n');
    code += `\n# Test string\ntest_string = '${escapedTestString}'\n`;

    if (flags.global) {
      code += `\n# Find all matches\nmatches = regex.findall(test_string)\nprint('Matches:', matches)\n`;
      code += `\n# Get match details with finditer\nfor match in regex.finditer(test_string):\n    print(f'Match: {match.group()} at index: {match.start()}')\n`;
    } else {
      code += `\n# Find first match\nmatch = regex.search(test_string)\nif match:\n    print('Match:', match.group(), 'at index:', match.start())\n`;
    }
  }

  if (includeReplacement && replacement !== undefined) {
    const escapedReplacement = replacement.replace(/'/g, "\\'");
    const count = flags.global ? '0' : '1';
    code += `\n# Replacement\nreplacement = '${escapedReplacement}'\nresult = regex.sub(replacement, test_string, count=${count})\nprint('Result:', result)\n`;
  }

  return code;
}

function generateJava(config: ExportConfig): string {
  const { pattern, flags, testString, replacement, includeTest, includeReplacement } = config;
  const escapedPattern = escapePatternForLanguage(pattern, 'java');

  const flagsList: string[] = [];
  if (flags.caseInsensitive) flagsList.push('Pattern.CASE_INSENSITIVE');
  if (flags.multiline) flagsList.push('Pattern.MULTILINE');
  const flagsArg = flagsList.length > 0 ? `, ${flagsList.join(' | ')}` : '';

  let code = `import java.util.regex.Pattern;\nimport java.util.regex.Matcher;\n\npublic class RegexExample {\n    public static void main(String[] args) {\n        // Regex Pattern\n        Pattern pattern = Pattern.compile("${escapedPattern}"${flagsArg});\n`;

  if (includeTest && testString) {
    const escapedTestString = testString.replace(/"/g, '\\"').replace(/\n/g, '\\n');
    code += `\n        // Test string\n        String testString = "${escapedTestString}";\n        Matcher matcher = pattern.matcher(testString);\n`;

    if (flags.global) {
      code += `\n        // Find all matches\n        while (matcher.find()) {\n            System.out.println("Match: " + matcher.group() + " at index: " + matcher.start());\n        }\n`;
    } else {
      code += `\n        // Find first match\n        if (matcher.find()) {\n            System.out.println("Match: " + matcher.group() + " at index: " + matcher.start());\n        }\n`;
    }
  }

  if (includeReplacement && replacement !== undefined) {
    const escapedReplacement = replacement.replace(/"/g, '\\"');
    const method = flags.global ? 'replaceAll' : 'replaceFirst';
    code += `\n        // Replacement\n        String replacement = "${escapedReplacement}";\n        String result = matcher.${method}(replacement);\n        System.out.println("Result: " + result);\n`;
  }

  code += `    }\n}\n`;
  return code;
}

function generateGo(config: ExportConfig): string {
  const { pattern, flags, testString, replacement, includeTest, includeReplacement } = config;

  // Go doesn't support flags the same way, need to embed in pattern
  let goPattern = pattern;
  if (flags.caseInsensitive || flags.multiline) {
    let flagPrefix = '(?';
    if (flags.caseInsensitive) flagPrefix += 'i';
    if (flags.multiline) flagPrefix += 'm';
    flagPrefix += ')';
    goPattern = flagPrefix + pattern;
  }
  const escapedPattern = goPattern.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

  let code = `package main\n\nimport (\n\t"fmt"\n\t"regexp"\n)\n\nfunc main() {\n\t// Regex Pattern\n\tpattern := "${escapedPattern}"\n\tregex := regexp.MustCompile(pattern)\n`;

  if (includeTest && testString) {
    const escapedTestString = testString.replace(/"/g, '\\"').replace(/\n/g, '\\n');
    code += `\n\t// Test string\n\ttestString := "${escapedTestString}"\n`;

    if (flags.global) {
      code += `\n\t// Find all matches\n\tmatches := regex.FindAllString(testString, -1)\n\tfmt.Println("Matches:", matches)\n`;
      code += `\n\t// Get match details\n\tindices := regex.FindAllStringIndex(testString, -1)\n\tfor i, idx := range indices {\n\t\tfmt.Printf("Match %d: %s at index: %d\\n", i, testString[idx[0]:idx[1]], idx[0])\n\t}\n`;
    } else {
      code += `\n\t// Find first match\n\tmatch := regex.FindString(testString)\n\tif match != "" {\n\t\tidx := regex.FindStringIndex(testString)\n\t\tfmt.Printf("Match: %s at index: %d\\n", match, idx[0])\n\t}\n`;
    }
  }

  if (includeReplacement && replacement !== undefined) {
    const escapedReplacement = replacement.replace(/"/g, '\\"');
    const method = flags.global ? 'ReplaceAllString' : 'ReplaceAllStringFunc'; // Go doesn't have replaceFirst natively
    if (flags.global) {
      code += `\n\t// Replacement\n\treplacement := "${escapedReplacement}"\n\tresult := regex.${method}(testString, replacement)\n\tfmt.Println("Result:", result)\n`;
    } else {
      code += `\n\t// Replacement (first match only)\n\treplacement := "${escapedReplacement}"\n\treplaced := false\n\tresult := regex.ReplaceAllStringFunc(testString, func(s string) string {\n\t\tif !replaced {\n\t\t\treplaced = true\n\t\t\treturn replacement\n\t\t}\n\t\treturn s\n\t})\n\tfmt.Println("Result:", result)\n`;
    }
  }

  code += `}\n`;
  return code;
}

function generateRust(config: ExportConfig): string {
  const { pattern, flags, testString, replacement, includeTest, includeReplacement } = config;

  // Rust regex crate uses inline flags
  let rustPattern = pattern;
  if (flags.caseInsensitive || flags.multiline) {
    let flagPrefix = '(?';
    if (flags.caseInsensitive) flagPrefix += 'i';
    if (flags.multiline) flagPrefix += 'm';
    flagPrefix += ')';
    rustPattern = flagPrefix + pattern;
  }

  let code = `use regex::Regex;\n\nfn main() {\n    // Regex Pattern\n    let pattern = r"${rustPattern}";\n    let regex = Regex::new(pattern).unwrap();\n`;

  if (includeTest && testString) {
    const escapedTestString = testString.replace(/"/g, '\\"').replace(/\n/g, '\\n');
    code += `\n    // Test string\n    let test_string = "${escapedTestString}";\n`;

    if (flags.global) {
      code += `\n    // Find all matches\n    for mat in regex.find_iter(test_string) {\n        println!("Match: {} at index: {}", mat.as_str(), mat.start());\n    }\n`;
    } else {
      code += `\n    // Find first match\n    if let Some(mat) = regex.find(test_string) {\n        println!("Match: {} at index: {}", mat.as_str(), mat.start());\n    }\n`;
    }
  }

  if (includeReplacement && replacement !== undefined) {
    const escapedReplacement = replacement.replace(/"/g, '\\"');
    const method = flags.global ? 'replace_all' : 'replace';
    code += `\n    // Replacement\n    let replacement = "${escapedReplacement}";\n    let result = regex.${method}(test_string, replacement);\n    println!("Result: {}", result);\n`;
  }

  code += `}\n`;
  return code;
}

function generateCSharp(config: ExportConfig): string {
  const { pattern, flags, testString, replacement, includeTest, includeReplacement } = config;
  const escapedPattern = escapePatternForLanguage(pattern, 'csharp');

  const flagsList: string[] = [];
  if (flags.caseInsensitive) flagsList.push('RegexOptions.IgnoreCase');
  if (flags.multiline) flagsList.push('RegexOptions.Multiline');
  const flagsArg = flagsList.length > 0 ? `, ${flagsList.join(' | ')}` : '';

  let code = `using System;\nusing System.Text.RegularExpressions;\n\nclass Program\n{\n    static void Main()\n    {\n        // Regex Pattern\n        var pattern = @"${escapedPattern}";\n        var regex = new Regex(pattern${flagsArg});\n`;

  if (includeTest && testString) {
    const escapedTestString = testString.replace(/"/g, '""').replace(/\n/g, '\\n');
    code += `\n        // Test string\n        var testString = "${escapedTestString}";\n`;

    if (flags.global) {
      code += `\n        // Find all matches\n        var matches = regex.Matches(testString);\n        foreach (Match match in matches)\n        {\n            Console.WriteLine($"Match: {match.Value} at index: {match.Index}");\n        }\n`;
    } else {
      code += `\n        // Find first match\n        var match = regex.Match(testString);\n        if (match.Success)\n        {\n            Console.WriteLine($"Match: {match.Value} at index: {match.Index}");\n        }\n`;
    }
  }

  if (includeReplacement && replacement !== undefined) {
    const escapedReplacement = replacement.replace(/"/g, '""');
    const count = flags.global ? '' : ', 1';
    code += `\n        // Replacement\n        var replacement = "${escapedReplacement}";\n        var result = regex.Replace(testString, replacement${count});\n        Console.WriteLine($"Result: {result}");\n`;
  }

  code += `    }\n}\n`;
  return code;
}

/**
 * Generate code for the specified language
 */
export function generateCode(config: ExportConfig): ExportResult {
  const { language } = config;
  const langConfig = languageConfigs[language];

  let code: string;
  switch (language) {
    case 'javascript':
      code = generateJavaScript(config);
      break;
    case 'python':
      code = generatePython(config);
      break;
    case 'java':
      code = generateJava(config);
      break;
    case 'go':
      code = generateGo(config);
      break;
    case 'rust':
      code = generateRust(config);
      break;
    case 'csharp':
      code = generateCSharp(config);
      break;
    default:
      code = '// Language not supported';
  }

  return {
    code,
    language,
    filename: `regex_example.${langConfig.extension}`,
  };
}

/**
 * Get all available export languages
 */
export function getExportLanguages(): Array<{ id: ExportLanguage; name: string }> {
  return Object.entries(languageConfigs).map(([id, config]) => ({
    id: id as ExportLanguage,
    name: config.name,
  }));
}
