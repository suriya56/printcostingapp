import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "import {LogOut,\nBarChart3,\nFileIcon,\n apiFetch } from './mockApi';",
    "import { apiFetch } from './mockApi';"
)

content = content.replace(
    "import { \n  Printer, \n  Calculator, \n  BookOpen, \n  Settings, \n  FileText, \n  Scale, ",
    "import { \n  LogOut, \n  BarChart3, \n  FileIcon, \n  Printer, \n  Calculator, \n  BookOpen, \n  Settings, \n  History, \n  FileText, \n  Scale, "
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
