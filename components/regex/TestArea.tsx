"use client";

import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { testStringGroups } from "@/lib/data/test-strings";
import { useLanguage } from "@/contexts/LanguageContext";
import { labels } from "@/lib/data/labels";

interface TestAreaProps {
  testString: string;
  onChange: (value: string) => void;
  pattern: string;
}

export function TestArea({ testString, onChange, pattern }: TestAreaProps) {
  const { language } = useLanguage();
  const t = labels[language];

  const handleQuickStringSelect = (value: string) => {
    onChange(value);
  };

  // Highlight matches in the text
  const highlightMatches = () => {
    if (!pattern || !testString) return testString;

    try {
      const regex = new RegExp(pattern, 'g');
      const parts: Array<{ text: string; isMatch: boolean }> = [];
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(testString)) !== null) {
        if (match.index > lastIndex) {
          parts.push({
            text: testString.slice(lastIndex, match.index),
            isMatch: false,
          });
        }
        parts.push({ text: match[0], isMatch: true });
        lastIndex = match.index + match[0].length;

        // Prevent infinite loop for zero-length matches
        if (match[0].length === 0) {
          regex.lastIndex++;
        }
      }

      if (lastIndex < testString.length) {
        parts.push({ text: testString.slice(lastIndex), isMatch: false });
      }

      return parts;
    } catch {
      return testString;
    }
  };

  const highlightedParts = highlightMatches();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{t.testString}</label>
        <Select onValueChange={handleQuickStringSelect}>
          <SelectTrigger className="w-[200px] h-8 text-xs">
            <SelectValue placeholder={t.quickTestStrings} />
          </SelectTrigger>
          <SelectContent>
            {testStringGroups.map((group) => (
              <SelectGroup key={group.categoryId}>
                <SelectLabel>{group.categoryName}</SelectLabel>
                {group.strings.map((str) => (
                  <SelectItem key={str.id} value={str.value}>
                    {str.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Textarea
        value={testString}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t.enterTestString}
        rows={4}
        className="font-mono"
      />

      {/* Visual match highlighting preview */}
      {pattern && testString && typeof highlightedParts !== 'string' && highlightedParts.length > 0 && (
        <div className="p-3 bg-muted rounded-md font-mono text-sm whitespace-pre-wrap break-all">
          {highlightedParts.map((part, index) =>
            part.isMatch ? (
              <mark key={index} className="bg-yellow-300 dark:bg-yellow-600 rounded px-0.5">
                {part.text}
              </mark>
            ) : (
              <span key={index}>{part.text}</span>
            )
          )}
        </div>
      )}
    </div>
  );
}
