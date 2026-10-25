import csv
import hashlib
import json
from statistics import mean

from export_adversarial import ROOT, CONDITIONAL, BASELINES, NLL, key


def main():
    sources = []

    def read(path):
        sources.append(path)
        return json.loads(path.read_text())

    conditional = read(CONDITIONAL)
    baselines = {metric: read(BASELINES / f'{metric}-summary.json') for metric in ('sol', 'ed', 'gm', 'jcd')}
    definitions = read(ROOT / 'website/assets/data/adversarial.json')['metrics']
    suites = {}
    for cohort, name in [('franca_and_corruptions', 'corruption'), ('adaptive', 'adaptive'), ('structural', 'structural')]:
        groups = {'conditional': [(row['job']['label'], row['scores']['forward']) for row in conditional if row['job']['cohort'] == cohort]}
        for metric, records in baselines.items():
            groups[metric] = [(row['job']['label'], row['score']) for row in records if row['job']['cohort'] == cohort]
        if name == 'corruption':
            sources.append(NLL)
            with NLL.open() as handle:
                groups['nll'] = [(json.loads(row['parameters']), float(row['nll'])) for row in csv.DictReader(handle)]
        else:
            directory = ROOT / f'.cache/{name}-adversaries/likelihood'
            paths = list(directory.glob('*/summary.json'))
            assert len(paths) == 1
            groups['nll'] = [(dict(row['job'], phase=row['phase']), row['qwen_nll_bits_per_source_token']) for row in read(paths[0])['settings']]
        suite = {'metrics': {}, 'phases': ['all'] if name == 'corruption' else ['heldout', 'dev']}
        for metric in ('conditional', 'nll', 'sol', 'ed', 'gm', 'jcd'):
            metadata = definitions[metric]
            records = []
            for phase in suite['phases']:
                rows = [(label, score) for label, score in groups[metric] if label.get('phase', 'all') == phase]
                controls = [score for label, score in rows if label['kind'] == 'real']
                assert len(controls) == (1 if phase == 'all' else 3)
                control = mean(controls)
                for label, score in rows:
                    if label['kind'] == 'real' or (name == 'corruption' and label['kind'] not in ('pollute', 'shuffle', 'repeat', 'collapse', 'bank')):
                        continue
                    records.append({'parameters': label, 'phase': phase, 'score': score, 'control': control, 'control_min': min(controls), 'control_max': max(controls), 'margin': score-control})
            suite['metrics'][metric] = {'name': metadata['name'], 'units': metadata['units'], 'rows': sorted(records, key=lambda row: key(row['parameters']))}
        identities = [{key(row['parameters']) for row in metric['rows']} for metric in suite['metrics'].values()]
        assert all(identity == identities[0] for identity in identities)
        assert len(identities[0]) == {'corruption': 39, 'adaptive': 28, 'structural': 26}[name]
        suites[name] = suite
    paired = read(CONDITIONAL.parent / 'paired.json')
    suites['paired'] = {'phases': ['paired'], 'metrics': {}}
    for metric, name in [('forward', 'Conditional W₁ · real context'), ('reverse', 'Conditional W₁ · generated context'), ('sum', 'Bidirectional conditional W₁ sum'), ('standalone', 'Standalone rate W₁')]:
        suites['paired']['metrics'][metric] = {'name': name, 'units': 'bits / UTF-8 byte', 'rows': [{'parameters': {'condition': row['condition']}, 'phase': 'paired', 'score': row['after'][metric], 'control': row['before'][metric], 'control_min': row['before'][metric], 'control_max': row['before'][metric], 'margin': row['after'][metric]-row['before'][metric]} for row in paired]}
    matched = read(ROOT / '.cache/analysis/standalone-matched-adversary/3ca8890f76948ccc0a04/summary.json')
    suites['matched'] = {'phases': ['heldout'], 'metrics': {}, 'selection': matched}
    for metric in ('conditional', 'standalone'):
        suites['matched']['metrics'][metric] = {'name': f'{metric.title()} rate W₁', 'units': 'bits / UTF-8 byte', 'rows': [{'parameters': {'seed': row['seed']}, 'phase': 'heldout', 'score': row[f'heldout_{metric}_w1'], 'control': row[f'real_control_{metric}_w1'], 'control_min': row[f'real_control_{metric}_w1'], 'control_max': row[f'real_control_{metric}_w1'], 'margin': row[f'heldout_{metric}_w1']-row[f'real_control_{metric}_w1']} for row in matched]}
    payload = {'suites': suites, 'sources': [{'path': str(path.relative_to(ROOT)), 'sha256': hashlib.sha256(path.read_bytes()).hexdigest()} for path in sources]}
    (ROOT / 'website/assets/data/stress-tests.json').write_text(json.dumps(payload, indent=2, allow_nan=False)+'\n')
    print('Exported five stress-test suites with matched controls and unrounded margins.')


if __name__ == '__main__':
    main()
