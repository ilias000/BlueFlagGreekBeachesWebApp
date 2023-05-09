interface ImportMetaEnv {
  VITE_DEBUG: string;
  VITE_CUSTOM_MAP_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}