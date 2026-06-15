import { Candidate } from './types';

export const initialCandidates: Candidate[] = [
  {
    id: "cand_1",
    name: "Sarah Jenkins",
    role: "Senior Frontend Engineer",
    email: "sjenkins.dev@domain.com",
    phone: "+1 (555) 234-5678",
    experience: "7 Years",
    education: "B.S. in Computer Science, Stanford University",
    skills: ["React 18", "TypeScript", "Vite", "Tailwind CSS", "Next.js", "Redux Toolkit", "Jest", "Web Accessibility (WCAG)"],
    summary: "Senior frontend architect specializing in pixel-perfect interactive web apps, modular design systems, and fast fluid web client optimization.",
    resumeText: `SARAH JENKINS
San Francisco, CA | sjenkins.dev@domain.com | +1 (555) 234-5678 | Web: sjenk.dev

PROFESSIONAL SUMMARY
Senior Frontend Engineer with 7 years of deep experience building complex, accessible, and high-performance user interfaces for financial and SaaS platforms. Developer advocate for clean, scalable component architectures.

WORK EXPERIENCE
Lead Frontend Architect | FinTech Wave | Jan 2022 - Present
- Led a team of 4 engineers rebuilding a legacy onboarding portal using React 18, Vite, and Tailwind CSS, resulting in a 42% decrease in first-input delay.
- Architected a shared design system consumed across 3 product lines, cutting feature delivery cycles from 3 weeks to 4 days.
- Implemented responsive charts and visual dashboards using D3.js and Recharts, improving user engagement metrics by 28%.

Senior Software Engineer | SaaSify Global | Mar 2019 - Dec 2021
- Authored critical core modules for a collaboration platform using Next.js and TypeScript, handling up to 10k real-time concurrent active users.
- Reduced webpack bundle sizes by 55% using lazy-loading, tree-shaking, and code-splitting methodologies.
- Coached and mentored junior engineers on test-driven development (Jest, Cypress) and web accessibility (WCAG 2.1 AA compliance).

TECHNICAL SKILLS
- Languages: JavaScript (ESNext), TypeScript, HTML5, CSS3, JSON
- Libraries & Frameworks: React, Next.js, Redux, Node.js, Express
- Styling: Tailwind CSS, CSS Modules, Styled Components, Sass
- Tools & Infra: Vite, Webpack, Git, Docker, CI/CD pipelines (GitHub Actions)

EDUCATION
Stanford University
Bachelor of Science in Computer Science | 2014 - 2018
`,
    status: 'pending',
    aiReasoning: "Strong technical matches across the entire stack. Rebuild experience with React 18 and Vite aligns directly with state-of-the-art standards. Demonstrated leadership capability with a proven track record of optimizing performance and crafting design systems.",
    matchPercentage: 96,
    appliedDate: "2026-06-12"
  },
  {
    id: "cand_2",
    name: "David Kim",
    role: "Senior Backend / Cloud Specialist",
    email: "david.kim@cloudnet.io",
    phone: "+1 (555) 456-7890",
    experience: "9 Years",
    education: "M.S. in Software Engineering, Georgia Tech",
    skills: ["Node.js", "Go (Golang)", "PostgreSQL", "Docker", "Kubernetes", "AWS (EKS, RDS, S3)", "Microservices", "GRPC"],
    summary: "High-performance systems engineer focusing on cloud-native distributed microservices, database vertical scaling, and high-throughput real-time message brokers.",
    resumeText: `DAVID KIM
Seattle, WA | david.kim@cloudnet.io | +1 (555) 456-7890 | GitHub: dkim-cloud

SUMMARY
DevOps-adjacent Backend Specialist with 9 years of expertise designing and managing distributed enterprise systems, databases, and containerized microservice API structures. Focused on system reliability, zero-downtime migrations, and latency reduction.

EXPERIENCE
Principal Backend Engineer | Apex Distributed Systems | Aug 2021 - Present
- Refactored high-traffic Core API service into lightweight Go microservices, reducing operational server cost by 35% and p99 latency by 120ms.
- Managed and queries-optimized a 4.2TB PostgreSQL cluster supporting real-time transactional ledger logs.
- Engineered event-driven workflows utilizing Apache Kafka and Node.js backend processes.

Senior Cloud Systems Engineer | RetailCloud Corp | Sep 2017 - Jul 2021
- Automated AWS multi-region infrastructure provisioning using Terraform scripts, securing IAM and network routing protocols.
- Migrated legacy VMs to elastic Docker containers hosted on Kubernetes (AWS EKS), enhancing node scalability during peak commercial events.
- Devised secure RESTful APIs integrated with modern Auth providers (OAuth2, OAuth).

SKILLS MATRIX
- Backend Core: Node.js, Express, Go, Python, FastAPI
- Databases: PostgreSQL, Redis, MongoDB, Elasticsearch
- Cloud & Infrastructure: AWS, Docker, Kubernetes, Terraform, Nginx, Linux (Ubuntu)
- Architecture: REST, gRPC, Pub/Sub, CORS policies, Thread safety

EDUCATION
M.S. in Software Engineering | Georgia Institute of Technology | 2018
B.S. in Computer Engineering | University of Washington | 2013 - 2017
`,
    status: 'pending',
    aiReasoning: "Remarkable credentials in high-availability backend environments. Exceptional Go and Node.js microservice knowledge. Database performance statistics and scaling expertise represent senior-tier credentials.",
    matchPercentage: 92,
    appliedDate: "2026-06-14"
  },
  {
    id: "cand_3",
    name: "Maria Rodriguez",
    role: "Technical Product Manager",
    email: "m.rodriguez@visionlabs.org",
    phone: "+1 (555) 890-1234",
    experience: "5 Years",
    education: "B.A. in Economics & Administration, NYU",
    skills: ["Agile/Scrum", "Product Roadmap Planning", "Jira & Confluence", "SQL Analytics", "UX Strategy", "A/B Testing", "Airtable", "Customer Discovery"],
    summary: "Empathetic, data-driven Product Manager with a strong technical background who bridges the gap between client request discovery and engineering execution.",
    resumeText: `MARIA RODRIGUEZ
New York, NY | m.rodriguez@visionlabs.org | +1 (555) 890-1234

PROFESSIONAL EXPERIENCE
Senior Technical Product Manager | VisionLabs | Oct 2022 - Present
- Owned the product lifecycle and execution strategy for an AI-assisted reporting tool, generating $1.4M ARR within its first two quarters.
- Formulated clear user stories, managed the cross-functional sprint backlog (12 engineers, 2 designers) using Agile/Scrum standards.
- Defined product success KPIs and spearheaded analytical monitoring using Amplitude and SQL queries, leading to a 15% improvement in trial conversions.

Product Manager | CommerceHQ | May 2021 - Sep 2022
- Conducted user customer discovery interviews with 50+ enterprise clients to formulate product roadmap prioritize features.
- Launched a new merchant checkout integrations portal that boosted credit-card success rates by 3.2%.
- Collaborated closely with engineering leads to define API schema specifications and ease third-party integrations.

CORE CAPABILITIES
- Frameworks: Scrum, Lean Product Management, Design Thinking, Kanban
- Analytics: SQL (PostgreSQL), Amplitude, FullStory, Google Analytics
- Management Tools: Jira, Confluence, Linear, Notion, Figma (view/edit)

EDUCATION & CREDENTIALS
New York University (NYU)
B.A. in Economics & Business Administration | 2016 - 2020
Certified Scrum Product Owner (CSPO) | Scrum Alliance
`,
    status: 'pending',
    aiReasoning: "Combines solid business analytics metrics with structured operational coordination. Possesses excellent product development pedigree and handles requirements definitions very maturely. Good for leadership coordinates.",
    matchPercentage: 88,
    appliedDate: "2026-06-11"
  },
  {
    id: "cand_4",
    name: "Alex Rivera",
    role: "UI/UX Product Designer",
    email: "arivera.creative@designstudio.io",
    phone: "+1 (555) 345-6789",
    experience: "4 Years",
    education: "BFA in Communication Design, Pratt Institute",
    skills: ["Figma Specialist", "UI Visual Systems", "Wireframing", "Prototyping", "UX Research", "Framer Motion", "Design Systems", "User Journeys"],
    summary: "Creative product designer dedicated to crafting elegant, functional interfaces. Highly skilled in user research and scalable component libraries.",
    resumeText: `ALEX RIVERA
Brooklyn, NY | arivera.creative@designstudio.io | +1 (555) 345-6789 | Behance: arivera-ui

EXPERIENCE
Senior Product Designer | Studio Pixel | Nov 2022 - Present
- Spearheaded the end-to-end design restructure of a healthcare scheduling application, reducing user bookings drop-offs by 39%.
- Built a highly reusable Figma design library featuring 140+ fully-interactive components with variable states.
- Led monthly collaborative feedback sessions with engineers, establishing clear Hand-Off protocols and Figma-to-code consistency.

Interaction Designer | SwiftFlow App | Aug 2020 - Oct 2022
- Conducted remote and in-person usability testing with 35 task participants, optimizing accessibility and text readabilities.
- Designed high-fidelity prototypes representing intricate data collection forms and interactive financial boards.
- Developed the company’s core layout style, standardizing dark-mode guidelines and typography pairing rules.

SKILLS
- Core Designing: Figma, Sketch, Adobe Creative Suite (Photoshop, Illustrator)
- UI Prototyping: Framer, Principle, Webflow interactions
- Research & Strategy: Usability testing, heuristic evaluations, affinity mapping, user personas
- Code Comfort: Tailwind CSS layout principles, CSS flexbox/grid mechanics

EDUCATION
Pratt Institute | Brooklyn, NY
Bachelor of Fine Arts (BFA) in Communication Design | Minor in Web Dev, 2020
`,
    status: 'pending',
    aiReasoning: "Strong visual fidelity design background combined with technical developer hand-off maturity. Her deep understanding of Tailwind utility concepts and grid layouts guarantees smooth design-to-engineering transitions.",
    matchPercentage: 85,
    appliedDate: "2026-06-13"
  },
  {
    id: "cand_5",
    name: "Marcus Aurelius",
    role: "Database Engineer & Security Administrator",
    email: "maurelius@stoicops.org",
    phone: "+1 (555) 912-3456",
    experience: "11 Years",
    education: "B.S. in Computer Information Systems, UT Austin",
    skills: ["PostgreSQL Tuning", "Database Clustering", "Query Profiling", "Security Auditing", "Redis", "Elasticsearch", "Linux Shell Scripting", "SSL/TLS Hardening"],
    summary: "Venerable systems systems administrator focused on securing mission-critical database warehouses, query performance scaling, and storage layer replication.",
    resumeText: `MARCUS AURELIUS
Austin, TX | maurelius@stoicops.org | +1 (555) 912-3456

SUMMARY
Analytical Database Architect with over 11 years of hands-on expertise building enterprise-grade relational warehouses. Expert at performance debugging, high availability mirroring, backup policies, and secure network isolation.

CHRONOLOGY
Principal Database Administrator | Capital Security Corp | Jan 2020 - Present
- Designed a multi-region active-passive failover PostgreSQL replication system, resulting in 99.999% database uptime across three straight years.
- Evaluated slow system queries to craft target indexing strategies, reducing raw storage disk reads by 72%.
- Established rigorous secure schema permission models, protecting high-security credit cards tables from unauthorized access.

Senior Backend & Storage Specialist | OilTex Logistical Corp | Apr 2015 - Dec 2019
- Built customized logging and message warehousing pipelines utilizing Node.js script utilities.
- Implemented Elasticsearch nodes providing millisecond-level fuzzy query search access over 45 million corporate logistics files.
- Automated system recovery tasks and automated backup schemas using advanced Bash shell and Python cronjobs.

CORE COMPETENCIES
- SQL Engines: PostgreSQL, Microsoft SQL Server, SQLite
- NoSQL Engines: Redis, Elasticsearch, DynamoDB
- Infrastructure: Linux (RHEL, Debian), IAM Security, SSL Certification, VPC design
- Performance: EXPLAIN ANALYZE profiling, buffer cache sizing, indexing tuning

EDUCATION
University of Texas at Austin
Bachelor of Science in Computer Information Systems | 2010 - 2014
`,
    status: 'pending',
    aiReasoning: "An outstanding specialist in database optimization. Possesses deeply specialized skills that are rare yet essential for high-throughput transactional stability. Direct and pragmatic experience in PostgreSQL profiling.",
    matchPercentage: 91,
    appliedDate: "2026-06-15"
  }
];
