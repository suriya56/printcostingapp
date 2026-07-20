import re

with open('server.ts', 'r') as f:
    content = f.read()

def extract_array(name, var_name):
    # This is rough, but since the variables are defined at the top...
    # Actually we can just regex the whole block
    start_idx = content.find(f"const {name}")
    if start_idx == -1: return ""
    # Find next const
    end_idx = content.find("const ", start_idx + 10)
    # The brackets const is an object
    if name == 'DEFAULT_BRACKETS':
        return f"export {content[start_idx:end_idx]}"
    return f"export {content[start_idx:end_idx]}"

out = "import { PaperProfile, PlateProfile, LaminationRate, MiscCost, PrintingBracketsConfig } from './types';\n\n"
out += extract_array("DEFAULT_PAPERS", "DEFAULT_PAPERS")
out += extract_array("DEFAULT_PLATES", "DEFAULT_PLATES")
out += extract_array("DEFAULT_LAM", "DEFAULT_LAM")
out += extract_array("DEFAULT_MISC", "DEFAULT_MISC")
out += extract_array("DEFAULT_BRACKETS", "DEFAULT_BRACKETS")

with open('src/seedData.ts', 'w') as f:
    f.write(out)
