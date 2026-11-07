#!/usr/bin/env python3
"""Build Docker documentation from the official docs, CLI, and BuildKit checkouts."""

import argparse
import json
import pathlib
import re
import subprocess

EXAMPLE_SECRET_PATTERNS = (
    (re.compile(r'\bSWMTKN-1-[A-Za-z0-9]{50}-[A-Za-z0-9]{25}\b'), '<SWARM_JOIN_TOKEN>'),
    (re.compile(r'\bSWMKEY-1-[A-Za-z0-9+/=]{43}(?![A-Za-z0-9+/=])'), '<SWARM_UNLOCK_KEY>'),
)


def redact_example_tokens(text):
    for pattern, placeholder in EXAMPLE_SECRET_PATTERNS:
        text = pattern.sub(placeholder, text)
    return text


def revision(root):
    return subprocess.check_output(['git', '-C', str(root), 'rev-parse', 'HEAD'], text=True).strip()


def page(file, root, prefix):
    text = file.read_text(encoding='utf-8-sig')
    title = file.stem
    if text.startswith('---\n'):
        frontmatter, text = re.split(r'\n---(?:\n|$)', text[4:], maxsplit=1)
        title = next((line[6:].strip().strip('"\'') for line in frontmatter.splitlines() if line.startswith('title:')), title)
    else:
        title = next((line.lstrip('# ').strip() for line in text.splitlines() if line.startswith('# ')), title)
    return {'path': prefix + '/' + file.relative_to(root).as_posix(), 'title': title, 'text': redact_example_tokens(text.strip())}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('docs', type=pathlib.Path)
    parser.add_argument('cli', type=pathlib.Path)
    parser.add_argument('buildkit', type=pathlib.Path)
    parser.add_argument('output', type=pathlib.Path)
    args = parser.parse_args()
    docs, cli, buildkit = (path.resolve() for path in (args.docs, args.cli, args.buildkit))
    pages = []
    for folder in ('content/reference', 'content/manuals/engine', 'content/manuals/build', 'content/manuals/compose', 'content/get-started'):
        pages.extend(page(file, docs, 'docs') for file in sorted((docs / folder).rglob('*.md')))
    pages.extend(page(file, cli, 'cli') for file in sorted((cli / 'docs' / 'reference').rglob('*.md')))
    pages.append(page(buildkit / 'frontend/dockerfile/docs/reference.md', buildkit, 'buildkit'))
    for root, prefix, filename in ((docs, 'docs', 'LICENSE'), (cli, 'cli', 'NOTICE')):
        file = root / filename
        if file.is_file():
            pages.append({'path': prefix + '/' + filename, 'title': 'Docker ' + filename, 'text': file.read_text(encoding='utf-8')})
    pack = {
        'format': 'devkit-documentation-pack', 'version': 1,
        'id': 'docker-2026-11', 'name': 'Docker documentation snapshot 2026-11',
        'source': 'https://github.com/docker/docs/', 'license': 'Apache License 2.0',
        'docsRevision': revision(docs), 'cliRevision': revision(cli), 'buildkitRevision': revision(buildkit), 'pages': pages,
    }
    args.output.write_text(json.dumps(pack, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    print(f"Wrote {len(pages)} pages to {args.output}")


if __name__ == '__main__':
    main()
