- **Question:** does reference-conditioned compression distance track downstream task performance?
- **Metric:** forward conditional-rate Wasserstein-1; smaller distances indicate closer coding-rate distributions.
- **Comparators:** SOL, handcrafted-feature energy distance, Gradient Moment, and Qwen3-8B-Base negative log-likelihood; all displayed scores use lower-is-better orientation.
- **Scope:** Pythia; separate analyses for each decoding setting.

#### Experimental setup

- **Model sizes:** 160M, 410M, 1B, and 6.9B.
- **Training checkpoints:** 3K, 13K, 33K, 63K, 103K, and 143K updates per size.
- **Decoding:** temperatures 0.7, 1.0, and 1.3 without truncation; temperature 1.0 with top-p 0.95; temperature 1.0 with top-k 20.
- **Generation pool:** 1,024 unconditional sequences per setting; 1,024 model-native tokens per sequence; generation seed 2026; EOS/BOS prompt excluded from evaluated text; generation continues through EOS.
- **Displayed analysis:** cached 512-sequence candidate bank split into 256 fit and 256 held-out sequences; 512 Pile reference sequences split into 256 fit and 256 held-out sequences; split seed 2026.
- **Forward score:** real-data fit dictionary only; 256 held-out real sequences versus 256 held-out generated sequences; generated fit samples are unused by this direction.
- **Downstream target:** unweighted mean accuracy across seven published five-shot evaluations: ARC-Challenge, ARC-Easy, LAMBADA, LogiQA, PIQA, SciQ, and WinoGrande; WSC and MMLU excluded from this aggregate.
- **Observation count:** 24 size–checkpoint pairs per decoding setting; 120 metric measurements overall; five decoding settings share each checkpoint's downstream target.

#### Measurement and analysis

- **Compressor:** Zstandard level 10; window log 23; fixed 64 KiB raw reference dictionary.
- **Coding protocol:** independent compression frame per sequence; adaptation within each sequence permitted; no context carried between evaluated sequences.
- **Normalization:** compressed bits per original UTF-8 byte; frame overhead included; shared dictionary transmission excluded.
- **Comparison:** exact empirical one-dimensional Wasserstein-1 between conditional coding rates; equal sequence weights; no histogram bins.
- **Association:** Spearman correlation between negative distance and downstream mean accuracy; positive correlation means lower distance accompanies higher accuracy.
- **Comparator sample counts:** SOL, energy distance, and Gradient Moment use 512 generated sequences per setting; Qwen likelihood uses 1,024; conditional compression uses 256 held-out sequences. Same 24 checkpoints, different cached sample budgets; not a sample-matched head-to-head comparison.
- **Comparator inputs:** SOL and Gradient Moment retokenize the text with a 1,024-token cap; energy distance uses the full text; sequence counts and tokenizer horizons differ from paper-default protocols.
- **Likelihood:** token-weighted Qwen3-8B-Base negative log-likelihood, expressed in bits per Pythia token; no compression penalty added.
- **Unigram entropy:** no complete saved Pythia checkpoint table found; omitted rather than replaced with compression rate or combined with likelihood using an arbitrary sum.
- **Controls:** separate pooled correlations, within-size correlations, and leave-one-size-out correlations; no fitted regression line or independence-based significance test.

<div id="downstream-results" class="downstream-results" aria-label="Downstream performance results">
<div class="experiment-toolbar"><label for="downstream-metric">Evaluation metric</label><select id="downstream-metric"><option value="conditional">Conditional compression W₁</option><option value="sol">SOL</option><option value="ed">Energy distance</option><option value="gm">Gradient Moment</option><option value="nll">Qwen3-8B-Base NLL</option></select></div>
<div class="experiment-toolbar"><label for="downstream-setting">Decoding setting</label><select id="downstream-setting"><option value="t10">T = 1.0</option><option value="t07">T = 0.7</option><option value="t10-p095">T = 1.0 · top-p 0.95</option><option value="t10-k20">T = 1.0 · top-k 20</option><option value="t13">T = 1.3</option></select></div>
<div id="downstream-status" role="status" aria-live="polite">Loading saved results…</div>
<div id="downstream-legend" class="experiment-legend"></div>
<div id="downstream-scatter" class="experiment-plot"></div>
<div class="experiment-pair"><div id="downstream-distance" class="experiment-plot"></div><div id="downstream-accuracy" class="experiment-plot"></div></div>
<div id="downstream-correlations" class="experiment-table"></div>
<div id="downstream-comparison" class="experiment-table"></div>
<details class="experiment-data"><summary>All 24 plotted points · selected decoding setting</summary><div id="downstream-points" class="experiment-table"></div></details>
<a href="assets/data/downstream.json" download>Download all 120 measurements and source hashes ↗</a>
</div>

#### Reading the figures

- **Scatter:** one point per size–checkpoint pair; color and marker shape identify model size; horizontal axis is the selected evaluation score, lower is better; vertical axis is downstream accuracy, higher is better; hover or focus a point for its update and values.
- **Training curves:** separate distance and downstream panels; shared update axis; fixed axes across decoding choices; no dual-axis overlay; lines connect observed checkpoints only.
- **Correlation table:** all five decoding settings, including T=1.3; pooled correlations use 24 points; within-size correlations use six; leave-one-size-out correlations use 18.
- **Metric comparison table:** pooled correlations for every metric and decoding setting; correlations share a scale, raw metric values do not.

#### Limitations

- **Dependence:** checkpoints share training trajectories; decoding variants share downstream measurements; 120 settings are not 120 independent observations.
- **Confounding:** pooled correlation can reflect model size rather than within-size training improvement; six checkpoints per size support descriptive trends, not precise within-size inference.
- **Sampling:** one generation seed and one displayed reference split; no uncertainty intervals shown; packed reference rows can share original source documents.
- **Interpretation:** association with this seven-task aggregate, not a causal effect or a validated general measure of language quality.
- **Sources:** [published Pythia evaluation archive](https://github.com/EleutherAI/pythia/tree/a19eecb807ec2c79a39ebf18108816e6ffffc1d5/evals/pythia-v1); local conditional-direction analysis `8630a5e84115aef93a3a`; exact source paths and SHA-256 hashes in the downloadable data.
