#!/usr/bin/env python3
"""Package the official Vim help files without altering their text."""
import argparse
import json
from pathlib import Path
import subprocess

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('source', type=Path)
parser.add_argument('publication_license', type=Path, help='SPDX OPUBL-1.0 license text')
parser.add_argument('output', type=Path)
args = parser.parse_args()
root = args.source.resolve()
revision = subprocess.check_output(['git', '-c', f'safe.directory={root.as_posix()}', '-C', str(root), 'rev-parse', 'HEAD'], text=True).strip()
files = sorted((root / 'runtime/doc').glob('*.txt'))
if not files or not (root / 'runtime/doc/uganda.txt').is_file():
    raise ValueError('Vim documentation or its license is missing')
pages = [{'path': 'runtime/doc/' + file.name, 'title': file.name,
          'text': file.read_bytes().decode('utf-8')} for file in files]
pages.append({'path': 'licenses/OPUBL-1.0.txt', 'title': 'Open Publication License v1.0',
              'text': args.publication_license.read_bytes().decode('utf-8')})
pack = {'format': 'devkit-documentation-pack', 'version': 1, 'id': 'vim-2026-11',
        'name': 'Vim 9.2 help snapshot (November 2026)', 'revision': revision,
        'source': 'https://github.com/vim/vim/', 'license': 'Open Publication License v1.0 or later; Vim License', 'pages': pages}
args.output.write_text(json.dumps(pack, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
print(f'Wrote {len(pages)} help files')
