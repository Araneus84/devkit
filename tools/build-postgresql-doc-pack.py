#!/usr/bin/env python3
"""Convert PostgreSQL's distributed HTML manual into searchable DevKit text."""

import argparse
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re


class PostgreSQLPage(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.in_body = False
        self.in_title = False
        self.hidden_divs = 0
        self.ignored = 0
        self.pre = False
        self.title = []
        self.parts = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'title':
            self.in_title = True
        if tag == 'body':
            self.in_body = True
        if not self.in_body:
            return
        if tag == 'div' and (self.hidden_divs or attrs.get('class') in ('navheader', 'navfooter')):
            self.hidden_divs += 1
        if tag in ('script', 'style'):
            self.ignored += 1
        if self.hidden_divs or self.ignored:
            return
        if tag == 'pre':
            self.pre = True
        if tag in ('p', 'pre', 'li', 'dt', 'dd', 'h1', 'h2', 'h3', 'h4', 'tr'):
            self.parts.append('\n')
        if tag in ('td', 'th'):
            self.parts.append(' | ')

    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False
        if not self.in_body:
            return
        if tag in ('script', 'style') and self.ignored:
            self.ignored -= 1
        if tag == 'div' and self.hidden_divs:
            self.hidden_divs -= 1
            return
        if tag == 'pre' and not self.hidden_divs and not self.ignored:
            self.pre = False
            self.parts.append('\n')
        if tag == 'body':
            self.in_body = False

    def handle_data(self, data):
        if self.in_title:
            self.title.append(data)
        if self.in_body and not self.hidden_divs and not self.ignored:
            self.parts.append(data if self.pre else re.sub(r'\s+', ' ', data))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source', type=Path, help='Directory containing PostgreSQL 18.6 HTML files')
    parser.add_argument('archive', type=Path, help='Original PostgreSQL documentation archive')
    parser.add_argument('output', type=Path)
    args = parser.parse_args()
    pages = []
    for file in sorted(args.source.glob('*.html')):
        page = PostgreSQLPage()
        page.feed(file.read_text(encoding='utf-8'))
        text = re.sub(r'\n[ \t]*\n[ \t]*\n+', '\n\n', ''.join(page.parts)).strip()
        if not text:
            raise ValueError(f'No readable content in {file}')
        pages.append({'path': file.name, 'title': ''.join(page.title).strip(), 'text': text})
    if not pages:
        parser.error('No PostgreSQL HTML pages found.')
    pack = {
        'format': 'devkit-documentation-pack', 'version': 1,
        'id': 'postgresql-18.6', 'name': 'PostgreSQL 18.6 documentation',
        'source': 'https://www.postgresql.org/docs/18/',
        'archiveSha256': hashlib.sha256(args.archive.read_bytes()).hexdigest(),
        'license': 'PostgreSQL License', 'pages': pages,
    }
    args.output.write_text(json.dumps(pack, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    print(f"Wrote {len(pages)} pages to {args.output}")


if __name__ == '__main__':
    main()
