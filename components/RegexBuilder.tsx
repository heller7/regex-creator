/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { useLanguage } from "contexts/LanguageContext";
import { Textarea } from './ui/textarea';
import { Car, Info, Copy, Check, Undo } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./ui/accordion";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

type RegexBlock = {
  type: string;
  value: string;
  testString?: string;
};

type PatternExplanation = {
  pattern: string;
  explanation: string;
  example: string;
};

type PatternPart = {
  pattern: string;
  explanation: string;
  example?: string;
};

const patternExplanations: Record<string, PatternPart> = {
  '\\d': { pattern: '\\d', explanation: 'Matches any digit (0-9)', example: '"abc123" → matches 1, 2, 3' },
  '\\w': { pattern: '\\w', explanation: 'Matches any word character (letter, digit, underscore)', example: '"*ab12_" → matches a, b, 1, 2, _' },
  '\\s': { pattern: '\\s', explanation: 'Matches any whitespace character', example: '"a b\tc" → matches the space and tab' },
  '.': { pattern: '.', explanation: 'Matches any character except newline', example: '"abc" → matches a, b, c' },
  
  '*': { pattern: '*', explanation: 'Matches 0 or more of the preceding character', example: '"a*" matches "" or "a" or "aaa"' },
  '+': { pattern: '+', explanation: 'Matches 1 or more of the preceding character', example: '"a+" matches "a" or "aaa" but not ""' },
  '?': { pattern: '?', explanation: 'Makes the preceding character optional', example: '"colou?r" matches "color" or "colour"' },
  '{': { pattern: '{n}', explanation: 'Matches exactly n occurrences of the preceding character', example: 'a{3} matches "aaa" but not "aa" or "aaaa"' },
  '}': { pattern: '}', explanation: 'Ends the count specification', example: '' },

  // Special count patterns
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

type InteractiveExample = {
  title: string;
  pattern: string;
  testCases: Array<{
    input: string;
    expected: boolean;
  }>;
  explanation: string;
};

const interactiveExamples: InteractiveExample[] = [
  {
    title: "Email Validation",
    pattern: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
    testCases: [
      { input: "test@example.com", expected: true },
      { input: "invalid.email", expected: false },
      { input: "test@test@example.com", expected: false },
    ],
    explanation: "Breaks down how email validation works step by step"
  },
  // Add more examples
];

type WizardStep = {
  id: string;
  question: string;
  options: Array<{
    label: string;
    pattern: string;
  }>;
};

const wizardSteps: WizardStep[] = [
  {
    id: "type",
    question: "What kind of pattern do you want to match?",
    options: [
      { label: "Letters only", pattern: "[a-zA-Z]" },
      { label: "Numbers only", pattern: "\\d" },
      { label: "Both letters and numbers", pattern: "[a-zA-Z0-9]" }
    ]
  },
  {
    id: "quantity",
    question: "How many characters do you want to match?",
    options: [
      { label: "One", pattern: "" },
      { label: "One or more", pattern: "+" },
      { label: "Zero or more", pattern: "*" },
      { label: "Optional", pattern: "?" }
    ]
  }
];

type RegexFlag = {
  id: 'global' | 'caseInsensitive' | 'multiline';
  label: string;
  description: string;
  flag: string;
};

const regexFlags: RegexFlag[] = [
  {
    id: 'global',
    label: 'Global',
    description: 'Find all matches rather than stopping after the first match',
    flag: 'g'
  },
  {
    id: 'caseInsensitive',
    label: 'Case Insensitive',
    description: 'Make the pattern case-insensitive',
    flag: 'i'
  },
  {
    id: 'multiline',
    label: 'Multiline',
    description: 'Make ^ and $ match the start/end of each line',
    flag: 'm'
  }
];

type FlagState = Record<RegexFlag['id'], boolean>;

const RegexFlagsComponent = ({ flags, setFlags, pattern }: {
  flags: FlagState;
  setFlags: React.Dispatch<React.SetStateAction<FlagState>>;
  pattern: string;
}) => {
  const handleFlagChange = (flagId: RegexFlag['id']) => {
    setFlags(prev => ({
      ...prev,
      [flagId]: !prev[flagId]
    }));
  };

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Pattern Options</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {regexFlags.map((flagOption) => (
            <div
              key={flagOption.id}
              className="flex items-center space-x-2"
            >
              <Switch
                id={flagOption.id}
                checked={flags[flagOption.id]}
                onCheckedChange={(checked) => 
                  handleFlagChange(flagOption.id)
                }
              />
              <div className="flex items-center gap-2">
                <Label htmlFor={flagOption.id} className="font-medium">
                  {flagOption.label}
                </Label>
                <span className="text-xs text-muted-foreground">
                  ({flagOption.flag})
                </span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{flagOption.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          ))}
          
          {/* Show active flags */}
          <div className="mt-2 pt-2 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Active flags:</span>
              <code className="bg-muted px-1 rounded">
                /{pattern}/{
                  Object.entries(flags)
                    .filter(([_, value]) => value)
                    .map(([key]) => regexFlags.find(f => f.id === key)?.flag)
                    .join('')
                }
              </code>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const RegexBuilder = () => {
  const [pattern, setPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [matches, setMatches] = useState<string[]>([]);
  const [blocks, setBlocks] = useState<RegexBlock[]>([]);
  const [complexString, setComplexString] = useState('');
  const [copied, setCopied] = useState(false);
  const [flags, setFlags] = useState({
    global: true,
    caseInsensitive: false,
    multiline: false,
  });
  const [savedPatterns, setSavedPatterns] = useState<Array<{name: string, pattern: string}>>([]);
  const [patternName, setPatternName] = useState('');
  const { language } = useLanguage();
  const [wizardActive, setWizardActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [realTimeResults, setRealTimeResults] = useState<{
    valid: boolean;
    message: string;
  }>({ valid: true, message: '' });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('savedPatterns');
      if (saved) {
        setSavedPatterns(JSON.parse(saved));
      }
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      localStorage.setItem('savedPatterns', JSON.stringify(savedPatterns));
    }
  }, [savedPatterns, mounted]);

  const commonPatternCategories = [
    {
      name: "Validation",
      patterns: [
        { 
          id: "email",
          pattern: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
          description: "Matches valid email addresses",
          example: "test@example.com"
        },
        { 
          id: "url",
          pattern: "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)",
          description: "Matches URLs (http or https)",
          example: "https://www.example.com"
        },
        { 
          id: "phone",
          pattern: "^[\\+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$",
          description: "Matches phone numbers in various formats",
          example: "+1 (234) 567-8900"
        },
        {
          id: "password",
          pattern: "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$",
          description: "Matches strong passwords (min 8 chars, at least 1 uppercase, 1 lowercase, 1 number)",
          example: "TestPass123"
        }
      ]
    },
    {
      name: "Dates & Times",
      patterns: [
        {
          id: "date-iso",
          pattern: "^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$",
          description: "Matches dates in YYYY-MM-DD format",
          example: "2024-03-14"
        },
        {
          id: "time-24h",
          pattern: "^([01]\\d|2[0-3]):([0-5]\\d)$",
          description: "Matches 24-hour time format",
          example: "23:59"
        },
        {
          id: "datetime-iso",
          pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?Z$",
          description: "Matches ISO datetime format",
          example: "2024-03-14T15:30:00Z"
        }
      ]
    },
    {
      name: "Numbers",
      patterns: [
        {
          id: "integer",
          pattern: "^-?\\d+$",
          description: "Matches whole numbers (positive or negative)",
          example: "-123, 456"
        },
        {
          id: "decimal",
          pattern: "^-?\\d*\\.?\\d+$",
          description: "Matches decimal numbers",
          example: "-123.45, 0.789"
        },
        {
          id: "currency",
          pattern: "^\\$\\d{1,3}(,\\d{3})*(\\.\\d{2})?$",
          description: "Matches currency format",
          example: "$1,234.56"
        }
      ]
    },
    {
      name: "Text Formats",
      patterns: [
        {
          id: "username",
          pattern: "^[a-zA-Z0-9_-]{3,16}$",
          description: "Matches common username format (3-16 characters)",
          example: "user_123"
        },
        {
          id: "slug",
          pattern: "^[a-z0-9-]+$",
          description: "Matches URL-friendly slugs",
          example: "my-page-title"
        },
        {
          id: "hex-color",
          pattern: "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
          description: "Matches hex color codes",
          example: "#FF0000, #F00"
        }
      ]
    }
  ];

  const buildingBlocks = [
    { 
      name: 'Any digit', 
      pattern: '\\d',
      info: 'Matches any single digit (0-9)'
    },
    { 
      name: 'Any letter', 
      pattern: '[a-zA-Z]',
      info: 'Matches any single letter, case-sensitive'
    },
    { 
      name: 'Any whitespace', 
      pattern: '\\s',
      info: 'Matches any whitespace character (spaces, tabs, line breaks)'
    },
    { 
      name: 'Optional', 
      pattern: '?',
      info: 'Makes the preceding character or group optional'
    },
    { 
      name: 'One or more', 
      pattern: '+',
      info: 'Matches one or more occurrences of the preceding character or group'
    },
    { 
      name: 'Zero or more', 
      pattern: '*',
      info: 'Matches zero or more occurrences of the preceding character or group'
    },
  ];

  const complexPatterns = [
    {
      name: 'Custom Number Range',
      generatePattern: (input: string) => {
        const numbers = input.split(',').map(n => n.trim());
        return `[${numbers[0]}-${numbers[1]}]`;
      },
      placeholder: 'Enter range (e.g., 1,9)',
      info: 'Creates a pattern matching any single digit in the specified range'
    },
    {
      name: 'Repeated Pattern',
      generatePattern: (input: string) => `(${input})+`,
      placeholder: 'Enter pattern to repeat',
      info: 'Matches one or more occurrences of the specified pattern'
    },
    {
      name: 'Optional Pattern',
      generatePattern: (input: string) => `(${input})?`,
      placeholder: 'Enter optional pattern',
      info: 'Makes the specified pattern optional'
    },
  ];

  const validateAndTest = (patternStr: string, testStr: string) => {
    try {
      const flagString = (flags.global ? 'g' : '') +
                        (flags.caseInsensitive ? 'i' : '') +
                        (flags.multiline ? 'm' : '');
      const regex = new RegExp(patternStr, flagString);
      const found = testStr.match(regex) || [];
      setMatches(found);
      setRealTimeResults({ 
        valid: true, 
        message: found.length > 0 
          ? `Found ${found.length} match${found.length === 1 ? '' : 'es'}`
          : 'Valid pattern, but no matches found'
      });
    } catch (error) {
      setMatches([]);
      setRealTimeResults({ 
        valid: false, 
        message: (error as Error).message 
      });
    }
  };

  const handleAddBlock = (type: string, value: string) => {
    setBlocks(prevBlocks => [...prevBlocks, { type, value }]);
    setPattern(prevPattern => prevPattern + value);
  };

  const handleRemoveLastBlock = () => {
    setBlocks(prevBlocks => {
      const newBlocks = prevBlocks.slice(0, -1);
      setPattern(newBlocks.map(block => block.value).join(''));
      return newBlocks;
    });
  };

  const handleComplexPattern = (generator: (input: string) => string) => {
    if (complexString) {
      const generatedPattern = generator(complexString);
      handleAddBlock('complex', generatedPattern);
      setComplexString('');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(pattern);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSavePattern = () => {
    if (pattern && patternName) {
      const newPatterns = [...savedPatterns, { name: patternName, pattern }];
      setSavedPatterns(newPatterns);
      localStorage.setItem('savedPatterns', JSON.stringify(newPatterns));
      setPatternName('');
    }
  };

  const labels: Record<string, Record<string, string>> = {
    en: {
      addBlock: "Add Block",
      removeBlock: "Remove Last Block",
      "Any digit": "Any digit",
      "Any letter": "Any letter",
      "Any whitespace": "Any whitespace",
      "Optional": "Optional",
      "One or more": "One or more",
      "Zero or more": "Zero or more",
      testRegex: "Test RegEx",
      matches: "Matches",
      buildingBlocks: "Building Blocks",
      commonPatterns: "Common Patterns",
      title: "Regex Builder",
      complexBlocks: "Complex Blocks",
      addPattern: "Add Pattern",
      customInput: "Custom Input",
      savedPatterns: "Saved Patterns",
      patternName: "Pattern Name",
      savePattern: "Save Pattern",
      savedPatternsInfo: "Save your patterns for easy reuse. These are stored locally in your browser.",
    },
    de: {
      addBlock: "Block hinzufügen",
      removeBlock: "Letzten Block entfernen",
      "Any digit": "Beliebige Ziffer",
      "Any letter": "Beliebiger Buchstabe",
      "Any whitespace": "Beliebiges Leerzeichen",
      "Optional": "Optional",
      "One or more": "Eins oder mehr",
      "Zero or more": "Null oder mehr",
      testRegex: "RegEx testen",
      matches: "Treffer",
      buildingBlocks: "Bausteine",
      commonPatterns: "Häufige Muster",
      title: "Regex Builder",
      complexBlocks: "Komplexe Blöcke",
      addPattern: "Muster hinzufügen",
      customInput: "Benutzerdefinierte Eingabe",
      savedPatterns: "Gespeicherte Muster",
      patternName: "Name des Musters",
      savePattern: "Muster speichern",
      savedPatternsInfo: "Speichern Sie Ihre Muster für einfache Wiederverwendung. Diese werden lokal in Ihrem Browser gespeichert.",
    }
  };

  const ExampleTester = ({ example }: { example: InteractiveExample }) => {
    return (
      <div className="border p-4 rounded-md mb-4">
        <h3 className="font-semibold">{example.title}</h3>
        <p className="text-sm text-muted-foreground mb-2">{example.explanation}</p>
        <div className="space-y-2">
          {example.testCases.map((testCase, index) => {
            const isMatch = new RegExp(example.pattern).test(testCase.input);
            return (
              <div key={index} className="flex items-center gap-2">
                <span className="font-mono">{testCase.input}</span>
                <span className={isMatch === testCase.expected ? "text-green-500" : "text-red-500"}>
                  {isMatch ? "✓" : "✗"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const RegexWizard = () => {
    return wizardActive ? (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Pattern Builder Wizard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{wizardSteps[currentStep].question}</p>
          <div className="flex gap-2">
            {wizardSteps[currentStep].options.map((option) => (
              <Button
                key={option.label}
                onClick={() => {
                  handleAddBlock('wizard', option.pattern);
                  if (currentStep < wizardSteps.length - 1) {
                    setCurrentStep(c => c + 1);
                  } else {
                    setWizardActive(false);
                    setCurrentStep(0);
                  }
                }}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    ) : null;
  };

  const validatePattern = (pattern: string) => {
    try {
      new RegExp(pattern);
      setRealTimeResults({ valid: true, message: 'Valid pattern' });
    } catch (error) {
      setRealTimeResults({ 
        valid: false, 
        message: (error as Error).message 
      });
    }
  };

  const PatternExplainer = ({ pattern }: { pattern: string }) => {
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
            
            if (!max) {
              explanation = `Matches exactly ${min} occurrences of the preceding character`;
              example = `a${countPattern} matches "${'a'.repeat(Number(min))}"`;
            } else if (min && max) {
              explanation = `Matches between ${min} and ${max} occurrences of the preceding character`;
              example = `a${countPattern} matches "${'a'.repeat(Number(min))}" to "${'a'.repeat(Number(max))}"`;
            } else if (!min) {
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
  };

  return (
    <div className="flex gap-4 p-4 max-w-7xl mx-auto">
      {/* Left Sidebar with Blocks */}
      <div className="w-72 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{labels[language].buildingBlocks}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {buildingBlocks.map((block) => (
              <div key={block.name} className="flex items-center gap-2">
                <Button
                  className="flex-1"
                  onClick={() => handleAddBlock(block.name, block.pattern)}
                >
                  {labels[language][block.name]}
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{block.info}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{labels[language].commonPatterns}</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="space-y-2">
              {commonPatternCategories.map((category, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-sm font-medium">
                    {category.name}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-2">
                      {category.patterns.map((pattern) => (
                        <div key={pattern.id} className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            className="flex-1 justify-start text-sm"
                            onClick={() => handleAddBlock(pattern.id, pattern.pattern)}
                          >
                            {pattern.id}
                          </Button>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 cursor-pointer" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>{pattern.description}</p>
                                <p className="text-xs mt-1 font-mono">Example: {pattern.example}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{labels[language].complexBlocks}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              value={complexString}
              onChange={(e) => setComplexString(e.target.value)}
              placeholder={labels[language].customInput}
            />
            {complexPatterns.map((pattern) => (
              <div key={pattern.name} className="flex items-center gap-2">
                <Button
                  className="flex-1"
                  onClick={() => handleComplexPattern(pattern.generatePattern)}
                  disabled={!complexString}
                >
                  {pattern.name}
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{pattern.info}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>{labels[language].title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-1">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  value={pattern}
                  onChange={(e) => {
                    setPattern(e.target.value);
                    validateAndTest(e.target.value, testString);
                  }}
                  className={!realTimeResults.valid ? "border-red-500" : ""}
                  placeholder="Enter your regex pattern"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <Button 
                variant="destructive" 
                onClick={handleRemoveLastBlock}
                disabled={blocks.length === 0}
                size="icon"
              >
                <Undo className="h-4 w-4" />
              </Button>
            </div>
            <p className={`text-sm ${realTimeResults.valid ? "text-green-500" : "text-red-500"}`}>
              {realTimeResults.message}
            </p>
          </div>

          <div className="space-y-1">
            <Textarea
              value={testString}
              onChange={(e) => {
                setTestString(e.target.value);
                validateAndTest(pattern, e.target.value);
              }}
              placeholder="Enter test string"
              rows={4}
            />
          </div>

          {matches.length > 0 && (
            <div className="p-4 bg-muted rounded-md">
              <h2 className="text-sm font-semibold mb-2">Matches:</h2>
              <div className="space-y-1">
                {matches.map((match, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="font-mono bg-background px-2 py-1 rounded text-sm">
                      {match}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      at position {testString.indexOf(match, 
                        index > 0 ? testString.indexOf(matches[index-1]) + matches[index-1].length : 0
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 mt-2">
            <Input
              value={patternName}
              onChange={(e) => setPatternName(e.target.value)}
              placeholder="Pattern name"
              className="max-w-xs"
            />
            <Button 
              onClick={handleSavePattern}
              disabled={!pattern || !patternName}
            >
              {labels[language].savePattern}
            </Button>
          </div>

          <RegexFlagsComponent flags={flags} setFlags={(newFlags) => setFlags(newFlags)} pattern={pattern} />

          <PatternExplainer pattern={pattern} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{labels[language].savedPatterns} <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{labels[language].savedPatternsInfo}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>  </CardTitle>
        </CardHeader>
        <CardContent>
          {savedPatterns.map((saved, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <Button
                variant="outline"
                onClick={() => setPattern(saved.pattern)}
              >
                {saved.name}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
      <RegexWizard />
    </div>
  );
};
