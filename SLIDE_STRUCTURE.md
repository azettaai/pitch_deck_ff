# Azetta.ai Pitch Deck - Final Structure

## Overview
8 slides total, with Omnilingual (OmniEm) positioned as the central/flagship product, and Cosma DB + Periodica as supporting infrastructure accessible via clickable modals.

---

## Slide Structure

### Slide 1: Title
**Azetta.ai - Foundational AI Research Lab**
- Company positioning
- YAT-Product tagline: "10x Smaller Models · 90% More Efficient · White-Box Interpretable"

### Slide 2: Problem
**The Scaling Impasse**
- Bloated architectures
- Non-determinism
- Black box effects

### Slide 3: Secondary Challenge
**Infrastructure Costs**
- RAM cliff problem
- Cost explosion at scale

### Slide 4: Solution
**YAT-Product Mathematical Foundation**
- Formula comparison (standard vs YAT)
- Validated results (vision tasks)
- Language model results (AetherGPT)
- Research collaboration (Prof. Choromanski)
- Aether Framework links

### Slide 5: YAT-Product Details (Modal-based)
**Interactive benchmarks and technical details**
- Opens via clickable element on Slide 4
- Contains detailed mathematical foundation
- Benchmark galleries and results

### Slide 6: Unit Economics
**Path to Profitability**
- Financial projections with caveats
- ARR projections
- Revenue per employee targets

### Slide 7: Core Product
**Omnilingual (OmniEm)** ⭐ FLAGSHIP
- Multilingual embedding models
- Unified latent space (100+ languages)
- Training approach
- Status update
- Value proposition

### Slide 8: Supporting Infrastructure
**Cosma DB & Periodica**
- Two large clickable cards
- Cosma DB: Vector database with O(1) indexing
  - Structure-free indexing
  - 10-100x cost reduction
  - Real-time RAG applications
  - Click to open detailed modal
- Periodica: Interpretability suite
  - Weight tracing & gradient inspection
  - Decision auditing
  - Safety-critical industries
  - Click to open detailed modal
- Integrated architecture explanation

### Slide 9: Competitive Barriers
**Technical Replication Challenges**
- Trade secret IP
- Integrated architecture
- API-only access
- Open source strategy (old models public, current models private)

### Slide 10: Team
**Founder-Market Fit**
- Taha Bouhsine (CEO)
- Douglas Seo (CTO)
- Jose Miguel Luna (Startup Advisor)
- Research advisory: Prof. Krzysztof Choromanski

### Slide 11: The Ask
**$2M Pre-Seed Round**
- Minimum check: $50K
- Use of funds breakdown
- 18-month milestones
- Honesty statement about validation needs

---

## Modal Components

### Cosma DB Modal
**Triggered by**: Click on Cosma DB card (Slide 8)
**Contents**:
- Foundation explanation
- Key features (structure-free indexing, deterministic latency, O(1) indexing)
- Technical advantages
- Status update

### Periodica Modal
**Triggered by**: Click on Periodica card (Slide 8)
**Contents**:
- Key innovation (structural interpretability)
- Safety-critical applications
- Core capabilities (weight tracing, gradient inspection, decision auditing, real-time monitoring)
- Target industries
- Status update

### Additional Modals
- Results Modal (YAT-Product details)
- AetherGPT Benchmarks Modal
- Profitability Modal
- Competitive Landscape Modal

---

## Key Improvements Made

1. **Omnilingual as Central Focus**: Moved from "Component 2" to "Core Product" on its own dedicated slide
2. **Supporting Components Separated**: Cosma DB and Periodica now have their own slide (Slide 8) as "Supporting Infrastructure"
3. **Enhanced Clickability**: Larger, more prominent cards with bullet points and clear CTAs
4. **Modal Access**: Detailed information accessible via modals to keep slides clean
5. **Clear Hierarchy**:
   - YAT-Product = Foundation (Slide 4)
   - Omnilingual = Core Product (Slide 7)
   - Cosma DB + Periodica = Supporting Infrastructure (Slide 8)

---

## Navigation

- **Arrow Keys**: Navigate between slides
- **F Key**: Toggle fullscreen
- **Home/End**: Jump to first/last slide
- **Click Cards**: Open modals for Cosma DB and Periodica details

---

## File Locations

- **Main Deck**: `/Users/douglasseo/Desktop/Workplace/Azetta/technical_report_azetta/index.html`
- **Modal HTML** (to be integrated): `/Users/douglasseo/Desktop/Workplace/Azetta/technical_report_azetta/modals_to_add.html`
- **Styles**: `/Users/douglasseo/Desktop/Workplace/Azetta/technical_report_azetta/styles.css`
- **Scripts**: `/Users/douglasseo/Desktop/Workplace/Azetta/technical_report_azetta/script.js`

---

## Next Steps

To complete the integration:
1. Copy contents from `modals_to_add.html`
2. Paste into `index.html` before the line: `<!-- KaTeX JavaScript for LaTeX math rendering -->`
3. This will make the Cosma DB and Periodica cards fully functional with modal popups
