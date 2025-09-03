"use client";

import { useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { css } from "@codemirror/lang-css";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

interface CodeMirrorEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language: string;
  height?: string | number;
  readOnly?: boolean;
}

export function CodeMirrorEditor({
  value,
  onChange,
  language,
  height = "100%",
  readOnly = false,
}: CodeMirrorEditorProps) {

  const extensions = useMemo(() => {
    const exts = [];
    
    if (language === "tsx" || language === "typescript" || language === "javascript") {
      exts.push(javascript({ jsx: true, typescript: language === "tsx" || language === "typescript" }));
    } else if (language === "css") {
      exts.push(css());
    }
    
    return exts;
  }, [language]);

  const theme = useMemo(() => {
    return vscodeDark;
  }, []);

  return (
    <div style={{ height, width: "100%" }}>
      <CodeMirror
        value={value}
        onChange={onChange || (() => {})}
        extensions={extensions}
        theme={theme}
        readOnly={readOnly}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          dropCursor: false,
          allowMultipleSelections: false,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          highlightSelectionMatches: false,
          searchKeymap: true,
        }}
        style={{
          fontSize: "14px",
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace",
          lineHeight: "1.6",
        }}
      />
    </div>
  );
}
