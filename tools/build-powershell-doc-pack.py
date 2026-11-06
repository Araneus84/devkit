#!/usr/bin/env python3
"""Build a searchable pack from Microsoft's PowerShell-Docs source checkout."""

import argparse
import json
import pathlib
import re
import subprocess

INCLUDE = re.compile(r'\[!INCLUDE\s+\[[^\]]*\]\(([^)]+)\)\]', re.IGNORECASE)


def expand_includes(file, root, seen=()):
    file = file.resolve()
    if file in seen or not file.is_relative_to(root):
        raise ValueError(f'Unsafe or recursive include: {file}')
    text = file.read_text(encoding='utf-8-sig')
    def replace(match):
        target = (file.parent / match.group(1)).resolve()
        if not target.is_file():
            raise ValueError(f'Missing include {match.group(1)} in {file}')
        return expand_includes(target, root, (*seen, file))
    return INCLUDE.sub(replace, text)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source', type=pathlib.Path)
    parser.add_argument('output', type=pathlib.Path)
    args = parser.parse_args()
    root = args.source.resolve()
    revision = subprocess.check_output(['git', '-C', str(root), 'rev-parse', 'HEAD'], text=True).strip()
    files = sorted((root / 'reference' / '7.6').rglob('*.md'))
    files += sorted((root / 'reference' / 'docs-conceptual').rglob('*.md'))
    files.append(root / 'LICENSE.md')
    pages = []
    for file in files:
        text = expand_includes(file, root)
        if text.startswith('---\n'):
            _, _, text = text.split('---\n', 2)
        title = next((line.lstrip('# ').strip() for line in text.splitlines() if line.startswith('# ')), file.stem)
        pages.append({'path': file.relative_to(root).as_posix(), 'title': title, 'text': text.strip()})
    pack = {
        'format': 'devkit-documentation-pack',
        'version': 1,
        'id': 'powershell-7.6',
        'name': 'PowerShell 7.6 documentation',
        'source': 'https://github.com/MicrosoftDocs/PowerShell-Docs/',
        'sourceRevision': revision,
        'license': 'Creative Commons Attribution 4.0 International',
        'pages': pages,
    }
    args.output.write_text(json.dumps(pack, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    print(f"Wrote {len(pages)} pages to {args.output} from {revision}")


if __name__ == '__main__':
    main()
