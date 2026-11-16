import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ARAANEX — Biodesign Wearables',
    short_name: 'ARAANEX',
    description:
      'Anatomy-mapped smart clothing: biomechanical textile engineering and sensing fabrics.',
    start_url: '/',
    display: 'standalone',
    background_color: '#05080f',
    theme_color: '#05080f',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
