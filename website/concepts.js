/**
 * Concept Tooltip System for Azetta.ai Pitch Deck
 * Provides interactive explanations for technical and business terms
 */

const CONCEPTS = {
    // ===== TITLE SLIDE =====
    "omnilingual": {
        term: "Omnilingual",
        definition: "The ability to understand and process 100+ languages in a single unified system without separate translation layers or language-specific indexes.",
        impact: "Eliminates the 95% of AI deployments that artificially limit data by language, enabling true global search across all enterprise knowledge.",
        potential: "First-mover advantage in a market where no competitor offers true cross-language semantic understanding at scale.",
        risks: "Requires continuous training data updates as languages evolve; low-resource languages may have reduced accuracy initially."
    },

    "jevons-paradox": {
        term: "Jevons Paradox",
        definition: "An economic principle where technological improvements that increase resource efficiency lead to increased total consumption of that resource, not decreased consumption.",
        impact: "When we reduce vector search costs by 10-20x, enterprises will index 100x more data—their entire archives, logs, and history—not just 'hot' data.",
        potential: "Creates exponential revenue growth as customers use more embeddings due to lower unit costs. A $5K customer could become $50K.",
        risks: "Requires infrastructure to handle massive scale; competitors may attempt price matching (but can't due to architecture)."
    },

    // ===== PROBLEM SLIDES =====
    "filter-trap": {
        term: "The Filter Trap",
        definition: "The industry practice of partitioning AI search by metadata (language, date, region) to reduce infrastructure costs, artificially limiting the system's intelligence.",
        impact: "95% of enterprise AI deployments use filters, meaning their AI literally cannot find relevant information in other languages or partitions.",
        potential: "Eliminating this trap unlocks cross-lingual discovery—an English query finding a Spanish manual, a Japanese patent, or Arabic research.",
        risks: "Enterprises have built workflows around filtered search; migration requires behavior change."
    },

    "intelligence-silos": {
        term: "Intelligence Silos",
        definition: "Fragmented knowledge bases where information in one language or department cannot be discovered by queries from another, despite semantic equivalence.",
        impact: "Enterprises duplicate effort, miss insights, and make worse decisions because their AI cannot see the full picture.",
        potential: "Breaking silos creates compound intelligence—each piece of knowledge becomes accessible from any language or context.",
        risks: "Data governance becomes more complex when everything is interconnected."
    },

    "ram-cliff": {
        term: "The RAM Cliff",
        definition: "The point at which vector database costs become prohibitive because graph-based indexes (HNSW) require all data structures to reside in expensive RAM.",
        impact: "At 1 billion vectors, competitors require ~3TB RAM costing $15K+/month just to hold the index—before any queries.",
        potential: "Eliminating RAM dependency means 10-20x cost reduction and removes the scaling ceiling entirely.",
        risks: "Disk I/O becomes the new bottleneck; requires specialized optimization."
    },

    "linear-ram": {
        term: "O(N) Memory Scaling",
        definition: "A cost function where memory requirements grow linearly with data size—double your data, double your RAM costs.",
        impact: "Creates an unsustainable economic model where the largest possible deployments are also the most unprofitable.",
        potential: "Our O(1) memory architecture means costs plateau regardless of data volume—enabling previously impossible scale.",
        risks: "Computational complexity shifts elsewhere; requires careful query optimization."
    },

    "hnsw": {
        term: "HNSW (Hierarchical Navigable Small World)",
        definition: "The dominant graph-based algorithm for approximate nearest neighbor search, used by Pinecone, Weaviate, Milvus, and pgvector.",
        impact: "Industry standard with excellent read performance, but forces three fundamental taxes: Write Tax, Memory Tax, and Mutability Tax.",
        potential: "Well-understood algorithm with extensive optimizations available.",
        risks: "Inherently RAM-bound architecture cannot be optimized away—it's a mathematical limitation of the graph structure."
    },

    "three-taxes": {
        term: "The Three Taxes of HNSW",
        definition: "Write Tax (30-50% CPU on insertion), Memory Tax (RAM-only index), and Mutability Tax (expensive updates requiring re-indexing).",
        impact: "These taxes compound: fast writes need more CPU, large scale needs more RAM, real-time updates need constant re-indexing.",
        potential: "CVD eliminates all three by removing the graph structure entirely.",
        risks: "Some workloads with read-heavy, static data may not benefit as much from tax elimination."
    },

    // ===== SOLUTION SLIDE =====
    "coem": {
        term: "COEM (Cosma Omnilingual Embedding Models)",
        definition: "Proprietary neural models that map 100+ languages into a unified 768-dimensional vector space where semantically similar content clusters regardless of source language.",
        impact: "The 'bridge' that makes disk-native search mathematically possible. Standard embeddings (OpenAI, Cohere) are incompatible with efficient storage-based indexing.",
        potential: "Creates symbiotic lock-in: COEM vectors require CVD, CVD requires COEM. Competitors must rebuild both to compete.",
        risks: "Model training requires significant GPU investment; accuracy depends on parallel corpus quality for each language."
    },

    "cvd": {
        term: "CVD (Cosma Vector Database)",
        definition: "A proprietary storage engine that eliminates graph-maintenance overhead through Direct-Storage Traversal, achieving O(1) memory complexity.",
        impact: "Data is searchable in milliseconds, not hours. No HNSW rebuild phases. Runs on commodity disk storage, not expensive RAM.",
        potential: "Enables use cases that were economically unbuildable: billion-vector personal search, planetary-scale biometrics, universal genomic matching.",
        risks: "Trade-secret architecture means no open-source community; enterprise buyers must trust our closed-source approach."
    },

    "csl": {
        term: "CSL (Cosma Serverless Layer)",
        definition: "Fully managed API layer that handles embedding generation, vector search, and ranking workflows with automatic scaling and zero infrastructure management.",
        impact: "Reduces time-to-production from weeks to hours. Developers call one API, we handle the complex ML pipeline.",
        potential: "Self-service tier enables product-led growth; 70%+ customer acquisition without enterprise sales.",
        risks: "API dependency creates vendor lock-in concerns for some enterprises."
    },

    "disk-native": {
        term: "Disk-Native Architecture",
        definition: "An indexing approach where vectors are stored and searched directly on disk/SSD storage rather than requiring all data structures in RAM.",
        impact: "Disk costs ~$0.08/GB/month vs RAM at ~$5/GB/month—a 60x cost reduction at the storage layer.",
        potential: "Removes the RAM cliff entirely, enabling infinite horizontal scaling limited only by disk capacity.",
        risks: "Disk I/O latency (~0.1ms SSD) is higher than RAM (~0.0001ms); requires architectural optimizations to maintain performance."
    },

    // ===== CVD INNOVATION SLIDE =====
    "structure-free": {
        term: "Structure-Free Indexing",
        definition: "An indexing method that does not maintain neighbor relationships or graph edges between vectors—the opposite of HNSW's connected graph approach.",
        impact: "Eliminates the memory overhead of storing millions of edge pointers, and removes the computational cost of graph maintenance on every insert.",
        potential: "Updates and deletes become standard database operations, not complex graph repairs. Instant mutability.",
        risks: "Requires specialized training of embedding models to produce vectors compatible with structure-free search."
    },

    "direct-storage": {
        term: "Direct-Storage Traversal",
        definition: "A proprietary algorithm (trade secret) that enables semantic search directly on disk-stored vectors without loading them into RAM-based graph structures.",
        impact: "Decouples semantic precision from RAM-intensive data structures, enabling disk-native inference.",
        potential: "Core technical moat—cannot be replicated without years of specialized expertise across vector DBs, multilingual NLP, and kernel methods.",
        risks: "Algorithm is unpublished; some prospects may require technical due diligence."
    },

    "deterministic-latency": {
        term: "Deterministic Latency",
        definition: "Query response times that are consistent and predictable, unlike HNSW where latency varies based on graph traversal paths ('jitter').",
        impact: "Critical for production SLAs: enterprises can guarantee p99 latency without provisioning for worst-case graph paths.",
        potential: "Enables latency-sensitive applications like real-time content moderation and interactive search.",
        risks: "Deterministic doesn't mean 'fastest'—some HNSW queries may be faster for small datasets."
    },

    "zero-build": {
        term: "Zero Build Time",
        definition: "Data becomes searchable immediately upon ingestion—no background index construction, warm-up phases, or HNSW rebuild cycles.",
        impact: "Critical for real-time RAG (Retrieval-Augmented Generation) where new documents must be immediately queryable.",
        potential: "Enables use cases impossible with HNSW: live document ingestion, streaming data search, instant knowledge base updates.",
        risks: "Performance characteristics differ from batch-indexed systems; requires different capacity planning."
    },

    // ===== COEM INNOVATION SLIDE =====
    "manifold-regularization": {
        term: "Manifold Regularization",
        definition: "A machine learning training technique that constrains the embedding space to have smooth geometric structure, ensuring similar meanings map to nearby points.",
        impact: "Produces vectors with specific geometric properties required for CVD's disk-native search—standard embeddings lack this structure.",
        potential: "Creates the mathematical 'bridge' between language understanding and efficient storage-based retrieval.",
        risks: "Regularization may slightly reduce raw accuracy on standard benchmarks while improving practical retrieval quality."
    },

    "symbiotic-lockin": {
        term: "Symbiotic Lock-In",
        definition: "A competitive moat where two components (COEM and CVD) are designed to depend on each other's properties, making partial replication useless.",
        impact: "Competitors cannot copy just the database or just the model—they must rebuild both simultaneously with coordinated design.",
        potential: "Multi-year head start: even with understanding the concept, execution requires deep expertise across multiple specialized domains.",
        risks: "Lock-in works both ways—if we fail to maintain innovation velocity, customers have limited migration paths."
    },

    // ===== BUSINESS MODEL SLIDE =====
    "counter-positioning": {
        term: "Counter-Positioning Strategy",
        definition: "A competitive strategy where adopting the new business model would damage the incumbent's existing profitable business—they rational choose not to copy us.",
        impact: "Pinecone, Weaviate, and Milvus cannot match our zero-markup infrastructure pricing without destroying their 20-40% infrastructure margins.",
        potential: "Creates sustainable pricing advantage: incumbents are structurally unable to compete on our terms.",
        risks: "Requires maintaining technology differentiation; pure pricing advantage is temporary if tech gap closes."
    },

    "at-cost-infra": {
        term: "At-Cost Infrastructure",
        definition: "Passing through raw cloud provider costs (AWS/GCP) with zero markup—customers pay exactly what the infrastructure costs us.",
        impact: "Creates radical transparency and trust with enterprise buyers. A $5K/month workload costs $5K, not $6-7K like competitors.",
        potential: "Converts infrastructure from profit center to customer acquisition wedge—we compete then monetize on COEM usage.",
        risks: "Zero-margin infrastructure means all profit must come from model usage; requires high COEM adoption rates."
    },

    "nrr": {
        term: "NRR (Net Revenue Retention)",
        definition: "A SaaS metric measuring revenue from existing customers year-over-year, including expansion, contraction, and churn. 110% means each $1 becomes $1.10.",
        impact: "Our 110-130% NRR target means existing customers naturally grow revenue without additional sales effort—expansion revenue is built into the product.",
        potential: "High NRR compounds dramatically: 120% NRR means revenue doubles every ~4 years from existing customers alone.",
        risks: "Requires delivering continuous value; usage-based pricing means NRR drops if customers reduce embedding volume."
    },

    // ===== MOATS SLIDE =====
    "trade-secret-ip": {
        term: "Trade Secret IP Strategy",
        definition: "Protecting intellectual property by keeping it secret rather than patenting—no public disclosure, no 20-year expiration, no design-around guidance for competitors.",
        impact: "CVD algorithm, CosmaDistance metric, and COEM training pipeline are unpublished. Competitors cannot study our approach.",
        potential: "Indefinite protection as long as secrecy is maintained—unlike patents which expire and require disclosure.",
        risks: "No legal protection if independently discovered; requires strict internal controls; some enterprises prefer patented technology."
    },

    "api-only": {
        term: "API-Only Access",
        definition: "Technology delivered exclusively through our managed API—no open-source core, no model downloads, no architectural documentation for self-hosting.",
        impact: "Prevents commoditization and ensures every use generates revenue. No 'free tier abuse' at scale.",
        potential: "Maintains full control over pricing, features, and customer experience.",
        risks: "Some enterprises require on-premise deployment; may lose deals to open-source alternatives that offer more control."
    },

    // ===== UNIT ECONOMICS SLIDE =====
    "ebitda": {
        term: "EBITDA",
        definition: "Earnings Before Interest, Taxes, Depreciation, and Amortization—a measure of operating profitability that excludes non-cash expenses and financing costs.",
        impact: "Our target: EBITDA-positive by Year 4 at $44.6M ARR, demonstrating a path to self-sustaining operations.",
        potential: "18% EBITDA margin by Year 5 represents best-in-class SaaS efficiency, attractive for acquisition or IPO.",
        risks: "Aggressive growth investment in Years 1-3 means significant cash burn; requires executing on revenue targets."
    },

    "rev-per-employee": {
        term: "Revenue per Employee",
        definition: "Annual recurring revenue divided by total headcount—a measure of operational efficiency and leverage.",
        impact: "Our $2.3M/employee by Year 5 is 10-20x the typical SaaS benchmark of $150-250K/employee.",
        potential: "Extreme capital efficiency means profitability with less dilution; attractive unit economics for investors.",
        risks: "Aggressive ratio requires heavy automation; may limit customer success quality if stretched too thin."
    },

    // ===== COMPETITIVE SLIDE =====
    "o1-memory": {
        term: "O(1) Memory Complexity",
        definition: "A cost function where memory requirements remain constant regardless of data size—index 1 million or 1 billion vectors with the same RAM footprint.",
        impact: "Fundamentally different economics: scale is limited by cheap disk capacity, not expensive RAM.",
        potential: "Enables use cases that are mathematically impossible for O(N) systems—trillion-vector indexes become conceivable.",
        risks: "Requires specialized embedding models; not compatible with standard OpenAI/Cohere vectors."
    },

    // ===== TEAM SLIDE =====
    "kernel-methods": {
        term: "Kernel Methods",
        definition: "A class of machine learning algorithms that operate in high-dimensional feature spaces without explicitly computing coordinates—foundational to SVMs and Gaussian Processes.",
        impact: "The mathematical foundation of our 'Structure-Free' embedding approach, enabling disk-native search.",
        potential: "Deep theoretical grounding provides confidence in long-term scalability and correctness.",
        risks: "Specialized expertise is rare; hiring kernel methods experts is challenging."
    },

    // ===== COMPLEXITY CLASSES =====
    "complexity-o1": {
        term: "O(1) — Constant Time",
        definition: "An operation that takes the same amount of time regardless of how much data you have. Whether you have 1 million or 1 billion records, it finishes in the same time.",
        impact: "CVD indexing is O(1)—new data becomes searchable instantly without rebuilding indexes.",
        potential: "Enables real-time applications where data must be immediately queryable after insertion.",
        risks: "Achieving true O(1) often requires trade-offs in other areas like memory or preprocessing."
    },

    "complexity-logn": {
        term: "O(log n) — Logarithmic Time",
        definition: "Time grows very slowly as data increases. Doubling your data only adds one extra step. For 1 billion records, it takes only ~30 steps instead of 1 billion.",
        impact: "CVD search is O(log n)—queries remain fast even at massive scale. 10x more data ≠ 10x slower.",
        potential: "The gold standard for search operations.",
        risks: "Requires carefully structured algorithms; naive implementations fall back to O(n)."
    },

    "complexity-n": {
        term: "O(n) — Linear Time",
        definition: "Time grows directly with data size. Double your data, double your time. At scale, this becomes a major bottleneck and cost driver.",
        impact: "HNSW memory requirements are O(n)—the 'RAM Cliff' where costs grow linearly with vectors.",
        potential: "Sometimes unavoidable for operations that must touch every record.",
        risks: "At billion-vector scale, O(n) operations become prohibitively expensive in both time and cost."
    },

    "complexity-nlogn": {
        term: "O(n log n) — Linearithmic Time",
        definition: "Slightly worse than linear—time grows with data size times the logarithm. Common for efficient sorting algorithms like mergesort and heapsort.",
        impact: "Many graph-building and index construction algorithms fall into this class.",
        potential: "Often the best achievable for comparison-based sorting and many divide-and-conquer algorithms.",
        risks: "At scale, the log factor adds meaningful overhead compared to pure O(n)."
    },

    "complexity-n2": {
        term: "O(n²) — Quadratic Time",
        definition: "Time grows with the square of data size. 10x more data = 100x more time. Essentially unusable at scale—1 million records means 1 trillion operations.",
        impact: "Naive similarity comparisons (checking every pair) are O(n²)—completely impractical for vector search.",
        potential: "Only acceptable for very small datasets or as preprocessing for better algorithms.",
        risks: "Even modest data sizes become intractable. This is why approximate methods like HNSW exist."
    }
};

/**
 * Initialize the concept tooltip system
 */
let lockedConcept = null;
let globalTooltip = null;

function initConceptTooltips() {
    // Create a single tooltip element for all concepts
    globalTooltip = document.createElement('div');
    globalTooltip.className = 'concept-tooltip';
    globalTooltip.id = 'globalConceptTooltip';
    document.body.appendChild(globalTooltip);

    const concepts = document.querySelectorAll('.concept');

    concepts.forEach(concept => {
        const key = concept.dataset.concept;
        const data = CONCEPTS[key];

        if (!data) {
            console.warn(`No concept data found for: ${key}`);
            return;
        }

        // Store data on element for access in handlers
        concept._conceptData = data;

        // Add tabindex for keyboard accessibility
        concept.setAttribute('tabindex', '0');
        concept.setAttribute('role', 'button');
        concept.setAttribute('aria-label', `Learn more about ${data.term}`);

        // Show tooltip on hover (only if not locked)
        concept.addEventListener('mouseenter', () => {
            if (!lockedConcept) {
                showTooltip(concept, data, globalTooltip);
            }
        });
        concept.addEventListener('mouseleave', () => {
            if (!lockedConcept) {
                hideTooltip(globalTooltip);
            }
        });

        // Click to lock/unlock tooltip
        concept.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (lockedConcept === concept) {
                // Clicking same concept - unlock
                lockedConcept = null;
                concept.classList.remove('concept-locked');
                hideTooltip(globalTooltip);
            } else {
                // Lock to this concept
                if (lockedConcept) {
                    lockedConcept.classList.remove('concept-locked');
                }
                lockedConcept = concept;
                concept.classList.add('concept-locked');
                showTooltip(concept, data, globalTooltip);
            }
        });

        // Keyboard support
        concept.addEventListener('focus', () => {
            if (!lockedConcept) {
                showTooltip(concept, data, globalTooltip);
            }
        });
        concept.addEventListener('blur', () => {
            if (!lockedConcept) {
                hideTooltip(globalTooltip);
            }
        });
        concept.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                concept.click();
            } else if (e.key === 'Escape' && lockedConcept) {
                lockedConcept.classList.remove('concept-locked');
                lockedConcept = null;
                hideTooltip(globalTooltip);
            }
        });
    });

    // Click outside to close locked tooltip
    document.addEventListener('click', (e) => {
        if (lockedConcept && !e.target.closest('.concept') && !e.target.closest('.concept-tooltip')) {
            lockedConcept.classList.remove('concept-locked');
            lockedConcept = null;
            hideTooltip(globalTooltip);
        }
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lockedConcept) {
            lockedConcept.classList.remove('concept-locked');
            lockedConcept = null;
            hideTooltip(globalTooltip);
        }
    });
}

/**
 * Show tooltip with proper positioning
 */
function showTooltip(concept, data, tooltip) {
    // Update tooltip content
    tooltip.innerHTML = `
        <div class="tooltip-header">
            <span class="icon">◈</span>
            <span class="term">${data.term}</span>
            <span class="tooltip-close" onclick="closeLockedTooltip()">✕</span>
        </div>
        <div class="tooltip-body">
            <div class="tooltip-section definition">
                <div class="tooltip-section-label">Definition</div>
                <div class="tooltip-section-content">${data.definition}</div>
            </div>
            <div class="tooltip-section impact">
                <div class="tooltip-section-label">Impact</div>
                <div class="tooltip-section-content">${data.impact}</div>
            </div>
            <div class="tooltip-section potential">
                <div class="tooltip-section-label">Potential</div>
                <div class="tooltip-section-content">${data.potential}</div>
            </div>
            <div class="tooltip-section risks">
                <div class="tooltip-section-label">Risk</div>
                <div class="tooltip-section-content">${data.risks}</div>
            </div>
        </div>
    `;

    // Get element position
    const rect = concept.getBoundingClientRect();
    const tooltipWidth = 380;
    const tooltipHeight = tooltip.offsetHeight || 350;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const padding = 12;

    // Calculate horizontal position (centered on element)
    let left = rect.left + (rect.width / 2) - (tooltipWidth / 2);

    // Clamp to viewport
    if (left < padding) {
        left = padding;
    } else if (left + tooltipWidth > viewportWidth - padding) {
        left = viewportWidth - tooltipWidth - padding;
    }

    // Calculate vertical position (prefer above, fallback to below)
    let top;
    const spaceAbove = rect.top;
    const spaceBelow = viewportHeight - rect.bottom;

    if (spaceAbove > tooltipHeight + padding) {
        // Position above
        top = rect.top - tooltipHeight - padding;
    } else if (spaceBelow > tooltipHeight + padding) {
        // Position below
        top = rect.bottom + padding;
    } else {
        // Position at top of viewport with scroll
        top = padding;
    }

    // Apply position
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    tooltip.style.opacity = '1';
    tooltip.style.visibility = 'visible';
    tooltip.style.pointerEvents = 'auto';
}

/**
 * Hide tooltip
 */
function hideTooltip(tooltip) {
    tooltip.style.opacity = '0';
    tooltip.style.visibility = 'hidden';
    tooltip.style.pointerEvents = 'none';
}

/**
 * Close locked tooltip (called from close button)
 */
function closeLockedTooltip() {
    if (lockedConcept) {
        lockedConcept.classList.remove('concept-locked');
        lockedConcept = null;
    }
    hideTooltip(globalTooltip);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initConceptTooltips);
} else {
    initConceptTooltips();
}


