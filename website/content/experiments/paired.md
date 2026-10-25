- **Question:** does transforming the same source documents increase the score?
- **TL;DR:** Score the same source documents before and after sentence shuffling or digit substitution.
- **Core results:** Blind spot: the current real-context conditional W₁ decreases for all five transformations instead of penalizing them. This panel reports the original rate-W₁ variants, not the newer dictionary-difference candidates.

<details class="experiment-setup">
<summary>Experimental setup, methodology & interpretation</summary>

- **Pairing:** original and transformed versions of the same source banks; fixed real context and real evaluation bank; generated context and generated test banks transformed together.
- **Conditions:** sentence shuffle at 0.25, 0.5 and 1.0; digit substitution at 0.25 and 1.0.
- **Budget:** 256 sequences in each real/generated fit/test bank; fixed 64 KiB raw dictionaries; Zstandard level 10, window log 23.
- **Metric variants:** real-context conditional W₁, generated-context conditional W₁, their sum, and standalone rate W₁; all measured in bits per UTF-8 byte.
- **Margin:** transformed score minus original score, not minus an independent real control.
- **Blind spot:** real-context conditional W₁ decreases in all five conditions; it does not penalize these transformations in this paired experiment.
- **Meaning:** shuffled chunks can retain many reusable substrings; digit changes can preserve local coding statistics. This is limited sensitivity to these transformations, not proof of semantic equivalence.
- **Coverage limit:** this paired snapshot contains compression metrics only; unpaired Qwen, SOL, energy-distance, GM and JCD scores are not substituted for missing paired measurements.

- **Reading the plot:** positive margins indicate higher scores; negative margins indicate lower scores; each metric retains its native units. Hover or focus on a point for exact setting details.
- **Uncertainty:** observed differences, not significance tests; settings and seeds are related, not independent detection trials.
- **Data:** [download all five suites, raw scores, controls and source hashes](assets/data/stress-tests.json).

</details>

<div class="stress-suite" data-suite="paired"><p role="status">Loading saved results…</p></div>
