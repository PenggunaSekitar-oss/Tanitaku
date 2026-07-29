const runtimeEnv = (import.meta as ImportMeta & {
  env?: Record<string, string | undefined>;
}).env;

export const IS_DEMO_MODE = runtimeEnv?.VITE_DEMO_MODE === 'true';
