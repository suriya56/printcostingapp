import re

with open('src/components/CalculatorModeB.tsx', 'r') as f:
    content = f.read()

# Remove state variables for custom inner paper and plate
content = re.sub(r'\s*const \[isCustomPaperInner, setIsCustomPaperInner\].*?\n', '\n', content)
content = re.sub(r'\s*const \[customPaperNameInner, setCustomPaperNameInner\].*?\n', '\n', content)
content = re.sub(r'\s*const \[customPaperPriceInner, setCustomPaperPriceInner\].*?\n', '\n', content)
content = re.sub(r'\s*const \[isCustomPlateInner, setIsCustomPlateInner\].*?\n', '\n', content)
content = re.sub(r'\s*const \[customPlateNameInner, setCustomPlateNameInner\].*?\n', '\n', content)
content = re.sub(r'\s*const \[customPlateCostInner, setCustomPlateCostInner\].*?\n', '\n', content)

# Remove them from calculateLive
content = content.replace("const activePaperInner = isCustomPaperInner ? { pricePerFullSheet: customPaperPriceInner } : paperInner;", "const activePaperInner = paperInner;")
content = content.replace("const plateCostInner = isCustomPlateInner ? customPlateCostInner * (totalPages / upsInner) : (plateProfileInner?.cost || 0) * (totalPages / upsInner);", "const plateCostInner = (plateProfileInner?.cost || 0) * (totalPages / upsInner);")

# Remove them from handleSaveQuotation payload
content = re.sub(r'\s*isCustomPaperInner,', '', content)
content = re.sub(r'\s*customPaperNameInner,', '', content)
content = re.sub(r'\s*customPaperPriceInner,', '', content)
content = re.sub(r'\s*isCustomPlateInner,', '', content)
content = re.sub(r'\s*customPlateNameInner,', '', content)
content = re.sub(r'\s*customPlateCostInner,', '', content)

# Remove setting them in useEffect
content = re.sub(r'\s*setIsCustomPaperInner\(.*?;\n', '\n', content)
content = re.sub(r'\s*setCustomPaperNameInner\(.*?;\n', '\n', content)
content = re.sub(r'\s*setCustomPaperPriceInner\(.*?;\n', '\n', content)
content = re.sub(r'\s*setIsCustomPlateInner\(.*?;\n', '\n', content)
content = re.sub(r'\s*setCustomPlateNameInner\(.*?;\n', '\n', content)
content = re.sub(r'\s*setCustomPlateCostInner\(.*?;\n', '\n', content)


with open('src/components/CalculatorModeB.tsx', 'w') as f:
    f.write(content)

