import os

layout_path = r'C:\Users\muham\.gemini\antigravity\brain\4eba96b2-d1a7-40d6-b229-659dfed4c9a0\scratch\Asher_Pamarai_App\frontend\src\app\layout.tsx'
css_path = r'C:\Users\muham\.gemini\antigravity\brain\4eba96b2-d1a7-40d6-b229-659dfed4c9a0\scratch\Asher_Pamarai_App\frontend\src\app\globals.css'

layout_content = '''import type { Metadata } from "next";
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
      className={${geistSans.variable}  h-full antialiased}
    >
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
'''
with open(layout_path, 'w', encoding='utf-8') as f:
    f.write(layout_content)

with open(css_path, 'r', encoding='utf-8') as f:
    css_content = f.read()

# Remove tailwind import
css_content = css_content.replace('@import "tailwindcss";', '')
with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css_content)
