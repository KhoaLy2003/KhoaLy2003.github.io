import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import preact from '@astrojs/preact';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://khoaly2003.github.io',
  integrations: [tailwind(), preact(), mdx(), icon()],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
  vite: {
    optimizeDeps: {
      esbuildOptions: {
        plugins: [
          {
            name: 'astro-preact-opts-shim',
            setup(build) {
              build.onResolve({ filter: /^astro:preact:opts$/ }, () => ({
                path: 'astro:preact:opts',
                namespace: 'astro-preact-opts',
              }));
              build.onLoad({ filter: /.*/, namespace: 'astro-preact-opts' }, () => ({
                contents: 'export default { include: undefined, exclude: undefined };',
                loader: 'js',
              }));
            },
          },
        ],
      },
    },
  },
});
