#!/usr/bin/env python3
"""Génère un squelette lisible (arborescence tag + classes + id) à partir des
HTML capturés, pour servir de référence de structure avant la migration D10.
Nettoie le bruit dynamique (hashs js-view-dom-id, tokens, query strings)."""
import re, sys
from html.parser import HTMLParser

SKIP = {"script", "style", "noscript", "svg", "path", "meta", "link", "br", "source"}

def norm_classes(cls):
    out = []
    for c in cls.split():
        c = re.sub(r"js-view-dom-id-[0-9a-f]+", "js-view-dom-id-…", c)
        c = re.sub(r"-[0-9a-f]{32,}", "-…", c)
        out.append(c)
    return out

class Skeleton(HTMLParser):
    def __init__(self):
        super().__init__()
        self.depth = 0
        self.lines = []
        self.skip_until = None

    def handle_starttag(self, tag, attrs):
        if self.skip_until:
            return
        if tag in SKIP:
            if tag in ("svg", "script", "style", "noscript"):
                self.skip_until = tag
            return
        d = dict(attrs)
        parts = [tag]
        if d.get("id"):
            parts.append("#" + re.sub(r"[0-9a-f]{16,}", "…", d["id"]))
        if d.get("class"):
            cls = norm_classes(d["class"])
            if cls:
                parts.append("." + ".".join(cls))
        # quelques attributs structurants utiles
        for a in ("role", "data-once"):
            if d.get(a):
                parts.append(f'{a}="{d[a]}"')
        self.lines.append("  " * self.depth + " ".join(parts))
        if tag not in ("img", "input", "hr", "col", "area", "embed", "track", "wbr"):
            self.depth += 1

    def handle_endtag(self, tag):
        if self.skip_until:
            if tag == self.skip_until:
                self.skip_until = None
            return
        if tag in SKIP:
            return
        if tag not in ("img", "input", "hr", "col", "area", "embed", "track", "wbr"):
            self.depth = max(self.depth - 1, 0)

for name in sys.argv[1:]:
    html = open(f"{name}.html", encoding="utf-8", errors="replace").read()
    body = re.search(r"<body.*?</body>", html, re.S)
    src = body.group(0) if body else html
    p = Skeleton()
    p.feed(src)
    open(f"{name}.skeleton.txt", "w", encoding="utf-8").write("\n".join(p.lines) + "\n")
    print(f"{name}.skeleton.txt — {len(p.lines)} lignes")
