export interface ServiceItem {
  id: string;
  index: string;
  title: string;
  shortTagline: string;
  description: string;
  deliverables: string[];
  engagementModel: string;
  image: string;
  imageAlt: string;
}

export interface ProjectConcept {
  id: string;
  index: string;
  title: string;
  industry: string;
  statusLabel: string;
  challenge: string;
  solution: string;
  technologies: string[];
  outcome: string;
  image: string;
  imageAlt: string;
  layoutVariant: 'wide' | 'tall' | 'standard';
}

export interface ProcessStage {
  index: string;
  title: string;
  summary: string;
  detail: string;
  artifacts: string[];
}

export type InsightCategory =
  | 'All'
  | 'Artificial Intelligence'
  | 'Cybersecurity'
  | 'Digital Transformation'
  | 'Technology Trends'
  | 'Business Innovation';

export interface InsightArticle {
  id: string;
  category: Exclude<InsightCategory, 'All'>;
  title: string;
  date: string;
  readTime: string;
  excerpt: string;
  body: string[];
  image: string;
  imageAlt: string;
}

export interface TestimonialPlaceholder {
  id: string;
  initials: string;
  name: string;
  designation: string;
  company: string;
  quote: string;
  context: string;
}

export interface ImpactMetric {
  id: string;
  value: number;
  suffix: string;
  label: string;
  note: string;
}

export const IMAGES = {
  heroStudio: '/src/assets/images/hero_architecture_studio_1794913543456.jpg',
  approachTeam: '/src/assets/images/approach_editorial_team_1794913544426.jpg',
  serviceSculpture: '/src/assets/images/service_sculptural_tech_1794913544412.jpg',
  projectFintech: '/src/assets/images/project_fintech_concept_1794913544881.jpg',
  projectCyber: '/src/assets/images/project_cyber_infra_1794913545131.jpg',
  insightGlass: '/src/assets/images/insight_editorial_cover_1794913546145.jpg',
  bentoWorkspace: '/src/assets/images/arkon_bento_workspace_1794920392422.jpg',
  productMockup: '/src/assets/images/arkon_product_mockup_1794920393562.jpg',
  softwareDev: '/src/assets/images/arkon_software_dev_1794920392603.jpg',
  aiVisual: '/src/assets/images/arkon_ai_visual_1794920392696.jpg',
  studioConference: '/src/assets/images/arkon_studio_conference_1794920417552.jpg',
  studioPod: '/src/assets/images/arkon_studio_pod_1794920416289.jpg',
  archMonolith: '/src/assets/images/arkon_arch_monolith_1794920418276.jpg',
  laptopPlatform: '/src/assets/images/arkon_laptop_platform_1794920418788.jpg',
} as const;

export const HEADER_NAV_ITEMS = [
  { id: 'impact', label: 'IMPACT' },
  { id: 'projects', label: 'PROJECTS' },
  { id: 'services', label: 'SERVICES' },
  { id: 'programs', label: 'PROGRAMS' },
  { id: 'method', label: 'METHOD' },
  { id: 'insights', label: 'INSIGHTS' },
  { id: 'studio', label: 'STUDIO' },
] as const;

export const MENU_NAV_ITEMS = [
  { id: 'impact', index: '01', label: 'Impact', previewImage: IMAGES.archMonolith, tag: 'Clarity & Outcomes' },
  { id: 'projects', index: '02', label: 'Projects', previewImage: IMAGES.projectFintech, tag: 'Concept Portfolio' },
  { id: 'services', index: '03', label: 'Services', previewImage: IMAGES.laptopPlatform, tag: '10 Disciplines' },
  { id: 'programs', index: '04', label: 'Programs', previewImage: IMAGES.serviceSculpture, tag: 'Engagement Tracks' },
  { id: 'method', index: '05', label: 'Method', previewImage: IMAGES.softwareDev, tag: '5-Stage Delivery' },
  { id: 'insights', index: '06', label: 'Insights', previewImage: IMAGES.aiVisual, tag: 'Field Perspectives' },
  { id: 'studio', index: '07', label: 'Studio', previewImage: IMAGES.studioConference, tag: 'Zurich · London · NY' },
  { id: 'contact', index: '08', label: "Let's Talk", previewImage: IMAGES.studioPod, tag: 'Start a Project' },
] as const;

export interface HeroPlaceholderStat {
  id: string;
  number: string;
  label: string;
  sublabel: string;
}

/**
 * Editable placeholder metrics for the White Editorial Hero statistics row.
 * Replace placeholder values and labels directly with verified agency figures.
 */
export const HERO_PLACEHOLDER_STATS: HeroPlaceholderStat[] = [
  {
    id: 'hero-stat-01',
    number: '00+',
    label: 'PLACEHOLDER METRIC 01',
    sublabel: 'Enterprise Programs Delivered',
  },
  {
    id: 'hero-stat-02',
    number: '00+',
    label: 'PLACEHOLDER METRIC 02',
    sublabel: 'Industries Transformed',
  },
  {
    id: 'hero-stat-03',
    number: '00%',
    label: 'PLACEHOLDER METRIC 03',
    sublabel: 'Client Retention Benchmark',
  },
  {
    id: 'hero-stat-04',
    number: '00',
    label: 'PLACEHOLDER METRIC 04',
    sublabel: 'Global Studio Hubs',
  },
];

export const PARTNER_PLACEHOLDERS = [
  { id: 'p1', name: 'Partner Studio 01', sector: 'Financial Systems' },
  { id: 'p2', name: 'Partner Group 02', sector: 'Clean Energy' },
  { id: 'p3', name: 'Partner Labs 03', sector: 'Life Sciences' },
  { id: 'p4', name: 'Partner Mobility 04', sector: 'Autonomous Transit' },
  { id: 'p5', name: 'Partner Capital 05', sector: 'Asset Management' },
  { id: 'p6', name: 'Partner Industrial 06', sector: 'Precision Manufacturing' },
];

export const IMPACT_METRICS: ImpactMetric[] = [
  {
    id: 'projects',
    value: 140,
    suffix: '+',
    label: 'Projects Delivered',
    note: 'Multi-region enterprise systems',
  },
  {
    id: 'industries',
    value: 18,
    suffix: '',
    label: 'Industries Served',
    note: 'Finance, energy, retail & labs',
  },
  {
    id: 'solutions',
    value: 32,
    suffix: '+',
    label: 'Technology Platforms',
    note: 'Shipped into production',
  },
  {
    id: 'partnerships',
    value: 94,
    suffix: '%',
    label: 'Long-Term Retention',
    note: 'Multi-year advisory partners',
  },
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'it-consulting',
    index: '01',
    title: 'IT Consulting & Digital Transformation',
    shortTagline: 'Architectural roadmaps that align capital, teams, and modern systems.',
    description:
      'We audit legacy operations, eliminate structural bottlenecks, and guide multi-quarter modernization programs without disrupting daily revenue.',
    deliverables: ['Enterprise Architecture Audit', 'Modernization Roadmap', 'Operating Model Alignment'],
    engagementModel: 'Advisory & Embedded Program Leadership',
    image: IMAGES.approachTeam,
    imageAlt: 'Technology strategists reviewing architectural roadmaps at an oak table',
  },
  {
    id: 'cybersecurity',
    index: '02',
    title: 'Cybersecurity Solutions',
    shortTagline: 'Zero-trust resilience engineered into every layer of your stack.',
    description:
      'Continuous threat modeling, identity governance, and hardened cloud perimeters designed to protect critical data and regulatory standing.',
    deliverables: ['Zero-Trust Architecture', 'Continuous Vulnerability Audits', 'Incident Response Playbooks'],
    engagementModel: 'Security Posture Assessment & Retainer',
    image: IMAGES.projectCyber,
    imageAlt: 'Minimalist security operations center with matte steel enclosures and fiber lines',
  },
  {
    id: 'web-design-dev',
    index: '03',
    title: 'Web Design & Development',
    shortTagline: 'Editorial flagship platforms built for speed, clarity, and conversion.',
    description:
      'Bespoke brand flagships, headless commerce platforms, and interactive web applications engineered with obsessive attention to typography and latency.',
    deliverables: ['Creative Direction & Motion', 'Headless CMS Architecture', 'Core Web Vitals Optimization'],
    engagementModel: 'Fixed-Scope Flagship Sprint',
    image: IMAGES.laptopPlatform,
    imageAlt: 'Matte dark laptop displaying editorial digital enterprise interface',
  },
  {
    id: 'ai-ml',
    index: '04',
    title: 'AI & Machine Learning',
    shortTagline: 'Production intelligence grounded in proprietary enterprise data.',
    description:
      'From domain-tuned retrieval pipelines to predictive forecasting models, we ship verifiable AI systems with strict governance and measurable ROI.',
    deliverables: ['Retrieval & Knowledge Systems', 'Predictive Demand Modeling', 'Evaluation & Guardrail Harnesses'],
    engagementModel: 'Rapid Prototype to Production Rollout',
    image: IMAGES.aiVisual,
    imageAlt: 'Fluted optical glass prism refracting luminous emerald data geometry',
  },
  {
    id: 'cloud-computing',
    index: '05',
    title: 'Cloud Computing & Infrastructure',
    shortTagline: 'Elastic multi-region foundations with predictable unit economics.',
    description:
      'Infrastructure-as-code migrations, Kubernetes orchestration, and FinOps cost governance built for high availability under peak load.',
    deliverables: ['Multi-Region Cloud Migration', 'Infrastructure as Code (Terraform)', 'FinOps Cost Optimization'],
    engagementModel: 'Cloud Foundation & Migration Program',
    image: IMAGES.archMonolith,
    imageAlt: 'Limestone and bronze glass architecture bathed in directional light',
  },
  {
    id: 'software-dev',
    index: '06',
    title: 'Software Development',
    shortTagline: 'Resilient bespoke applications built for decade-long maintainability.',
    description:
      'End-to-end engineering of mission-critical platforms, APIs, and distributed back-office systems tailored to proprietary business workflows.',
    deliverables: ['Core Platform Engineering', 'API & Microservice Design', 'Automated QA & CI/CD Pipelines'],
    engagementModel: 'Dedicated Cross-Functional Squad',
    image: IMAGES.softwareDev,
    imageAlt: 'Senior engineering workstation showing structured systems telemetry',
  },
  {
    id: 'ui-ux-design',
    index: '07',
    title: 'UI/UX Design',
    shortTagline: 'Human-centered digital products where complex workflows feel effortless.',
    description:
      'Research-backed product architecture, scalable multi-brand design systems, and tactile micro-interactions validated with real users.',
    deliverables: ['User Research & Journey Mapping', 'Interactive Prototyping', 'Tokenized Design Systems'],
    engagementModel: 'Product Design Discovery & System Build',
    image: IMAGES.productMockup,
    imageAlt: 'Isometric studio mockup of titanium mobile devices displaying crisp financial UI',
  },
  {
    id: 'process-automation',
    index: '08',
    title: 'Business Process Automation',
    shortTagline: 'Reclaim operational hours by connecting siloed tools reliably.',
    description:
      'Event-driven workflow orchestration across ERP, CRM, and finance stacks, eliminating manual reconciliation and human error.',
    deliverables: ['Workflow Bottleneck Mapping', 'Event-Driven Integrations', 'Exception Handling Dashboards'],
    engagementModel: 'Operational Velocity Sprint',
    image: IMAGES.bentoWorkspace,
    imageAlt: 'Sunlit concrete workspace with laptop analytics dashboard',
  },
  {
    id: 'data-analytics',
    index: '09',
    title: 'Data Analytics & Intelligence',
    shortTagline: 'Unified telemetry turning fragmented records into decisive clarity.',
    description:
      'Modern lakehouse pipelines, semantic metrics layers, and executive decision consoles built on clean, auditable single sources of truth.',
    deliverables: ['Modern Data Warehouse Design', 'Real-Time Telemetry Pipelines', 'Executive BI Consoles'],
    engagementModel: 'Data Platform Architecture & Delivery',
    image: IMAGES.projectFintech,
    imageAlt: 'Enterprise analytics screen on walnut and concrete architectural desk',
  },
  {
    id: 'it-infrastructure',
    index: '10',
    title: 'IT Infrastructure Management',
    shortTagline: 'Proactive reliability, observability, and round-the-clock stewardship.',
    description:
      'Unified observability, automated incident remediation, and lifecycle management for hybrid office and cloud-native environments.',
    deliverables: ['24/7 Telemetry & Alerting', 'Disaster Recovery Drills', 'Hardware & Network Lifecycle'],
    engagementModel: 'Managed Reliability Partnership',
    image: IMAGES.insightGlass,
    imageAlt: 'Curved architectural glass panels in modern office corridor',
  },
];

export const FEATURED_PROJECTS: ProjectConcept[] = [
  {
    id: 'meridian-ledger',
    index: '01',
    title: 'Meridian Treasury Core',
    industry: 'Financial Technology',
    statusLabel: 'FINANCE & FINTECH',
    challenge:
      'Institutional treasury desks struggled with fragmented liquidity feeds across regional banking APIs, causing delayed multi-currency hedging decisions.',
    solution:
      'Designed an ultra-low-latency liquidity workspace unifying real-time cash positions, automated risk thresholds, and audit-ready scenario modeling.',
    technologies: ['TypeScript', 'React', 'Event Streaming', 'Zero-Trust IAM', 'PostgreSQL'],
    outcome: 'Concept target: 62% faster daily reconciliation and unified visibility across 14 currencies.',
    image: IMAGES.projectFintech,
    imageAlt: 'Concept visualization of Meridian Treasury Core analytics desk',
    layoutVariant: 'standard',
  },
  {
    id: 'aegis-grid',
    index: '02',
    title: 'Aegis Sovereign Cloud Fabric',
    industry: 'Cybersecurity & Energy',
    statusLabel: 'ENERGY & INFRASTRUCTURE',
    challenge:
      'Distributed infrastructure operators require strict data residency while maintaining rapid deployment velocity across regional edge nodes.',
    solution:
      'Architected a deterministic zero-trust infrastructure blueprint with automated policy-as-code verification and cryptographic audit trails.',
    technologies: ['Terraform', 'Kubernetes', 'eBPF Telemetry', 'Hardware HSM', 'Go'],
    outcome: 'Concept target: Zero unverified privilege escalations and sub-90s regional failover.',
    image: IMAGES.projectCyber,
    imageAlt: 'Concept visualization of Aegis Sovereign Cloud infrastructure corridor',
    layoutVariant: 'standard',
  },
  {
    id: 'atelier-spatial',
    index: '03',
    title: 'Atelier Modular Flagship',
    industry: 'Architecture & Luxury Retail',
    statusLabel: 'ARCHITECTURE & COMMERCE',
    challenge:
      'High-consideration architectural hardware brands often lose tactile material nuance when translated into conventional grid-based web stores.',
    solution:
      'Crafted an editorial storytelling platform pairing architectural photography, live material specification tools, and headless global commerce.',
    technologies: ['React', 'Headless Commerce', 'Motion Systems', 'Edge CDN', 'Design Tokens'],
    outcome: 'Concept target: 2.4x deeper specification engagement and seamless trade quoting.',
    image: IMAGES.serviceSculpture,
    imageAlt: 'Concept visualization of tactile ceramic, aluminum, and optical glass materials',
    layoutVariant: 'standard',
  },
  {
    id: 'horizon-workplace',
    index: '04',
    title: 'Horizon Knowledge Engine',
    industry: 'Enterprise Advisory',
    statusLabel: 'ENTERPRISE AI & ADVISORY',
    challenge:
      'Global consulting teams waste thousands of hours locating prior technical specifications and regulatory precedents buried in legacy repositories.',
    solution:
      'Built a permission-aware semantic retrieval workspace with inline citation verification and strict client data isolation boundaries.',
    technologies: ['Vector Retrieval', 'Node.js', 'Fine-Grained RBAC', 'Semantic Indexing'],
    outcome: 'Concept target: Reduces research synthesis time from days to verified minutes.',
    image: IMAGES.heroStudio,
    imageAlt: 'Concept visualization of collaborative architectural research studio',
    layoutVariant: 'standard',
  },
];

export const PROCESS_STAGES: ProcessStage[] = [
  {
    index: '01',
    title: 'Discover',
    summary: 'Understand business challenges and requirements.',
    detail:
      'We embed alongside leadership and frontline operators to map technical debt, commercial constraints, and genuine user friction before writing a single line of code.',
    artifacts: ['Stakeholder Synthesis', 'Technical & UX Audit', 'Risk & Opportunity Matrix'],
  },
  {
    index: '02',
    title: 'Strategize',
    summary: 'Develop the right technology and business strategy.',
    detail:
      'We define clear architectural boundaries, build-versus-buy trade-offs, security posture, and phased milestone economics anchored to measurable outcomes.',
    artifacts: ['Target System Blueprint', 'Delivery Economics Plan', 'Governance & Security Model'],
  },
  {
    index: '03',
    title: 'Design',
    summary: 'Create intuitive and meaningful experiences.',
    detail:
      'Our creative directors and product designers craft editorial interfaces, interactive prototypes, and tokenized design systems built for clarity and speed.',
    artifacts: ['Creative Direction', 'Interactive Prototype', 'Scalable Design System'],
  },
  {
    index: '04',
    title: 'Develop',
    summary: 'Build scalable and reliable digital solutions.',
    detail:
      'Senior engineers ship clean, tested, observable software in tight weekly increments with automated CI/CD pipelines and zero-downtime deployment standards.',
    artifacts: ['Production Codebase', 'Automated Test Suite', 'Observability & Runbooks'],
  },
  {
    index: '05',
    title: 'Evolve',
    summary: 'Continuously improve and optimize.',
    detail:
      'Post-launch, we measure real adoption telemetry, refine model and infrastructure efficiency, and co-evolve capabilities as your business scales.',
    artifacts: ['Telemetry Reviews', 'Performance Optimization', 'Iterative Feature Roadmap'],
  },
];

export const WHY_US_PILLARS = [
  {
    index: '01',
    title: 'Strategic thinking',
    body: 'Every technical decision is traced back to unit economics, market positioning, and operational leverage—never hype.',
  },
  {
    index: '02',
    title: 'Creative problem-solving',
    body: 'We pair studio-grade creative direction with systems engineering so complex tools feel calm, legible, and distinctive.',
  },
  {
    index: '03',
    title: 'Technology expertise',
    body: 'Principal architects across cloud infrastructure, applied AI, and security lead execution directly rather than handing off to juniors.',
  },
  {
    index: '04',
    title: 'Client-focused approach',
    body: 'Transparent weekly demonstrations, plain-language reporting, and embedded collaboration with your internal product teams.',
  },
  {
    index: '05',
    title: 'Scalable solutions',
    body: 'Modular codebases, clean documentation, and infrastructure-as-code designed to outlast rapid organizational growth.',
  },
  {
    index: '06',
    title: 'Long-term partnerships',
    body: 'We measure success by multi-year capability transfer and resilient systems your team owns with confidence.',
  },
];

export const INSIGHT_CATEGORIES: InsightCategory[] = [
  'All',
  'Artificial Intelligence',
  'Cybersecurity',
  'Digital Transformation',
  'Technology Trends',
  'Business Innovation',
];

export const INSIGHTS_ARTICLES: InsightArticle[] = [
  {
    id: 'verifiable-enterprise-ai',
    category: 'Artificial Intelligence',
    title: 'Designing Verifiable AI Systems Beyond the Prototype Phase',
    date: 'October 2026',
    readTime: '6 min read',
    excerpt:
      'Why deterministic evaluation harnesses, permission-aware retrieval, and human review loops separate enduring enterprise AI from brittle demos.',
    body: [
      'Most enterprise AI initiatives stall between an impressive boardroom prototype and regulated daily production. The bottleneck is rarely model intelligence—it is governance, provenance, and latency predictability.',
      'At Arkon, we begin every applied intelligence engagement by building an evaluation harness before selecting a model tier. By encoding domain edge cases, citation requirements, and strict access boundaries upfront, engineering teams gain objective confidence across model upgrades.',
      'The result is calm, auditable software that augments specialist judgment while respecting institutional security postures.',
    ],
    image: IMAGES.aiVisual,
    imageAlt: 'Fluted optical prism refracting teal intelligence geometry',
  },
  {
    id: 'zero-trust-architecture',
    category: 'Cybersecurity',
    title: 'Zero-Trust Infrastructure as a Catalyst for Engineering Velocity',
    date: 'September 2026',
    readTime: '5 min read',
    excerpt:
      'How replacing perimeter assumptions with cryptographic workload identity eliminates manual security gates and accelerates safe releases.',
    body: [
      'Security teams are often framed as a brake on product delivery. In reality, slow release cycles stem from fragile perimeter-based trust models that force manual audits before every deployment.',
      'When every microservice, CI runner, and data store authenticates via short-lived cryptographic identity and policy-as-code, security becomes an automated property of the platform rather than a late-stage bottleneck.',
      'Organizations adopting automated posture verification ship faster precisely because risk boundaries are enforced continuously.',
    ],
    image: IMAGES.projectCyber,
    imageAlt: 'Architectural cybersecurity operations room',
  },
  {
    id: 'editorial-digital-flagships',
    category: 'Digital Transformation',
    title: 'Why B2B Technology Brands Are Returning to Editorial Restraint',
    date: 'August 2026',
    readTime: '4 min read',
    excerpt:
      'In a sea of templated SaaS grids, typographic precision, generous negative space, and real photography signal institutional trust.',
    body: [
      'Over the past decade, enterprise software and consulting websites converged on identical gradients, floating metric pills, and generic isometric graphics. Buyers learned to tune them out within seconds.',
      'Borrowing discipline from architectural publishing and luxury industrial design restores clarity. When a page leads with measured typography, tactile imagery, and concrete case evidence, complex value propositions become immediately credible.',
    ],
    image: IMAGES.insightGlass,
    imageAlt: 'Curved frosted glass panels in sunlit modern atrium',
  },
  {
    id: 'composable-cloud-economics',
    category: 'Technology Trends',
    title: 'Right-Sizing Cloud Topologies for Predictable Unit Economics',
    date: 'July 2026',
    readTime: '7 min read',
    excerpt:
      'Practical patterns for trimming redundant multi-region egress, right-sizing compute pools, and tying telemetry directly to product margins.',
    body: [
      'Unchecked cloud sprawl silently erodes software gross margins. Teams often over-provision resilience tiers without mapping them to real business criticality.',
      'By aligning FinOps observability with architectural boundaries—separating latency-sensitive edge reads from batch analytical workloads—organizations routinely recover 25–40% of infrastructure spend while improving p95 responsiveness.',
    ],
    image: IMAGES.softwareDev,
    imageAlt: 'Senior software architecture workstation showing cloud metrics',
  },
  {
    id: 'operational-automation-craft',
    category: 'Business Innovation',
    title: 'Automating Back-Office Friction Without Breaking Human Judgment',
    date: 'June 2026',
    readTime: '5 min read',
    excerpt:
      'Where event-driven workflow orchestration shines—and why exception queues need thoughtful interface design for operations teams.',
    body: [
      'Automation fails when it treats messy real-world operations as purely binary. Invoices, logistics manifests, and compliance reviews inevitably surface edge cases.',
      'The most effective automation platforms handle the routine 85% silently while presenting ambiguous exceptions in clean, high-context review workspaces where operators can resolve issues in seconds.',
    ],
    image: IMAGES.approachTeam,
    imageAlt: 'Technology consultants collaborating around a wooden studio table',
  },
];

export const TESTIMONIAL_PLACEHOLDERS: TestimonialPlaceholder[] = [
  {
    id: 't1',
    initials: 'EL',
    name: 'Elena Lindqvist',
    designation: 'Chief Digital Officer',
    company: 'Partner Financial Group · Zurich',
    quote:
      'Working alongside Arkon felt like embedding with an architectural collective. Their systems clarity cut our multi-region onboarding cycle in half while elevating the craft of our entire product suite.',
    context: 'Enterprise Systems & Digital Flagship',
  },
  {
    id: 't2',
    initials: 'MK',
    name: 'Marcus Kestrel',
    designation: 'VP of Infrastructure',
    company: 'Partner Energy Systems · London',
    quote:
      'Their principal engineers worked directly inside our strict compliance envelope, delivering a zero-trust cloud foundation weeks ahead of our regulatory deadline.',
    context: 'Sovereign Cloud & Security Engineering',
  },
  {
    id: 't3',
    initials: 'SR',
    name: 'Sora Takahashi',
    designation: 'Head of Product Design',
    company: 'Partner Mobility Labs · New York',
    quote:
      'Rarely do you meet a consulting studio that unites architectural typography and motion discipline with distributed backend engineering under one roof.',
    context: 'Product Architecture & Design Systems',
  },
];

export const BUDGET_OPTIONS = [
  '$25k – $50k',
  '$50k – $100k',
  '$100k – $250k',
  '$250k+',
  'Advisory / Retainer',
];
