"""
Builds public/cv/Sadeep_Withana_CV.pdf from src/data/cv.json (the same data as the /cv page).

    pip install reportlab
    npm run cv:pdf

Contact links are read from src/config/site.ts so the PDF and the site never disagree.
Replace the generated file with your own PDF at any time; the site just serves whatever is there.
"""
import json
import re
from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    HRFlowable,
    KeepTogether,
    ListFlowable,
    ListItem,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parent.parent
cv = json.loads((ROOT / "src/data/cv.json").read_text(encoding="utf-8"))
site_ts = (ROOT / "src/config/site.ts").read_text(encoding="utf-8")
OUT = ROOT / "public/cv/Sadeep_Withana_CV.pdf"


def ts_value(key: str) -> str:
    m = re.search(rf"\b{key}:\s*'([^']*)'", site_ts)
    return m.group(1).strip() if m else ""


def strip(url: str) -> str:
    return re.sub(r"^https?://(www\.)?", "", url)


INK = HexColor("#111a24")
MUTED = HexColor("#4a5868")
LINE = HexColor("#dce3ea")
ACCENT = HexColor("#6a3fd0")

BASE = "Helvetica"
BOLD = "Helvetica-Bold"
MONO = "Courier"

s_name = ParagraphStyle("name", fontName=BOLD, fontSize=24, leading=27, textColor=INK)
s_title = ParagraphStyle("title", fontName=BOLD, fontSize=11, leading=14, textColor=INK, spaceBefore=4)
s_focus = ParagraphStyle("focus", fontName=BASE, fontSize=9, leading=12, textColor=MUTED)
s_contact = ParagraphStyle("contact", fontName=BASE, fontSize=8.5, leading=11.5, textColor=INK, alignment=TA_RIGHT)
s_head = ParagraphStyle("head", fontName=BOLD, fontSize=8.5, leading=11, textColor=ACCENT, spaceBefore=8, spaceAfter=2)
s_body = ParagraphStyle("body", fontName=BASE, fontSize=8.9, leading=12.1, textColor=MUTED)
s_item = ParagraphStyle("item", fontName=BOLD, fontSize=9.5, leading=12.4, textColor=INK)
s_meta = ParagraphStyle("meta", fontName=BASE, fontSize=8.2, leading=11, textColor=MUTED, alignment=TA_RIGHT)
s_tech = ParagraphStyle("tech", fontName=MONO, fontSize=7.8, leading=10.5, textColor=ACCENT)
s_label = ParagraphStyle("label", fontName=BOLD, fontSize=8.9, leading=12.1, textColor=INK)


def esc(t: str) -> str:
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def section(title: str):
    return [
        Paragraph(title.upper(), s_head),
        HRFlowable(width="100%", thickness=0.6, color=LINE, spaceBefore=0, spaceAfter=4),
    ]


def row(left, right, widths=(0.72, 0.28)):
    t = Table([[left, right]], colWidths=[W * widths[0], W * widths[1]])
    t.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "BOTTOM"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 0)]))
    return t


def bullets(points):
    return ListFlowable(
        [ListItem(Paragraph(esc(p), s_body), leftIndent=10, value="square") for p in points],
        bulletType="bullet",
        start="square",
        bulletFontSize=4.5,
        bulletColor=ACCENT,
        leftIndent=10,
        bulletOffsetY=-2.5,
    )


MARGIN = 15 * mm
W = A4[0] - 2 * MARGIN - 12  # frame has 6pt padding each side
story = []

# Header
contact_bits = [cv["location"]]
for key in ("email", "github", "linkedin", "researchProfile"):
    v = ts_value(key)
    if v:
        contact_bits.append(f'<link href="{("mailto:" + v) if key == "email" else v}">{esc(strip(v))}</link>')
site_url = ts_value("url")
if site_url:
    contact_bits.append(f'<link href="{site_url}">{esc(strip(site_url))}</link>')

left = [Paragraph(esc(cv["name"]), s_name), Paragraph(esc(cv["title"]), s_title), Paragraph(esc(cv["focus"]), s_focus)]
right = [Paragraph(b, s_contact) for b in contact_bits]
header = Table([[left, right]], colWidths=[W * 0.62, W * 0.38])
header.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "BOTTOM"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 8)]))
story += [header, HRFlowable(width="100%", thickness=1.6, color=INK, spaceBefore=0, spaceAfter=2)]

# Profile
story += section("Profile") + [Paragraph(esc(cv["summary"]), s_body)]

# Education
story += section("Education")
for e in cv["education"]:
    story.append(
        KeepTogether(
            [
                row(Paragraph(esc(e["degree"]), s_item), Paragraph(esc(e["period"]), s_meta)),
                Paragraph(esc(e["institution"]), ParagraphStyle("inst", parent=s_body, textColor=INK)),
                Paragraph(esc(e["detail"]), s_body),
                Paragraph(f'<font color="#111a24">Relevant coursework: </font>{esc(", ".join(e["coursework"]))}', s_body),
            ]
        )
    )

# Research
story += section("Research")
for r in cv["research"]:
    story.append(KeepTogether([row(Paragraph(esc(r["title"]), s_item), Paragraph(esc(r["status"]), s_meta), (0.82, 0.18)), Spacer(1, 2), bullets(r["points"])]))

# Projects
story += section("Projects")
for p in cv["projects"]:
    story.append(
        KeepTogether(
            [
                row(Paragraph(esc(p["title"]), s_item), Paragraph(esc(p["status"]), s_meta), (0.78, 0.22)),
                Paragraph(esc(p["tech"]), s_tech),
                bullets(p["points"]),
                Spacer(1, 3),
            ]
        )
    )

# Skills
story += section("Skills")
skill_rows = [[Paragraph(esc(s["group"]), s_label), Paragraph(esc(" · ".join(s["items"])), s_body)] for s in cv["skills"]]
st = Table(skill_rows, colWidths=[W * 0.24, W * 0.76])
st.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("TOPPADDING", (0, 0), (-1, -1), 1), ("BOTTOMPADDING", (0, 0), (-1, -1), 2)]))
story.append(st)

# Interests
story += section("Research interests") + [Paragraph(esc(" · ".join(cv["interests"])), s_body)]


def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont(BASE, 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(MARGIN, 9 * mm, f'{cv["name"]} — Curriculum Vitae')
    canvas.drawRightString(A4[0] - MARGIN, 9 * mm, f"Page {doc.page}")
    canvas.restoreState()


OUT.parent.mkdir(parents=True, exist_ok=True)
doc = SimpleDocTemplate(
    str(OUT),
    pagesize=A4,
    leftMargin=MARGIN,
    rightMargin=MARGIN,
    topMargin=13 * mm,
    bottomMargin=16 * mm,
    title=f'{cv["name"]} — CV',
    author=cv["name"],
    subject="Curriculum Vitae",
)
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print(f"Wrote {OUT.relative_to(ROOT)}")
