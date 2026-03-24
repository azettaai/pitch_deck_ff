# Azetta.ai — Friends & Family Pitch Deck

> **Interactive pitch deck for Azetta.ai — Physics Grounded AI research lab building interpretable, steerable, and efficient AI systems.**

![Status](https://img.shields.io/badge/status-Friends_%26_Family_Round-blue.svg)
![Platform](https://img.shields.io/badge/platform-GitHub%20Pages-green.svg)
![Live](https://img.shields.io/badge/demo-live-brightgreen.svg)

**🌐 Live Deck:** [https://www.azetta.ai/pitch_deck_ff/](https://www.azetta.ai/pitch_deck_ff/)

---

## Overview

This repository contains the **interactive Friends & Family investor pitch deck** for **Azetta.ai**, a Physics Grounded AI research lab building glass-box models that are interpretable, steerable, and efficient by design.

---

## Deck Structure (15 Slides)

| # | Slide | Description |
|---|-------|-------------|
| 01 | Cover | Friends & Family Round — Feb 2026 |
| 02 | The Problem | AI scaled without interpretability; every major AI risk traces back to this gap |
| 03 | The Incumbent Approach | How black-box models work and why they fail |
| 04 | Our Research | YAT kernel formula, manifold geometry, and 2 ICML 2026 papers |
| 05 | The Azetta Approach | Physics Grounded AI: Interpretable, Steerable, Efficient, Performant |
| 06 | Competitive Landscape | 2×2 matrix positioning Azetta vs. the field |
| 07 | Go-To-Market | Research → Patent → Build → Publish → Sell → Enterprise flywheel |
| 08 | Research Agenda | NoMoreDelulu & SLAY Attention (ICML 2026); NeurIPS roadmap |
| 09 | First Product Spinoff: Periodica | Full model interpretability & steering platform |
| 10 | Next Product Spinoff: Aether Models | Fully interpretable SOTA models via API, ~10× fewer parameters |
| 11 | Market Opportunity | $1B SAM today → $25B by 2035 at 38% CAGR |
| 12 | Exit Scenarios | Acqui-hire ($50–100M) → Strategic acquisition → IPO-scale |
| 13 | The Team | Taha Bouhsine (CEO), Douglas Seo (CTO), Jose Miguel Luna (CPO) + Advisors |
| 14 | The Ask | $250K F&F · Post-Money SAFE · $5M cap · Min. $50K ticket |
| 15 | Closing | contact@azetta.ai |

---

## The Science: YAT Kernel

The core innovation is the **YAT kernel** — a physics-grounded Mercer kernel that replaces the dot product in neural networks:

```
ⵟ(x, w) = (x·w)² / ‖x − w‖²
```

Unlike dot products and cosines, the YAT kernel measures how much a weight vector acts as an **attractor** for an input — yielding monosemantic neurons by design, not approximation. Each neuron fires for exactly one concept, preserving a geometric manifold that creates a full audit trail from input to output.

**Research output:** 2 papers submitted to ICML 2026 — *NoMoreDelulu* and *SLAY Attention*.

---

## Products

| Product | Description | Status |
|---------|-------------|--------|
| **Periodica** | Full model interpretability & steering platform. Upload any model — get a neuron map and direct steering controls, no retraining required. | First spinoff |
| **Aether Models** | Fully interpretable SOTA language models available via API. ~7B params vs ~70B for comparable SOTA models. | Next spinoff |

---

## The Ask

| Term | Detail |
|------|--------|
| Round | Friends & Family |
| Amount | $250,000 |
| Instrument | Post-Money SAFE |
| Valuation Cap | $5M |
| Minimum Ticket | $50,000 |
| Runway | 6 months to Pre-Seed |

**Use of Funds:** 40% Talent · 30% Compute · 30% Business Operations

---

## Repository Structure

```
pitch_deck_ff/
├── index.html              # Pitch deck (source, read by build.js)
├── styles.css              # Dark physics-themed UI
├── script.js               # Navigation & interactive visualizations
├── build.js                # Encrypts deck and outputs to dist/ for deployment
├── logos/                  # Competitor and partner logos
├── team_images/            # Founder photos
├── Assets/                 # Diagrams and supporting images
└── New_Pitch_Deck/         # Development working copy
```

### Running Locally

```bash
# Serve with any HTTP server (file:// won't work due to JS modules)
python -m http.server 8000
# Open http://localhost:8000
```

### Deployment

Pushes to `main` trigger the **Encrypt & Deploy** GitHub Actions workflow, which:
1. Runs `build.js` to AES-256-GCM encrypt the deck content (password stored as `DECK_PASSWORD` secret)
2. Outputs to `dist/`
3. Deploys to GitHub Pages → [https://www.azetta.ai/pitch_deck_ff/](https://www.azetta.ai/pitch_deck_ff/)

---

## Team

- **Taha Bouhsine** — Co-Founder & CEO. Architect of Physics Grounded AI. ICML 2026 author.
- **Douglas Seo** — Co-Founder & CTO. 3× founder, Founders Fund network, Berkeley CS.
- **Jose Miguel Luna** — Co-Founder & CPO. Ex-Apple, Columbia MBA + MS AI/ML.

---

## Contact

- **Email:** contact@azetta.ai
- **Website:** [https://azetta.ai](https://azetta.ai)

---

*Confidential — For Investor Review Only*
