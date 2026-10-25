- **Question:** do artificial samples receive worse scores than real OpenWebText, and by how much?
- **Scope:** four França-inspired sampler families; 73 parameter/seed configurations; real-data control from the same experiment suite [@franca2026].

#### Samplers

| Sampler | Construction in this experiment | Configurations |
| :--- | :--- | ---: |
| Mirror | Sample an IID token half-sequence, then append an exact copy; not a reversal. | 18 |
| Periodic | Repeat a fixed cycle of frequent tokens; identical sequences across the sampled collection. | 10 |
| Phrase bank | Concatenate uniformly sampled common five-token phrases. | 27 |
| Top-k IID | Independently draw from frequent tokens, weighted by corpus frequency. | 18 |

#### Experimental setup

- **Source:** OpenWebText construction samples supply token frequencies and phrase banks; synthetic sequences contain 1,024 GPT-2 tokens.
- **Sweep:** vocabulary or phrase-bank size and generation seed; configurations are related settings, not 73 independent datasets.
- **Conditional compression:** Zstandard level 10, window log 23, fixed 64 KiB raw real-data dictionary; 256 held-out real and 256 held-out generated sequences; independent frames; equal sequence weights.
- **Likelihood:** Qwen3-8B-Base negative log-likelihood on 512 sequences per configuration, including the real control; token-weighted bits per GPT-2 source token.
- **Baselines:** SOL, energy distance, Gradient Moment, and JCD use 512-sequence input banks and their cached metric-specific protocols; JCD includes internal fit/test splits.
- **Alignment:** same sampler configurations across metrics; sample budgets and internal splits differ; not a sample-matched head-to-head comparison.

#### Margin above the real-data control

$$
\Delta M_a=M(G_a,D)-M(D_{\mathrm{control}},D).
$$

- **Notation:** $G_a$ is the sample bank for adversarial configuration $a$; $D$ is the real reference bank; likelihood uses the fixed Qwen evaluator rather than a fitted reference-bank model.
- **Positive margin:** the adversary receives a worse score than the real control.
- **Negative margin:** the adversary receives a better score than the real control.
- **Zero line:** equality with the observed real control; not a statistical decision threshold.
- **Dots:** individual configurations; vertical offsets separate overlapping points and have no statistical meaning.
- **Short vertical marks:** family medians; computed from unrounded scores.
- **Axes:** independent linear scales in each metric's native units; raw margin magnitudes are not comparable across metrics.

<div id="adversarial-results" class="adversarial-results" aria-label="Adversarial sample margins">
<div id="adversarial-status" role="status" aria-live="polite">Loading saved adversarial results…</div>
<div class="adversarial-key"><span class="positive-key">● Positive margin</span><span class="negative-key">● Negative margin</span><span>│ Median</span><span>Dashed line: real control</span></div>
<div id="adversarial-panels" class="adversarial-panels"></div>
<output id="adversarial-detail" class="adversarial-detail" aria-live="polite">Hover, focus, or tap a point for its parameters and scores.</output>
<div class="experiment-toolbar"><label for="adversarial-metric">Table metric</label><select id="adversarial-metric"><option value="conditional">Conditional compression W₁</option><option value="nll">Qwen3-8B-Base NLL</option><option value="sol">SOL</option><option value="ed">Energy distance</option><option value="gm">Gradient Moment</option><option value="jcd">JCD</option></select></div>
<div id="adversarial-summary" class="experiment-table"></div>
<details class="experiment-data"><summary>All 73 configurations · raw scores and margins</summary><div id="adversarial-points" class="experiment-table"></div></details>
<a href="assets/data/adversarial.json" download>Download scores, unrounded margins, and source hashes ↗</a>
</div>

#### Interpretation limits

- **Control uncertainty:** one real-control configuration in this sweep; no confidence bands or significance claims.
- **Ratios:** not used; near-zero or negative real-control scores can make ratios unstable or misleading.
- **Detection counts:** number of configurations with strictly positive observed margins; not independent trials or a general detection rate.
- **Scope:** paired structural corruptions and compression-matched attacks belong to separate experiments; not pooled into this result.
