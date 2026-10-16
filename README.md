# ARANEX — Biomechanical Wearable Architecture

> *"Clothing Evolved to Protect Us. Science Will Empower It to Do More."*

ARANEX is a scroll-driven, 3D, story-led interactive documentary and future-tech product reveal for an advanced biomechanical wearables brand. It replaces conventional fashion e-commerce tropes with scientific inquiry, anatomical stress mapping, and interactive 3D simulations.

---

## 🔬 Story Arc Architecture

1. **Hero**: The Knitted Filament — A single thread of light weaves in 3D, assembling into a garment matrix reacting to cursor physics.
2. **01 The Origin**: *Before Fashion, There Was Function* — Horizontal 3D timeline of 5 historical silhouettes (1420 Armour, 1740 Wrap, 1854 Greatcoat, 1905 Savile Row, 1926 Tennis Whites) lit in warm amber with floating purpose labels.
3. **02 Clothing & Performance**: *Different Roles. Different Demands.* — 4 selectable archetypes (Field Operator, Desk Analyst, Industrial Specialist, Endurance Performer) morphing a central 3D mannequin with thermal and shear stress overlays.
4. **03 The Polo Shirt**: *When Performance Changed Fashion* — Interactive 3D before/after slider comparing René Lacoste's 1920s liberation of movement against starched tennis dress.
5. **04 The Science of What We Wear**: *Your Body Is Not Uniform.* — Translucent X-ray human body with interactive clickable anatomical zones (Foot, Knee, Back, Shoulder, Torso), laminar airflow/sweat particle flows, and an instant "Uniform Garment" vs "Anatomically Engineered" thermal contrast toggle.
6. **05 The ARANEX Approach**: *Engineered Around Anatomy.* — 3D exploded view product reveal scrubbing along the Z-axis with scroll. 4 functional layers (Outer Matrix, Cushioning, Compression, Moisture Channels) with educational material callouts.
7. **06 Beyond Comfort**: *Can Better Clothing Contribute to Better Health?* — Interactive problem selector (Friction, Pressure, Heat, Movement) with dynamic stress vectors, ARANEX design principles, and a drawer displaying peer-reviewed scientific citations.
8. **07 The Future**: *What If Your Clothing Could Understand Your Body?* — Conductive yarn matrix lighting up fiber by fiber with traveling data pulses and a minimalist holographic HUD displaying real-time skin temperature, strain, respiration, and impedance.
9. **08 Our Vision**: *The Next Evolution of Clothing Starts with Science.* — 3D constellation of research nodes (Biomaterials, 3D Knitting, Biometric Roadmap, Clinical Partners) and quiet research dispatch registration.

---

## ✨ The 7 Surprise Moments

Every surprise moment specified in the design brief has been fully implemented:

1. **Cursor Light Thread**: A luminous fiber trail follows cursor velocity, weaving organic loops with soft cyan bloom and dissolving gradually.
2. **Triple-Click Easter Egg**: Clicking the ARANEX logo mark 3 times declassifies the topological kinematic wireframe of the garment in an interactive 3D modal.
3. **Scroll-Speed Kinetic Ripple**: Scrolling fast deforms and stretches the fabric mesh along its kinetic vectors; when scroll stops, harmonic oscillation settles the fibers.
4. **Dynamic Time-of-Day Lighting**: The 3D scene lighting automatically detects the visitor's local hour (Dawn, Day, Dusk, Midnight) with an interactive override previewer in the navigation.
5. **"Feel the Fabric" Tactile Swatch**: Holding the mouse down or touching the swatch for 1.5 seconds zooms into a 400x macro 3D textile weave where individual micro-filaments separate into capillary, elastomeric, and conductive layers.
6. **Footer Exhale**: Reaching the footer triggers a biological "exhalation" cycle where the entire scene's fabric gently breathes with a synchronized resting state pulse.
7. **Procedural Web Audio Engine**: Audio toggle (muted by default) running zero-latency Web Audio oscillators and filtered noise buffers producing soft textile swishes, resonant archetypal hums, and data pulse chimes without external MP3 dependencies.

---

## 🛡️ Scientific & Content Guardrails

In strict adherence to medical communication ethics:
- Every section displays its visual evidence badge:
  - `Established science` (Empirically validated biomechanics & thermoregulation)
  - `ARANEX design intent` (Targeted kinematic architectural benefits)
  - `Future vision` (Laboratory research direction; not a current product)
- Wording consistently employs "designed to", "aims to", and "may help".
- Clear medical disclaimers confirm that ARANEX technologies do not diagnose, treat, or prevent clinical diseases.

---

## 🛠️ Tech Stack & Implementation Details

- **Framework**: Next.js 16 (App Router) + TypeScript + React 19
- **3D Engine**: React Three Fiber (`@react-three/fiber`), `@react-three/drei`, Three.js
- **Animation & Motion**: GSAP ScrollTrigger + Lenis smooth scroll + Framer Motion
- **Styling**: Tailwind CSS v4, custom CSS variables, and bespoke GLSL shaders
- **Typography**: Editorial serif (*Newsreader*), clean grotesk (*Geist Sans*), technical mono (*Geist Mono*)
- **Sound**: Procedural Web Audio API synthesizer (`src/lib/soundEngine.ts`)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 3. Production Build & Verification
```bash
npm run build
npm run start
```

---

## 📦 Swapping in Real 3D Models & Product Data

The codebase is engineered with clean separation of concerns:

1. **Content & Copy**: Edit `src/content/aranexData.ts` to update narratives, archetype statistics, anatomical zones, or citation DOIs.
2. **Real 3D GLB Models**: Place compressed `.glb` files into `/public/models/` following the guide in [`public/models/README.md`](./public/models/README.md).
3. **Drop-in Logic**: The `ModelOrPlaceholder` component (`src/scenes/ModelOrPlaceholder.tsx`) will automatically render your GLTF models with Draco decompression while maintaining the fallback shaders.
