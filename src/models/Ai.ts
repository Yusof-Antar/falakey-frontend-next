'use client';
export interface AIParameterBase {
  key: string;
  path: string;
  type: "integer" | "select" | "string" | "boolean";
  default: any; // Will be refined per subtype
  label: string;
  description: string;
  config?: Record<string, any>;
  disabled?: {
    when: string;
    operation: "equals" | "not_in" | "in";
    value: string | string[];
  };
  visible?: {
    when: string;
    operation: "equals" | "not_in" | "in";
    value: string | string[];
  };
}

export interface AIParameterSelect extends AIParameterBase {
  type: "select";
  default: string; // Since all option values are strings
  options: {
    label: string;
    value: string;
    icon: string;
  }[];
}

export interface AIParameterInteger extends AIParameterBase {
  type: "integer";
  default: number;
  config: {
    min: number;
    max: number;
  };
}

// Discriminated union — TypeScript will know which type based on `type` field
export type AIParameter =
  | AIParameterInteger
  | AIParameterSelect
  // You can add more as needed: AIParameterString, AIParameterBoolean, etc.
  | (AIParameterBase & { type: "string" | "boolean" });

export interface AIModel {
  id: string;
  name: string;
  description: string;
  parameters: AIParameter[];
}

export interface AIProvider {
  [modelId: string]: AIModel;
}

export interface AIConfig {
  [category: string]: {
    [providerId: string]: AIProvider;
  };
}
