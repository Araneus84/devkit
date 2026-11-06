#!/usr/bin/env python3
"""Build a Terraform language and CLI pack from HashiCorp's docs checkout."""

import argparse
import json
import pathlib
import subprocess


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source', type=pathlib.Path)
    parser.add_argument('output', type=pathlib.Path)
    args = parser.parse_args()
    root = args.source.resolve()
    revision = subprocess.check_output(['git', '-C', str(root), 'rev-parse', 'HEAD'], text=True).strip()
    files = sorted((root / 'content' / 'terraform' / 'v1.17.x' / 'docs').rglob('*.mdx'))
    pages = []
    for file in files:
        text = file.read_text(encoding='utf-8-sig')
        if text.startswith('---\n'):
            _, _, text = text.split('---\n', 2)
        title = next((line.lstrip('# ').strip().replace('`', '') for line in text.splitlines() if line.startswith('# ')), file.stem)
        pages.append({'path': file.relative_to(root).as_posix(), 'title': title, 'text': text.strip()})
    pages.append({'path': 'LICENSE', 'title': 'Business Source License 1.1', 'text': (root / 'LICENSE').read_text(encoding='utf-8')})
    pack = {
        'format': 'devkit-documentation-pack', 'version': 1,
        'id': 'terraform-1.17', 'name': 'Terraform 1.17 documentation',
        'source': 'https://github.com/hashicorp/web-unified-docs/', 'sourceRevision': revision,
        'license': 'Business Source License 1.1', 'pages': pages,
    }
    args.output.write_text(json.dumps(pack, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    print(f"Wrote {len(pages)} pages to {args.output} from {revision}")


if __name__ == '__main__':
    main()
