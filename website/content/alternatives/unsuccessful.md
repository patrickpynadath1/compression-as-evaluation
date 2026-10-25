#### Candidates and the experiments behind the decision

- **Notation:** $h_R(Q)$ is generated-text cross-entropy under the Qwen evaluator $R$; $c(Q)$ is the standalone collection compression rate; $g(Q,P)=|c(Q)-c(P)|$; $d_C(Q,P)$ is a reference-versus-own-context coding difference. Rates use the same token normalization within each comparison.

<details class="candidate-card">
<summary>Likelihood alone</summary>

- **Construction:** $h_R(Q)$
- **Evidence / limitation:** França sweep: many mirror, periodic and phrase-bank settings score below real data.
- **Decision:** Keep as learned baseline, not the model-free metric.

</details>

<details class="candidate-card">
<summary>“Entropy gap” alone</summary>

- **Construction:** $g(Q,P)$
- **Evidence / limitation:** Detects all four França families in the saved sweep; matching one average rate still cannot establish distributional similarity. The separate standalone-W₁ attack targets a stronger rate-distribution summary, not this exact collection-gap formula.
- **Decision:** Useful diagnostic, not sufficient by itself.

</details>

<details class="candidate-card">
<summary>Likelihood + gap</summary>

- **Construction:** $h_R(Q)+g(Q,P)$
- **Evidence / limitation:** Detects all four França families; still requires Qwen.
- **Decision:** Earlier successful hybrid; excluded from the model-free main metric, not declared universally unsuccessful.

</details>

<details class="candidate-card">
<summary>VCDIFF reference difference</summary>

- **Construction:** $d_C(Q,P)$
- **Evidence / limitation:** Sweep: no mirror or top-k IID setting exceeds the real control; pilot forward scores are exactly zero for both.
- **Decision:** Context matching alone leaves blind spots.

</details>

<details class="candidate-card">
<summary>Reverse VCDIFF difference</summary>

- **Construction:** $d_C(P,Q)$
- **Evidence / limitation:** Pilot: identical mean reverse scores for periodic, mirror, phrase-bank and top-k IID samples.
- **Decision:** Reversing direction alone does not provide useful separation among these cases.

</details>

<details class="candidate-card">
<summary>VCDIFF + entropy gap</summary>

- **Construction:** $d_C(Q,P)+g(Q,P)$
- **Evidence / limitation:** Pilot: the gap supplies a positive penalty for mirror and top-k IID when their forward VCDIFF difference is zero; exact pilot scores follow.
- **Decision:** Model-free hybrid, but still inherits the information loss of a scalar rate gap.

</details>

<details class="candidate-card">
<summary>Zstd concatenation difference</summary>

- **Construction:** Difference of incremental code lengths after real versus generated prefixes
- **Evidence / limitation:** All four França families exceed the control in the larger sweep; the initial periodic concern is not a failure under this strict observed-margin criterion. Adaptive target coding can dilute prefix effects.
- **Decision:** Retain as historical comparator; not a frozen-context cross-entropy estimator.

</details>

<details class="candidate-card">
<summary>Likelihood + maximum penalty</summary>

- **Construction:** $h_R(Q)+\max\{d_C(Q,P),g(Q,P)\}$
- **Evidence / limitation:** All four França families exceed the control for both VCDIFF and concatenation variants.
- **Decision:** More complex and still model-dependent; no need to call this a failed detector.

</details>

<details class="candidate-card">
<summary>Standalone rate W₁</summary>

- **Construction:** Compare distributions of $r_C^{(0)}(x)$
- **Evidence / limitation:** Three specially selected attacks closely match standalone rates; conditioning on real context increases separation in all three.
- **Decision:** Useful ablation; does not encode reference-pattern overlap.

</details>

<details class="candidate-card">
<summary>Bidirectional conditional W₁</summary>

- **Construction:** Add real-context and generated-context W₁
- **Evidence / limitation:** Paired structural test: the sum decreases in all five conditions.
- **Decision:** Additional diagnostic, not a cure for structural insensitivity.

</details>

<details class="candidate-card">
<summary>Zstd dictionary difference · mean over generated documents</summary>

- **Per-document quantity:**

$$
\Delta(x)=\frac{L_C(x\mid d_D)-L_C(x\mid d_G)}{b(x)}.
$$

- **Score:**

$$
S_{\mathrm{mean}}=\frac1m\sum_{j=1}^m\Delta(y_j).
$$

- **Construction:** Average the signed difference over generated test documents only; retain negative values.
- **Protocol:** current Zstandard level 10, window log 23; equal raw-dictionary byte budgets capped at 64 KiB; separate fit/test banks; independent document frames; bits per UTF-8 byte. Reuses cached rates across 1,176 configurations; no new generation or compression.
- **França samplers:** 73/73 settings above the real control, including mirror and top-k IID.
- **Corruption sweeps:** repetition 0/7; pollution 6/10; shuffling 8/10; collapse 4/7 settings above the real control.
- **Paired structural tests:** 5/5 transformations increase the score relative to the same original documents; not a significance claim.
- **Downstream:** Spearman correlation of negative score with the seven-task five-shot downstream average, across 24 Pythia size/checkpoint points per setting: t07: -0.645; t10: 0.469; t10-k20: -0.188; t10-p095: 0.410; t13: 0.261.
- **Interpretation / decision:** A KL-motivated ablation, not an exact KL estimate. Detects all França settings but misses the repetition sweep; downstream correlations depend on decoding.
- **Limits:** inherited source-overlap caveats remain; budgets vary by cohort; repeated checkpoints are not independent model runs.
- **Source:** [download the analyses, paired scores, protocol descriptions and source hashes](assets/data/dictionary-variants.json).

</details>

<details class="candidate-card">
<summary>Zstd dictionary difference · Wasserstein over documents</summary>

- **Per-document quantity:**

$$
\Delta(x)=\frac{L_C(x\mid d_D)-L_C(x\mid d_G)}{b(x)}.
$$

- **Score:**

$$
S_{\mathrm{contrast}}=W_1\big(\{\Delta(x_i)\}_{i=1}^n,\{\Delta(y_j)\}_{j=1}^m\big).
$$

- **Construction:** Compute the same signed difference for real and generated test documents, then compare their distributions with equal document weights. Do not reverse the subtraction on real documents or take absolute values before transport.
- **Protocol:** current Zstandard level 10, window log 23; equal raw-dictionary byte budgets capped at 64 KiB; separate fit/test banks; independent document frames; bits per UTF-8 byte. Reuses cached rates across 1,176 configurations; no new generation or compression.
- **França samplers:** 73/73 settings above the real control, including mirror and top-k IID.
- **Corruption sweeps:** repetition 7/7; pollution 10/10; shuffling 10/10; collapse 6/7 settings above the real control.
- **Paired structural tests:** 2/5 transformations increase the score relative to the same original documents; not a significance claim.
- **Downstream:** Spearman correlation of negative score with the seven-task five-shot downstream average, across 24 Pythia size/checkpoint points per setting: t07: 0.635; t10: 0.688; t10-k20: 0.729; t10-p095: 0.454; t13: 0.097.
- **Interpretation / decision:** Promising alternative, not a rejected version: stronger corruption-sweep separation than the generated-only mean, but mixed paired structural sensitivity. Retain as a candidate; the main definition remains unchanged.
- **Limits:** inherited source-overlap caveats remain; budgets vary by cohort; repeated checkpoints are not independent model runs.
- **Source:** [download the analyses, paired scores, protocol descriptions and source hashes](assets/data/dictionary-variants.json).

</details>

- **Details:** quantitative historical comparisons follow; structural and standalone-matched results remain linked to their own protocols rather than pooled into the earlier sweep.
