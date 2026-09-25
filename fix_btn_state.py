import os

file_path = r'C:\Users\muham\.gemini\antigravity\brain\4eba96b2-d1a7-40d6-b229-659dfed4c9a0\scratch\Asher_Pamarai_App\frontend\src\app\executive\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Check if btn1 state exists, if not add it
if 'const [btn1, setBtn1]' not in content:
    content = content.replace(
        'const [wasteVal, setWasteVal] = useState(0);',
        "const [wasteVal, setWasteVal] = useState(0);\n  const [btn1, setBtn1] = useState('Export Laporan');"
    )
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
