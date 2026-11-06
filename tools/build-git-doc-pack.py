#!/usr/bin/env python3
"""Convert Git's prebuilt HTML manual pages into a searchable text pack."""

import argparse
import html.parser
import json
import pathlib
import re
import subprocess


class GitPage(html.parser.HTMLParser):
    def __init__(self, capture_body=False):
        super().__init__(convert_charrefs=True)
        self.depth = 0
        self.ignored = 0
        self.pre = False
        self.in_title = False
        self.title = []
        self.parts = []
        self.capture_body = capture_body

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'title':
            self.in_title = True
        if self.capture_body and tag == 'body':
            self.depth = 1
            return
        if not self.depth and tag == 'div' and attrs.get('id') in ('header', 'content'):
            self.depth = 1
            return
        if not self.depth:
            return
        if tag == 'div':
            self.depth += 1
        if tag in ('script', 'style'):
            self.ignored += 1
        if self.ignored:
            return
        if tag == 'pre':
            self.pre = True
        if tag in ('p', 'pre', 'li', 'dt', 'dd', 'h1', 'h2', 'h3', 'h4', 'tr'):
            self.parts.append('\n')

    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False
        if self.capture_body and tag == 'body':
            self.depth = 0
            return
        if not self.depth:
            return
        if tag in ('script', 'style') and self.ignored:
            self.ignored -= 1
        if tag == 'pre' and not self.ignored:
            self.pre = False
            self.parts.append('\n')
        if tag == 'div':
            self.depth -= 1

    def handle_data(self, data):
        if self.in_title:
            self.title.append(data)
        if self.depth and not self.ignored:
            self.parts.append(data if self.pre else re.sub(r'\s+', ' ', data))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source', type=pathlib.Path)
    parser.add_argument('license', type=pathlib.Path)
    parser.add_argument('output', type=pathlib.Path)
    args = parser.parse_args()
    root = args.source.resolve()
    revision = subprocess.check_output(['git', '-C', str(root), 'rev-parse', 'HEAD'], text=True).strip()
    pages = []
    for file in sorted(root.rglob('*.html')):
        if '.git' in file.parts:
            continue
        page = GitPage(capture_body=file.name == 'user-manual.html')
        page.feed(file.read_text(encoding='utf-8'))
        text = re.sub(r'\n[ \t]*\n[ \t]*\n+', '\n\n', ''.join(page.parts)).strip()
        if text:
            pages.append({'path': file.relative_to(root).as_posix(), 'title': ''.join(page.title).strip(), 'text': text})
    pages.append({'path': 'COPYING', 'title': 'GNU General Public License version 2', 'text': args.license.read_text(encoding='utf-8')})
    pack = {
        'format': 'devkit-documentation-pack', 'version': 1,
        'id': 'git-2026-11', 'name': 'Git manual snapshot 2026-11',
        'source': 'https://github.com/git/htmldocs/', 'sourceRevision': revision,
        'license': 'GNU General Public License version 2', 'pages': pages,
    }
    args.output.write_text(json.dumps(pack, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    print(f"Wrote {len(pages)} pages to {args.output} from {revision}")


if __name__ == '__main__':
    main()
