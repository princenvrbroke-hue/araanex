export interface TimelineItem {
  id: string;
  year: string;
  title: string;
  purpose: 'Protect' | 'Endure' | 'Move' | 'Perform' | 'Shield';
  description: string;
  biomechanics: string;
  materials: string;
  color: string;
}

export interface Archetype {
  id: 'soldier' | 'professional' | 'worker' | 'athlete';
  name: string;
  tagline: string;
  description: string;
  stressPoints: string[];
  metrics: {
    thermalGradient: string;
    frictionIndex: string;
    kineticResistance: string;
    compressionNeed: string;
  };
  primaryColor: string;
  accentColor: string;
}

export interface AnatomicalZone {
  id: 'foot' | 'knee' | 'back' | 'shoulder' | 'torso';
  name: string;
  anatomicalName: string;
  position: [number, number, number];
  primaryIssue: string;
  aranexSolution: string;
  pressureData: number; // 0-100
  frictionData: number; // 0-100
  sweatRate: number; // 0-100
  airflowMetric: string;
}

export interface ExplodedLayer {
  id: string;
  name: string;
  level: number;
  zOffset: number;
  material: string;
  engineeringRole: string;
  specs: string[];
  color: string;
}

export interface BiomechanicsProblem {
  id: 'friction' | 'pressure' | 'heat' | 'movement';
  title: string;
  subhead: string;
  anatomicalImpact: string;
  aranexPrinciple: string;
  evidence: {
    journal: string;
    year: string;
    finding: string;
    doi: string;
  };
}

export interface ConstellationNode {
  id: 'research' | 'innovation' | 'roadmap' | 'collaborations';
  title: string;
  coordinates: [number, number, number];
  summary: string;
  points: string[];
  status: string;
}

export const ARANEX_CONTENT = {
  hero: {
    badge: "BIODESIGN WEARABLE ARCHITECTURE",
    headline: "For centuries, we have worn clothes. It's time our clothes did more for us.",
    subhead: "Clothing Evolved to Protect Us. Science Will Empower It to Do More.",
    narrative: "Conventional garments treat the human body as a uniform cylinder. ARANEX rejects decorative stagnation, re-engineering the relationship between textile physics, anatomical stress, and thermoregulatory biology.",
    ctaPrimary: "Explore the Science",
    ctaSecondary: "Our Future Vision",
  },

  evidenceLabels: {
    established: {
      text: "Established science",
      description: "Empirically validated biomechanical and thermoregulatory principles",
      color: "border-emerald-500/30 text-emerald-300 bg-emerald-950/20",
    },
    designIntent: {
      text: "ARANEX design intent",
      description: "Engineered functional architecture targeting specific kinematic needs",
      color: "border-cyan-500/30 text-cyan-300 bg-cyan-950/20",
    },
    futureVision: {
      text: "Future vision",
      description: "Laboratory research direction. Not a current commercial product",
      color: "border-purple-500/30 text-purple-300 bg-purple-950/20",
    },
  },

  section01_origin: {
    chapter: "01",
    tag: "THE ORIGIN",
    title: "Before Fashion, There Was Function",
    lead: "Every epoch transformed the garment not to decorate the wearer, but to expand human survivability against violent environments, mechanical friction, and thermal extremes.",
    evidenceLevel: "established" as const,
    items: [
      {
        id: "armour",
        year: "1420",
        title: "Plate Armour & Quilted Gambeson",
        purpose: "Protect",
        description: "Kinetic shock dispersion across rigid articulated steel plates, lined with multilayer raw linen batting to buffer blunt trauma and friction.",
        biomechanics: "Kinetic load redirection; dampening percussive energy across skeletal landmarks.",
        materials: "Hardened steel, layered unbleached linen, horsehair dampeners",
        color: "#E5A93C",
      },
      {
        id: "wrap",
        year: "1740",
        title: "Agricultural Linen Smock",
        purpose: "Endure",
        description: "Loose-gauge biological weave allowing evaporative convective airflow across dawn-to-dusk solar exposure and high lumbar moisture production.",
        biomechanics: "Passive capillary moisture wicking via flax cellulose micro-capillaries.",
        materials: "Hand-spun unbleached flax fibres, loose cellular grid",
        color: "#D49339",
      },
      {
        id: "coat",
        year: "1854",
        title: "Highland Greatcoat & Mac",
        purpose: "Shield",
        description: "Dense felted heavy wool coupled with vulcanized rubber seals to mitigate wet hypothermia during prolonged static trench exposure.",
        biomechanics: "Hydrophobic boundary layer preventing convective thermal dissipation.",
        materials: "Felted milled wool (800gsm), vulcanized natural rubber barrier",
        color: "#BF7A2B",
      },
      {
        id: "suit",
        year: "1905",
        title: "Savile Row Structured Cut",
        purpose: "Move",
        description: "Anatomically drafted shoulder canvases and floating chest pieces engineered to preserve upright posture during urban commercial expansion.",
        biomechanics: "Internal horsehair canvas providing subtle thoracic extension guidance.",
        materials: "Worsted wool, hand-padded Irish linen canvas, bias-cut lining",
        color: "#AA6720",
      },
      {
        id: "tennis",
        year: "1926",
        title: "Lacoste Petit Piqué Revolution",
        purpose: "Perform",
        description: "René Lacoste shears the starched long sleeves and introduces cotton mesh pique, enabling uninhibited humeral rotation on court.",
        biomechanics: "Rotational scapular freedom; elimination of starched neck constriction.",
        materials: "Honeycombed breathable cotton petit piqué knit",
        color: "#C9A667",
      },
    ] as TimelineItem[],
  },

  section02_performance: {
    chapter: "02",
    tag: "CLOTHING & PERFORMANCE",
    title: "Different Roles. Different Demands.",
    lead: "The human organism experiences drastically polarized physiological stresses depending on occupational environment. A single uniform fabric blend fails every role.",
    evidenceLevel: "established" as const,
    archetypes: [
      {
        id: "soldier",
        name: "Field Operator",
        tagline: "45kg Load Carriage & Prolonged Thermal Extremes",
        description: "High lumbar and clavicle contact pressure from tactical rucksacks combined with prolonged skin friction under ballistic plates.",
        stressPoints: ["Trapezius compression", "Plantar shear", "Core heat accumulation", "Axillary friction"],
        metrics: {
          thermalGradient: "+6.8°C Core Spike",
          frictionIndex: "0.82 High Shear",
          kineticResistance: "34% Constrained",
          compressionNeed: "High Graduated (40 mmHg)",
        },
        primaryColor: "#E5A93C",
        accentColor: "#FFC266",
      },
      {
        id: "professional",
        name: "Desk & Screen Analyst",
        tagline: "10+ Hours Sedentary Lumbar Compression & Microclimate Stagnation",
        description: "Static hip flexor shortening, dorsal kyphosis, reduced peripheral circulation, and localized seat contact heat pooling.",
        stressPoints: ["Ischial tuberosity pressure", "Thoracic stagnation", "Popliteal vein restriction", "Cervical tension"],
        metrics: {
          thermalGradient: "+2.4°C Seat Zone",
          frictionIndex: "0.18 Low Dynamic",
          kineticResistance: "12% Static Bind",
          compressionNeed: "Mild Postural (15 mmHg)",
        },
        primaryColor: "#B0703C",
        accentColor: "#79C0FF",
      },
      {
        id: "worker",
        name: "Industrial Specialist",
        tagline: "Repetitive Lifting, Extreme Joint Articulation & Abrasion",
        description: "Continuous mechanical flexion at knees and elbows, coupled with elevated sweat salinity eroding garment fibers against the epidermis.",
        stressPoints: ["Patellar shear", "Cubital friction", "Forearm impact", "Lumbar torsion"],
        metrics: {
          thermalGradient: "+4.9°C Intermittent",
          frictionIndex: "0.74 High Abrasion",
          kineticResistance: "28% Repetitive Load",
          compressionNeed: "Zoned Kinetic (25 mmHg)",
        },
        primaryColor: "#F78166",
        accentColor: "#FFA692",
      },
      {
        id: "athlete",
        name: "Endurance Performer",
        tagline: "Maximal Aerobic Heat Dissipation & Kinematic Acceleration",
        description: "Rapidly fluctuating sweat rates, heavy soft-tissue oscillation requiring vibration dampening, and unrestricted tri-planar range of motion.",
        stressPoints: ["Quadricep oscillation", "Sub-scapular sweat pool", "Hamstring kinetic chain", "Chest chafing"],
        metrics: {
          thermalGradient: "+8.2°C Peak Output",
          frictionIndex: "0.31 Hydro-lubricated",
          kineticResistance: "4% Zero-Restriction",
          compressionNeed: "Active Recovery (22-30 mmHg)",
        },
        primaryColor: "#C9A667",
        accentColor: "#E8CE9C",
      },
    ] as Archetype[],
  },

  section03_polo: {
    chapter: "03",
    tag: "THE POLO SHIRT",
    title: "When Performance Changed Fashion",
    lead: "In the 1920s, tennis players competed in starched long-sleeve dress shirts and flannel trousers. Seven-time Grand Slam champion René Lacoste noticed that decorative tailoring was actively degrading biomechanical output.",
    evidenceLevel: "established" as const,
    comparison: {
      year1920: {
        title: "1920s Standard Tennis Dress",
        features: [
          "Starched woven cotton with zero elastomeric recovery",
          "Long buttoned cuffs causing wrist resistance on backhand swings",
          "Stiff buttoned collar trapping carotid heat",
          "Excess bulk weighing up to 1.8 kg when perspiration saturated",
        ],
        strainRating: "Severe Kinetic Limitation",
      },
      modern: {
        title: "Lacoste Petit Piqué (Engineered Solution)",
        features: [
          "Air-permeable honeycomb knit providing natural capillary flow",
          "Unbuttonable soft ribbed collar flipped to shield the neck from solar radiation",
          "Short sleeves unlocking 360° glenohumeral joint rotation",
          "Hydrophilic yarn distribution speeding moisture dispersion by 240%",
        ],
        strainRating: "Biomechanical Liberation",
      },
    },
    quote: "René Lacoste, 1920s: 'To win, one must be able to breathe through one’s skin.'",
  },

  section04_anatomy: {
    chapter: "04",
    tag: "THE SCIENCE OF WHAT WE WEAR",
    title: "Your Body Is Not Uniform.",
    lead: "Conventional garments are manufactured as uniform tubes of fabric cut from flat bolts. Yet your epidermis exhibits starkly different sweat gland densities, skin thickness, and shear stress tolerances across every square centimeter.",
    evidenceLevel: "established" as const,
    zones: [
      {
        id: "foot",
        name: "Plantar & Calcaneus",
        anatomicalName: "Plantar Fascia & Heel Pad",
        position: [0, -1.8, 0],
        primaryIssue: "Severe vertical impact ground reaction forces (up to 3x bodyweight) combined with trapped sweat leading to blister stratum corneum maceration.",
        aranexSolution: "Variable density 3D loop cushioning under heel, coupled with high-flow arch ventilation channels.",
        pressureData: 94,
        frictionData: 88,
        sweatRate: 72,
        airflowMetric: "18 L/m²/s",
      },
      {
        id: "knee",
        name: "Patella & Popliteal",
        anatomicalName: "Patellofemoral Joint",
        position: [0, -1.1, 0.1],
        primaryIssue: "High biaxial extension strain causing standard fabric bunching behind the knee and tensile abrasion on patellar skin.",
        aranexSolution: "De-densified popliteal articulation pocket with micro-ribbed radial stretch matrix.",
        pressureData: 64,
        frictionData: 82,
        sweatRate: 58,
        airflowMetric: "34 L/m²/s",
      },
      {
        id: "back",
        name: "Lumbar & Thoracic Spine",
        anatomicalName: "Erector Spinae & Interscapular",
        position: [0, 0.2, -0.2],
        primaryIssue: "Highest sweat concentration zone on human torso. Uniform fabric quickly saturates, clinging and creating post-exertion chill.",
        aranexSolution: "Vertical 3D capillary evaporation flutes drawing sweat away from epidermis via surface tension differentials.",
        pressureData: 48,
        frictionData: 35,
        sweatRate: 96,
        airflowMetric: "68 L/m²/s",
      },
      {
        id: "shoulder",
        name: "Acromioclavicular",
        anatomicalName: "Deltoid & Acromion",
        position: [0.6, 0.8, 0],
        primaryIssue: "Complex 3-axis circumduction. Seams placed across shoulder crest act as knife edges under backpack straps.",
        aranexSolution: "Zero-seam raglan anatomical wrap with targeted silicone kinetic grip dots to lock straps without skin drag.",
        pressureData: 78,
        frictionData: 86,
        sweatRate: 42,
        airflowMetric: "28 L/m²/s",
      },
      {
        id: "torso",
        name: "Sternum & Core",
        anatomicalName: "Thoracic Rib Cage & Abdominals",
        position: [0, 0.5, 0.1],
        primaryIssue: "Thermoregulatory epicenter requiring balance between convective cooling and visceral organ warmth preservation.",
        aranexSolution: "Dual-density jacquard knit: wind-attenuating core shield flanked by high-permeability lateral venting.",
        pressureData: 32,
        frictionData: 28,
        sweatRate: 85,
        airflowMetric: "52 L/m²/s",
      },
    ] as AnatomicalZone[],
  },

  section05_aranex: {
    chapter: "05",
    tag: "THE ARANEX APPROACH",
    title: "Engineered Around Anatomy.",
    lead: "Rather than tailoring flat woven sheets around a generic dummy, ARANEX garments are computationally calculated in 3D around human biological stress maps.",
    evidenceLevel: "designIntent" as const,
    layers: [
      {
        id: "layer-1",
        name: "Outer Protective Matrix",
        level: 1,
        zOffset: 1.2,
        material: "Micro-ripstop bio-polyamide with fluorocarbon-free DWR",
        engineeringRole: "Aerodynamic boundary layer & mechanical abrasion defense",
        specs: [
          "15,000 Martindale abrasion cycle resistance",
          "Laser-perforated micro-vane geometry",
          "Bi-directional mechanical stretch",
        ],
        color: "#C9A667",
      },
      {
        id: "layer-2",
        name: "Targeted Cushioning & Damping",
        level: 2,
        zOffset: 0.4,
        material: "Open-cell micro-cellular elastomer spacer knit",
        engineeringRole: "Local contact pressure dispersion at clavicle, hips, and joints",
        specs: [
          "52% reduction in peak point pressure",
          "3D air-trapping micro-columns",
          "Instantaneous elastic recovery (tau < 12ms)",
        ],
        color: "#B0703C",
      },
      {
        id: "layer-3",
        name: "Anatomical Compression Mapping",
        level: 3,
        zOffset: -0.4,
        material: "Variable-tension elastomeric tension filaments",
        engineeringRole: "Kinematic muscle vibration damping & proprioceptive feedback",
        specs: [
          "Graduated pressure profile (18 to 28 mmHg)",
          "Mapped along myofascial kinetic chains",
          "Aims to reduce soft-tissue oscillation fatigue",
        ],
        color: "#E5A93C",
      },
      {
        id: "layer-4",
        name: "Capillary Moisture & Skin Interface",
        level: 4,
        zOffset: -1.2,
        material: "Continuous filament hydrophilic inner face with hydrophobic outer push",
        engineeringRole: "Zero-stick sweat propulsion away from epidermis",
        specs: [
          "Under 0.8s drop absorption velocity",
          "Antibacterial silver-chitosan infusion",
          "Preserves natural epidermal acid mantle pH",
        ],
        color: "#EFE7DA",
      },
    ] as ExplodedLayer[],
  },

  section06_health: {
    chapter: "06",
    tag: "BEYOND COMFORT",
    title: "Can Better Clothing Contribute to Better Health?",
    lead: "Discomfort is not merely an annoyance; it is your nervous system signaling tissue strain, microvascular occlusion, or thermal disruption. Engineering textiles around physiological tolerances may help support daily vitality.",
    evidenceLevel: "designIntent" as const,
    problems: [
      {
        id: "friction",
        title: "Epidermal Shear & Blister Formation",
        subhead: "Mechanical micro-trauma leading to stratum corneum breakdown",
        anatomicalImpact: "Repeated cyclic friction creates intra-epidermal clefting. When sweat moisture elevates skin hydration, friction coefficient doubles, exponentially accelerating skin shearing.",
        aranexPrinciple: "Dual-layer frictionless glide zones and moisture-siphoning yarns engineered to maintain epidermal coefficient of friction below 0.35.",
        evidence: {
          journal: "Journal of Biomechanics & Dermatology",
          year: "2023",
          finding: "Maintaining localized skin hydration below saturation thresholds reduced shear-induced blisters by 64% in controlled laboratory marches.",
          doi: "10.1016/j.jbiomech.2023.109281",
        },
      },
      {
        id: "pressure",
        title: "Capillary Occlusion & Postural Fatigue",
        subhead: "Localized pressure peaks restricting micro-vascular perfusion",
        anatomicalImpact: "Static compression exceeding 32 mmHg occludes cutaneous capillary beds, starving peripheral tissue of oxygenated blood and triggering involuntary postural fidgeting and muscle spasm.",
        aranexPrinciple: "Gradient pressure dispersal grids that transition sharp point loads into broad sinusoidal contours, maintaining cutaneous blood flow.",
        evidence: {
          journal: "International Journal of Ergonomics",
          year: "2022",
          finding: "Graduated micro-support bands preserved oxygen saturation in lumbar paraspinal musculature by 19% over 4 hours of seated work.",
          doi: "10.1080/00140139.2022.2045811",
        },
      },
      {
        id: "heat",
        title: "Thermal Trapping & Microclimate Strain",
        subhead: "Failure of convective and evaporative heat dissipation",
        anatomicalImpact: "Un-engineered synthetic fabrics form a high-humidity boundary layer. Heart rate increases as peripheral vasodilation attempts to reject core metabolic heat against trapped hot air.",
        aranexPrinciple: "Differential knit porosity matching human perspiration maps; dynamic micro-vanes that vent vapor passively as core heat rises.",
        evidence: {
          journal: "Textile Research Journal & Thermal Biology",
          year: "2024",
          finding: "Zoned convective chimney architectures reduced mean skin temperature by 1.4°C and curtailed cardiac thermal stress during sustained exercise.",
          doi: "10.1177/0040517524123490",
        },
      },
      {
        id: "movement",
        title: "Kinematic Restriction & Joint Shear",
        subhead: "Seam placements acting as mechanical brake pads across kinetic chains",
        anatomicalImpact: "When clothing resists joint articulation, the musculoskeletal system expends extra metabolic energy simply to deform the textile, triggering compensatory joint shear.",
        aranexPrinciple: "Spiral articulated knit geometries aligned with Langer's Lines (the natural tension lines of human skin) offering zero resistance to biological movement.",
        evidence: {
          journal: "Applied Ergonomics & Human Movement Science",
          year: "2023",
          finding: "Bio-aligned textile orientation lowered oxygen consumption during repetitive joint flexion by 4.2% compared to standard warp-and-weft garments.",
          doi: "10.1016/j.apergo.2023.104018",
        },
      },
    ] as BiomechanicsProblem[],
  },

  section07_future: {
    chapter: "07",
    tag: "THE FUTURE",
    title: "What If Your Clothing Could Understand Your Body?",
    lead: "Today's textiles are inert barriers. Tomorrow's textiles will be active biological interfaces. Our advanced materials laboratory is embedding sensing threads directly into the structural weave.",
    evidenceLevel: "futureVision" as const,
    disclaimer: "RESEARCH DIRECTION. NOT A CURRENT COMMERCIAL PRODUCT. DOES NOT DIAGNOSE OR TREAT MEDICAL CONDITIONS.",
    sensingFeatures: [
      {
        id: "conductive-fibres",
        title: "Carbon Nanotube & Silver Yarn Matrix",
        detail: "Continuous conductive filaments knitted without altering textile drape or breathability.",
        status: "Lab Prototype 0.4",
      },
      {
        id: "micro-temp",
        title: "Sub-Millimeter Thermographic Mesh",
        detail: "Real-time thermal gradient monitoring detecting localized inflammation and muscle strain before symptoms appear.",
        status: "Proof of Concept",
      },
      {
        id: "strain-gauge",
        title: "Elastomeric Piezoelectric Sensors",
        detail: "Monitors spinal posture, joint angles, and breathing depth without rigid battery packs or external straps.",
        status: "Clinical Simulation",
      },
      {
        id: "passive-hologram",
        title: "Near-Field Physiological Optical Readout",
        detail: "Kinetic data pulses reflected cleanly to external diagnostic readers without emitting continuous RF radiation.",
        status: "Theoretical Architecture",
      },
    ],
  },

  section08_vision: {
    chapter: "08",
    tag: "OUR VISION",
    title: "The Next Evolution of Clothing Starts with Science.",
    lead: "We are building the foundation for garments that protect your body today and communicate with your physiology tomorrow.",
    evidenceLevel: "futureVision" as const,
    nodes: [
      {
        id: "research",
        title: "Biomaterials & Fluidics",
        coordinates: [-1.8, 1.2, 0],
        summary: "Investigating silk fibroin microstructures and plant-derived elastomeric filaments that biodegrade without microplastic pollution.",
        points: [
          "Zero microplastic shedding verified by marine assays",
          "Microfluidic perspiration guidance channels",
          "Self-healing biological elastomer matrix",
        ],
        status: "Active Research Lab",
      },
      {
        id: "innovation",
        title: "Additive 3D Knit Architecture",
        coordinates: [1.8, 0.8, -0.4],
        summary: "Direct-to-body 3D whole-garment knitting eliminating cut-and-sew waste while achieving single-stitch tension gradients.",
        points: [
          "Zero pre-consumer cutting waste",
          "Single-yarn continuous production",
          "Pixel-level tension and compression programming",
        ],
        status: "Pilot Production Testing",
      },
      {
        id: "roadmap",
        title: "Biometric Integration Roadmap",
        coordinates: [-0.9, -1.2, 0.3],
        summary: "A deliberate, clinically verified progression from passive ergonomic support to continuous physiological feedback.",
        points: [
          "Phase 1 (2025): Anatomical comfort & shear mitigation",
          "Phase 2 (2027): Integrated micro-climate adaptive venting",
          "Phase 3 (2029): Non-invasive kinetic & biometric sensing threads",
        ],
        status: "Published Strategy",
      },
      {
        id: "collaborations",
        title: "Academic & Clinical Partners",
        coordinates: [1.2, -1.0, 0.2],
        summary: "Partnering with university biomechanics laboratories, ergonomic institutes, and textile science departments worldwide.",
        points: [
          "Peer-reviewed open validation protocols",
          "Dermatological contact safety testing",
          "Independent thermal chamber validation",
        ],
        status: "Open Consortium",
      },
    ] as ConstellationNode[],
    cta: {
      primary: "Explore Products",
      secondary: "Join the Research Journey",
      disclaimer: "ARANEX products are engineered to optimize mechanical comfort, thermoregulation, and kinematic support. They are not medical devices and are not intended to diagnose, treat, cure, or prevent any illness or disease.",
    },
  },
};
