#!/usr/bin/env python3
"""Convert the GNU Bash HTML manual to searchable DevKit text pages."""

import argparse
import html.parser
import json
import pathlib
import re


class BashManual(html.parser.HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.pages = []
        self.current = None
        self.heading = None
        self.ignored = 0
        self.pre = False

    def finish(self):
        if self.current:
            self.current['text'] = re.sub(r'\n[ \t]*\n[ \t]*\n+', '\n\n', ''.join(self.current['parts'])).strip()
            del self.current['parts']
            if self.current['text']:
                self.pages.append(self.current)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        classes = attrs.get('class', '').split()
        if self.ignored:
            if tag not in ('br', 'hr', 'img', 'meta', 'link', 'input', 'wbr'):
                self.ignored += 1
            return
        if tag in ('script', 'style', 'noscript') or any(c in classes for c in ('nav-panel', 'mini-toc', 'copiable-link')):
            self.ignored = 1
            return
        if tag in ('h2', 'h3', 'h4') and attrs.get('id'):
            self.finish()
            self.current = {'path': 'bash.html#' + attrs['id'], 'title': '', 'parts': []}
            self.heading = tag
        if not self.current:
            return
        if tag == 'pre':
            self.pre = True
        if tag in ('p', 'pre', 'li', 'dt', 'dd', 'h2', 'h3', 'h4', 'tr'):
            self.current['parts'].append('\n')

    def handle_endtag(self, tag):
        if self.ignored:
            self.ignored -= 1
            return
        if tag == self.heading:
            self.heading = None
        if tag == 'pre':
            self.pre = False
            if self.current:
                self.current['parts'].append('\n')

    def handle_data(self, data):
        if self.ignored or not self.current:
            return
        if self.heading:
            self.current['title'] += data
        self.current['parts'].append(data if self.pre else re.sub(r'\s+', ' ', data))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source', type=pathlib.Path)
    parser.add_argument('output', type=pathlib.Path)
    args = parser.parse_args()
    manual = BashManual()
    manual.feed(args.source.read_text(encoding='utf-8'))
    manual.finish()
    pack = {
        'format': 'devkit-documentation-pack',
        'version': 1,
        'id': 'bash-5.3',
        'name': 'GNU Bash 5.3 Reference Manual',
        'source': 'https://www.gnu.org/software/bash/manual/',
        'license': 'GNU Free Documentation License 1.3 or later',
        'copyright': 'Copyright 1988–2025 Free Software Foundation, Inc.',
        'pages': manual.pages,
    }
    args.output.write_text(json.dumps(pack, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    print(f"Wrote {len(manual.pages)} sections to {args.output}")


if __name__ == '__main__':
    main()
