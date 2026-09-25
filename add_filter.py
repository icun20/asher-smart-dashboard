import os
import re

file_path = r'C:\Users\muham\.gemini\antigravity\brain\4eba96b2-d1a7-40d6-b229-659dfed4c9a0\scratch\Asher_Pamarai_App\frontend\src\app\executive\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add a Date Filter UI at the top
header_replacement = '''<div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">ASHER Smart Dashboard</h1>
        <p className="text-[var(--muted-foreground)]">Executive Overview &mdash; PT. Industri Nusantara</p>
      </div>
      
      {/* Date Filter & Export */}
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-[var(--card)] border border-[var(--border)] rounded-md px-3 py-2">
          <span className="text-sm text-[var(--muted-foreground)] mr-2">Periode:</span>
          <select className="bg-transparent text-sm font-medium outline-none cursor-pointer">
            <option>September 2026</option>
            <option>Agustus 2026</option>
            <option>Q3 2026</option>
            <option>Tahun 2026 (YTD)</option>
            <option>Kustom Rentang...</option>
          </select>
        </div>
        <button 
          onClick={() => {
            alert('DEMO: Di versi final, sistem akan men-generate Laporan PDF (Standar GHG Protocol & GRI) untuk periode yang dipilih.');
            setBtn1('Telah Diunduh');
          }}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          {btn1 === 'Telah Diunduh' ? 'PDF Terunduh' : 'Export Laporan'}
        </button>
      </div>
    </div>'''

# We need to replace the old header
# The old header was:
# <div className="flex items-center justify-between">
#   <div>
#     <h1 className="text-3xl font-bold tracking-tight mb-1">ASHER Smart Dashboard</h1>
#     <p className="text-[var(--muted-foreground)]">Executive Overview &mdash; PT. Industri Nusantara</p>
#   </div>
# </div>
content = re.sub(
    r'<div className="flex items-center justify-between">.*?</div>\s*</div>', 
    header_replacement, 
    content, 
    flags=re.DOTALL | re.IGNORECASE, 
    count=1
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
