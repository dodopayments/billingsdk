import { useEffect } from "react";
import { usePlayground } from "./playground-context";
import { componentRegistry } from "./component-registry";

export function usePlaygroundState() {
  const { state, setSelectedComponent } = usePlayground();

  // Auto-select first component on mount
  useEffect(() => {
    if (!state.selectedComponent && componentRegistry.length > 0) {
      setSelectedComponent(componentRegistry[0]);
    }
  }, [state.selectedComponent, setSelectedComponent]);

  return {
    state,
    setSelectedComponent,
    componentRegistry,
  };
}
