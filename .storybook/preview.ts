import type { Preview } from '@storybook/angular';

// `data-theme="dark"` en <html> — mismo mecanismo que ThemeService.setDataTheme(),
// necesario para que los tokens semánticos (--color-*) de _tokens.scss resuelvan
// (están definidos bajo `[data-theme="dark"]` / `[data-theme="light"]`, ver
// shared-utils/src/lib/styles/_tokens.scss).
document.documentElement.setAttribute('data-theme', 'dark');

// Fondo real de <body> — el parámetro `backgrounds` de abajo depende del
// addon "backgrounds" (no instalado, ver .storybook/main.ts `addons: []`),
// así que sin esto cada historia queda sobre blanco por defecto y los
// componentes (pensados para el fondo navy de la app) se ven mal/invisibles
// (texto/bordes blancos sobre blanco). Se inyecta acá una sola vez en vez de
// repetir un wrapper con background inline en cada .stories.ts.
const style = document.createElement('style');
style.textContent = `
  body {
    background: var(--color-bg-base, #0D1655) !important;
    color: var(--color-text-primary, #fff);
  }
`;
document.head.appendChild(style);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'factor-dark',
      values: [{ name: 'factor-dark', value: '#0D1655' }],
    },
  },
};

export default preview;
