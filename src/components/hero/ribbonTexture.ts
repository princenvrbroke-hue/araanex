import * as THREE from 'three';

let cachedRibbonTexture: THREE.CanvasTexture | null = null;

/**
 * Procedural woven fabric ribbon texture: dark navy base, diagonal micro-weave,
 * glowing electric blue edges. Shared by the hero 3D ribbon layer.
 */
export function createRibbonTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  if (cachedRibbonTexture) return cachedRibbonTexture;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Dark navy base
  ctx.fillStyle = '#0a1630';
  ctx.fillRect(0, 0, 1024, 256);

  // High-tech fine wireframe weave grid
  ctx.strokeStyle = 'rgba(90, 169, 255, 0.35)';
  ctx.lineWidth = 1.2;
  for (let x = -256; x < 1280; x += 16) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 100, 256);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, 256);
    ctx.lineTo(x + 100, 0);
    ctx.stroke();
  }

  // Horizontal woven micro-filaments
  ctx.strokeStyle = 'rgba(140, 196, 255, 0.2)';
  ctx.lineWidth = 1;
  for (let y = 0; y < 256; y += 8) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // Electric cyan-blue glowing top edge
  const gradTop = ctx.createLinearGradient(0, 0, 0, 52);
  gradTop.addColorStop(0, 'rgba(74, 144, 255, 0.98)');
  gradTop.addColorStop(0.3, 'rgba(90, 169, 255, 0.7)');
  gradTop.addColorStop(1, 'rgba(10, 22, 48, 0)');
  ctx.fillStyle = gradTop;
  ctx.fillRect(0, 0, 1024, 52);

  // Electric cyan-blue glowing bottom edge
  const gradBottom = ctx.createLinearGradient(0, 204, 0, 256);
  gradBottom.addColorStop(0, 'rgba(10, 22, 48, 0)');
  gradBottom.addColorStop(0.7, 'rgba(90, 169, 255, 0.7)');
  gradBottom.addColorStop(1, 'rgba(74, 144, 255, 0.98)');
  ctx.fillStyle = gradBottom;
  ctx.fillRect(0, 204, 1024, 52);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.repeat.set(3, 1);
  cachedRibbonTexture = tex;
  return tex;
}
