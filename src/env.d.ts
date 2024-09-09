interface ImportMetaEnv {
  readonly VITE_WS_SERVER: string;
  readonly VITE_WS_PORT: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
