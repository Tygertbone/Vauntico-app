import { Helmet } from 'react-helmet-async';

export default function DemoPage() {
  return (
    <div className="bg-black text-white min-h-screen px-6 py-12">
      <Helmet>
        <title>Demo — Vauntico System UX</title>
        <meta name="description" content="Explore Vauntico’s System UX: funnel showcase, emotional design, and core UX principles." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <main role="main">
        <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-vauntico-gold">System UX</h1>
        <p className="mt-4 text-lg text-gray-300">
          Every page in Vauntico is designed to feel alive — clean, centered, and emotionally intelligent.
        </p>
        </header>

      <section 
        className="bg-gray-900 p-6 rounded-lg mb-12 hover:bg-gray-800 transition-colors duration-300 cursor-pointer" 
        role="region" 
        aria-labelledby="funnel-heading"
        onClick={() => console.log('Funnel showcase clicked')}
        data-cta="demo-funnel-showcase"
        tabIndex="0"
        onKeyDown={(e) => e.key === 'Enter' && console.log('Funnel showcase activated')}
      >
        <h2 id="funnel-heading" className="text-2xl font-semibold text-vauntico-gold mb-4">🎯 Funnel Showcase</h2>
        <p className="text-gray-300 mb-4">
          From homepage to vault unlock, every interaction is intentional. We optimize for clarity, emotion, and conversion.
        </p>
        <button
          onClick={(e) => { e.stopPropagation(); console.log('Demo video clicked'); }}
          data-cta="demo-video-embed"
          aria-label="Play funnel walkthrough demo video"
          className="bg-gray-800 p-4 rounded text-gray-400 text-sm hover:bg-gray-700 transition-colors duration-200 w-full text-left"
        >
          [Embed walkthrough video or animated funnel demo here]
        </button>
      </section>

      <section className="bg-gray-900 p-6 rounded-lg mb-12 hover:bg-gray-800 transition-colors duration-300" role="region" aria-labelledby="design-heading">
        <h2 id="design-heading" className="text-2xl font-semibold text-vauntico-gold mb-4">🧠 Emotional Design</h2>
        <p className="text-gray-300 mb-4">
          We use color, spacing, and copy to guide users through transformation. Every vault feels sacred. Every CTA feels empowering.
        </p>
        <ul className="list-disc list-inside text-gray-400" role="list">
          <li role="listitem">Gold accents for legacy and value</li>
          <li role="listitem">Dark backgrounds for focus and depth</li>
          <li role="listitem">Rounded corners for warmth and flow</li>
        </ul>
      </section>

      <section className="bg-gray-900 p-6 rounded-lg hover:bg-gray-800 transition-colors duration-300" role="region" aria-labelledby="principles-heading">
        <h2 id="principles-heading" className="text-2xl font-semibold text-vauntico-gold mb-4">📐 UX Principles</h2>
        <p className="text-gray-300 mb-4">
          We follow a simple rule: clarity over complexity. Every page has one goal, one emotion, and one action.
        </p>
        <button
          onClick={() => console.log('UX docs clicked')}
          data-cta="demo-ux-docs"
          aria-label="View UX documentation and design files"
          className="bg-gray-800 p-4 rounded text-gray-400 text-sm hover:bg-gray-700 transition-colors duration-200 w-full text-left"
        >
          [Optional: Link to Figma file or UX doc]
        </button>
        <button
          onClick={() => console.log('Experience demo clicked')}
          data-cta="demo-experience-demo"
          aria-label="Experience the Vauntico UX demo"
          className="mt-4 bg-vauntico-gold text-black px-6 py-3 rounded font-semibold hover:bg-yellow-400 transition-colors duration-200"
        >
          Experience the Demo
        </button>
      </section>
      </main>
      <footer role="contentinfo" className="text-center text-xs text-gray-500 mt-12">© Vauntico</footer>
    </div>
  );
}