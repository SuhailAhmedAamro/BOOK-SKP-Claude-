<!--
Sync Impact Report:
Version: 0.0.0 → 1.0.0 (Initial Constitution)
Modified Principles: N/A (Initial version)
Added Sections: All sections added (Core Principles, Content Standards, Development Workflow, Governance)
Removed Sections: None
Templates Requiring Updates:
  ✅ plan-template.md - Constitution Check section will use these principles
  ✅ spec-template.md - Aligned with technical accuracy and user scenario requirements
  ✅ tasks-template.md - Aligned with testable task structure and modular design
Follow-up TODOs: None
-->

# Physical AI & Humanoid Robotics Textbook Constitution

## Core Principles

### I. Technical Accuracy & Standards Compliance

All technical content MUST adhere to verified standards and current best practices:
- ROS 2 commands and examples MUST target "Humble" or "Iron" distributions exclusively
- NVIDIA Isaac Sim integration MUST follow official documentation and supported APIs
- Python code MUST follow PEP 8 standards; C++ MUST follow ROS 2 C++ style guide
- All mathematical equations MUST be rendered using LaTeX notation
- No deprecated or unsupported library versions may be referenced

**Rationale**: Students depend on working examples. Outdated or incorrect commands break trust and create frustration. Version-specific accuracy ensures reproducibility across Panaversity cohorts.

### II. Visual Communication First

Complex concepts MUST be explained visually before textual deep-dives:
- Architecture diagrams MUST use Mermaid.js for consistency and maintainability
- Every robotics system MUST include a block diagram showing sensor-actuator-controller relationships
- Isaac Sim scenes MUST include annotated screenshots or rendered visualizations
- Data flow (ROS 2 topics, services, actions) MUST be visualized using sequence or flow diagrams

**Rationale**: Embodied AI involves spatial reasoning and multi-component interactions that text alone cannot convey effectively. Visual-first teaching accelerates comprehension for engineering students.

### III. Adaptive Learning Paths

Content MUST support multiple skill levels through clear differentiation:
- **Beginner Path (O/A Level)**: Python-focused, simplified abstractions, step-by-step tutorials
- **Advanced Path (Professional)**: C++ and CUDA implementations, performance optimization, low-level control
- Chapter content MUST be tagged with difficulty levels: [Beginner], [Intermediate], [Advanced]
- Advanced sections MUST NOT be prerequisites for understanding core concepts
- Optional deep-dive sections (e.g., CUDA kernels, Eigen matrix operations) clearly marked

**Rationale**: Panaversity serves diverse learners. A single-difficulty curriculum excludes either beginners or advanced practitioners. Adaptive paths maximize accessibility without diluting rigor.

### IV. Mandatory Self-Assessment

Every chapter MUST conclude with a "Self-Assessment" section containing:
- 5-10 multiple-choice questions testing conceptual understanding
- At least 2 practical coding challenges with success criteria
- Questions MUST cover: theory (30%), implementation (50%), troubleshooting (20%)
- Answers and explanations provided in an appendix or collapsible section

**Rationale**: Self-assessment transforms passive reading into active learning. MCQs provide immediate feedback loops critical for remote/asynchronous education models.

### V. AI-Native Authorship Transparency

This textbook acknowledges its AI-assisted creation:
- Tone is encouraging but professional—addresses students directly ("you will implement...")
- Does NOT pretend human authorship where AI was primary contributor
- References are cited; generated examples are validated against official docs
- Updates and errata are version-controlled with clear changelogs

**Rationale**: Transparency about AI authorship builds trust and models responsible AI use for students who will themselves leverage AI tools professionally.

### VI. Bilingual Support (English/Urdu)

Content MUST support Urdu translation via structured mechanisms:
- All chapter headings, key terms, and UI elements MUST have Urdu equivalents
- Translation toggle available in web/interactive formats
- Technical terms (e.g., "node", "topic", "simulation") retain English with Urdu explanations
- LaTeX equations remain language-neutral; descriptive text translated

**Rationale**: Panaversity's Pakistan-based audience includes Urdu-first learners. Bilingual support democratizes access to cutting-edge robotics education.

## Content Standards

### Chapter Structure (Non-Negotiable)

Each chapter MUST follow this structure:
1. **Learning Objectives** (3-5 bullet points, measurable outcomes)
2. **Conceptual Overview** (text + Mermaid diagram, 500-800 words)
3. **Hands-On Tutorial** (step-by-step, tested code examples)
4. **Advanced Topics** (optional, marked [Advanced], 300-500 words)
5. **Self-Assessment** (MCQs + 2 coding challenges)
6. **Further Resources** (official docs, research papers, video links)

### Code Example Requirements

All code samples MUST:
- Be executable in specified environment (ROS 2 Humble/Iron + Isaac Sim version)
- Include prerequisite setup instructions (e.g., `sudo apt install ros-humble-nav2`)
- Provide expected output or behavior description
- Handle common errors with try-catch or defensive checks
- Be syntax-highlighted and include line comments for complex logic

### Mathematical Rigor

- Equations MUST be derived step-by-step for core concepts (kinematics, dynamics, control theory)
- Variables MUST be defined before first use (e.g., "$\theta$: joint angle in radians")
- Numerical examples MUST accompany abstract equations
- Simulation results MUST validate theoretical predictions (e.g., PID controller response curves)

## Development Workflow

### Content Creation Process

1. **Outline Approval**: Chapter structure reviewed by subject matter experts before drafting
2. **Draft with Runnable Code**: All code examples tested in target environment
3. **Visual Asset Creation**: Mermaid diagrams embedded; Isaac Sim screenshots captured at 1920x1080
4. **Peer Review**: Technical accuracy validated by ROS 2/Isaac Sim practitioners
5. **Student Beta Testing**: Selected Panaversity students test tutorials and report issues
6. **Version Release**: Semantic versioning (MAJOR.MINOR.PATCH) for textbook updates

### Quality Gates

Before a chapter is marked "Complete":
- [ ] All code examples execute without errors in clean ROS 2 Humble environment
- [ ] Mermaid diagrams render correctly in target platform (web/PDF)
- [ ] Self-assessment questions reviewed for clarity and correctness
- [ ] At least one beginner and one advanced path student have completed tutorials
- [ ] Urdu translations reviewed by native speaker for technical term accuracy

### Version Control & Errata

- Textbook source maintained in Git repository
- Each chapter is a separate markdown file
- Errata tracked in `ERRATA.md` with chapter/section/line references
- Critical errors (breaking code, incorrect math) trigger PATCH release within 48 hours
- Minor improvements batched into MINOR releases quarterly

## Governance

### Amendment Process

Changes to this constitution require:
1. Proposed amendment documented with rationale
2. Impact assessment on existing chapters (how many require updates?)
3. Review by Panaversity curriculum committee
4. Approval by majority vote of active contributors
5. Migration plan with timeline for affected content

### Constitution Supremacy

This constitution supersedes all prior content guidelines. In conflicts between:
- Constitution vs. chapter draft → Constitution wins
- Constitution vs. external style guide → Constitution wins (unless explicitly deferred)
- Principle vs. convenience → Principle wins (complexity must be justified)

### Compliance Verification

All pull requests/content submissions MUST:
- Include checklist confirming adherence to Core Principles
- Pass automated checks (LaTeX rendering, Mermaid syntax, code linting)
- Be reviewed by maintainer with veto power for constitutional violations

### Principle Justification

If a chapter requires violating a principle (e.g., skipping Mermaid for a trivial concept):
- Violation MUST be explicitly called out in PR description
- Alternative approach MUST be proposed and rejected with reasoning
- Approval requires sign-off from two maintainers

**Version**: 1.0.0 | **Ratified**: 2025-12-18 | **Last Amended**: 2025-12-18
