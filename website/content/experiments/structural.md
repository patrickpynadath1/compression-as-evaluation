- **Question:** which changes to support and structure remain visible to each metric?
- **TL;DR:** Change document support, shuffle sentence chunks or replace digits, and compare with independent real subsets.
- **Core results:** Conditional compression exceeds the control mean in 8/13 held-out settings; Qwen NLL, SOL and energy distance in 9/13, Gradient Moment in 12/13 and JCD in 8/13. Not every setting is necessarily degraded text; the separate paired tests isolate transformation effects.

<details class="experiment-setup">
<summary>Experimental setup, methodology & interpretation</summary>

- **Coverage:** 13 settings per phase; three real-control subsets per phase; development and held-out phases kept separate.
- **Unique topic documents:** keyword-selected computing, science or politics documents without repeated-text sampling.
- **Random unique documents:** a support-selection control, not necessarily degraded language.
- **Disjoint collage:** real spans assembled using disjoint source pools for generated reference and test banks.
- **Sentence shuffle:** permute selected punctuation-delimited chunks at fractions 0.25, 0.5 and 1.0; heuristic boundaries, not a linguistic sentence parser.
- **Digit substitution:** change selected digits with a nonzero modular shift at fractions 0.25 and 1.0; grammaticality need not change.
- **Budgets:** conditional W₁ uses 128 held-out sequences per bank; Qwen and baseline metrics use 256-sequence input banks.
- **Controls:** phase-specific mean of three real subsets; table includes the observed control range.
- **Important distinction:** these are comparisons with independent real subsets, not same-document before/after comparisons. Use the paired tests below to isolate transformation effects.

- **Reading the plot:** positive margins indicate higher scores; negative margins indicate lower scores; each metric retains its native units. Hover or focus on a point for exact setting details.
- **Uncertainty:** observed differences, not significance tests; settings and seeds are related, not independent detection trials.
- **Data:** [download all five suites, raw scores, controls and source hashes](assets/data/stress-tests.json).

</details>

<div class="stress-suite" data-suite="structural"><p role="status">Loading saved results…</p></div>
