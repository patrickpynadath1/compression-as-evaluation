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

- **Details:** quantitative historical comparisons follow; structural and standalone-matched results remain linked to their own protocols rather than pooled into the earlier sweep.
