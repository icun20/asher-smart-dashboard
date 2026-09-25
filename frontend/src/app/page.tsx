import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-3xl text-center space-y-8">
        <h1 className="text-4xl font-bold">The ASHER Smart IT Portal</h1>
        <p className="text-[var(--muted-foreground)] text-lg">Platform pintar untuk memonitor, mengelola, dan melacak kepatuhan lingkungan serta operasional mesin secara real-time.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Link href="/executive" className="block p-6 bg-[var(--card)] border border-[var(--border)] rounded-xl hover:border-emerald-500 transition-colors">
            <h2 className="text-xl font-bold mb-2 text-emerald-500">Eksekutif (C-Level)</h2>
            <p className="text-sm text-[var(--muted-foreground)]">Carbon Credit, ESG Score, dan Unduh Eksum</p>
          </Link>
          
          <Link href="/hse" className="block p-6 bg-[var(--card)] border border-[var(--border)] rounded-xl hover:border-blue-500 transition-colors">
            <h2 className="text-xl font-bold mb-2 text-blue-500">Manajer HSE</h2>
            <p className="text-sm text-[var(--muted-foreground)]">Kepatuhan Emisi, Gas Analyzer, dan Log Insiden</p>
          </Link>
          
          <Link href="/operator" className="block p-6 bg-[var(--card)] border border-[var(--border)] rounded-xl hover:border-orange-500 transition-colors">
            <h2 className="text-xl font-bold mb-2 text-orange-500">Operator Mesin</h2>
            <p className="text-sm text-[var(--muted-foreground)]">Predictive Maintenance & AI Camera Feed</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
