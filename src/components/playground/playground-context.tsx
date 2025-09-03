"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { ComponentConfig, PlaygroundState } from "./types";


function parseJSXProps(code: string): Record<string, any> {
  try {
    const jsxMatch = code.match(/<(\w+)([^>]*)>/);
    if (!jsxMatch) return {};

    const propsString = jsxMatch[2];
    const props: Record<string, any> = {};
    const propRegex = /(\w+)=({[^}]*}|"[^"]*"|'[^']*'|\w+)/g;
    let match;

    while ((match = propRegex.exec(propsString)) !== null) {
      const [, propName, propValue] = match;
      
      try {

        if (propValue.startsWith('{') && propValue.endsWith('}')) {

          const innerValue = propValue.slice(1, -1);
          if (innerValue.includes('=>') || innerValue.includes('function')) {

            props[propName] = () => console.log(`${propName} called`);
          } else if (innerValue.includes('{') && innerValue.includes('}')) {
            try {
              props[propName] = eval(`(${innerValue})`);
            } catch {
              props[propName] = {};
            }
          } else {

            try {
              props[propName] = eval(innerValue);
            } catch {
              props[propName] = innerValue;
            }
          }
        } else if (propValue.startsWith('"') || propValue.startsWith("'")) {
          props[propName] = propValue.slice(1, -1);
        } else {
          if (propValue === 'true') props[propName] = true;
          else if (propValue === 'false') props[propName] = false;
          else if (!isNaN(Number(propValue))) props[propName] = Number(propValue);
          else props[propName] = propValue;
        }
      } catch {
        props[propName] = propValue;
      }
    }

    return props;
  } catch (error) {
    console.warn("Error parsing JSX props:", error);
    return {};
  }
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
    setState((prev: PlaygroundState) => ({ ...prev, code }));
    

    try {
      const props = parseJSXProps(code);
      if (props && Object.keys(props).length > 0) {
        setState((prev: PlaygroundState) => ({ 
          ...prev, 
          code,
          props: { ...prev.props, ...props }
        }));
      }
    } catch (error) {

      console.warn("Failed to parse JSX props:", error);
    }
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
