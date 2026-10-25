import csv
import hashlib
import json
from statistics import median

from export_adversarial import ROOT


def main():
    sources = []

    def load(path, csv_file=False):
        path = ROOT / path
        sources.append(path)
        with path.open() as handle:
            return list(csv.DictReader(handle)) if csv_file else json.load(handle)

    candidates = load('.cache/analysis/max-penalty/adversarial.csv', True)
    likelihood = load('.cache/adversarial-suite/likelihood/ba55935c20c03815e18a/summary.json')
    pilot = load('outputs/vcdiff-bidirectional/summary.json')
    combined = load('outputs/combined/summary.json')
    correlations = load('.cache/analysis/max-penalty/correlations.csv', True)
    controls = next(row for row in candidates if row['kind'] == 'real')
    families = ['mirror', 'periodic', 'phrase_bank', 'topk_iid']
    metrics = {'nll': 'Qwen NLL', 'compression_gap': 'Absolute compression gap', 'nll_plus_gap': 'NLL + gap', 'vcdiff_gap': 'VCDIFF coding difference', 'concatenation_gap': 'Concatenation coding difference', 'vcdiff_max_score': 'NLL + max(VCDIFF, gap)', 'concatenation_max_score': 'NLL + max(concatenation, gap)'}
    counts = []
    for field, name in metrics.items():
        baseline = float(controls[field])
        counts.append([name, f'{baseline:.5f}', *[f"{sum(float(row[field]) > baseline for row in candidates if row['kind'] == family)}/{sum(row['kind'] == family for row in candidates)}" for family in families]])

    def table(headers, rows):
        return '\n'.join(['| '+' | '.join(headers)+' |', '| '+' | '.join([':---']*len(headers))+' |', *['| '+' | '.join(map(str, row))+' |' for row in rows]])

    history = '- **Comparison below:** 512 matched test sequences per setting; bits per GPT-2 source token; means over three corpus-order seeds for compression; Qwen3-8B-Base likelihood. Counts mean strictly above the observed real-control score, not statistical significance.\n\n'
    history += table(['Candidate', 'Real control', 'Mirror', 'Periodic', 'Phrase bank', 'Top-k IID'], counts)
    history += '\n\n- **Historical VCDIFF pilot:** separate sample banks and protocol; do not pool its scores with the sweep above. Mirror and top-k IID both had an exactly zero forward coding difference; reversing the direction gave the same mean for several very different samplers.\n\n'
    history += table(['Pilot sample', 'Forward VCDIFF', 'Reverse VCDIFF', 'Forward + entropy gap'], [[row['label'], f"{row['mean']:.6f}", f"{row['reverse_mean']:.6f}", f"{next(item['score'] for item in combined if item['label'] == row['label']):.6f}"] for row in pilot])
    history += '\n\n- **Units:** pilot scores are bits per source token; values averaged over the three stored reference-order seeds, not three independently generated datasets.\n'
    history += '\n#### Downstream correlation depends on decoding\n\n- **Pythia:** 24 size/checkpoint points per decoding setting; seven-task five-shot downstream average; Spearman correlation with the negative metric, so positive means lower scores align with higher downstream accuracy. Repeated checkpoints are not independent model runs.\n- **Protocol:** historical 512-sequence scoring subset; not the larger likelihood budget used in the main downstream section.\n\n'
    history += table(['Decoding', 'NLL', 'NLL + gap', 'NLL + max(VCDIFF, gap)', 'NLL + max(concatenation, gap)'], [[setting, *[f"{float(next(row['spearman'] for row in correlations if row['shots'] == '5' and row['setting'] == setting and row['metric'] == metric)):.4f}" for metric in ('nll', 'nll_plus_gap', 'vcdiff_max_score', 'concatenation_max_score')]] for setting in ('t07', 't10', 't10-k20', 't10-p095', 't13')])
    history += '\n\n- **Takeaway:** adding the gap improves some decoding settings and worsens others; the maximum-penalty variants have identical rank correlations here, not evidence of a universal improvement.\n'

    rows = []
    for record in likelihood['settings']:
        nll = record['qwen_nll_bits_per_source_token']
        rate = record['collection_bits_per_source_token']
        rows.append({'parameters': record['job'], 'source_tokens': record['source_tokens'], 'nll': nll, 'compression_rate': rate, 'residual': nll-rate})
    real = next(row for row in rows if row['parameters']['kind'] == 'real')
    for row in rows:
        row['residual_margin'] = row['residual']-real['residual']
        row['nll_reference_gap'] = abs(row['nll']-real['nll'])
        row['compression_reference_gap'] = abs(row['compression_rate']-real['compression_rate'])
        row['joint_reference_gap'] = row['nll_reference_gap']+row['compression_reference_gap']
    assert len(rows) == 113
    assert all(row['source_tokens'] == 1024*1024 for row in rows)
    residual = '- **New arithmetic baseline from existing measurements:** no new generation or GPU scoring; 113 configurations, including one real control; 1,024 sequences × 1,024 GPT-2 source tokens each.\n- **Alignment:** Qwen NLL and Zstandard collection rates come from the same saved full-bank summary; different budget from the 512-sequence historical comparison above.\n- **Compressor:** standalone collection coding, not the current per-document conditional W₁ metric.\n\n'
    residual += table(['Real-control quantity', 'Bits / GPT-2 source token'], [['Qwen NLL', f"{real['nll']:.6f}"], ['Zstd collection rate', f"{real['compression_rate']:.6f}"], ['NLL − Zstd rate', f"{real['residual']:.6f}"]])
    residual += '\n\n'+table(['Sampler', 'NLL − rate above control', 'Median residual', 'Median residual margin', 'Median reference-matching sum'], [[family.replace('_', ' '), f"{sum(row['residual_margin'] > 0 for row in rows if row['parameters']['kind'] == family)}/{sum(row['parameters']['kind'] == family for row in rows)}", f"{median(row['residual'] for row in rows if row['parameters']['kind'] == family):.5f}", f"{median(row['residual_margin'] for row in rows if row['parameters']['kind'] == family):.5f}", f"{median(row['joint_reference_gap'] for row in rows if row['parameters']['kind'] == family):.5f}"] for family in families])
    residual += '\n\n- **Diagnostic:** the negative real-control residual demonstrates that these two practical coding systems do not yield a nonnegative KL estimate. Centering the residual at the real control does not repair the identity.\n- **Reference-matching sum:** zero for the real control by construction; a descriptive two-statistic matching score, not a calibrated detection test.\n\n<details class="experiment-data stress-raw"><summary>Inspect all 113 configurations · likelihood, rate and derived baselines</summary><div class="experiment-table stress-table">\n\n'
    residual += table(['Setting', 'NLL', 'Zstd rate', 'NLL − rate', 'Residual margin', 'Reference-matching sum'], [[json.dumps(row['parameters'], sort_keys=True), *[f"{row[field]:.5f}" for field in ('nll', 'compression_rate', 'residual', 'residual_margin', 'joint_reference_gap')]] for row in rows])
    residual += '\n\n</div></details>\n\n- [Download unrounded baseline results and source hashes](assets/data/metric-history.json).\n'
    payload = {'residual_baseline': rows, 'historical_counts': counts, 'historical_vcdiff': pilot, 'historical_correlations': correlations, 'sources': [{'path': str(path.relative_to(ROOT)), 'sha256': hashlib.sha256(path.read_bytes()).hexdigest()} for path in sources]}
    (ROOT / 'website/assets/data/metric-history.json').write_text(json.dumps(payload, indent=2, allow_nan=False)+'\n')
    (ROOT / 'website/content/alternatives/history-results.md').write_text(history)
    (ROOT / 'website/content/alternatives/kl-results.md').write_text(residual)
    print('Exported historical comparisons and 113 likelihood–compression residuals.')


if __name__ == '__main__':
    main()
