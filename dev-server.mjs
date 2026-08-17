import { dev } from 'astro';

const server = await dev({
  root: '.',
  server: {
    port: 4322,
    host: '127.0.0.1'
  }
});

console.log('ASTRO_DEV_SERVER_READY on http://127.0.0.1:4322');
