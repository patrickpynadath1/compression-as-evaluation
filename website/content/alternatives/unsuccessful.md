- **How to read this comparison:** select a candidate to see its motivation, construction, observed results, and assessment. A method can pass a sampler test yet miss our model-free or structural-sensitivity criteria.

<div class="candidate-picker experiment-toolbar" hidden><label for="candidate-select">Candidate</label><select id="candidate-select" aria-controls="candidate-views"></select></div>
<p id="candidate-selection-status" class="candidate-selection-status" role="status" aria-live="polite"></p>

<details class="experiment-setup"><summary>Shared notation & comparison rules</summary>

- **Notation:** $h_R(Q)$ is generated-text cross-entropy under the Qwen evaluator $R$; $c(Q)$ is the standalone collection compression rate; $g(Q,P)=|c(Q)-c(P)|$; $d_C(Q,P)$ is a reference-versus-own-context coding difference. Rates use the same token normalization within each comparison.

- **Criteria:** model-free operation, reference sensitivity, adversarial separation, structural sensitivity and useful downstream association.
- **Counts:** strictly above a real control, or increases in a paired test; not significance tests. Protocols and budgets differ across experiments; compare within each experiment.

</details>

<div id="candidate-views">

<section class="candidate-view" id="candidate-option-0" data-candidate-title="Likelihood alone" aria-labelledby="candidate-heading-0">

<h4 id="candidate-heading-0">Likelihood alone</h4>

##### Why this was reasonable

- A reference language model assigns code lengths to text; fluent, familiar sequences should generally receive shorter codes.

##### Definition & computation

- **Construction:** $h_R(Q)$

##### Observed results

| Variant | Real control | Mirror | Periodic | Phrase bank | Top-k IID |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Qwen NLL | 3.71061 | 9/18 | 1/10 | 12/27 | 18/18 |

- **Protocol:** 512 matched test sequences; bits per GPT-2 source token; compression averages three corpus-order seeds. Counts are settings above the observed real control.

##### Downstream association

| Decoding | Spearman ρ |
| :--- | :--- |
| t07 | -0.914 |
| t10 | 0.942 |
| t10-k20 | 0.051 |
| t10-p095 | 0.937 |
| t13 | -0.334 |

- **Protocol:** 24 Pythia size/checkpoint points per setting; correlation of negative score with the seven-task five-shot average; historical 512-sequence scoring subset. Shared training trajectories are not independent trials.

- **Sources:** [historical results](assets/data/metric-history.json), [paired and matched diagnostics](assets/data/stress-tests.json); detailed protocols appear in the corresponding experiment sections.

##### Criteria & decision

- **Evidence / limitation:** França sweep: many mirror, periodic and phrase-bank settings score below real data.
- **Decision:** Keep as learned baseline, not the model-free metric.

</section>

<section class="candidate-view" id="candidate-option-1" data-candidate-title="“Entropy gap” alone" aria-labelledby="candidate-heading-1">

<h4 id="candidate-heading-1">“Entropy gap” alone</h4>

##### Why this was reasonable

- Matching information content should expose both overly repetitive output and excessively random output.

##### Definition & computation

- **Construction:** $g(Q,P)$

##### Observed results

| Variant | Real control | Mirror | Periodic | Phrase bank | Top-k IID |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Absolute compression gap | 0.03131 | 18/18 | 10/10 | 27/27 | 18/18 |

- **Protocol:** 512 matched test sequences; bits per GPT-2 source token; compression averages three corpus-order seeds. Counts are settings above the observed real control.

- **Sources:** [historical results](assets/data/metric-history.json), [paired and matched diagnostics](assets/data/stress-tests.json); detailed protocols appear in the corresponding experiment sections.

##### Criteria & decision

- **Evidence / limitation:** Detects all four França families in the saved sweep; matching one average rate still cannot establish distributional similarity. The separate standalone-W₁ attack targets a stronger rate-distribution summary, not this exact collection-gap formula.
- **Decision:** Useful diagnostic, not sufficient by itself.

</section>

<section class="candidate-view" id="candidate-option-2" data-candidate-title="Likelihood + gap" aria-labelledby="candidate-heading-2">

<h4 id="candidate-heading-2">Likelihood + gap</h4>

##### Why this was reasonable

- Likelihood tests plausibility while a compression-gap penalty discourages both collapse and excess randomness.

##### Definition & computation

- **Construction:** $h_R(Q)+g(Q,P)$

##### Observed results

| Variant | Real control | Mirror | Periodic | Phrase bank | Top-k IID |
| :--- | :--- | :--- | :--- | :--- | :--- |
| NLL + gap | 3.74192 | 18/18 | 10/10 | 27/27 | 18/18 |

- **Protocol:** 512 matched test sequences; bits per GPT-2 source token; compression averages three corpus-order seeds. Counts are settings above the observed real control.

##### Downstream association

| Decoding | Spearman ρ |
| :--- | :--- |
| t07 | 0.970 |
| t10 | 0.869 |
| t10-k20 | 0.973 |
| t10-p095 | 0.810 |
| t13 | -0.383 |

- **Protocol:** 24 Pythia size/checkpoint points per setting; correlation of negative score with the seven-task five-shot average; historical 512-sequence scoring subset. Shared training trajectories are not independent trials.

- **Sources:** [historical results](assets/data/metric-history.json), [paired and matched diagnostics](assets/data/stress-tests.json); detailed protocols appear in the corresponding experiment sections.

##### Criteria & decision

- **Evidence / limitation:** Detects all four França families; still requires Qwen.
- **Decision:** Earlier successful hybrid; excluded from the model-free main metric, not declared universally unsuccessful.

</section>

<section class="candidate-view" id="candidate-option-3" data-candidate-title="VCDIFF reference difference" aria-labelledby="candidate-heading-3">

<h4 id="candidate-heading-3">VCDIFF reference difference</h4>

##### Why this was reasonable

- Under ideal distribution-matched coding, the real-versus-own coding overhead on generated samples has a KL interpretation.

##### Definition & computation

- **Construction:** $d_C(Q,P)$

##### Observed results

| Variant | Real control | Mirror | Periodic | Phrase bank | Top-k IID |
| :--- | :--- | :--- | :--- | :--- | :--- |
| VCDIFF coding difference | 0.00656 | 0/18 | 10/10 | 27/27 | 0/18 |

- **Protocol:** 512 matched test sequences; bits per GPT-2 source token; compression averages three corpus-order seeds. Counts are settings above the observed real control.

- **Sources:** [historical results](assets/data/metric-history.json), [paired and matched diagnostics](assets/data/stress-tests.json); detailed protocols appear in the corresponding experiment sections.

##### Criteria & decision

- **Evidence / limitation:** Sweep: no mirror or top-k IID setting exceeds the real control; pilot forward scores are exactly zero for both.
- **Decision:** Context matching alone leaves blind spots.

</section>

<section class="candidate-view" id="candidate-option-4" data-candidate-title="Reverse VCDIFF difference" aria-labelledby="candidate-heading-4">

<h4 id="candidate-heading-4">Reverse VCDIFF difference</h4>

##### Why this was reasonable

- Evaluating real samples under a generated context tests whether generated data covers the reference distribution.

##### Definition & computation

- **Construction:** $d_C(P,Q)$

##### Observed results

| Sample | Reverse coding difference |
| :--- | :--- |
| Real OWT | 0.005384 |
| GPT-2 | 0.043419 |
| Periodic | 0.062174 |
| Mirror | 0.062174 |
| Phrase bank | 0.062174 |
| Top-k IID | 0.062174 |
| Collapsed documents | 0.062174 |

- **Protocol:** separate pilot; bits per source token; three reference-order seeds, not independent datasets. Do not compare raw scores with the larger sweep.

- **Sources:** [historical results](assets/data/metric-history.json), [paired and matched diagnostics](assets/data/stress-tests.json); detailed protocols appear in the corresponding experiment sections.

##### Criteria & decision

- **Evidence / limitation:** Pilot: identical mean reverse scores for periodic, mirror, phrase-bank and top-k IID samples.
- **Decision:** Reversing direction alone does not provide useful separation among these cases.

</section>

<section class="candidate-view" id="candidate-option-5" data-candidate-title="VCDIFF + entropy gap" aria-labelledby="candidate-heading-5">

<h4 id="candidate-heading-5">VCDIFF + entropy gap</h4>

##### Why this was reasonable

- An information-content penalty could catch degeneracies that reference matching alone overlooks.

##### Definition & computation

- **Construction:** $d_C(Q,P)+g(Q,P)$

##### Observed results

| Sample | Forward difference + entropy gap |
| :--- | :--- |
| Real OWT | 0.044830 |
| GPT-2 | 2.014083 |
| Top-k IID | 4.200320 |
| Collapsed documents | 49.196604 |
| Periodic | 41.594454 |
| Phrase bank | 11.640584 |
| Mirror | 7.954758 |

- **Protocol:** separate pilot; bits per source token; three reference-order seeds, not independent datasets. Do not compare raw scores with the larger sweep.

- **Sources:** [historical results](assets/data/metric-history.json), [paired and matched diagnostics](assets/data/stress-tests.json); detailed protocols appear in the corresponding experiment sections.

##### Criteria & decision

- **Evidence / limitation:** Pilot: the gap supplies a positive penalty for mirror and top-k IID when their forward VCDIFF difference is zero; exact pilot scores follow.
- **Decision:** Model-free hybrid, but still inherits the information loss of a scalar rate gap.

</section>

<section class="candidate-view" id="candidate-option-6" data-candidate-title="Zstd concatenation difference" aria-labelledby="candidate-heading-6">

<h4 id="candidate-heading-6">Zstd concatenation difference</h4>

##### Why this was reasonable

- Compressing a reference prefix followed by test text offers a simple off-the-shelf approximation to contextual coding.

##### Definition & computation

- **Construction:** Difference of incremental code lengths after real versus generated prefixes

##### Observed results

| Variant | Real control | Mirror | Periodic | Phrase bank | Top-k IID |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Concatenation coding difference | -0.00382 | 18/18 | 10/10 | 27/27 | 18/18 |

- **Protocol:** 512 matched test sequences; bits per GPT-2 source token; compression averages three corpus-order seeds. Counts are settings above the observed real control.

- **Sources:** [historical results](assets/data/metric-history.json), [paired and matched diagnostics](assets/data/stress-tests.json); detailed protocols appear in the corresponding experiment sections.

##### Criteria & decision

- **Evidence / limitation:** All four França families exceed the control in the larger sweep; the initial periodic concern is not a failure under this strict observed-margin criterion. Adaptive target coding can dilute prefix effects.
- **Decision:** Retain as historical comparator; not a frozen-context cross-entropy estimator.

</section>

<section class="candidate-view" id="candidate-option-7" data-candidate-title="Likelihood + maximum penalty" aria-labelledby="candidate-heading-7">

<h4 id="candidate-heading-7">Likelihood + maximum penalty</h4>

##### Why this was reasonable

- The larger of the contextual and information-content penalties could cover the weaknesses of either alone.

##### Definition & computation

- **Construction:** $h_R(Q)+\max\{d_C(Q,P),g(Q,P)\}$

##### Observed results

| Variant | Real control | Mirror | Periodic | Phrase bank | Top-k IID |
| :--- | :--- | :--- | :--- | :--- | :--- |
| NLL + max(VCDIFF, gap) | 3.74192 | 18/18 | 10/10 | 27/27 | 18/18 |
| NLL + max(concatenation, gap) | 3.74192 | 18/18 | 10/10 | 27/27 | 18/18 |

- **Protocol:** 512 matched test sequences; bits per GPT-2 source token; compression averages three corpus-order seeds. Counts are settings above the observed real control.

##### Downstream association

| Decoding | Spearman ρ |
| :--- | :--- |
| t07 | 0.970 |
| t10 | 0.869 |
| t10-k20 | 0.973 |
| t10-p095 | 0.810 |
| t13 | -0.383 |

- **Protocol:** 24 Pythia size/checkpoint points per setting; correlation of negative score with the seven-task five-shot average; historical 512-sequence scoring subset. Shared training trajectories are not independent trials.

- **Sources:** [historical results](assets/data/metric-history.json), [paired and matched diagnostics](assets/data/stress-tests.json); detailed protocols appear in the corresponding experiment sections.

##### Criteria & decision

- **Evidence / limitation:** All four França families exceed the control for both VCDIFF and concatenation variants.
- **Decision:** More complex and still model-dependent; no need to call this a failed detector.

</section>

<section class="candidate-view" id="candidate-option-8" data-candidate-title="Standalone rate W₁" aria-labelledby="candidate-heading-8">

<h4 id="candidate-heading-8">Standalone rate W₁</h4>

##### Why this was reasonable

- A distribution of per-document rates preserves variation that an average compression rate discards.

##### Definition & computation

- **Construction:** Compare distributions of $r_C^{(0)}(x)$

##### Observed results

| Seed | Standalone W₁ | Real control | Conditional W₁ | Conditional control |
| :--- | :--- | :--- | :--- | :--- |
| 0 | 0.06184 | 0.05166 | 0.29891 | 0.03569 |
| 1 | 0.03719 | 0.03542 | 0.25992 | 0.03037 |
| 2 | 0.02304 | 0.03173 | 0.25463 | 0.02493 |

- **Protocol:** 128 selected synthetic samples; independent 128-sample real evaluation and control banks; selection uses only standalone rates. Bits per UTF-8 byte. This attack targets standalone W₁, not the conditional metric.

- **Sources:** [historical results](assets/data/metric-history.json), [paired and matched diagnostics](assets/data/stress-tests.json); detailed protocols appear in the corresponding experiment sections.

##### Criteria & decision

- **Evidence / limitation:** Three specially selected attacks closely match standalone rates; conditioning on real context increases separation in all three.
- **Decision:** Useful ablation; does not encode reference-pattern overlap.

</section>

<section class="candidate-view" id="candidate-option-9" data-candidate-title="Bidirectional conditional W₁" aria-labelledby="candidate-heading-9">

<h4 id="candidate-heading-9">Bidirectional conditional W₁</h4>

##### Why this was reasonable

- Using both real and generated contexts might capture complementary differences missed by either direction.

##### Definition & computation

- **Construction:** Add real-context and generated-context W₁

##### Observed results

| Paired transformation | Before | After | Change |
| :--- | :--- | :--- | :--- |
| digit_substitution-0.25 | 0.052287 | 0.042538 | -0.009749 |
| digit_substitution-1.0 | 0.052287 | 0.049127 | -0.003161 |
| sentence_shuffle-0.25 | 0.052287 | 0.045995 | -0.006292 |
| sentence_shuffle-0.5 | 0.052287 | 0.044316 | -0.007972 |
| sentence_shuffle-1.0 | 0.052287 | 0.046118 | -0.006169 |

- **Protocol:** exact original/transformed source banks; 256 documents per fit/test bank; bits per UTF-8 byte. All five changes are negative.

- **Sources:** [historical results](assets/data/metric-history.json), [paired and matched diagnostics](assets/data/stress-tests.json); detailed protocols appear in the corresponding experiment sections.

##### Criteria & decision

- **Evidence / limitation:** Paired structural test: the sum decreases in all five conditions.
- **Decision:** Additional diagnostic, not a cure for structural insensitivity.

</section>

<section class="candidate-view" id="candidate-option-10" data-candidate-title="Zstd dictionary difference · mean over generated documents" aria-labelledby="candidate-heading-10">

<h4 id="candidate-heading-10">Zstd dictionary difference · mean over generated documents</h4>

##### Why this was reasonable

- Use the same Zstd dictionary protocol as the current metric, but directly measure the extra cost of coding generated documents with real rather than generated context.

##### Definition & computation

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


##### Observed results

- **França samplers:** 73/73 settings above the real control, including mirror and top-k IID.
- **Corruption sweeps:** repetition 0/7; pollution 6/10; shuffling 8/10; collapse 4/7 settings above the real control.
- **Paired structural tests:** 5/5 transformations increase the score relative to the same original documents; not a significance claim.
- **Downstream:** Spearman correlation of negative score with the seven-task five-shot downstream average, across 24 Pythia size/checkpoint points per setting: t07: -0.645; t10: 0.469; t10-k20: -0.188; t10-p095: 0.410; t13: 0.261.
- **Source:** [download the analyses, paired scores, protocol descriptions and source hashes](assets/data/dictionary-variants.json).

##### Criteria & decision

- **Interpretation / decision:** A KL-motivated ablation, not an exact KL estimate. Detects all França settings but misses the repetition sweep; downstream correlations depend on decoding.
- **Limits:** inherited source-overlap caveats remain; budgets vary by cohort; repeated checkpoints are not independent model runs.

</section>

<section class="candidate-view" id="candidate-option-11" data-candidate-title="Zstd dictionary difference · Wasserstein over documents" aria-labelledby="candidate-heading-11">

<h4 id="candidate-heading-11">Zstd dictionary difference · Wasserstein over documents</h4>

##### Why this was reasonable

- Keep a signed context-preference score for every document, then compare its distribution on real and generated text; this avoids reducing generated samples to a single mean.

##### Definition & computation

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


##### Observed results

- **França samplers:** 73/73 settings above the real control, including mirror and top-k IID.
- **Corruption sweeps:** repetition 7/7; pollution 10/10; shuffling 10/10; collapse 6/7 settings above the real control.
- **Paired structural tests:** 2/5 transformations increase the score relative to the same original documents; not a significance claim.
- **Downstream:** Spearman correlation of negative score with the seven-task five-shot downstream average, across 24 Pythia size/checkpoint points per setting: t07: 0.635; t10: 0.688; t10-k20: 0.729; t10-p095: 0.454; t13: 0.097.
- **Source:** [download the analyses, paired scores, protocol descriptions and source hashes](assets/data/dictionary-variants.json).

##### Criteria & decision

- **Interpretation / decision:** Promising alternative, not a rejected version: stronger corruption-sweep separation than the generated-only mean, but mixed paired structural sensitivity. Retain as a candidate; the main definition remains unchanged.
- **Limits:** inherited source-overlap caveats remain; budgets vary by cohort; repeated checkpoints are not independent model runs.

</section>

</div>
