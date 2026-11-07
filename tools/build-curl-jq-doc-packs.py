#!/usr/bin/env python3
"""Build curl and jq documentation packs (requires PyYAML)."""
import argparse
import json
from pathlib import Path
import re
import subprocess
import yaml

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('curl', type=Path)
parser.add_argument('jq', type=Path)
parser.add_argument('jq_license', type=Path)
parser.add_argument('output', type=Path)
args = parser.parse_args()

def revision(root):
    root = root.resolve()
    return subprocess.check_output(['git', '-c', f'safe.directory={root.as_posix()}', '-C', str(root), 'rev-parse', 'HEAD'], text=True).strip()

def save(filename, identifier, name, license_name, rev, pages):
    pack = {'format': 'devkit-documentation-pack', 'version': 1, 'id': identifier,
            'name': name, 'license': license_name, 'revision': rev, 'pages': pages}
    (args.output / filename).write_text(json.dumps(pack, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    print(f'{identifier}: {len(pages)} pages')

curl = args.curl.resolve()
curl_rev = revision(curl)
pages = []
for file in sorted((curl / 'docs/cmdline-opts').glob('*.md')):
    raw = file.read_text(encoding='utf-8')
    title = file.stem
    text = raw
    if raw.startswith('---\n'):
        front, text = raw[4:].split('\n---\n', 1)
        # curl option metadata resembles YAML but examples are not YAML-quoted.
        meta = {}
        key = None
        for line in front.splitlines():
            field = re.match(r'^([A-Za-z-]+):\s*(.*)$', line)
            if field:
                key = field.group(1)
                meta[key] = field.group(2) if field.group(2) else []
            elif key and line.startswith('  - '):
                if isinstance(meta[key], list):
                    meta[key].append(line[4:])
        if 'Long' in meta:
            title = '--' + str(meta['Long'])
            if 'Short' in meta:
                title += ' (-' + str(meta['Short']) + ')'
            details = [f'{key}: {meta[key]}' for key in ('Help', 'Arg', 'Protocols', 'Added', 'Multi') if key in meta]
            examples = ['curl ' + str(example).replace('$URL', 'https://example.com') for example in meta.get('Example', [])]
            text = '\n'.join(details) + '\n\n' + text.strip() + ('\n\nExamples:\n' + '\n'.join(examples) if examples else '')
    pages.append({'path': file.relative_to(curl).as_posix(), 'title': title, 'text': text.strip()})
manual = subprocess.check_output(['git', '-c', f'safe.directory={curl.as_posix()}', '-C', str(curl), 'show', 'HEAD:docs/MANUAL.md']).decode('utf-8')
pages.append({'path':'docs/MANUAL.md', 'title':'curl tutorial', 'text':manual})
pages.append({'path':'COPYING', 'title':'curl copyright and permission notice', 'text':(curl / 'COPYING').read_text(encoding='utf-8')})
save('curl-2026-11.json', 'curl-2026-11', 'curl documentation snapshot (November 2026)', 'curl license', curl_rev, pages)

jq = args.jq.resolve()
jq_rev = revision(jq)
docpath = 'docs/content/manual/v1.8/manual.yml'
doc = yaml.safe_load((jq / docpath).read_text(encoding='utf-8'))
pages = [{'path':docpath, 'title':'jq 1.8 introduction and invocation', 'text':'\n\n'.join(doc.get(k, '') for k in ('body', 'manpage_intro', 'manpage_epilogue'))}]
for section in doc['sections']:
    pages.append({'path':docpath, 'title':section['title'], 'text':section.get('body', '')})
    for entry in section.get('entries', []):
        parts = [entry.get('body', '')]
        for example in entry.get('examples', []):
            output = example.get('output', [])
            parts.append('Example filter: ' + str(example.get('program', '')) + '\nInput: ' + str(example.get('input', '')) + '\nOutput:\n' + '\n'.join(map(str, output)))
        pages.append({'path':docpath, 'title':entry['title'], 'text':'\n\n'.join(parts)})
pages.append({'path':'licenses/CC-BY-3.0.txt', 'title':'Creative Commons Attribution 3.0 license', 'text':args.jq_license.read_text(encoding='utf-8')})
save('jq-1.8.json', 'jq-1.8', 'jq 1.8 manual', 'CC BY 3.0', jq_rev, pages)
