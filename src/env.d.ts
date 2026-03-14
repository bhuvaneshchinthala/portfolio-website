/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly BASE_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
