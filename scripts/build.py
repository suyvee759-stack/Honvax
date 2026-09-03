"""Validate the static site and stage only its public files."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import shutil

ROOT = Path(__file__).resolve().parents[1]

# Serve one complete stylesheet so layout does not depend on a second CSS request.
(ROOT / 'assets/css/site-v5.css').write_text(
    (ROOT / 'assets/css/site.css').read_text() + '\n' +
    (ROOT / 'assets/css/revision.css').read_text()
)

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.references = []
    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if 'id' in attrs:
            if attrs['id'] in self.ids:
                raise ValueError('Duplicate ID: ' + attrs['id'])
            self.ids.add(attrs['id'])
        for attr in ('href', 'src'):
            if attr in attrs:
                self.references.append(attrs[attr])

pages = {}
for path in ROOT.glob('*.html'):
    page = Page()
    page.feed(path.read_text())
    pages[path.name] = page
for name, page in pages.items():
    for reference in page.references:
        parts = urlsplit(reference)
        if parts.scheme or parts.netloc:
            continue
        target = unquote(parts.path) or name
        if not (ROOT / target).exists():
            raise ValueError(name + ': missing file ' + reference)
        if parts.fragment and target in pages and unquote(parts.fragment) not in pages[target].ids:
            raise ValueError(name + ': missing anchor ' + reference)

output = ROOT / 'dist'
output.mkdir(exist_ok=True)
for path in ROOT.glob('*.html'):
    shutil.copy2(path, output / path.name)
for name in ('assets',):
    shutil.copytree(ROOT / name, output / name, dirs_exist_ok=True)
for name in ('robots.txt', 'sitemap.xml', 'equipment.json', '_redirects'):
    if (ROOT / name).exists():
        shutil.copy2(ROOT / name, output / name)
print('Validated and staged {} HTML pages.'.format(len(pages)))
