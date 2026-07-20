sed -i 's/Math\.max([^,]\+, \?parseInt(e\.target\.value) || [0-9]\+)/e.target.value === "" ? ("" as any) : parseInt(e.target.value)/g' src/components/CalculatorModeA.tsx
sed -i 's/Math\.max([^,]\+, \?parseFloat(e\.target\.value) || [0-9]\+)/e.target.value === "" ? ("" as any) : parseFloat(e.target.value)/g' src/components/CalculatorModeA.tsx
sed -i 's/Math\.max([^,]\+, \?parseInt(e\.target\.value) || [0-9]\+)/e.target.value === "" ? ("" as any) : parseInt(e.target.value)/g' src/components/CalculatorModeB.tsx
sed -i 's/Math\.max([^,]\+, \?parseFloat(e\.target\.value) || [0-9]\+)/e.target.value === "" ? ("" as any) : parseFloat(e.target.value)/g' src/components/CalculatorModeB.tsx
