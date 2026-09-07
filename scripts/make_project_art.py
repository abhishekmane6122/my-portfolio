# -*- coding: utf-8 -*-
"""Generate project-specific SVG artwork for the portfolio Projects section.

Run:  python scripts/make_project_art.py

Each project gets a *motif* chosen to reflect what the system actually does -
a pipeline, a dashboard, a knowledge graph, a vision grid, a governance gate -
rather than one shared template with the title swapped out.
"""
import io, os, sys, math

sys.stdout.reconfigure(encoding="utf-8")

OUT = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "frontend-vite", "public", "projects",
)

W, H = 1200, 675


def esc(s):
    return (s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
             .replace('"', "&quot;").replace("'", "&apos;"))


# ----------------------------------------------------------------- motifs
def motif_pipeline(a, dim):
    """Staged pipeline: boxes flowing left to right with a branch."""
    p = []
    xs = [110, 330, 550, 770, 990]
    for i, x in enumerate(xs):
        op = 0.10 + i * 0.05
        p.append(f'<rect x="{x-70}" y="300" width="140" height="86" rx="12" '
                 f'fill="{a}" fill-opacity="{op:.2f}" stroke="{a}" stroke-opacity="0.5"/>')
        if i < len(xs) - 1:
            p.append(f'<path d="M{x+72} 343 L{xs[i+1]-74} 343" stroke="{a}" '
                     f'stroke-opacity="0.45" stroke-width="2" marker-end="url(#ar)"/>')
    # branch down from stage 3
    p.append(f'<path d="M550 390 L550 470 L770 470" stroke="{a}" stroke-opacity="0.3" '
             f'stroke-width="2" stroke-dasharray="5 5" fill="none"/>')
    p.append(f'<rect x="700" y="440" width="140" height="60" rx="10" fill="{dim}" '
             f'fill-opacity="0.5" stroke="{a}" stroke-opacity="0.3"/>')
    return "\n  ".join(p)


def motif_dashboard(a, dim):
    """Analytics surface: panels and a bar series."""
    p = [f'<rect x="90" y="250" width="480" height="300" rx="16" fill="{dim}" '
         f'fill-opacity="0.55" stroke="{a}" stroke-opacity="0.35"/>']
    heights = [60, 110, 85, 145, 100, 170, 130]
    for i, bh in enumerate(heights):
        x = 130 + i * 62
        p.append(f'<rect x="{x}" y="{500-bh}" width="38" height="{bh}" rx="5" '
                 f'fill="{a}" fill-opacity="{0.25 + i*0.09:.2f}"/>')
    p.append(f'<rect x="620" y="250" width="490" height="140" rx="16" fill="{dim}" '
             f'fill-opacity="0.55" stroke="{a}" stroke-opacity="0.35"/>')
    pts = " ".join(f"{620+i*70},{350-int(50*math.sin(i/1.6))}" for i in range(8))
    p.append(f'<polyline points="{pts}" fill="none" stroke="{a}" stroke-opacity="0.75" stroke-width="3"/>')
    p.append(f'<rect x="620" y="410" width="490" height="140" rx="16" fill="{dim}" '
             f'fill-opacity="0.55" stroke="{a}" stroke-opacity="0.35"/>')
    for i in range(4):
        p.append(f'<rect x="650" y="{440+i*26}" width="{330-i*54}" height="10" rx="5" '
                 f'fill="{a}" fill-opacity="{0.5-i*0.09:.2f}"/>')
    return "\n  ".join(p)


def motif_graph(a, dim):
    """Knowledge / entity graph: nodes and edges."""
    nodes = [(250, 300), (450, 240), (430, 430), (660, 320), (860, 250),
             (880, 450), (640, 520), (1050, 350)]
    p = []
    edges = [(0, 1), (0, 2), (1, 3), (2, 3), (3, 4), (3, 5), (2, 6), (5, 7), (4, 7), (6, 5)]
    for i, j in edges:
        p.append(f'<line x1="{nodes[i][0]}" y1="{nodes[i][1]}" x2="{nodes[j][0]}" '
                 f'y2="{nodes[j][1]}" stroke="{a}" stroke-opacity="0.32" stroke-width="2"/>')
    for k, (x, y) in enumerate(nodes):
        r = 34 if k in (3, 2) else 22
        p.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{a}" fill-opacity="{0.18+0.07*(k%4):.2f}" '
                 f'stroke="{a}" stroke-opacity="0.65" stroke-width="2"/>')
    return "\n  ".join(p)


def motif_vision(a, dim):
    """Computer vision: frame with detection boxes."""
    p = [f'<rect x="150" y="230" width="900" height="330" rx="14" fill="{dim}" '
         f'fill-opacity="0.5" stroke="{a}" stroke-opacity="0.4"/>']
    boxes = [(230, 300, 170, 200), (470, 270, 140, 230), (700, 320, 190, 180), (930, 290, 90, 150)]
    for i, (x, y, bw, bh) in enumerate(boxes):
        p.append(f'<rect x="{x}" y="{y}" width="{bw}" height="{bh}" rx="6" fill="none" '
                 f'stroke="{a}" stroke-opacity="{0.85-i*0.12:.2f}" stroke-width="3"/>')
        p.append(f'<rect x="{x}" y="{y-22}" width="{min(bw,78)}" height="20" rx="4" '
                 f'fill="{a}" fill-opacity="0.65"/>')
        for cx, cy in ((x, y), (x+bw, y), (x, y+bh), (x+bw, y+bh)):
            p.append(f'<circle cx="{cx}" cy="{cy}" r="4" fill="{a}"/>')
    return "\n  ".join(p)


def motif_gate(a, dim):
    """Governance: artefact passing through inspection gates into a registry."""
    p = []
    for i, x in enumerate([300, 520, 740]):
        p.append(f'<rect x="{x-52}" y="270" width="104" height="150" rx="10" fill="none" '
                 f'stroke="{a}" stroke-opacity="{0.75-i*0.13:.2f}" stroke-width="3"/>')
        p.append(f'<path d="M{x-30} 345 l18 20 l34 -44" stroke="{a}" stroke-opacity="0.8" '
                 f'stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>')
    p.append(f'<circle cx="140" cy="345" r="34" fill="{a}" fill-opacity="0.28" stroke="{a}" stroke-opacity="0.6"/>')
    p.append(f'<path d="M180 345 L244 345" stroke="{a}" stroke-opacity="0.5" stroke-width="2" marker-end="url(#ar)"/>')
    p.append(f'<path d="M356 345 L464 345" stroke="{a}" stroke-opacity="0.5" stroke-width="2" marker-end="url(#ar)"/>')
    p.append(f'<path d="M576 345 L684 345" stroke="{a}" stroke-opacity="0.5" stroke-width="2" marker-end="url(#ar)"/>')
    p.append(f'<path d="M796 345 L890 345" stroke="{a}" stroke-opacity="0.5" stroke-width="2" marker-end="url(#ar)"/>')
    p.append(f'<rect x="900" y="280" width="180" height="130" rx="12" fill="{a}" fill-opacity="0.2" '
             f'stroke="{a}" stroke-opacity="0.6" stroke-width="2"/>')
    for i in range(3):
        p.append(f'<rect x="925" y="{305+i*30}" width="130" height="14" rx="7" fill="{a}" fill-opacity="0.45"/>')
    return "\n  ".join(p)


def motif_documents(a, dim):
    """Document intelligence: stacked pages fanning into structured fields."""
    p = []
    for i in range(3):
        p.append(f'<rect x="{150+i*26}" y="{250+i*18}" width="240" height="300" rx="10" '
                 f'fill="{dim}" fill-opacity="0.6" stroke="{a}" stroke-opacity="{0.55-i*0.12:.2f}" stroke-width="2"/>')
    for i in range(6):
        p.append(f'<rect x="228" y="{310+i*36}" width="{170-(i%3)*38}" height="11" rx="5" fill="{a}" fill-opacity="0.34"/>')
    p.append(f'<path d="M448 400 L560 400" stroke="{a}" stroke-opacity="0.5" stroke-width="2" marker-end="url(#ar)"/>')
    for i in range(4):
        y = 280 + i * 68
        p.append(f'<rect x="580" y="{y}" width="480" height="52" rx="9" fill="{a}" fill-opacity="{0.12+i*0.05:.2f}" '
                 f'stroke="{a}" stroke-opacity="0.4"/>')
        p.append(f'<rect x="602" y="{y+20}" width="110" height="12" rx="6" fill="{a}" fill-opacity="0.55"/>')
        p.append(f'<rect x="736" y="{y+20}" width="{300-i*46}" height="12" rx="6" fill="{a}" fill-opacity="0.3"/>')
    return "\n  ".join(p)


def motif_agents(a, dim):
    """Multi-agent orchestration: coordinator with workers and a shared store."""
    p = [f'<rect x="500" y="240" width="200" height="86" rx="14" fill="{a}" fill-opacity="0.28" '
         f'stroke="{a}" stroke-opacity="0.7" stroke-width="2"/>']
    workers = [(220, 450), (450, 490), (700, 490), (930, 450)]
    for i, (x, y) in enumerate(workers):
        p.append(f'<rect x="{x-80}" y="{y-40}" width="160" height="80" rx="12" fill="{dim}" fill-opacity="0.6" '
                 f'stroke="{a}" stroke-opacity="{0.6-i*0.07:.2f}" stroke-width="2"/>')
        p.append(f'<path d="M600 330 L{x} {y-42}" stroke="{a}" stroke-opacity="0.3" stroke-width="2"/>')
    p.append(f'<ellipse cx="600" cy="600" rx="150" ry="34" fill="{a}" fill-opacity="0.16" '
             f'stroke="{a}" stroke-opacity="0.45" stroke-width="2"/>')
    for x, y in workers:
        p.append(f'<path d="M{x} {y+42} L600 578" stroke="{a}" stroke-opacity="0.22" '
                 f'stroke-width="2" stroke-dasharray="4 5"/>')
    return "\n  ".join(p)


MOTIFS = {
    "pipeline": motif_pipeline,
    "dashboard": motif_dashboard,
    "graph": motif_graph,
    "vision": motif_vision,
    "gate": motif_gate,
    "documents": motif_documents,
    "agents": motif_agents,
}


def build(slug, kicker, title, motif, colors):
    bg1, bg2, accent, dim = colors
    art = MOTIFS[motif](accent, dim)
    uid = slug.replace("-", "")

    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-label="{esc(title)}">
  <defs>
    <linearGradient id="bg{uid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{bg1}"/><stop offset="100%" stop-color="{bg2}"/>
    </linearGradient>
    <radialGradient id="gl{uid}" cx="0.8" cy="0.1" r="0.7">
      <stop offset="0%" stop-color="{accent}" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="{accent}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="gr{uid}" width="44" height="44" patternUnits="userSpaceOnUse">
      <path d="M44 0H0V44" fill="none" stroke="#FFFFFF" stroke-opacity="0.045" stroke-width="1"/>
    </pattern>
    <marker id="ar" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto">
      <path d="M0 0 L9 4.5 L0 9 z" fill="{accent}" fill-opacity="0.55"/>
    </marker>
  </defs>

  <rect width="{W}" height="{H}" fill="url(#bg{uid})"/>
  <rect width="{W}" height="{H}" fill="url(#gr{uid})"/>
  <rect width="{W}" height="{H}" fill="url(#gl{uid})"/>
  <rect x="0" y="0" width="7" height="{H}" fill="{accent}"/>

  {art}

  <text x="90" y="120" font-family="ui-monospace,SFMono-Regular,Menlo,monospace"
        font-size="19" fill="{accent}" letter-spacing="6">{esc(kicker.upper())}</text>
  <text x="90" y="182" font-family="Georgia,serif" font-size="52" fill="#FFFFFF">{esc(title)}</text>
</svg>
"""
    io.open(os.path.join(OUT, f"{slug}.svg"), "w", encoding="utf-8").write(svg)


# slug, kicker, short title, motif, (bg1, bg2, accent, dim)
PROJECTS = [
    ("art-shareholding", "Investor Relations", "Shareholding Intelligence",
     "dashboard", ("#0B1F3A", "#12324F", "#5B9BD5", "#0A1830")),
    ("art-mf-exposure", "Treasury Analytics", "Debt Exposure Analytics",
     "dashboard", ("#241A3F", "#38295C", "#A78BFA", "#1B1330")),
    ("art-sebi-pipeline", "Regulatory AI", "Securities Regulator Intelligence",
     "pipeline", ("#0B2A2E", "#124048", "#4FC3D9", "#08211F")),
    ("art-rbi-pipeline", "Regulatory AI", "Central Bank Circular Pipeline",
     "pipeline", ("#2E1F10", "#46331D", "#D4A373", "#231708")),
    ("art-bse-intelligence", "Document AI", "Exchange Filing Intelligence",
     "documents", ("#13233F", "#1D3557", "#7FB3D5", "#0D1A2E")),
    ("art-equity-analytics", "Market Analytics", "Equity Analytics Platform",
     "dashboard", ("#0E2A22", "#17402F", "#5FC48E", "#0A1F19")),
    ("art-ir-mom", "Multi-Agent RAG", "IR Meeting & Research Intelligence",
     "agents", ("#2A1430", "#3E2047", "#C084C7", "#1F0E24")),
    ("art-rpa-ai", "Automation Intelligence", "RPA Failure & Knowledge Copilot",
     "graph", ("#2B1618", "#43242A", "#E08C7D", "#1F0F12")),
    ("art-sentinel", "AI Governance", "Model Governance & Secure Deployment",
     "gate", ("#101B33", "#1B2A4A", "#8FA8E0", "#0B1426")),
    ("art-vision-ai", "Computer Vision", "Industrial Safety Vision System",
     "vision", ("#2B2410", "#42381B", "#D9C05F", "#1F1A0A")),
    ("art-testmu", "QA Engineering", "Autonomous Test Engineering",
     "agents", ("#101F2B", "#1B3242", "#6FB6C9", "#0A1620")),
]

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for p in PROJECTS:
        build(*p)
        print("wrote", p[0] + ".svg", f"({p[3]} motif)")
    print(f"\n{len(PROJECTS)} project artworks written to {OUT}")
