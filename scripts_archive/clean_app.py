import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace any number of </div> before ); with a single </div>
content = re.sub(r'(</main>.*?</footer>).*?(</div>\s*)*\);\s*}', r'\1\n    </div>\n  );\n}', content, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(content)
