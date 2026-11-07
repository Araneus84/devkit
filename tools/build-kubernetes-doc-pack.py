#!/usr/bin/env python3
"""Package Kubernetes English documentation and expand local example snippets."""
import argparse
from collections import Counter
import json
from pathlib import Path
import re
import subprocess

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('source', type=Path)
parser.add_argument('output', type=Path)
args = parser.parse_args()
root = args.source.resolve()
docs = root / 'content/en/docs'
examples = root / 'content/en/examples'
includes = root / 'content/en/includes'
counts = Counter()
revision = subprocess.check_output(['git', '-c', f'safe.directory={root.as_posix()}', '-C', str(root), 'rev-parse', 'HEAD'], text=True).strip()

def contained_file(base, name):
    path = (base / name).resolve()
    return path if path.is_relative_to(base.resolve()) and path.is_file() else None

def expand(text, current, depth=0):
    if depth > 4:
        return text
    def sample(match):
        name = match.group(1)
        file = contained_file(current.parent, name) or contained_file(examples, name.lstrip('/'))
        if not file:
            counts['missing examples'] += 1
            return f'[Example unavailable in this pack: {name}]'
        counts['examples'] += 1
        return f'\nExample: {name}\n```{file.suffix.lstrip(".")}\n{file.read_text(encoding="utf-8", errors="replace")}\n```\n'
    text = re.sub(r'\{\{[%<]\s*code_sample\s+[^}]*?\bfile="([^"]+)"[^}]*?[>%]\}\}', sample, text)
    def include(match):
        name = match.group(1)
        file = contained_file(includes, name) or contained_file(current.parent, name)
        if not file:
            counts['missing includes'] += 1
            return f'[Included content unavailable in this pack: {name}]'
        counts['includes'] += 1
        return expand(file.read_text(encoding='utf-8'), file, depth + 1)
    text = re.sub(r'\{\{[%<]\s*include\s+"([^"]+)"\s*[>%]\}\}', include, text)
    text = re.sub(r'\{\{[%<]\s*heading\s+"([^"]+)"\s*[>%]\}\}', lambda m: {'whatsnext':'What\'s next','seealso':'See also','envvars':'Environment variables'}.get(m.group(1), m.group(1).capitalize()), text)
    def tooltip(match):
        attrs = match.group(1)
        label = re.search(r'\btext="([^"]+)"', attrs) or re.search(r'\bterm_id="([^"]+)"', attrs)
        return label.group(1) if label else match.group(0)
    return re.sub(r'\{\{[%<]\s*glossary_tooltip\s+([^}]*?)[>%]\}\}', tooltip, text)

pages = []
for file in sorted(docs.rglob('*.md')):
    text = file.read_text(encoding='utf-8-sig')
    title = file.stem
    if text.startswith('---\n'):
        parts = re.split(r'\n---(?:\n|$)', text[4:], maxsplit=1)
        if len(parts) == 2:
            front, text = parts
            title = next((line[6:].strip().strip('"\'') for line in front.splitlines() if line.startswith('title:')), title)
    text = expand(text, file).strip()
    text, redacted = re.subn(r'-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----.*?-----END \1PRIVATE KEY-----', '[PRIVATE KEY EXAMPLE REMOVED]', text, flags=re.DOTALL)
    counts['private key examples removed'] += redacted
    if re.search(r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----', text):
        raise ValueError(f'Unmatched private key marker in {file}')
    pages.append({'path': file.relative_to(root).as_posix(), 'title': title, 'text': text})
pages.append({'path': 'LICENSE', 'title': 'Kubernetes documentation license', 'text': (root / 'LICENSE').read_text(encoding='utf-8')})
pack = {'format': 'devkit-documentation-pack', 'version': 1, 'id': 'kubernetes-2026-11',
        'name': 'Kubernetes documentation snapshot (November 2026)', 'revision': revision,
        'source': 'https://github.com/kubernetes/website/', 'license': 'CC BY 4.0', 'pages': pages}
args.output.write_text(json.dumps(pack, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
print(f'{len(pages)} pages; ' + ', '.join(f'{key}: {value}' for key, value in sorted(counts.items())))
