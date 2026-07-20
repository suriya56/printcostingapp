# Calculator Logic Details

The application features two distinct calculation modes: **Mode A (Standard Jobs)** and **Mode B (Booklets & Books)**. This document outlines the exact formulas and logic used for each mode.

---

## 1. Mode A: Standard Jobs Calculator
`CalculatorModeA.tsx` calculates pricing for standard, single-piece printing jobs like flyers, posters, and simple cards.

### Core Variables & Formulae
- **Quantity (`Q`)**: The final desired number of output pieces.
- **Divisor (`D`)**: How many final pieces fit into a single feeding sheet.
- **Wastage (`W`)**: The number of feeding sheets wasted per plate.
- **Plates Count (`P`)**: The total number of plates used.

#### Paper & Sheets Calculation
1. **Total Wastage**:
   `Total Wastage = P * W`
2. **Feeding Sheets (Press Sheets)**: The number of sheets passed through the press.
   `Feeding Sheets = (Q / D) + Total Wastage`
3. **Full Sheets (Parent Sheets)**: The number of parent sheets to be purchased. It assumes each full sheet yields 2 feeding sheets.
   `Full Sheets = Feeding Sheets / 2`
4. **Paper Cost**:
   `Total Paper Cost = Full Sheets * Price Per Full Sheet`

#### Impressions & Printing Cost
1. **Impressions**: Represents how many times the sheets pass through the press.
   `Impressions = (Print Sides == 'both') ? (Feeding Sheets * 2) : Feeding Sheets`
2. **Printing Cost Calculation**: 
   The cost is based on an administrative **Brackets System**. The system evaluates the total `Impressions`.
   - **Bracket 1**: If `Impressions <= b1.maxImpressions`, cost is `b1.cost`.
   - **Bracket 2/3**: Scaled based on higher volumes. 
   - **Excess**: If `Impressions > Max Bracket`, it adds a step cost:
     `Excess = Impressions - Max Bracket Impressions`
     `Steps = Math.ceil(Excess / excessStepImpressions)`
     `Printing Cost = Max Bracket Cost + (Steps * excessStepCost)`
   - Note: *Single Color* options only utilize the first bracket.

#### Total Production & Quoted Cost
1. **Post-Press Cost**: Sum of all added post-press operations (e.g., binding, cutting, folding).
2. **Total Production Cost**: 
   `Total Production = Paper Cost + Plate Cost + Post-Press Cost + Printing Cost`
3. **Final Price (With Margin)**:
   `Final Total Price = Total Production Cost * (1 + Margin Percentage / 100)`
4. **Per-Piece Cost**: 
   `Per Piece = Final Total Price / Q`

---

## 2. Mode B: Booklets & Books Calculator
`CalculatorModeB.tsx` calculates complex, multi-part projects like magazines or books, strictly separating **Inner Pages** from the **Wrapper (Cover)**.

### A. Inner Pages Calculation
Inner pages can be calculated as a single block or broken into multiple customized sections (`Multi-Section Mode`).

#### For Each Section (or single block):
- **Section Plates**: 
  `Section Plates = Math.ceil(Pages Count / Ups)`
- **Section Forms**: 
  `Section Forms = (Pages Count / Ups) / 2`
- **Feeding Sheets**: 
  `Section Feeding = (Section Forms * Q) + (Section Plates * Wastage)`
- **Full Sheets**: 
  `Section Full Sheets = Section Feeding / Divisor`
- **Paper Cost**: 
  `Section Paper Cost = Section Full Sheets * Price Per Full Sheet`
- **Total Inner Paper Cost** and **Total Inner Plates Count** are the sum of all section results.

### B. Wrapper (Cover) Calculation
- **Wrapper Forms**: 
  `Wrapper Forms = Wrapper Plates Count / 2`
- **Feeding Sheets**: 
  `Wrapper Feeding = Math.ceil(Wrapper Forms * Q) + (Wrapper Plates Count * Wrapper Wastage)`
- **Full Sheets**: 
  `Wrapper Full = Wrapper Feeding / Wrapper Divisor`
- **Wrapper Paper Cost**: 
  `Wrapper Cost = Wrapper Full * Wrapper Price Per Full Sheet`

### C. Lamination Cost (Wrapper Only)
Lamination is typically applied to the cover.
1. **Base Area Calculation**:
   `Base Cost = (Paper Height * Paper Width * Lamination Rate Per Sq Inch) / 100`
2. **Lamination Sheets Used**: 
   Can be manually set, but defaults to: `Q * (Wrapper Plates Count / 2)`
3. **Total Lamination Cost**:
   `Lamination Cost = Base Cost * Lamination Sides (1 or 2) * Lamination Sheets Used`

### D. Printing Cost
Unlike Mode A which prices based on *impressions*, Mode B calculates a **Base Printing Cost** based strictly on the final **Quantity (`Q`)** requested, using the Bracket System.
1. Determine `Base Cost` using the Brackets (based on `Q`).
2. **Total Printing Cost**:
   `Printing Cost = (Base Cost * Total Inner Plates) + (Base Wrapper Cost * Wrapper Plates)`

### E. Total Production & Quoted Cost
1. **Total Material Cost**:
   `Material Cost = Inner Paper Cost + Wrapper Paper Cost + Lamination Cost`
2. **Total Post-Press (Misc) Cost**:
   Sum of all post-press items (binding, etc.)
3. **Total Production Cost**:
   `Production Cost = Material Cost + Total Post-Press Cost + Total Plate Cost + Printing Cost`
4. **Final Price (With Margin)**:
   `Final Total Price = Total Production Cost * (1 + Margin Percentage / 100)`
5. **Per-Piece Cost**: 
   `Per Piece = Final Total Price / Q`
