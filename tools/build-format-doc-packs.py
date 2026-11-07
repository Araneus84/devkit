#!/usr/bin/env python3
"""Package unmodified YAML and JSON specifications for offline searching."""
import argparse
import hashlib
import json
from pathlib import Path

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('yaml_source', type=Path)
parser.add_argument('json_source', type=Path)
parser.add_argument('output', type=Path)
args = parser.parse_args()
for source, filename, identifier, title, path, url, license_name in [
    (args.yaml_source, 'yaml-1.2.2.json', 'yaml-1.2.2', 'YAML 1.2.2 specification',
     'spec.md', 'https://yaml.org/spec/1.2.2/', 'YAML specification copying terms'),
    (args.json_source, 'json-rfc8259.json', 'json-rfc8259', 'JSON RFC 8259',
     'rfc8259.txt', 'https://www.rfc-editor.org/rfc/rfc8259.txt', 'IETF Trust Legal Provisions'),
]:
    data = source.read_bytes()
    pack = {'format': 'devkit-documentation-pack', 'version': 1, 'id': identifier,
            'name': title, 'source': url, 'sourceSha256': hashlib.sha256(data).hexdigest(),
            'license': license_name, 'pages': [{'path': path, 'title': title,
                                                'text': data.decode('utf-8')}]}
    (args.output / filename).write_text(json.dumps(pack, ensure_ascii=False, separators=(',', ':')),
                                        encoding='utf-8')
