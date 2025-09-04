export interface ComponentConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  defaultCode: string;
  defaultProps: Record<string, any>;
  component: React.ComponentType<any>;
  imports: string[];
}

export interface PlaygroundState {
  selectedComponent: ComponentConfig | null;
  code: string;
  props: Record<string, any>;
  styles: string;
}

export interface PropField {
  name: string;
  type: "string" | "number" | "boolean" | "select" | "color" | "textarea";
  label: string;
  description?: string;
  defaultValue?: any;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
}
