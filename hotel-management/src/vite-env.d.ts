/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // các biến môi trường khác...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
