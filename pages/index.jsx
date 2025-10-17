export default function Home() { return <div>Vauntico lives</div> }
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white flex items-center justify-center">
      <main className="text-center">
        <h1 className="text-4xl font-bold text-[var(--vauntico-gold-text)] mb-4">
          Vauntico Lives
        </h1>
        <p className="text-gray-300">
          This is your purified Next.js entry scroll. Ready to receive transmissions.
        </p>
      </main>
    </div>
  );
}