- **Question:** how do scores change as corruption or repetition increases?
- **Coverage:** 39 configurations; six metrics; the same real-data control as the França sampler sweep.
- **Token pollution:** replace selected tokens with the token for “ the”.
- **Token shuffle:** permute selected token positions; includes whole-document and localized regions.
- **Repetition:** replace a suffix with repetitions of the first 16 tokens.
- **Collapse:** replace a fraction of documents with one shared document.
- **Finite bank:** replace documents with draws from a small shared bank.
- **Budgets:** conditional W₁ uses 256 held-out sequences per bank; Qwen NLL scores 512 sequences; SOL, energy distance, Gradient Moment and JCD use 512-sequence input banks with their own internal protocols.
- **Interpretation:** severity ranges from 0.01 to 1 for the main sweeps; localized shuffling and pollution use severity 1 within a selected fifth of the document. Inspect severity and region rather than treating every setting as a separate successful detection.

<div class="stress-suite" data-suite="corruption"><p role="status">Loading saved results…</p></div>

- **Reading the plot:** positive margins indicate higher scores; negative margins indicate lower scores; each metric retains its native units. Hover or focus on a point for exact setting details.
- **Uncertainty:** observed differences, not significance tests; settings and seeds are related, not independent detection trials.
- **Data:** [download all five suites, raw scores, controls and source hashes](assets/data/stress-tests.json).
