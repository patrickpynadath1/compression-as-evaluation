import csv
import hashlib
import json
import math
from pathlib import Path
from statistics import mean

ROOT = Path(__file__).resolve().parents[2]
SUMMARY = ROOT / '.cache/analysis/bidirectional-savings/dd9d3ca581adc948cb9e/conditional-directions/8630a5e84115aef93a3a/summary.json'
BENCHMARK = ROOT / '.cache/pythia/published-evals/checkpoint_summary.csv'
MANIFEST = ROOT / '.cache/pythia/published-evals/manifest.json'
BASELINES = ROOT / '.cache/analysis/pythia-baseline-training/points.csv'
LIKELIHOOD = ROOT / '.cache/pythia/analysis/qwen8b-pile/all_settings.csv'
TASKS = ['arc_challenge_acc', 'arc_easy_acc', 'lambada_openai_acc', 'logiqa_acc', 'piqa_acc', 'sciq_acc', 'winogrande_acc']
SIZES = ['160m', '410m', '1b', '6.9b']
SETTINGS = ['t07', 't10', 't10-p095', 't10-k20', 't13']


def ranks(values):
    ordered = sorted(range(len(values)), key=values.__getitem__)
    result = [0.0] * len(values)
    start = 0
    while start < len(ordered):
        end = start + 1
        while end < len(ordered) and values[ordered[end]] == values[ordered[start]]:
            end += 1
        for index in ordered[start:end]:
            result[index] = (start + end - 1) / 2
        start = end
    return result


def correlation(rows, metric='conditional'):
    horizontal = ranks([-row['scores'][metric] for row in rows])
    vertical = ranks([row['accuracy'] for row in rows])
    horizontal = [value - mean(horizontal) for value in horizontal]
    vertical = [value - mean(vertical) for value in vertical]
    denominator = math.sqrt(sum(value**2 for value in horizontal) * sum(value**2 for value in vertical))
    return sum(left * right for left, right in zip(horizontal, vertical)) / denominator if denominator else None


def main():
    with BENCHMARK.open() as handle:
        benchmarks = {(row['size'], int(row['step'])): row for row in csv.DictReader(handle) if row['shots'] == '5'}
    points = []
    for row in json.loads(SUMMARY.read_text()):
        label = row['job']['label']
        if row['job']['cohort'] != 'pythia' or 'setting' not in label:
            continue
        benchmark = benchmarks[label['size'], label['step']]
        assert row['counts'] == [256, 256, 256, 256]
        points.append({**label, 'distance': row['scores']['forward'], 'accuracy': mean(float(benchmark[task]) for task in TASKS), 'tasks': {task: float(benchmark[task]) for task in TASKS}, 'job_id': row['job']['id']})
    assert len(points) == 120
    assert len({(row['size'], row['step'], row['setting']) for row in points}) == 120
    with BASELINES.open() as handle:
        baselines = {(row['metric'], row['size'], int(row['step']), row['setting']): row for row in csv.DictReader(handle)}
    with LIKELIHOOD.open() as handle:
        likelihoods = {(row['size'], int(row['step']), row['setting']): row for row in csv.DictReader(handle)}
    for row in points:
        key = (row['size'], row['step'], row['setting'])
        row['scores'] = {'conditional': row['distance']}
        for metric in ['gm', 'ed', 'sol']:
            baseline = baselines[(metric, *key)]
            assert abs(float(baseline['downstream_5shot_mean']) - row['accuracy']) < 1e-12
            row['scores'][metric] = float(baseline['score'])
        row['scores']['nll'] = float(likelihoods[key]['nll_bits_per_pythia_token'])
        assert int(likelihoods[key]['sequences']) == 1024
    points.sort(key=lambda row: (SETTINGS.index(row['setting']), SIZES.index(row['size']), row['step']))
    metrics = {
        'conditional': {'name': 'Conditional compression W₁', 'units': 'bits / UTF-8 byte', 'sequences': 256},
        'sol': {'name': 'SOL', 'units': 'SOL score', 'sequences': 512},
        'ed': {'name': 'Energy distance', 'units': 'feature-space ED', 'sequences': 512},
        'gm': {'name': 'Gradient Moment', 'units': 'gradient score', 'sequences': 512},
        'nll': {'name': 'Qwen3-8B-Base NLL', 'units': 'bits / Pythia token', 'sequences': 1024},
    }
    by_metric = {}
    for metric in metrics:
        correlations = {}
        for setting in SETTINGS:
            rows = [row for row in points if row['setting'] == setting]
            assert len(rows) == 24
            correlations[setting] = {'pooled': correlation(rows, metric), 'within_size': {size: correlation([row for row in rows if row['size'] == size], metric) for size in SIZES}, 'leave_one_size_out': {size: correlation([row for row in rows if row['size'] != size], metric) for size in SIZES}}
        by_metric[metric] = correlations
    manifest = json.loads(MANIFEST.read_text())
    payload = {'metric': 'Forward reference-conditioned coding-rate Wasserstein-1', 'units': 'bits / UTF-8 byte', 'metrics': metrics, 'tasks': TASKS, 'sizes': SIZES, 'settings': SETTINGS, 'points': points, 'correlations': by_metric['conditional'], 'correlations_by_metric': by_metric, 'sources': [{'path': str(path.relative_to(ROOT)), 'sha256': hashlib.sha256(path.read_bytes()).hexdigest()} for path in [SUMMARY, BENCHMARK, MANIFEST, BASELINES, LIKELIHOOD]], 'published_eval_commit': manifest['commit']}
    destination = ROOT / 'website/assets/data/downstream.json'
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(json.dumps(payload, indent=2, allow_nan=False) + '\n')
    print(json.dumps({metric: {setting: result['pooled'] for setting, result in values.items()} for metric, values in by_metric.items()}, indent=2))


if __name__ == '__main__':
    main()
