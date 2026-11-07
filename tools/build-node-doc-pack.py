#!/usr/bin/env python3
"""Convert Node.js's published structured API reference to searchable text."""
import argparse
from collections import defaultdict
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('api', type=Path, help='Official Node.js all.json')
parser.add_argument('license', type=Path, help='Node.js release LICENSE')
parser.add_argument('output', type=Path)
args = parser.parse_args()

class Text(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []
        self.pre = False
        self.ignore = 0
    def handle_starttag(self, tag, attrs):
        if tag in ('script', 'style'): self.ignore += 1
        if self.ignore: return
        if tag == 'pre': self.pre = True
        if tag in ('p', 'pre', 'li', 'h1', 'h2', 'h3', 'h4', 'tr'): self.parts.append('\n')
        if tag == 'li': self.parts.append('- ')
        if tag == 'br': self.parts.append('\n')
    def handle_endtag(self, tag):
        if tag in ('script', 'style') and self.ignore:
            self.ignore -= 1
            return
        if tag == 'pre' and not self.ignore:
            self.pre = False
            self.parts.append('\n')
    def handle_data(self, data):
        if not self.ignore: self.parts.append(data if self.pre else re.sub(r'\s+', ' ', data))

def plain(html):
    p = Text()
    p.feed(html)
    return re.sub(r'\n[ \t]*\n[ \t]*\n+', '\n\n', ''.join(p.parts)).strip()

groups = defaultdict(list)
def visit(value, source=None):
    if isinstance(value, list):
        for item in value: visit(item, source)
    elif isinstance(value, dict):
        source = value.get('source', source)
        if source and re.fullmatch(r'doc/api/[a-zA-Z0-9_.-]+\.md', source):
            heading = value.get('textRaw', '')
            desc = value.get('desc', '')
            if heading or desc:
                parts = [str(heading).strip(), plain(desc) if isinstance(desc, str) else '']
                meta = value.get('meta', {})
                if isinstance(meta, dict):
                    if meta.get('added'): parts.append('Added: ' + ', '.join(map(str, meta['added'])))
                    for change in meta.get('changes', []):
                        if isinstance(change, dict):
                            versions = change.get('version', '')
                            if isinstance(versions, list): versions = ', '.join(map(str, versions))
                            parts.append('Changed ' + str(versions) + ': ' + str(change.get('description', '')))
                if value.get('stabilityText'): parts.append('Stability: ' + str(value['stabilityText']))
                groups[source].append('\n'.join(part for part in parts if part))
        for key, item in value.items():
            if key not in ('desc', 'meta') and isinstance(item, (dict, list)): visit(item, source)

raw = args.api.read_bytes()
visit(json.loads(raw))
pages = [{'path':source, 'title':Path(source).stem + ' — Node.js API', 'text':'\n\n'.join(parts)}
         for source, parts in sorted(groups.items())]
if not pages: raise ValueError('No Node.js API pages found')
pages.append({'path':'licenses/node-license.txt', 'title':'Node.js license', 'text':args.license.read_text(encoding='utf-8')})
pack = {'format':'devkit-documentation-pack', 'version':1, 'id':'node-26.13.0',
        'name':'Node.js 26.13.0 API reference', 'license':'MIT and third-party licenses',
        'source':'https://nodejs.org/download/release/v26.13.0/docs/api/all.json',
        'sourceSha256':hashlib.sha256(raw).hexdigest(), 'pages':pages}
args.output.write_text(json.dumps(pack, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
print(f'Wrote {len(pages)} pages')
