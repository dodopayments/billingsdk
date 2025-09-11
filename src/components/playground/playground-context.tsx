"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { ComponentConfig, PlaygroundState } from "./types";


function parseJSXProps(code: string): Record<string, any> {
  try {
    const jsxMatch = code.match(/<(\w+)([^>]*?)(?:\/?>|>[\s\S]*?<\/\1>)/s);
    if (!jsxMatch) return {};

    const propsString = jsxMatch[2];
    const props: Record<string, any> = {};
    
    let currentIndex = 0;
    while (currentIndex < propsString.length) {
      const propMatch = propsString.slice(currentIndex).match(/^\s*(\w+)=/);
      if (!propMatch) break;
      
      const propName = propMatch[1];
      currentIndex += propMatch[0].length;
      
      if (currentIndex >= propsString.length) break;
      
      const nextChar = propsString[currentIndex];
      let propValue: any;
      
      if (nextChar === '{') {
        let braceCount = 0;
        let valueStart = currentIndex + 1;
        let valueEnd = valueStart;
        
        for (let i = currentIndex; i < propsString.length; i++) {
          if (propsString[i] === '{') braceCount++;
          else if (propsString[i] === '}') {
            braceCount--;
            if (braceCount === 0) {
              valueEnd = i;
              currentIndex = i + 1;
              break;
            }
          }
        }
        
        let innerValue = propsString.slice(valueStart, valueEnd).trim();
        // Normalize trailing commas that would break JSON.parse for objects/arrays
        innerValue = innerValue
          .replace(/,\s*([}\]])/g, '$1')
          .replace(/([\{\[])(\s*),/g, '$1');
        
        try {
          if (innerValue.includes('=>') || innerValue.includes('function')) {
            props[propName] = () => console.log(`${propName} called`);
          } else if (innerValue === '' || innerValue === '{}') {
            props[propName] = {};
          } else if (innerValue === '[]') {
            props[propName] = [];
          } else {
            const sanitizedValue = innerValue
              .replace(/(\w+):/g, '"$1":')
              .replace(/'/g, '"')
              .replace(/undefined/g, 'null')
              .replace(/\s+/g, ' ')
              .trim();
            
            try {
              props[propName] = JSON.parse(sanitizedValue);
            } catch {
              // Fallback to evaluating as an expression (arrays/objects/functions)
              const safeEval = new Function('return (' + innerValue + ')');
              props[propName] = safeEval();
            }
          }
        } catch {
          props[propName] = innerValue;
        }
      } else if (nextChar === '"' || nextChar === "'") {
        const quote = nextChar;
        let valueStart = currentIndex + 1;
        let valueEnd = propsString.indexOf(quote, valueStart);
        
        if (valueEnd === -1) valueEnd = propsString.length;
        
        propValue = propsString.slice(valueStart, valueEnd);
        currentIndex = valueEnd + 1;
        
        if (propValue === 'true') props[propName] = true;
        else if (propValue === 'false') props[propName] = false;
        else if (!isNaN(Number(propValue))) props[propName] = Number(propValue);
        else props[propName] = propValue;
      } else {
        const nextSpace = propsString.indexOf(' ', currentIndex);
        const nextProp = propsString.indexOf('=', currentIndex + 1);
        let valueEnd = nextSpace !== -1 ? Math.min(nextSpace, nextProp !== -1 ? nextProp : Infinity) : nextProp;
        
        if (valueEnd === -1 || valueEnd === Infinity) valueEnd = propsString.length;
        
        propValue = propsString.slice(currentIndex, valueEnd).trim();
        currentIndex = valueEnd;
        
        if (propValue === 'true') props[propName] = true;
        else if (propValue === 'false') props[propName] = false;
        else if (!isNaN(Number(propValue))) props[propName] = Number(propValue);
        else props[propName] = propValue;
      }
    }

    return props;
  } catch (error) {
    console.warn("Error parsing JSX props:", error);
    return {};
  }
}

function deepMerge<T>(base: T, override: any): T {
  if (Array.isArray(base)) {
    // If override is an array, use it; otherwise keep base array
    return (Array.isArray(override) ? override : base) as unknown as T;
  }
  if (typeof base === "object" && base !== null) {
    const result: any = { ...base };
    if (override && typeof override === "object") {
      for (const key of Object.keys(override)) {
        const baseVal = (base as any)[key];
        const overrideVal = override[key];
        if (
          baseVal !== undefined &&
          baseVal !== null &&
          typeof baseVal === "object" &&
          !Array.isArray(baseVal)
        ) {
          result[key] = deepMerge(baseVal, overrideVal);
        } else {
          result[key] = overrideVal;
        }
      }
    }
    return result as T;
  }
  // Primitive base; prefer override if provided, else base
  return (override !== undefined ? override : base) as T;
}

interface PlaygroundContextType {
  state: PlaygroundState;
  setSelectedComponent: (component: ComponentConfig) => void;
  updateCode: (code: string) => void;
  updateProps: (props: Record<string, any>) => void;
  resetToDefault: () => void;
  exportCode: () => string;
  copyCode: () => Promise<void>;
  updateStyles: (styles: string) => void;
}

const PlaygroundContext = createContext<PlaygroundContextType | undefined>(undefined);

export function PlaygroundProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PlaygroundState>({
    selectedComponent: null,
    code: "",
    props: {},
    styles: `/* Component styles */
.component-container {
  /* Add your custom styles here */
}`,
  });

  const setSelectedComponent = useCallback((component: ComponentConfig) => {
    setState((prev: PlaygroundState) => ({
      ...prev,
      selectedComponent: component,
      code: component.defaultCode,
      props: component.defaultProps || {},
    }));
  }, []);

  const updateCode = useCallback((code: string) => {
    setState((prev: PlaygroundState) => {
      try {
        const parsedProps = parseJSXProps(code);
        
        // If parsing fails or returns empty, keep existing props but update code
        if (!parsedProps || Object.keys(parsedProps).length === 0) {
          return { ...prev, code };
        }

        // Start from the component defaults, then deep-merge parsed overrides
        const baseDefaults = prev.selectedComponent?.defaultProps || {};
        const merged = deepMerge(baseDefaults, parsedProps);
        return {
          ...prev,
          code,
          props: merged,
        };
      } catch (error) {
        console.warn("Failed to parse JSX props:", error);
        return { ...prev, code };
      }
    });
  }, []);

  const updateProps = useCallback((props: Record<string, any>) => {

    const filteredProps = Object.fromEntries(
      Object.entries(props).filter(([_, value]) => value !== undefined)
    );
    setState((prev: PlaygroundState) => ({ ...prev, props: { ...prev.props, ...filteredProps } }));
  }, []);

  const resetToDefault = useCallback(() => {
    if (state.selectedComponent) {
      const component = state.selectedComponent;
      setState((prev: PlaygroundState) => ({
        ...prev,
        code: component.defaultCode,
        props: component.defaultProps || {},
      }));
    }
  }, [state.selectedComponent]);

  const exportCode = useCallback(() => {
    return state.code;
  }, [state.code]);

  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(state.code);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  }, [state.code]);

  const updateStyles = useCallback((styles: string) => {
    setState((prev: PlaygroundState) => ({ ...prev, styles }));
  }, []);



  const value: PlaygroundContextType = {
    state,
    setSelectedComponent,
    updateCode,
    updateProps,
    resetToDefault,
    exportCode,
    copyCode,
    updateStyles,
  };

  return (
    <PlaygroundContext.Provider value={value}>
      {children}
    </PlaygroundContext.Provider>
  );
}

export function usePlayground() {
  const context = useContext(PlaygroundContext);
  if (!context) {
    throw new Error("usePlayground must be used within PlaygroundProvider");
  }
  return context;
}
