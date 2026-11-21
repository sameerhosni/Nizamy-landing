"""Build standalone bilingual HR guide PDFs from the website's reviewed article."""

import html
import json
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ARTICLE = ROOT / "artifacts/web/src/pages/blogArticleContent.json"
OUTPUT = ROOT / "deliverables"


def escape(text):
    return html.escape(text, quote=True)


def render_paragraphs(paragraphs, citations, sources):
    result = []
    for index, paragraph in enumerate(paragraphs):
        citation = citations.get(str(index))
        source_index = next(
            (n for n, source in enumerate(sources) if source["id"] == citation),
            None,
        )
        marker = (
            f' <sup><a href="#source-{source_index + 1}">[{source_index + 1}]</a></sup>'
            if source_index is not None
            else ""
        )
        result.append(f"<p>{escape(paragraph)}{marker}</p>")
    return "".join(result)


def render_section(section, sources):
    out = [f"<section><h2>{escape(section['heading'])}</h2>"]
    out.append(render_paragraphs(section.get("paragraphs", []), section.get("citations", {}), sources))
    if section.get("list"):
        out.append("<ul>")
        out.extend(f"<li>{escape(item)}</li>" for item in section["list"])
        out.append("</ul>")
    out.append(render_paragraphs(section.get("closingParagraphs", []), {}, sources))
    for subsection in section.get("subsections", []):
        out.append(f"<h3>{escape(subsection['heading'])}</h3>")
        out.append(render_paragraphs(subsection.get("paragraphs", []), subsection.get("citations", {}), sources))
    for faq in section.get("faqs", []):
        out.append(f"<h3>{escape(faq['question'])}</h3><p>{escape(faq['answer'])}</p>")
    out.append("</section>")
    return "".join(out)


def render_document(article, language):
    title = escape(article["title"])
    direction = "rtl" if language == "ar" else "ltr"
    source_title = "المصادر الرسمية ومراجع إضافية" if language == "ar" else "Official sources and further reading"
    sources = article["sources"]
    body = render_paragraphs(article["intro"], {}, sources)
    body += "".join(render_section(section, sources) for section in article["sections"])
    body += f'<section class="sources"><h2>{source_title}</h2><ol>'
    for index, source in enumerate(sources, 1):
        url = escape(source["url"])
        body += (
            f'<li id="source-{index}"><strong>[{index}] {escape(source["label"])}</strong>'
            f'<br><a class="url" href="{url}" dir="ltr">{url}</a></li>'
        )
    body += "</ol></section>"
    return f"""<!doctype html><html lang="{language}" dir="{direction}"><head>
<meta charset="utf-8"><title>{title}</title><style>
@page {{ size: A4; margin: 19mm 19mm 20mm; }}
* {{ box-sizing: border-box; }}
body {{ font-family: "DejaVu Sans", sans-serif; color: #1c293b; font-size: 10pt;
  line-height: 1.7; }}
header {{ border-bottom: 2px solid #2563eb; margin-bottom: 22px; padding-bottom: 17px; }}
header small {{ color: #2563eb; font-size: 9pt; font-weight: bold; }}
h1 {{ font-size: 21pt; line-height: 1.4; margin: 8px 0; color: #152443; }}
.dek {{ color: #526278; margin: 8px 0 0; }}
h2 {{ font-size: 14pt; line-height: 1.5; color: #152443; margin: 24px 0 8px; break-after: avoid; }}
h3 {{ font-size: 11.5pt; margin: 17px 0 5px; color: #273a59; break-after: avoid; }}
p {{ margin: 0 0 11px; orphans: 2; widows: 2; }}
ul {{ margin: 5px 0 13px; padding-inline-start: 22px; }}
li {{ padding-bottom: 3px; }}
a {{ color: #155ac2; }}
sup {{ font-size: 8pt; }}
.sources {{ break-before: page; }}
.sources ol {{ list-style: none; padding: 0; }}
.sources li {{ margin: 0 0 20px; break-inside: avoid; }}
.url {{ display: inline-block; direction: ltr; text-align: left; unicode-bidi: isolate;
  overflow-wrap: anywhere; word-break: break-all; font-size: 8.5pt; }}
</style></head><body>
<header><small>{"NIZAMY · HR GUIDE" if language == "en" else "نظامي · دليل الموارد البشرية"}</small>
<h1>{title}</h1><p class="dek">{escape(article["dek"])}</p></header>
{body}</body></html>"""


def main():
    content = json.loads(ARTICLE.read_text(encoding="utf-8"))
    OUTPUT.mkdir(exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="nizamy-hr-guides-") as temp:
        for language in ("en", "ar"):
            document = Path(temp) / f"nizamy-hr-{language}.html"
            document.write_text(render_document(content[language], language), encoding="utf-8")
            target = OUTPUT / f"nizamy-hr-{language}.pdf"
            subprocess.run(
                [
                    "chromium", "--headless", "--no-sandbox", "--disable-gpu",
                    "--disable-dev-shm-usage", "--no-pdf-header-footer",
                    f"--print-to-pdf={target}", document.as_uri(),
                ],
                check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE,
            )
            print(f"Created {target.relative_to(ROOT)}")


if __name__ == "__main__":
    main()