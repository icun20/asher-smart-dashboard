import os
import re

file_path = r'C:\Users\muham\.gemini\antigravity\brain\4eba96b2-d1a7-40d6-b229-659dfed4c9a0\scratch\Asher_Pamarai_App\frontend\src\app\executive\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the select styling
content = content.replace(
    'className="bg-transparent text-sm font-medium outline-none cursor-pointer"',
    'className="bg-[#1e293b] text-white text-sm font-medium outline-none cursor-pointer p-1 rounded border border-gray-600"'
)

# Fix the button onClick to use window.print() and download a dummy CSV
new_onclick = """onClick={() => {
            // Trigger Print to PDF
            setTimeout(() => window.print(), 500);
            
            // Trigger actual file download (CSV Summary)
            const csvContent = "Periode,Carbon Credit (Ton),Estimasi Nilai (USD),Sampah Diproses (Ton),ESG Score\\nSeptember 2026,1294,62759,2847,82";
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'ASHER_Executive_Summary.csv';
            a.click();
            URL.revokeObjectURL(url);
            
            setBtn1('Telah Diunduh');
          }}"""

# We need to carefully replace the old onClick
# The old onClick was:
# onClick={() => {
#   alert('DEMO: Di versi final, sistem akan men-generate Laporan PDF (Standar GHG Protocol & GRI) untuk periode yang dipilih.');
#   setBtn1('Telah Diunduh');
# }}

content = re.sub(r"onClick=\{\(\) => \{[^}]*setBtn1\('Telah Diunduh'\);\s*\}\}", new_onclick, content, flags=re.DOTALL)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
