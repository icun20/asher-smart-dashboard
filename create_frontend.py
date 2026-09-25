import os
import re

base_dir = r"C:\Users\muham\.gemini\antigravity\brain\4eba96b2-d1a7-40d6-b229-659dfed4c9a0\scratch\Asher_Pamarai_App\frontend\src\app"

# 1. Globals CSS
globals_css = """@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #0f172a;
  --foreground: #f8fafc;
  --card: #1e293b;
  --border: #334155;
  --muted-foreground: #94a3b8;
}

body {
  background-color: var(--background);
  color: var(--foreground);
}

.gauge-ring { transition: stroke-dashoffset 1.5s ease-in-out; }
.fade-in { animation: fadeIn 0.6s ease-in-out forwards; opacity: 0; }
@keyframes fadeIn { to { opacity: 1; } }
.fade-in:nth-child(1) { animation-delay: 0.1s; }
.fade-in:nth-child(2) { animation-delay: 0.2s; }
.fade-in:nth-child(3) { animation-delay: 0.3s; }
.fade-in:nth-child(4) { animation-delay: 0.4s; }
.bar-animate { animation: barGrow 1s ease-out forwards; transform-origin: bottom; transform: scaleY(0); }
@keyframes barGrow { to { transform: scaleY(1); } }
.pulse-dot { animation: pulse 2s infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
.blink-alert { animation: blink 1s infinite; }
@keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
.scan-line { animation: scan 2s ease-in-out infinite; }
@keyframes scan { 0%{top:10%} 50%{top:85%} 100%{top:10%} }
"""

# 2. Main Page
page_tsx = """import Link from 'next/link';

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
"""

def read_html(filename):
    path = rf"C:\Users\muham\.gemini\antigravity\brain\4eba96b2-d1a7-40d6-b229-659dfed4c9a0\{filename}"
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def convert_to_jsx(html_str, name):
    # Extract body content
    match = re.search(r'<body[^>]*>(.*?)</body>', html_str, re.DOTALL)
    if not match: return ""
    body = match.group(1)
    
    # Remove script tags
    body = re.sub(r'<script>.*?</script>', '', body, flags=re.DOTALL)
    
    # Convert class to className
    body = body.replace('class="', 'className="')
    
    # Convert style strings to objects
    body = re.sub(r'style="height:\s*([\d.]+)%;\s*animation-delay:\s*([\d.]+)s"', r'style={{ height: "\1%", animationDelay: "\2s" }}', body)
    body = re.sub(r'style="width:\s*([\d.]+)%"', r'style={{ width: "\1%" }}', body)
    body = re.sub(r'style="transition:\s*(.*?)"', r'style={{ transition: "\1" }}', body)
    body = re.sub(r'style="background:\s*(.*?);"', r'style={{ background: "\1" }}', body)
    
    # Convert stroke-dasharray and stroke-dashoffset to camelCase
    body = body.replace('stroke-dasharray', 'strokeDasharray')
    body = body.replace('stroke-dashoffset', 'strokeDashoffset')
    body = body.replace('stroke-linecap', 'strokeLinecap')
    body = body.replace('stroke-width', 'strokeWidth')
    body = body.replace('text-anchor', 'textAnchor')
    body = body.replace('font-size', 'fontSize')
    body = body.replace('font-weight', 'fontWeight')
    body = body.replace('viewBox', 'viewBox')
    
    # Remove onclick
    body = re.sub(r'onclick="[^"]+"', '', body)
    
    # Add Link back
    back_link = '<div className="max-w-6xl mx-auto mb-4"><a href="/" className="text-emerald-500 text-sm hover:underline">&larr; Kembali ke Menu Utama</a></div>'
    
    # React boilerplate
    client_code = ""
    if name == "ExecutiveDashboard":
        client_code = """
  const [carbonVal, setCarbonVal] = useState(0);
  const [creditVal, setCreditVal] = useState(0);
  const [wasteVal, setWasteVal] = useState(0);

  useEffect(() => {
    const animate = (target, setter, duration) => {
      let start = 0;
      const startTime = performance.now();
      const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setter(Math.round(start + (target - start) * eased));
        if (progress < 1) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
    };
    setTimeout(() => animate(1294, setCarbonVal, 2000), 300);
    setTimeout(() => animate(62759, setCreditVal, 2000), 500);
    setTimeout(() => animate(2847, setWasteVal, 2000), 400);
  }, []);
"""
        body = body.replace('id="carbonVal">0<', '>{carbonVal}<')
        body = body.replace('id="creditVal">0<', '>{creditVal.toLocaleString()}<')
        body = body.replace('id="wasteVal">0<', '>{wasteVal.toLocaleString()}<')
    
    jsx = f'''"use client";
import React, {{ useState, useEffect }} from 'react';

export default function {name}() {{
{client_code}
  return (
    <div className="p-4 pb-20">
      {back_link}
      {body}
    </div>
  );
}}
'''
    return jsx

# Process HTMLs
exec_html = read_html("dashboard_executive.html")
hse_html = read_html("dashboard_hse.html")
opr_html = read_html("dashboard_operator.html")

exec_jsx = convert_to_jsx(exec_html, "ExecutiveDashboard")
hse_jsx = convert_to_jsx(hse_html, "HSEDashboard")
opr_jsx = convert_to_jsx(opr_html, "OperatorDashboard")

# Write files
with open(os.path.join(base_dir, "globals.css"), "w", encoding="utf-8") as f: f.write(globals_css)
with open(os.path.join(base_dir, "page.tsx"), "w", encoding="utf-8") as f: f.write(page_tsx)

os.makedirs(os.path.join(base_dir, "executive"), exist_ok=True)
with open(os.path.join(base_dir, "executive", "page.tsx"), "w", encoding="utf-8") as f: f.write(exec_jsx)

os.makedirs(os.path.join(base_dir, "hse"), exist_ok=True)
with open(os.path.join(base_dir, "hse", "page.tsx"), "w", encoding="utf-8") as f: f.write(hse_jsx)

os.makedirs(os.path.join(base_dir, "operator"), exist_ok=True)
with open(os.path.join(base_dir, "operator", "page.tsx"), "w", encoding="utf-8") as f: f.write(opr_jsx)

print("All React components generated successfully!")
