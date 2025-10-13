import React from 'react';
import { Helmet } from 'react-helmet-async';
import LottieFromUrl from '@/components/LottieFromUrl';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

const glyphs = [
  { name: 'Obelisk', file: '/brand-assets/favicon-obelisk.svg', meaning: 'Eternal chain against chaos', usage: 'Favicon, centerpiece' },
  { name: 'Dream Mover', file: '/brand-assets/glyphs/dream-mover.svg', meaning: 'Spiral ignition into wings', usage: 'Dream Mover' },
  { name: 'Webhook Studio', file: '/brand-assets/glyphs/webhook-studio.svg', meaning: 'Hex lattice and nodes', usage: 'Studio, payloads' },
  { name: 'Forge of Echoes', file: '/brand-assets/glyphs/forge-of-echoes.svg', meaning: 'Hammer and echo wave', usage: 'Forge' },
  { name: 'Oracle’s Gaze', file: '/brand-assets/glyphs/oracles-gaze.svg', meaning: 'Eye within prism', usage: 'Oracle' },
];

function GlyphCard({ g, onExpand }) {
  return (
    <div className="brand-card rounded-lg p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-vauntico-glow cursor-pointer" onClick={() => onExpand?.(g)}>
      <div className="flex items-center gap-3 hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300">
        <Tooltip>
          <TooltipTrigger asChild>
            <img src={g.file} alt={g.name} className="w-12 h-12" />
          </TooltipTrigger>
          <TooltipContent>{g.name} — {g.meaning}</TooltipContent>
        </Tooltip>
        <div>
          <div className="font-semibold brand-gold font-playfair">{g.name}</div>
          <div className="text-xs text-gray-300">{g.meaning}</div>
        </div>
      </div>
      <div className="mt-3 text-xs text-gray-400">Usage: {g.usage}</div>
    </div>
  );
}

export default function BrandPage() {
  const [expanded, setExpanded] = React.useState(null);
  return (
    <div className="min-h-screen px-6 py-10 brand-bg" style={{ color: 'var(--vauntico-fg)' }}>
      <Helmet>
        <title>Vauntico Glyph System</title>
        <meta name="description" content="Symbols of resilience, clarity, and ascension" />
      </Helmet>

      {/* Hero */}
      <section className="max-w-5xl mx-auto text-center mb-10">
        <div className="flex justify-center mb-4">
          <LottieFromUrl src="/brand-assets/dualreveal.json" loop autoplay className="w-[480px] h-[240px]" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold font-playfair brand-gold">Vauntico Glyph System</h1>
        <p className="mt-2 text-gray-200">Symbols of resilience, clarity, and ascension</p>
      </section>

      {/* Glyph Gallery */}
      <section className="max-w-5xl mx-auto mb-12">
        <h2 className="text-xl font-semibold mb-4">Glyph Gallery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {glyphs.map((g) => (
            <GlyphCard key={g.name} g={g} onExpand={setExpanded} />
          ))}
        </div>
        {expanded && (
          <div className="mt-6 brand-card rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold brand-gold font-playfair">{expanded.name}</div>
              <a className="docs-link text-xs hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300" href={expanded.file} download>Download SVG</a>
            </div>
            <div className="text-xs text-gray-300">{expanded.meaning}</div>
          </div>
        )}
      </section>

      {/* Meanings Table (placeholder rows) */}
      <section className="max-w-5xl mx-auto mb-12">
        <h2 className="text-xl font-semibold mb-4">Meanings</h2>
        <div className="overflow-auto border-skin border rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="p-3">Glyph</th>
                <th className="p-3">Meaning</th>
                <th className="p-3">Usage</th>
              </tr>
            </thead>
            <tbody>
              {glyphs.map((g) => (
                <tr key={g.name} className="border-skin border-t">
                  <td className="p-3">{g.name}</td>
                  <td className="p-3">{g.meaning}</td>
                  <td className="p-3">{g.usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CLI Etch Demo */}
      <section className="max-w-5xl mx-auto mb-12">
        <h2 className="text-xl font-semibold mb-2">CLI Etch Demo</h2>
        <div className="card-surface rounded-lg p-4 font-sourcecode">
          <LottieFromUrl src="/brand-assets/cliritual.json" loop autoplay className="w-full h-[120px]" />
        </div>
      </section>

      {/* Payload Hologram Parse (mock) */}
      <section className="max-w-5xl mx-auto mb-12">
        <h2 className="text-xl font-semibold mb-2">Payload Hologram Parse</h2>
        <div className="card-surface rounded-lg p-4 text-xs font-sourcecode">
{`{
  "event": "charge.success",
  "data": { "reference": "abc123", "plan": "seekers-spark", "email": "you@example.com" }
}`}
        </div>
      </section>

      {/* Rune Generator (simple stub) */}
      <section className="max-w-5xl mx-auto mb-12">
        <h2 className="text-xl font-semibold mb-2">Rune Generator</h2>
        <RuneGenerator />
      </section>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-200 py-8 border-t border-gray-800">
        Remix the wards — fork on GitHub, tag <span className="font-semibold">#VaunticoGlyphs</span>
        <div className="mt-3">
          <a className="accent-btn" href="https://github.com/Tygertbone/Vauntico-app/fork" target="_blank" rel="noreferrer">Fork on GitHub</a>
        </div>
      </footer>
    </div>
  );
}

function RuneGenerator() {
  const [plan, setPlan] = React.useState('seekers-spark');
  const [glow, setGlow] = React.useState(false);
  const svgRef = React.useRef(null);

  const buildSVG = () => `<?xml version="1.0" encoding="UTF-8"?>\n<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">\n  <rect x="40" y="10" width="20" height="80" fill="none" stroke="#C29B4B" stroke-width="2"/>\n  <circle cx="50" cy="50" r="8" fill="#C29B4B"/>\n  <text x="50" y="95" text-anchor="middle" fill="#eaeaea" font-size="8">${plan}</text>\n</svg>`;

  const copySVG = async () => {
    try {
      await navigator.clipboard.writeText(buildSVG());
      setGlow(true); setTimeout(() => setGlow(false), 800);
    } catch {}
  };

  const downloadSVG = () => {
    const blob = new Blob([buildSVG()], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${plan || 'rune'}.svg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setGlow(true); setTimeout(() => setGlow(false), 800);
  };

  return (
    <div className={`card-surface rounded-lg p-4 transition-shadow ${glow ? 'shadow-[var(--vauntico-glow)]' : ''}`}>
      <label className="text-xs text-gray-400">Plan name</label>
      <input
        className="mt-1 w-full bg-transparent border-skin border rounded px-3 py-2"
        value={plan}
        onChange={(e) => setPlan(e.target.value)}
        placeholder="e.g., seekers-spark"
      />
      <div className="mt-4 flex items-center gap-4">
        <div className="rounded border-skin border p-3" ref={svgRef}>
          <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
            <rect x="40" y="10" width="20" height="80" fill="none" stroke="#C29B4B" strokeWidth="2"/>
            <circle cx="50" cy="50" r="8" fill="#C29B4B"/>
            <text x="50" y="95" textAnchor="middle" fill="#eaeaea" fontSize="8">{plan}</text>
          </svg>
        </div>
        <div className="text-xs text-gray-400">Preview rune for: <span className="text-[var(--vauntico-gold-text)]">{plan}</span></div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <button className="secondary-btn" onClick={copySVG}>Copy SVG</button>
        <button className="accent-btn" onClick={downloadSVG}>Download SVG</button>
      </div>
    </div>
  );
}
