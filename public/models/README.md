# ARANEX 3D Asset Guidelines & Drop-In Instructions

This directory (`/public/models/`) is configured for dropping in real, high-fidelity 3D assets to replace the default procedural geometries.

## Asset Structure
Place your `.glb` files directly in this directory:

- `/public/models/hero-garment.glb` — Replaces the procedural hero knitted garment silhouette
- `/public/models/timeline/` — Replaces the 5 historical silhouettes:
  - `armour-1420.glb`
  - `wrap-1740.glb`
  - `coat-1854.glb`
  - `suit-1905.glb`
  - `tennis-1926.glb`
- `/public/models/mannequin.glb` — Replaces the occupational morphing mannequin
- `/public/models/polo-evolution.glb` — Morph-target enabled model with blendshapes for `year1920` to `modern`
- `/public/models/human-anatomy.glb` — Translucent X-ray anatomical body with named vertex groups
- `/public/models/aranex-exploded.glb` — Exploded-view garment with 4 distinct sub-meshes: `Layer_Outer`, `Layer_Cushioning`, `Layer_Compression`, `Layer_Moisture`
- `/public/models/conductive-jacket.glb` — Garment with UV-mapped conductive fiber channel curves

## Recommended Optimization Specs
To ensure 60fps across mid-range laptops and mobile devices:

1. **Format**: Binary glTF (`.glb`)
2. **Mesh Compression**: Draco or Meshopt compression
   ```bash
   npx gltf-pipeline -i model.glb -o model-draco.glb -d
   ```
3. **Texture Compression**: KTX2 / Basis Universal
   ```bash
   toktx --bcmp --genmipmap model_diffuse.ktx2 model_diffuse.png
   ```
4. **Target Budget**:
   - Total scene geometry: < 50,000 polygons
   - Draw calls per section: < 20 draw calls
   - Textures: 1024x1024 or 2048x2048 PBR maps (Roughness/Metalness/Normal)

## How It Works
The `ModelOrPlaceholder` component in `src/scenes/ModelOrPlaceholder.tsx` automatically detects whether a file exists at the specified path. If detected, it streams and renders the real GLB model. If not, it falls back seamlessly to the procedural mathematical shaders and Three.js primitives without errors.
