import type { StorybookConfig } from '@storybook/angular';

// =============================================================================
// Storybook — seis-app-frontend
// =============================================================================
// Un solo Storybook para TODO el workspace (shared-utils + los 4 MFEs + el
// portal), a propósito: el objetivo es ver los componentes de todos los
// proyectos lado a lado para detectar la deriva de estilos entre ellos
// (paletas duplicadas, radios/shadows hardcodeados, etc. — ver auditoría).
//
// El build en sí corre con el contexto de `seis-portal` (angular.json →
// target `storybook`/`build-storybook` → browserTarget `seis-portal:esbuild`),
// que es quien trae cargado `_tokens.scss` vía su `styles.scss` global. Por
// eso los componentes de otros proyectos SÍ renderizan con los tokens reales:
// las CSS custom properties son globales, no dependen de qué proyecto las citó.
// =============================================================================
const config: StorybookConfig = {
  stories: [
    '../projects/**/*.mdx',
    '../projects/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
};

export default config;
