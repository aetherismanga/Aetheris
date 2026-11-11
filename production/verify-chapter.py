#!/usr/bin/env python3
"""Verify the 156-page Chapter 1 delivery before publication.

Usage: python production/verify-chapter.py
During illustration only: add --allow-incomplete (reports PENDING, never COMPLETE).
Use --baseline <git ref> to compare the original 125 pages to a known revision.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path
from PIL import Image

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--allow-incomplete', action='store_true')
parser.add_argument('--baseline', default='HEAD')
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
chapter = root / 'chapters/chapitre-01'
errors: list[str] = []
missing: list[int] = []
hashes: dict[str, int] = {}
sizes: dict[int, tuple[int, int]] = {}

def require(condition: bool, message: str) -> None:
    if not condition:
        errors.append(message)

def git(*arguments: str) -> bytes:
    return subprocess.check_output(['git', *arguments], cwd=root)

try:
    baseline_tree = git('ls-tree', '-r', args.baseline, '--', 'chapters/chapitre-01').decode()
    originals = {line.split('\t', 1)[1]: line.split()[2] for line in baseline_tree.splitlines()}
except subprocess.CalledProcessError:
    print(f'FAIL: cannot read git baseline {args.baseline}', file=sys.stderr)
    raise SystemExit(1)

for page in range(1, 157):
    relative = f'chapters/chapitre-01/{page:02}.jpg'
    path = root / relative
    if not path.is_file():
        missing.append(page)
        if page <= 125:
            errors.append(f'Original page missing: {page}')
        continue
    data = path.read_bytes()
    digest = hashlib.sha256(data).hexdigest()
    require(digest not in hashes, f'Duplicate images: pages {hashes.get(digest)} and {page}')
    hashes[digest] = page
    try:
        with Image.open(path) as image:
            image.verify()
        with Image.open(path) as image:
            image.load()
            sizes[page] = image.size
            require(image.format == 'JPEG', f'Page {page}: expected JPEG, found {image.format}')
            require(image.width > 0 and image.height > image.width, f'Page {page}: invalid portrait dimensions')
    except Exception as exc:
        errors.append(f'Page {page}: cannot decode image ({exc})')
    if page <= 125:
        blob = hashlib.sha1(f'blob {len(data)}\0'.encode() + data).hexdigest()
        require(originals.get(relative) == blob, f'Original page changed versus {args.baseline}: {page}')

actual_names = {path.name for path in chapter.glob('*.jpg')}
expected_names = {f'{page:02}.jpg' for page in range(1, 157)}
require(not (actual_names - expected_names), f'Unexpected Chapter 1 images: {sorted(actual_names - expected_names)}')

html = (root / 'index.html').read_text()
js = (root / 'js/app.js').read_text()
database = json.loads((root / 'assets/data/database.json').read_text())
require(re.search(r'id="reader"[^>]*data-total-pages="156"', html) is not None, 'Reader total is not 156')
require(re.search(r'id="total-pages"[^>]*>\s*/\s*156\s*<', html) is not None, 'Visible page total is not 156')
require('156 pages' in html and 'Chapitre complet' in html, 'Chapter 1 completion label missing')
records = [entry for entry in database['chapters'] if entry.get('id') == 'chapitre-01']
require(len(records) == 1, 'Expected one Chapter 1 metadata record')
if records:
    metadata = records[0]
    require(metadata.get('pages') == [f'{page:02}.jpg' for page in range(1, 157)], 'Metadata page order/count mismatch')
    require(metadata.get('status') == 'complete' and metadata.get('page_count') == 156, 'Metadata completion/count mismatch')
require(len(database['chapters']) == 1, 'Unexpected published chapter in metadata')
require('id="graam"' in html and '<h3>Graam</h3>' in html, 'Graam profile is missing')
for name in ('graam.jpeg', 'graam2.jpeg'):
    path = root / 'personnages' / name
    require(path.is_file(), f'Missing Graam image: {name}')
    if path.is_file():
        try:
            with Image.open(path) as illustration:
                illustration.verify()
            require(f'personnages/{name}' in html, f'Graam image is not linked: {name}')
        except Exception as exc:
            errors.append(f'Cannot decode {name}: {exc}')
ending = json.loads((root / 'production/chapitre-01-fin-127-156.json').read_text())
require([row['page'] for row in ending['pages']] == list(range(127, 157)), 'Ending pages out of order')
for row in ending['pages']:
    path = root / row['output']
    if path.is_file():
        require(hashlib.sha256(path.read_bytes()).hexdigest() == row['sha256'], f"Approved page changed: {row['page']}")
for path in (root / 'chapters').iterdir():
    if path.is_dir() and path.name != 'chapitre-01':
        require(not any(child.suffix.lower() in {'.jpg', '.jpeg', '.png', '.webp'} for child in path.rglob('*')), f'Unexpected published chapter artwork: {path.name}')
for heading in re.finditer(r'<h3>Chapitre [23]</h3>', html):
    card_start = html[:heading.start()].rsplit('<div class="chapter-card', 1)[-1]
    require('data-target="reader"' not in card_start, 'Chapter 2 or 3 incorrectly links to available reader')
require('new URLSearchParams(window.location.search).get("page")' in js, 'Page deep-link parser missing')
require(re.search(r'if \(requestedPage && mangaContainer\)\s*\{\s*switchView\("reader"\);\s*updateReaderMode\(\);', js) is not None, 'Valid page deep link does not activate reader')
require('currentPage = 1;\n                    renderPage' not in js, 'Automatic last-page wrap restored')
try:
    subprocess.run(['node', '--check', 'js/app.js'], cwd=root, check=True, capture_output=True)
except (FileNotFoundError, subprocess.CalledProcessError) as exc:
    errors.append(f'JavaScript syntax check failed: {exc}')

if missing and not args.allow_incomplete:
    errors.append(f'Missing pages: {missing}')
for error in errors:
    print(f'FAIL: {error}')
if missing:
    print(f'PENDING: missing pages {missing}')
print(f'Images decoded: {len(sizes)}/156; unique hashes: {len(hashes)}; baseline: {args.baseline}')
if errors:
    print('RESULT: FAILED')
    raise SystemExit(1)
if missing:
    print('RESULT: PENDING — illustrations incomplete; not ready for publication')
else:
    print('RESULT: COMPLETE — 156 pages decoded; originals unchanged; reader and metadata consistent')
