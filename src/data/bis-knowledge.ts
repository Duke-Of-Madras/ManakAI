export interface KnowledgeChunk {
    id: string;
    standardCode: string;
    section: string;
    content: string;
}

export const BIS_KNOWLEDGE: KnowledgeChunk[] = [
    // IS 15700:2018 — Quality Management for Educational Organizations
    {
        id: "is15700-1",
        standardCode: "IS 15700:2018",
        section: "Overview",
        content:
            "IS 15700:2018 is the Indian Standard for Quality Management in Educational Organizations. It specifies requirements for establishing and maintaining a quality management system (QMS) in schools, colleges, and universities. The standard aims to enhance learner satisfaction, improve education delivery processes, and ensure continuous improvement in educational outcomes.",
    },
    {
        id: "is15700-2",
        standardCode: "IS 15700:2018",
        section: "Clause 5.2 - Safety Infrastructure",
        content:
            "Clause 5.2 mandates that educational institutions must provide adequate safety infrastructure including: clearly visible fire exit signs at all floors and corridors, properly maintained fire extinguishers at intervals not exceeding 30 meters, emergency lighting systems with battery backup, high-visibility safety demarcation lines in laboratories and workshops, and first-aid kits accessible within 2 minutes of any location on campus.",
    },
    {
        id: "is15700-3",
        standardCode: "IS 15700:2018",
        section: "Clause 7.4 - Emergency Procedures",
        content:
            "Clause 7.4 requires all educational institutions to maintain updated emergency evacuation maps posted at every floor entrance and exit point. Evacuation drills must be conducted at least twice per academic year. Each building must have a designated assembly point clearly marked outdoors. Emergency contact numbers for fire services, police, and ambulance must be displayed prominently at reception areas, security posts, and all notice boards.",
    },
    {
        id: "is15700-4",
        standardCode: "IS 15700:2018",
        section: "Clause 8.1 - Service Quality",
        content:
            "Clause 8.1 specifies service quality requirements for educational institutions. Teaching faculty must possess minimum qualifications as specified by regulatory bodies (UGC/AICTE). Student-to-teacher ratios must not exceed 30:1 for undergraduate programs and 15:1 for postgraduate programs. Institutions must maintain feedback mechanisms allowing students to evaluate course quality, faculty performance, and infrastructure adequacy each semester.",
    },
    {
        id: "is15700-5",
        standardCode: "IS 15700:2018",
        section: "Clause 9.1 - Accessibility",
        content:
            "Clause 9.1 mandates accessibility compliance for persons with disabilities. All buildings must have ramp access with gradient not exceeding 1:12. Lifts must be available in buildings exceeding two floors with tactile buttons and audio announcements. Accessible restrooms must be available on every floor. Signage must include Braille and high-contrast visual indicators. Reserved seating in classrooms and examination halls is mandatory.",
    },
    {
        id: "is15700-6",
        standardCode: "IS 15700:2018",
        section: "Clause 10.3 - Quality Audits",
        content:
            "Clause 10.3 requires institutions to conduct periodic internal quality audits at least once per year covering all departments. Audit reports must be submitted to the Internal Quality Assurance Cell (IQAC). Non-conformities must be tracked with corrective action plans having defined timelines. External quality audits by recognized bodies (NAAC/NBA) are recommended every 5 years. Self-assessment reports must be filed annually.",
    },

    // ISO 42001:2023 — AI Management System
    {
        id: "iso42001-1",
        standardCode: "ISO 42001:2023",
        section: "Overview",
        content:
            "ISO 42001:2023 is the first international standard for Artificial Intelligence Management Systems (AIMS). It provides a framework for organizations to establish, implement, maintain, and continually improve an AI management system. The standard addresses the unique challenges of AI including ethics, transparency, accountability, and responsible deployment. It is applicable to any organization developing, providing, or using AI-based products or services.",
    },
    {
        id: "iso42001-2",
        standardCode: "ISO 42001:2023",
        section: "Clause 6.1 - AI Risk Assessment",
        content:
            "Clause 6.1 requires organizations to establish a systematic AI risk assessment framework. This includes identifying risks related to bias, fairness, safety, privacy, and security in all AI systems. Risk assessment must be performed before deployment, after significant changes, and periodically during operation. A risk register must be maintained documenting identified risks, their impact levels (low/medium/high/critical), mitigation measures, and residual risk acceptance justification.",
    },
    {
        id: "iso42001-3",
        standardCode: "ISO 42001:2023",
        section: "Clause 7.2 - Transparency & Explainability",
        content:
            "Clause 7.2 mandates transparency and explainability requirements. Organizations must document the purpose, capabilities, and limitations of each AI system. For high-impact decisions (admissions, grading, resource allocation), AI systems must provide explanations in human-understandable language. Model documentation must include training data sources, algorithm selection rationale, performance metrics, and known limitations. Users must be informed when interacting with AI systems.",
    },
    {
        id: "iso42001-4",
        standardCode: "ISO 42001:2023",
        section: "Clause 8.4 - Data Governance",
        content:
            "Clause 8.4 establishes data governance requirements for AI systems. Organizations must define data quality criteria including accuracy, completeness, timeliness, and representativeness. Training datasets must be documented with provenance, collection methodology, and potential biases. Data protection measures must comply with applicable privacy regulations. Data retention and deletion policies must be established. Regular data quality audits are required.",
    },

    // India AI Sutra 2026
    {
        id: "aisutra-1",
        standardCode: "India AI Sutra 2026",
        section: "Overview",
        content:
            "India AI Sutra 2026 is India's comprehensive national framework for responsible AI deployment in public institutions. Released by the Ministry of Electronics and Information Technology (MeitY), it establishes mandatory guidelines for all government bodies, public sector organizations, and educational institutions deploying AI systems. The framework emphasizes India's commitment to ethical AI that is transparent, inclusive, safe, and aligned with constitutional values.",
    },
    {
        id: "aisutra-2",
        standardCode: "India AI Sutra 2026",
        section: "Sutra 3.1 - AI Impact Assessment",
        content:
            "Sutra 3.1 mandates that all government and public institution deployments of AI systems must undergo a mandatory AI Impact Assessment (AIA) before deployment. The AIA must evaluate: potential societal impact, effect on fundamental rights, environmental footprint, accessibility for marginalized communities, and alignment with national development goals. AIAs must be reviewed by an independent ethics committee. Results must be published in a public registry maintained by MeitY.",
    },
    {
        id: "aisutra-3",
        standardCode: "India AI Sutra 2026",
        section: "Sutra 4.2 - Indigenous Language Support",
        content:
            "Sutra 4.2 requires that all AI interfaces deployed in Indian public institutions must support at least 5 scheduled languages in addition to English and Hindi. Priority languages include Tamil, Telugu, Kannada, Malayalam, Bengali, Marathi, and Gujarati. Machine translation and text-to-speech capabilities must be integrated. NLP models must be trained on Indian language datasets to ensure cultural context accuracy. Institutions must report language coverage metrics annually.",
    },
    {
        id: "aisutra-4",
        standardCode: "India AI Sutra 2026",
        section: "Sutra 5.3 - Bias Detection & Fairness",
        content:
            "Sutra 5.3 establishes mandatory bias detection and fairness auditing for AI systems. All AI models used in educational assessment, admissions, or resource allocation must undergo fairness testing across protected attributes including gender, caste, religion, disability status, and economic background. Disparate impact ratios exceeding 80% threshold require corrective action. Fairness audit reports must be filed with the AI Ethics Board quarterly. Institutions must maintain a bias incident register.",
    },
    {
        id: "aisutra-5",
        standardCode: "India AI Sutra 2026",
        section: "Sutra 6.1 - Data Sovereignty",
        content:
            "Sutra 6.1 mandates complete data sovereignty compliance for all AI systems in public institutions. All personal data and sensitive institutional data must be processed and stored within Indian borders. Cloud services must use data centers located in India. Cross-border data transfers require explicit approval from the Data Protection Authority. Encryption standards must meet AIS standards. Regular data sovereignty audits must be conducted annually.",
    },
    {
        id: "aisutra-6",
        standardCode: "India AI Sutra 2026",
        section: "Sutra 7.4 - Grievance Redressal",
        content:
            "Sutra 7.4 requires all institutions using AI-driven decision systems to establish a grievance redressal mechanism. Affected individuals must be able to challenge AI-driven decisions through a clearly defined appeals process. Human review must be available for all consequential decisions (admissions, grading, disciplinary actions). Response to grievances must be provided within 30 days. Institutions must appoint an AI Ombudsperson responsible for handling complaints.",
    },

    // IS 14489:2018 — Lab Safety
    {
        id: "is14489-1",
        standardCode: "IS 14489:2018",
        section: "Overview",
        content:
            "IS 14489:2018 specifies requirements for occupational health and safety management in laboratory environments within educational and research institutions. It covers chemical handling, equipment safety, personal protective equipment, ventilation, waste management, and emergency procedures specific to laboratory settings.",
    },
    {
        id: "is14489-2",
        standardCode: "IS 14489:2018",
        section: "Section 4.2 - Equipment Calibration",
        content:
            "Section 4.2 mandates that all laboratory measurement equipment must be calibrated at intervals not exceeding 12 months. Calibration must be performed by NABL-accredited laboratories. Calibration certificates must be maintained and displayed near the equipment. Equipment found out of calibration must be immediately taken out of service and labeled as 'Not for Use'. A master equipment register must be maintained with calibration schedules and history.",
    },

    // IS 732:2019 — Electrical Safety
    {
        id: "is732-1",
        standardCode: "IS 732:2019",
        section: "Overview",
        content:
            "IS 732:2019 is the Indian Standard Code of Practice for Electrical Wiring Installations. It applies to all buildings including educational institutions and covers planning, installation, testing, and maintenance of electrical systems to ensure safety of occupants.",
    },
    {
        id: "is732-2",
        standardCode: "IS 732:2019",
        section: "Clause 6.3 - Circuit Protection",
        content:
            "Clause 6.3 requires that all electrical circuits must be protected by appropriate circuit breakers (MCBs/MCCBs) rated for the connected load. Residual Current Devices (RCDs/ELCBs) with 30mA sensitivity must be installed on all socket outlet circuits. Distribution boards must be clearly labeled with circuit identification. Periodic testing of protective devices must be conducted every 6 months. Earth fault loop impedance must be measured and documented.",
    },

    // IS 3103:1975 — Ventilation
    {
        id: "is3103-1",
        standardCode: "IS 3103:1975",
        section: "Clause 3.1 - Air Changes",
        content:
            "Clause 3.1 of IS 3103 specifies minimum air changes per hour for different types of institutional spaces: classrooms require minimum 4-6 air changes per hour, laboratories require 6-10 air changes, chemical labs require 10-15 air changes with dedicated exhaust systems, workshops require 8-12 air changes, and auditoriums require 4-6 air changes. Natural ventilation openings must constitute at least 20% of floor area for naturally ventilated spaces.",
    },
];
