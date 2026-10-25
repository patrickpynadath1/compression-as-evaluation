- **Question:** can samples preserve local patterns or match aggregate compressibility while changing the distribution?
- **TL;DR:** Construct collages, noise/repetition mixtures and restricted document banks to probe what the scores miss.
- **Core results:** On the 14 held-out settings, conditional compression and all four distributional baselines exceed their real-control means in 14/14 cases; Qwen NLL does so in 10/14. These are descriptive comparisons.

<details class="experiment-setup">
<summary>Experimental setup, methodology & interpretation</summary>

- **Coverage:** 14 settings in each of development and held-out phases; three independent real-control subsets per phase.
- **Collage:** concatenate real-text spans of 8, 32, 128 or 512 tokens from randomly selected source documents.
- **Mixture:** an IID token prefix followed by a repeated phrase; vary the noise fraction from 0 to 1, including intermediate compression-matching candidates.
- **Narrow topic:** resample a 128-document bank selected using computing, science or politics keywords.
- **Random bank:** resample a random 128-document bank; separates finite support from topic selection.
- **Budgets:** conditional W₁ uses 128 held-out sequences per bank; Qwen and baseline metrics use 256-sequence input banks.
- **Controls:** subtract the mean of the three real-control scores from the same phase; tables retain their minimum and maximum. These ranges are not confidence intervals.
- **Selection:** held-out results shown first; development remains separately selectable, never pooled with held-out results.

- **Reading the plot:** positive margins indicate higher scores; negative margins indicate lower scores; each metric retains its native units. Hover or focus on a point for exact setting details.
- **Uncertainty:** observed differences, not significance tests; settings and seeds are related, not independent detection trials.
- **Data:** [download all five suites, raw scores, controls and source hashes](assets/data/stress-tests.json).

</details>

<div class="stress-suite" data-suite="adaptive"><p role="status">Loading saved results…</p></div>
