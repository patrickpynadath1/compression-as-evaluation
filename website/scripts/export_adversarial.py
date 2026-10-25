import csv
import hashlib
import json
import math
from pathlib import Path
from statistics import median

ROOT = Path(__file__).resolve().parents[2]
CONDITIONAL = ROOT / '.cache/analysis/bidirectional-savings/dd9d3ca581adc948cb9e/conditional-directions/8630a5e84115aef93a3a/summary.json'
NLL = ROOT / '.cache/analysis/max-penalty/adversarial.csv'
BASELINES = ROOT / '.cache/baseline-metrics/results/99782a36418b6bb10673'
KINDS = {'mirror': 18, 'periodic': 10, 'phrase_bank': 27, 'topk_iid': 18}


def key(label):
    return json.dumps(label, sort_keys=True)


def main():
    inputs = [CONDITIONAL, NLL]
    groups = {}
    conditional = [row for row in json.loads(CONDITIONAL.read_text()) if row['job']['cohort'] == 'franca_and_corruptions']
    assert all(row['counts'] == [256, 256, 256, 256] for row in conditional)
    groups['conditional'] = [(row['job']['label'], row['scores']['forward']) for row in conditional]
    with NLL.open() as handle:
        likelihood = list(csv.DictReader(handle))
    assert all(int(row['test_sequences']) == 512 for row in likelihood)
    groups['nll'] = [(json.loads(row['parameters']), float(row['nll'])) for row in likelihood]
    for metric in ['sol', 'ed', 'gm', 'jcd']:
        source = BASELINES / f'{metric}-summary.json'
        inputs.append(source)
        rows = [row for row in json.loads(source.read_text()) if row['job']['cohort'] == 'franca_and_corruptions']
        assert all(row['job']['target']['count'] == 512 for row in rows)
        groups[metric] = [(row['job']['label'], row['score']) for row in rows]
    definitions = {
        'conditional': ('Conditional compression W₁', 'bits / UTF-8 byte', '256 held-out sequences per bank'),
        'nll': ('Qwen3-8B-Base NLL', 'bits / GPT-2 source token', '512 scored sequences'),
        'sol': ('SOL', 'SOL score', '512-sequence banks'),
        'ed': ('Energy distance', 'feature-space ED', '512-sequence banks'),
        'gm': ('Gradient Moment', 'gradient score', '512-sequence banks'),
        'jcd': ('JCD', 'JCD score', '512-sequence banks; internal fit/test splits'),
    }
    points, metrics = {}, {}
    for metric, rows in groups.items():
        controls = [score for label, score in rows if label['kind'] == 'real']
        assert len(controls) == 1
        control = controls[0]
        name, units, samples = definitions[metric]
        metrics[metric] = {'name': name, 'units': units, 'samples': samples, 'control': control, 'families': {}}
        seen = set()
        for label, score in rows:
            if label['kind'] not in KINDS:
                continue
            identity = key(label)
            assert identity not in seen and math.isfinite(score)
            seen.add(identity)
            if identity not in points:
                points[identity] = {'parameters': label, 'scores': {}, 'margins': {}}
            points[identity]['scores'][metric] = score
            points[identity]['margins'][metric] = score - control
        assert len(seen) == 73
        for kind, count in KINDS.items():
            values = [score-control for label, score in rows if label['kind'] == kind]
            assert len(values) == count
            metrics[metric]['families'][kind] = {'count': count, 'above': sum(value > 0 for value in values), 'minimum': min(values), 'median': median(values), 'maximum': max(values)}
    assert len(points) == 73 and all(len(row['scores']) == 6 for row in points.values())
    payload = {'families': list(KINDS), 'metrics': metrics, 'points': sorted(points.values(), key=lambda row: (list(KINDS).index(row['parameters']['kind']), row['parameters'].get('size', 0), row['parameters'].get('seed', 0))), 'sources': [{'path': str(source.relative_to(ROOT)), 'sha256': hashlib.sha256(source.read_bytes()).hexdigest()} for source in inputs]}
    destination = ROOT / 'website/assets/data/adversarial.json'
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(json.dumps(payload, indent=2, allow_nan=False) + '\n')
    print('Exported 73 matched configurations × 6 metrics; margins computed before rounding.')


if __name__ == '__main__':
    main()
