import os
import re

replacements = {
    r'\bbg-white\b': 'bg-white dark:bg-slate-800',
    r'\bbg-slate-50\b': 'bg-slate-50 dark:bg-slate-800/50',
    r'\bbg-slate-100\b': 'bg-slate-100 dark:bg-slate-700/50',
    r'\bbg-slate-200\b': 'bg-slate-200 dark:bg-slate-900',
    r'\bbg-slate-300\b': 'bg-slate-300 dark:bg-slate-950',
    r'\btext-slate-900\b': 'text-slate-900 dark:text-slate-100',
    r'\btext-slate-800\b': 'text-slate-800 dark:text-slate-200',
    r'\btext-slate-700\b': 'text-slate-700 dark:text-slate-300',
    r'\btext-slate-600\b': 'text-slate-600 dark:text-slate-400',
    r'\btext-slate-500\b': 'text-slate-500 dark:text-slate-400',
    r'\bborder-slate-100\b': 'border-slate-100 dark:border-slate-700',
    r'\bborder-slate-200\b': 'border-slate-200 dark:border-slate-700',
    r'\bborder-slate-300\b': 'border-slate-300 dark:border-slate-600',
    r'\bg-slate-800 text-white\b': 'bg-slate-800 dark:bg-slate-900 text-white',
    r'\btext-slate-900\b': 'text-slate-900 dark:text-slate-100'
}

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    for old, new in replacements.items():
        # Avoid double replacement if run twice
        if new not in content:
            content = re.sub(old, new, content)
            
    with open(filepath, 'w') as f:
        f.write(content)

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx'):
            process_file(os.path.join(root, file))
