"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { decodePreset, encodePreset, generateRandomPreset } from "shadcn/preset";

import {
  INFERENCE_DEFAULT_PRESET,
  type InferencePresetConfig,
  type InferencePresetField,
} from "@/app/inference/_lib/preset-config";
import {
  resolveInferenceThemeVars,
  varsToStyle,
} from "@/app/inference/_lib/resolve-theme";

const STORAGE_KEY = "inference:preset-config";

interface InferenceThemeContextValue {
  config: InferencePresetConfig;
  presetCode: string;
  createUrl: string;
  applyCommand: string;
  themeStyle: ReturnType<typeof varsToStyle>;
  setField: <K extends InferencePresetField>(
    field: K,
    value: InferencePresetConfig[K],
  ) => void;
  shuffle: () => void;
  reset: () => void;
}

const InferenceThemeContext =
  createContext<InferenceThemeContextValue | null>(null);

function loadStoredConfig(): InferencePresetConfig {
  if (typeof window === "undefined") {
    return INFERENCE_DEFAULT_PRESET;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return INFERENCE_DEFAULT_PRESET;
    }
    return { ...INFERENCE_DEFAULT_PRESET, ...JSON.parse(raw) };
  } catch {
    return INFERENCE_DEFAULT_PRESET;
  }
}

export function InferenceThemeProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<InferencePresetConfig>(
    INFERENCE_DEFAULT_PRESET,
  );

  useEffect(() => {
    setConfig(loadStoredConfig());
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  const setField = useCallback(
    <K extends InferencePresetField>(
      field: K,
      value: InferencePresetConfig[K],
    ) => {
      setConfig((current) => {
        const next = { ...current, [field]: value };

        if (field === "theme") {
          next.chartColor = value as InferencePresetConfig["chartColor"];
        }

        return next;
      });
    },
    [],
  );

  const shuffle = useCallback(() => {
    const code = generateRandomPreset();
    const decoded = decodePreset(code);
    if (decoded) {
      setConfig(decoded);
    }
  }, []);

  const reset = useCallback(() => {
    setConfig(INFERENCE_DEFAULT_PRESET);
  }, []);

  const presetCode = useMemo(() => encodePreset(config), [config]);
  const createUrl = useMemo(
    () => `https://ui.shadcn.com/create?preset=${presetCode}`,
    [presetCode],
  );
  const applyCommand = useMemo(
    () => `pnpm dlx shadcn@latest apply --preset ${presetCode} -y`,
    [presetCode],
  );
  const themeStyle = useMemo(
    () => varsToStyle(resolveInferenceThemeVars(config)),
    [config],
  );

  const value = useMemo(
    () => ({
      applyCommand,
      config,
      createUrl,
      presetCode,
      reset,
      setField,
      shuffle,
      themeStyle,
    }),
    [
      applyCommand,
      config,
      createUrl,
      presetCode,
      reset,
      setField,
      shuffle,
      themeStyle,
    ],
  );

  return (
    <InferenceThemeContext.Provider value={value}>
      {children}
    </InferenceThemeContext.Provider>
  );
}

export function useInferenceTheme() {
  const context = useContext(InferenceThemeContext);
  if (!context) {
    throw new Error(
      "useInferenceTheme must be used within InferenceThemeProvider",
    );
  }
  return context;
}
