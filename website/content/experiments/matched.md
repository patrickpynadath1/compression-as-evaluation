- **Question:** can matching standalone compression rates evade the conditional metric?
- **Candidates:** 3,840 phrase-bank and top-k IID samples per construction seed.
- **Selection:** greedily choose 128 samples without replacement to match 128 real tuning-sample standalone rates; no conditional score used in selection.
- **Evaluation:** independent 128-sample real holdout and 128-sample real control; fixed 64 KiB real dictionary from the original 256-sample fit bank; Zstandard level 10, window log 23.
- **Repetitions:** three seeds vary candidate samples and the real tuning/evaluation split; not three independent datasets.
- **Comparison:** standalone rate W₁ versus real-context conditional rate W₁, using the same selected samples and held-out real bank.
- **Result:** conditional W₁ exceeds its matched real control in all three constructions; standalone W₁ exceeds its control in two of three.
- **Scope:** this attack targets standalone rate distributions, not the conditional metric itself; no paired likelihood or learned-baseline scores are available in this snapshot.

<div class="stress-suite" data-suite="matched"><p role="status">Loading saved results…</p></div>

- **Reading the plot:** positive margins indicate higher scores; negative margins indicate lower scores; each metric retains its native units. Hover or focus on a point for exact setting details.
- **Uncertainty:** observed differences, not significance tests; settings and seeds are related, not independent detection trials.
- **Data:** [download all five suites, raw scores, controls and source hashes](assets/data/stress-tests.json).

