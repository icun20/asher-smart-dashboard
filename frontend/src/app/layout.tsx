import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ASHER Smart IT Dashboard",
  description: "Dashboard for ASHER",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{__html: `
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  background: '#0f172a',
                  foreground: '#f8fafc',
                  card: '#1e293b',
                  border: '#334155'
                }
              }
            }
          }
        `}} />
      </head>
      <body className="min-h-full flex flex-col bg-[#0f172a] text-[#f8fafc]">
        {/* GLOBAL NAVIGATION BAR */}
        <nav className="bg-[#1e293b] border-b border-[#334155] px-6 py-4 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto flex flex-wrap gap-8 items-center">
            <a href="/" className="text-white font-bold text-lg mr-4 tracking-wider">ASHER<span className="text-emerald-500">.</span></a>
            <div className="flex gap-6">
              <a href="/executive" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Eksekutif</a>
              <a href="/hse" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">HSE</a>
              <a href="/operator" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Operator</a>
            </div>
          </div>
        </nav>
        
        <main className="flex-1 w-full">{children}</main>
      </body>
    </html>
  );
}
