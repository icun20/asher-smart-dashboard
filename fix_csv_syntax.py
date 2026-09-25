import os
import re

file_path = r'C:\Users\muham\.gemini\antigravity\brain\4eba96b2-d1a7-40d6-b229-659dfed4c9a0\scratch\Asher_Pamarai_App\frontend\src\app\executive\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the multiline string syntax error in JavaScript
content = re.sub(
    r'const csvContent = "([^"]+)\n([^"]+)";',
    r'const csvContent = \1\n\2;',
    content
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
