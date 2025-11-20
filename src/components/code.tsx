"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface CodeBlockTheme {
  name: string;
  light: any;
  dark: any;
}

export const themes: Record<string, CodeBlockTheme> = {
  default: {
    name: "VS Code Dark",
    light: oneLight,
    dark: {
      'pre[class*="language-"]': {
        background: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
        fontSize: "12px",
        lineHeight: "1.5",
        margin: 0,
        padding: "1em",
        overflow: "auto",
      },
      'code[class*="language-"]': {
        background: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
        fontSize: "12px",
        lineHeight: "1.5",
      },
      comment: { color: "#6a9955" },
      prolog: { color: "#6a9955" },
      doctype: { color: "#6a9955" },
      cdata: { color: "#6a9955" },
      punctuation: { color: "#d4d4d4" },
      property: { color: "#9cdcfe" },
      tag: { color: "#569cd6" },
      constant: { color: "#9cdcfe" },
      symbol: { color: "#9cdcfe" },
      deleted: { color: "#9cdcfe" },
      boolean: { color: "#569cd6" },
      number: { color: "#b5cea8" },
      selector: { color: "#d7ba7d" },
      "attr-name": { color: "#9cdcfe" },
      string: { color: "#ce9178" },
      char: { color: "#ce9178" },
      builtin: { color: "#ce9178" },
      inserted: { color: "#ce9178" },
      operator: { color: "#d4d4d4" },
      entity: { color: "#d4d4d4" },
      url: { color: "#d4d4d4" },
      variable: { color: "#9cdcfe" },
      atrule: { color: "#ce9178" },
      "attr-value": { color: "#ce9178" },
      function: { color: "#dcdcaa" },
      "class-name": { color: "#4ec9b0" },
      keyword: { color: "#569cd6" },
      regex: { color: "#d16969" },
      important: { color: "#569cd6" },
      bold: { fontWeight: "bold" },
      italic: { fontStyle: "italic" },
    },
  },
  github: {
    name: "GitHub",
    light: {
      ...oneLight,
      'pre[class*="language-"]': {
        ...oneLight['pre[class*="language-"]'],
        background: "#f6f8fa",
        border: "1px solid #d0d7de",
      },
      'code[class*="language-"]': {
        ...oneLight['code[class*="language-"]'],
        background: "#f6f8fa",
      },
    },
    dark: {
      ...oneDark,
      'pre[class*="language-"]': {
        ...oneDark['pre[class*="language-"]'],
        background: "#0d1117",
        border: "1px solid #30363d",
      },
      'code[class*="language-"]': {
        ...oneDark['code[class*="language-"]'],
        background: "#0d1117",
      },
    },
  },
  minimal: {
    name: "Minimal",
    light: {
      ...oneLight,
      'pre[class*="language-"]': {
        ...oneLight['pre[class*="language-"]'],
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        boxShadow: "none",
      },
      'code[class*="language-"]': {
        ...oneLight['code[class*="language-"]'],
        background: "#ffffff",
      },
    },
    dark: {
      ...oneDark,
      'pre[class*="language-"]': {
        ...oneDark['pre[class*="language-"]'],
        background: "#1f2937",
        border: "1px solid #374151",
        boxShadow: "none",
      },
      'code[class*="language-"]': {
        ...oneDark['code[class*="language-"]'],
        background: "#1f2937",
      },
    },
  },
  vscode: {
    name: "VS Code Dark",
    light: oneLight, // fallback
    dark: {
      'pre[class*="language-"]': {
        background: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
        fontSize: "12px",
        lineHeight: "1.5",
        margin: 0,
        padding: "1em",
        overflow: "auto",
      },
      'code[class*="language-"]': {
        background: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
        fontSize: "12px",
        lineHeight: "1.5",
      },
      comment: { color: "#6a9955" },
      prolog: { color: "#6a9955" },
      doctype: { color: "#6a9955" },
      cdata: { color: "#6a9955" },
      punctuation: { color: "#d4d4d4" },
      property: { color: "#9cdcfe" },
      tag: { color: "#569cd6" },
      constant: { color: "#9cdcfe" },
      symbol: { color: "#9cdcfe" },
      deleted: { color: "#9cdcfe" },
      boolean: { color: "#569cd6" },
      number: { color: "#b5cea8" },
      selector: { color: "#d7ba7d" },
      "attr-name": { color: "#9cdcfe" },
      string: { color: "#ce9178" },
      char: { color: "#ce9178" },
      builtin: { color: "#ce9178" },
      inserted: { color: "#ce9178" },
      operator: { color: "#d4d4d4" },
      entity: { color: "#d4d4d4" },
      url: { color: "#d4d4d4" },
      variable: { color: "#9cdcfe" },
      atrule: { color: "#ce9178" },
      "attr-value": { color: "#ce9178" },
      function: { color: "#dcdcaa" },
      "class-name": { color: "#4ec9b0" },
      keyword: { color: "#569cd6" },
      regex: { color: "#d16969" },
      important: { color: "#569cd6" },
      bold: { fontWeight: "bold" },
      italic: { fontStyle: "italic" },
    },
  },
};

export interface CustomCodeBlockProps {
  code: string;
  language: string;
  theme?: keyof typeof themes;
  title?: string;
  className?: string;
  wrapLines?: boolean;
  maxHeight?: string;
}

export function CustomCodeBlock({
  code,
  language,
  theme = "default",
  title,
  className,
  wrapLines = true,
  maxHeight = "none",
}: CustomCodeBlockProps) {
  const [isDark, setIsDark] = useState(false);

  // Simple dark mode detection - in a real app you'd use your theme context
  React.useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const selectedTheme = themes[theme];
  const currentStyle = isDark ? selectedTheme.dark : selectedTheme.light;

  return (
    <div className={cn("relative h-full", className)}>
      {title && (
        <div className="bg-background text-foreground flex items-center px-4 py-2">
          <span className="text-sm font-medium">{title}</span>
        </div>
      )}

      <div className="bg-background/95 hide-scrollbars h-full overflow-hidden">
        <SyntaxHighlighter
          language={language}
          style={currentStyle}
          showLineNumbers={false}
          wrapLines={wrapLines}
          customStyle={{
            margin: 0,
            borderRadius: 0,
            ...(maxHeight !== "none" && { maxHeight }),
            overflowY: "auto",
            overflowX: "auto",
            fontSize: "0.75rem",
            lineHeight: "1.5",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            overflowWrap: "anywhere",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
