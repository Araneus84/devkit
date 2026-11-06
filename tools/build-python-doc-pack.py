#!/usr/bin/env python3
"""Convert an unpacked official Python HTML manual into a DevKit documentation pack.

Usage: python tools/build-python-doc-pack.py /path/to/python-3.15-docs-html output.json
The original HTML archive remains the authoritative source; this tool retains readable
text and code examples, and records the source URL for each page.
"""

import argparse
import html.parser
import json
import pathlib
import re


class ManualPage(html.parser.HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.in_main = False
        self.depth = 0
        self.ignored = 0
        self.in_pre = False
        self.title = []
        self.in_title = False
        self.parts = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'title':
            self.in_title = True
        if not self.in_main and tag == 'div' and attrs.get('role') == 'main':
            self.in_main = True
            self.depth = 1
            return
        if not self.in_main:
            return
        if tag == 'div':
            self.depth += 1
        if tag in ('script', 'style', 'noscript'):
            self.ignored += 1
        if self.ignored:
            return
        if tag == 'pre':
            self.in_pre = True
        if tag in ('p', 'pre', 'li', 'dt', 'dd', 'h1', 'h2', 'h3', 'h4', 'tr'):
            self.parts.append('\n')

    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False
        if not self.in_main:
            return
        if tag in ('script', 'style', 'noscript') and self.ignored:
            self.ignored -= 1
        if not self.ignored and tag == 'pre':
            self.in_pre = False
            self.parts.append('\n')
        if tag == 'div':
            self.depth -= 1
            if self.depth == 0:
                self.in_main = False

    def handle_data(self, data):
        if self.in_title:
            self.title.append(data)
        if self.in_main and not self.ignored:
            self.parts.append(data if self.in_pre else re.sub(r'\s+', ' ', data))


def make_pack(source):
    pages = []
    for file in sorted(source.rglob('*.html')):
        relative = file.relative_to(source).as_posix()
        if relative.startswith('_') or file.name.startswith(('genindex', 'search')):
            continue
        parser = ManualPage()
        parser.feed(file.read_text(encoding='utf-8'))
        text = re.sub(r'\n[ \t]*\n[ \t]*\n+', '\n\n', ''.join(parser.parts)).strip()
        if not text:
            continue  # Redirect pages have no main content.
        title = ''.join(parser.title).split(' — ')[0].strip()
        pages.append({'path': relative, 'title': title, 'text': text})
    return {
        'format': 'devkit-documentation-pack',
        'version': 1,
        'id': 'python-3.15',
        'name': 'Python 3.15 documentation',
        'source': 'https://docs.python.org/3.15/',
        'license': 'Python Software Foundation License Version 2',
        'licenseUrl': 'https://docs.python.org/3.15/license.html',
        'pages': pages,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source', type=pathlib.Path)
    parser.add_argument('output', type=pathlib.Path)
    args = parser.parse_args()
    pack = make_pack(args.source)
    if not pack['pages']:
        parser.error('No manual pages found. Provide the unpacked Python HTML documentation.')
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(pack, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    print(f"Wrote {len(pack['pages'])} pages to {args.output}")


if __name__ == '__main__':
    main()
