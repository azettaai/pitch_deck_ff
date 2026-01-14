# Azetta.ai Investor Pitch Deck

> **Interactive pitch deck for Azetta.ai — Foundational AI Research Lab pioneering interpretable and efficient intelligence through YAT-Product mathematics.**

![Status](https://img.shields.io/badge/status-Pre--Seed-blue.svg)
![Platform](https://img.shields.io/badge/platform-GitHub%20Pages-green.svg)
![Live](https://img.shields.io/badge/demo-live-brightgreen.svg)

---

## 📄 Overview

This repository contains the **interactive investor pitch deck** for **Azetta.ai**, featuring:

- **YAT-Product Mathematical Foundation** — Research approach and validation results
- **Go-to-Market Products** — Omnilingual, Cosma DB, and Periodica
- **Business Model & Unit Economics** — Projected revenue, EBITDA targets, and funding requirements
- **Interactive Technical Explanations** — Hover tooltips for deep dives into key concepts

---

## 🎯 Go-to-Market Products

YAT-Product research enables three product applications:

| Product | Description | Status |
|---------|-------------|--------|
| **YAT-Product** | First-Principled Gravitational Mercer Kernel replacing dot-product in neural networks | Research Foundation |
| **Omnilingual** | Multilingual embedding models within unified YAT-Product latent space | In Development |
| **Cosma DB** | High-performance vector database utilizing YAT-Product based embeddings | Architecture Designed |
| **Periodica** | Full-interpretability suite for safety-critical industries | Planned |

### Core Innovation (YAT-Product Mathematics)

- **10x Smaller Models** — Projected 100M params achieving performance of 500M+ standard models
- **90% More Efficient** — Inference and indexing efficiency (projected)
- **White-Box Interpretable** — Every weight and gradient traces back to physical principles
- **Enables Applications** — Cosma DB's efficient operations and Omnilingual's unified latent space

**Validation Status:**
- Vision tasks: CIFAR-100 (+2.68%), STL-10 (+2.49%), ImageNet-1K (+1.11%) ✓ Validated
- Language models: AetherGPT (YatFormer) competitive with GPT-2 ✓ Small-scale validated
- Production-scale (100M+ params): Requires GPU infrastructure for benchmarking

**Research Availability:** Code and models available on [pypi.org](https://pypi.org/project/nmn/) and [arXiv](https://arxiv.org/search/cs?searchtype=author&query=Bouhsine%2C+T). Collaboration with Prof. Krzysztof Choromanski (Google DeepMind & Columbia University).

---

## 📁 Repository Structure

```
azetta_pitch_deck/
├── index.html             # Interactive pitch deck
├── styles.css             # CRT terminal styling
├── script.js              # Navigation & visualizations
├── concepts.js            # Tooltip system
└── README.md
```

---

## 🖥️ Interactive Pitch Deck

**🌐 Live Demo:** [https://azettaai.github.io/azetta_pitch_deck/](https://azettaai.github.io/azetta_pitch_deck/)

The pitch deck features:

- **CRT Terminal Aesthetic** — Retro-futuristic green phosphor design
- **Interactive Tooltips** — Click any highlighted term for detailed explanation
- **Animated Visualizations** — Canvas-based complexity graphs and platform diagrams
- **Keyboard Navigation** — Arrow keys, Home/End, F for fullscreen

### Running Locally

```bash
# Simply open in browser
open index.html

# Or serve with any HTTP server
python -m http.server 8000
# Then open http://localhost:8000
```

---

## 📊 Financial Summary

**Note:** Financial projections are contingent on successful model training and benchmark validation.

| Metric | Year 1 | Year 3 | Year 5 |
|--------|--------|--------|--------|
| ARR (Projected) | $350K | $10.4M | $44.6M |
| Customers | 5 | 75 | 200 |
| Team Size | 4 | 12 | 19 |
| EBITDA | -$1.1M | -$0.9M | +$8.0M |

**Funding Ask:** $2M Pre-Seed Round (Minimum check: $50K)

**Use of Funds:**
- $1,000,000 (50%): 5 World-Class Machine Learning Engineers
- $700,000 (35%): GPU Compute and Infrastructure
- $300,000 (15%): Legal, Operations, and GTM Strategy

---

## 🔧 Building the Whitepaper

Requires TeX Live or similar LaTeX distribution:

```bash
cd tex
latexmk -pdf main.tex
```

---

## 📬 Contact

- **Company**: Azetta.ai
- **Email**: investors@azetta.ai
- **Website**: https://azetta.ai

---

**Confidential — For Investor Review Only**
