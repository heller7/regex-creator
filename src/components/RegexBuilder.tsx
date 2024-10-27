/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from 'react';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Textarea } from '../../components/ui/textarea';

type RegexBlock = {
  type: string;
  value: string;
  // Add other properties as needed
};

export const RegexBuilder = () => {
  const [pattern, setPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [matches, setMatches] = useState<string[]>([]);
  const [blocks, setBlocks] = useState<RegexBlock[]>([]);
  const { language } = useLanguage();

  const commonPatterns = {
    email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    phone: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    url: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
  };

  const buildingBlocks = [
    { name: 'Any digit', pattern: '\\d' },
    { name: 'Any letter', pattern: '[a-zA-Z]' },
    { name: 'Any whitespace', pattern: '\\s' },
    { name: 'Optional', pattern: '?' },
    { name: 'One or more', pattern: '+' },
    { name: 'Zero or more', pattern: '*' },
  ];

  const testRegex = () => {
    try {
      const regex = new RegExp(pattern, 'g');
      const found = testString.match(regex) || [];
      setMatches(found);
    } catch (error) {
      setMatches(['Invalid regex pattern']);
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
      title: "Regex Builder"
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
      title: "Regex Builder"
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{labels[language].title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Building blocks */}
        <div>
          <h2 className="text-xl font-semibold mb-2">{labels[language].buildingBlocks}</h2>
          <div className="flex flex-wrap gap-2">
            {buildingBlocks.map((block) => (
              <Button
                key={block.name}
                onClick={() => handleAddBlock(block.name, block.pattern)}
              >
                {labels[language][block.name]}
              </Button>
            ))}
              </div>
            </div>

        {/* Common patterns */}
        <div>
          <h2 className="text-xl font-semibold mb-2">{labels[language].commonPatterns}</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(commonPatterns).map(([name, regex]) => (
              <Button
                key={name}
                onClick={() => setPattern(regex.toString().slice(1, -1))}
              >
                {name}
              </Button>
            ))}
          </div>
        </div>

        {/* Pattern input */}
        <div>
          <Input
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Regex pattern"
          />
        </div>

        {/* Test string input */}
        <div>
          <Textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder="Test string"
            rows={4}
          />
        </div>

        <Button onClick={testRegex}>
          {labels[language].testRegex}
        </Button>

        {/* Results */}
        <div>
          <h2 className="text-xl font-semibold mb-2">{labels[language].matches}</h2>
          <ul className="list-disc pl-5">
            {matches.map((match, index) => (
              <li key={index}>{match}</li>
            ))}
          </ul>
        </div>

        <Button 
          variant="destructive" 
          onClick={handleRemoveLastBlock}
          disabled={blocks.length === 0}
        >
          {labels[language].removeBlock}
        </Button>
      </CardContent>
    </Card>
  );
};
