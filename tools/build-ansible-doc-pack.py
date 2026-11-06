#!/usr/bin/env python3
"""Build an Ansible Core pack from matching official source checkouts."""

import argparse
import ast
import json
import pathlib
import re
import subprocess


def revision(root):
    return subprocess.check_output(['git', '-C', str(root), 'rev-parse', 'HEAD'], text=True).strip()


def guide_text(file, docs_root, seen=()):
    file = file.resolve()
    if file in seen or not file.is_relative_to(docs_root):
        raise ValueError(f'Unsafe or recursive documentation include: {file}')
    text = file.read_text(encoding='utf-8-sig')
    def expand(match):
        name = match.group(2).strip()
        target = (docs_root / name.lstrip('/')) if name.startswith('/') else (file.parent / name)
        target = target.resolve()
        if not target.is_file():
            raise ValueError(f'Missing documentation include {name} in {file}')
        indent = match.group(1)
        return '\n'.join(indent + line for line in guide_text(target, docs_root, (*seen, file)).splitlines())
    return re.sub(r'(?m)^()\.\. include::\s*([^\n]+)', expand, text)


def module_content(file):
    tree = ast.parse(file.read_text(encoding='utf-8'), filename=str(file))
    values = {}
    for node in tree.body:
        if isinstance(node, ast.Assign):
            for target in node.targets:
                if isinstance(target, ast.Name) and target.id in ('DOCUMENTATION', 'EXAMPLES', 'RETURN'):
                    try:
                        value = ast.literal_eval(node.value)
                    except (ValueError, TypeError):
                        continue
                    if isinstance(value, str):
                        values[target.id] = value.strip()
    if 'DOCUMENTATION' not in values:
        return None
    return '\n\n'.join(f'{key}\n\n{values[key]}' for key in ('DOCUMENTATION', 'EXAMPLES', 'RETURN') if key in values)


def fragment_content(file):
    tree = ast.parse(file.read_text(encoding='utf-8'), filename=str(file))
    parts = []
    for node in ast.walk(tree):
        if isinstance(node, ast.Assign):
            for target in node.targets:
                if isinstance(target, ast.Name) and target.id.isupper():
                    try:
                        value = ast.literal_eval(node.value)
                    except (ValueError, TypeError):
                        continue
                    if isinstance(value, str):
                        parts.append(f'{target.id}\n\n{value.strip()}')
    return '\n\n'.join(parts)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('guides', type=pathlib.Path)
    parser.add_argument('core', type=pathlib.Path)
    parser.add_argument('output', type=pathlib.Path)
    args = parser.parse_args()
    guides = args.guides.resolve()
    core = args.core.resolve()
    pages = []
    docs_root = (guides / 'docs' / 'docsite' / 'rst').resolve()
    for file in sorted(docs_root.rglob('*.rst')):
        text = guide_text(file, docs_root)
        title = next((line.strip() for line in text.splitlines() if line.strip() and not line.startswith(('..', ':', '='))), file.stem)
        pages.append({'path': 'guides/' + file.relative_to(guides).as_posix(), 'title': title, 'text': text})
    for folder in ('lib/ansible/modules', 'lib/ansible/plugins'):
        for file in sorted((core / folder).rglob('*.py')):
            is_fragment = 'doc_fragments' in file.parts
            content = fragment_content(file) if is_fragment else module_content(file)
            if content:
                name = file.stem
                prefix = 'Ansible documentation fragment: ' if is_fragment else 'ansible.builtin.'
                pages.append({'path': 'core/' + file.relative_to(core).as_posix(), 'title': prefix + name, 'text': content})
    pages.append({'path': 'guides/COPYING', 'title': 'GNU General Public License version 3', 'text': (guides / 'COPYING').read_text(encoding='utf-8')})
    pack = {
        'format': 'devkit-documentation-pack', 'version': 1,
        'id': 'ansible-core-2.21', 'name': 'Ansible Core 2.21 documentation',
        'source': 'https://github.com/ansible/', 'license': 'GNU General Public License version 3 or later',
        'guideRevision': revision(guides), 'coreRevision': revision(core), 'pages': pages,
    }
    args.output.write_text(json.dumps(pack, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    print(f"Wrote {len(pages)} pages to {args.output}")


if __name__ == '__main__':
    main()
