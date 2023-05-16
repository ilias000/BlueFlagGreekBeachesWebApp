interface ImportMetaEnv {
  VITE_DEBUG: string;
  VITE_CUSTOM_MAP_ID: string;
  VITE_HIDDEN_MAP: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}