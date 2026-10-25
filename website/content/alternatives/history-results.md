- **Comparison below:** 512 matched test sequences per setting; bits per GPT-2 source token; means over three corpus-order seeds for compression; Qwen3-8B-Base likelihood. Counts mean strictly above the observed real-control score, not statistical significance.

| Candidate | Real control | Mirror | Periodic | Phrase bank | Top-k IID |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Qwen NLL | 3.71061 | 9/18 | 1/10 | 12/27 | 18/18 |
| Absolute compression gap | 0.03131 | 18/18 | 10/10 | 27/27 | 18/18 |
| NLL + gap | 3.74192 | 18/18 | 10/10 | 27/27 | 18/18 |
| VCDIFF coding difference | 0.00656 | 0/18 | 10/10 | 27/27 | 0/18 |
| Concatenation coding difference | -0.00382 | 18/18 | 10/10 | 27/27 | 18/18 |
| NLL + max(VCDIFF, gap) | 3.74192 | 18/18 | 10/10 | 27/27 | 18/18 |
| NLL + max(concatenation, gap) | 3.74192 | 18/18 | 10/10 | 27/27 | 18/18 |

- **Historical VCDIFF pilot:** separate sample banks and protocol; do not pool its scores with the sweep above. Mirror and top-k IID both had an exactly zero forward coding difference; reversing the direction gave the same mean for several very different samplers.

| Pilot sample | Forward VCDIFF | Reverse VCDIFF | Forward + entropy gap |
| :--- | :--- | :--- | :--- |
| Real OWT | -0.005384 | 0.005384 | 0.044830 |
| GPT-2 | 0.037907 | 0.043419 | 2.014083 |
| Periodic | 29.421844 | 0.062174 | 41.594454 |
| Mirror | 0.000000 | 0.062174 | 7.954758 |
| Phrase bank | 2.361336 | 0.062174 | 11.640584 |
| Top-k IID | 0.000000 | 0.062174 | 4.200320 |
| Collapsed documents | 37.038979 | 0.062174 | 49.196604 |

- **Units:** pilot scores are bits per source token; values averaged over the three stored reference-order seeds, not three independently generated datasets.

#### Downstream correlation depends on decoding

- **Pythia:** 24 size/checkpoint points per decoding setting; seven-task five-shot downstream average; Spearman correlation with the negative metric, so positive means lower scores align with higher downstream accuracy. Repeated checkpoints are not independent model runs.
- **Protocol:** historical 512-sequence scoring subset; not the larger likelihood budget used in the main downstream section.

| Decoding | NLL | NLL + gap | NLL + max(VCDIFF, gap) | NLL + max(concatenation, gap) |
| :--- | :--- | :--- | :--- | :--- |
| t07 | -0.9139 | 0.9704 | 0.9704 | 0.9704 |
| t10 | 0.9417 | 0.8687 | 0.8687 | 0.8687 |
| t10-k20 | 0.0513 | 0.9730 | 0.9730 | 0.9730 |
| t10-p095 | 0.9374 | 0.8104 | 0.8104 | 0.8104 |
| t13 | -0.3339 | -0.3826 | -0.3826 | -0.3826 |

- **Takeaway:** adding the gap improves some decoding settings and worsens others; the maximum-penalty variants have identical rank correlations here, not evidence of a universal improvement.
