import { Helmet } from 'react-helmet-async';

export default function DelegationPage() {
  return (
    <div className="bg-black text-white min-h-screen px-6 py-12">
      <Helmet>
        <title>Delegation — Vauntico AI Collaboration</title>
        <meta name="description" content="Delegate with precision. Orchestrate AI agents like teammates and scale your impact." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <main role="main">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-vauntico-gold">AI Collaboration</h1>
          <p className="mt-4 text-lg text-gray-300">
            Work with AI agents like teammates. Delegate tasks, orchestrate workflows, and scale your impact.
          </p>
        </header>

        <section className="bg-gray-900 p-6 rounded-lg mb-12 hover:bg-gray-800 transition-colors duration-300" role="region" aria-labelledby="delegate-heading">
          <h2 id="delegate-heading" className="text-2xl font-semibold text-vauntico-gold mb-4">🤖 Delegate with Precision</h2>
          <p className="text-gray-300 mb-4">
            Assign tasks to AI agents for transcription, research, prompt generation, and automation. Treat them like specialists.
          </p>
          <ul className="list-disc list-inside text-gray-400" role="list">
            <li role="listitem">Transcribe audio or video content</li>
            <li role="listitem">Generate branded prompts and copy</li>
            <li role="listitem">Research competitors or trends</li>
            <li role="listitem">Automate repetitive workflows</li>
          </ul>
          <button className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300"> console.log('Start delegating clicked')}
            data-cta="delegation-start-delegating"
            aria-label="Start delegating tasks to AI agents"
            className="mt-4 bg-vauntico-gold text-black px-6 py-3 rounded font-semibold hover:bg-yellow-400 transition-colors duration-200"
          >
            Start Delegating
          </button>
        </section>

        <section className="bg-gray-900 p-6 rounded-lg mb-12 hover:bg-gray-800 transition-colors duration-300" role="region" aria-labelledby="templates-heading">
          <h2 id="templates-heading" className="text-2xl font-semibold text-vauntico-gold mb-4">📂 Agent Templates</h2>
          <p className="text-gray-300 mb-4">
            Use pre-built templates to assign tasks to agents like Cursur, GitHub Copilot, or your own AI stack.
          </p>
          <div className="bg-gray-800 p-4 rounded text-gray-400 text-sm hover:bg-gray-700 transition-colors duration-200" role="note">
            [Embed or link to delegation templates here]
          </div>
          <button className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300"> console.log('Browse templates clicked')}
            data-cta="delegation-browse-templates"
            aria-label="Browse AI agent templates"
            className="mt-4 bg-gray-800 text-white px-6 py-3 rounded hover:bg-gray-700 transition-colors duration-200"
          >
            Browse Templates
          </button>
        </section>

        <section className="bg-gray-900 p-6 rounded-lg hover:bg-gray-800 transition-colors duration-300" role="region" aria-labelledby="orchestrate-heading">
          <h2 id="orchestrate-heading" className="text-2xl font-semibold text-vauntico-gold mb-4">🧠 Orchestrate Like a Founder</h2>
          <p className="text-gray-300 mb-4">
            You're not just using AI — you're leading it. Assign roles, set goals, and build a system that scales with you.
          </p>
          <a
            href="https://notion.so/your-delegation-guide-link"
            target="_blank"
            rel="noopener noreferrer"
            data-cta="delegation-view-guide"
            aria-label="View comprehensive delegation guide (opens in new window)"
            className="inline-block bg-vauntico-gold text-black px-4 py-2 rounded hover:bg-yellow-400 transition hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300">
            View Delegation Guide
          </a>
        </section>
      </main>
    </div>
  );
}