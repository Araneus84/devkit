#!/usr/bin/env python3
"""Convert the published npm 12.2.2 HTML manual to searchable plain text."""
import argparse
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('package', type=Path, help='Extracted package directory')
parser.add_argument('archive', type=Path, help='Original npm 12.2.2 package archive')
parser.add_argument('output', type=Path)
args = parser.parse_args()

class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title = []
        self.parts = []
        self.in_title = False
        self.in_content = False
        self.depth = 0
        self.pre = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'title': self.in_title = True
        if tag == 'div' and attrs.get('id') == '_content':
            self.in_content = True
            self.depth = 1
            return
        if not self.in_content: return
        if tag == 'div': self.depth += 1
        if tag == 'pre': self.pre = True
        if tag in ('p', 'pre', 'li', 'h1', 'h2', 'h3', 'h4', 'tr'): self.parts.append('\n')
        if tag == 'li': self.parts.append('- ')
        if tag in ('td', 'th'): self.parts.append(' | ')
        if tag == 'br': self.parts.append('\n')

    def handle_endtag(self, tag):
        if tag == 'title': self.in_title = False
        if not self.in_content: return
        if tag == 'div':
            self.depth -= 1
            if self.depth == 0:
                self.in_content = False
                return
        if tag == 'pre':
            self.pre = False
            self.parts.append('\n')

    def handle_data(self, data):
        if self.in_title: self.title.append(data)
        if self.in_content: self.parts.append(data if self.pre else re.sub(r'\s+', ' ', data))

pages = []
for file in sorted((args.package / 'docs/output').rglob('*.html')):
    page = Page()
    page.feed(file.read_text(encoding='utf-8'))
    text = re.sub(r'\n[ \t]*\n[ \t]*\n+', '\n\n', ''.join(page.parts)).strip()
    if not text: raise ValueError(f'No manual text found in {file}')
    text = re.sub(r'-----BEGIN (RSA |EC |OPENSSH |)PRIVATE KEY-----.*?-----END \1PRIVATE KEY-----', '[PRIVATE KEY EXAMPLE REMOVED]', text, flags=re.DOTALL)
    if re.search(r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----', text): raise ValueError(f'Unmatched private key marker in {file}')
    pages.append({'path':file.relative_to(args.package).as_posix(), 'title':''.join(page.title).strip(), 'text':text})
if not pages: raise ValueError('No HTML manual files found')
pages.append({'path':'LICENSE', 'title':'npm Artistic License 2.0', 'text':(args.package / 'LICENSE').read_text(encoding='utf-8')})
pack = {'format':'devkit-documentation-pack', 'version':1, 'id':'npm-12.2.2',
        'name':'npm 12.2.2 documentation', 'license':'Artistic License 2.0',
        'source':'https://registry.npmjs.org/npm/-/npm-12.2.2.tgz',
        'archiveSha256':hashlib.sha256(args.archive.read_bytes()).hexdigest(), 'pages':pages}
args.output.write_text(json.dumps(pack, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
print(f'Wrote {len(pages)} pages')
