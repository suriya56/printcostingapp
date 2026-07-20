# Commercial Offset Printing Estimation System - Technical Specifications

This document outlines the core business logic, formulas, and parameters for the Commercial Offset Printing Quotation Calculator.

## Overview
The application handles two distinct modes of calculation:
- **Mode A**: Single Page Flyer / Poster
- **Mode B**: Multiple Pages Booklet / Catalog

All calculations result in a comprehensive cost breakdown including material costs, printing costs, plate costs, post-press costs, and a final margin markup.

## Global Parameters
- **Paper Profiles**: Contains `pricePerFullSheet` (in INR)
- **Plate Profiles**: Contains `cost` per plate (in INR)
- **Printing Brackets**: Used to calculate printing costs based on volume
  - Bracket 1: up to `maxImpressions` (default 1100), cost `C1` (default ₹1200)
  - Bracket 2: up to `maxImpressions` (default 2100), cost `C2` (default ₹1400)
  - Bracket 3: up to `maxImpressions` (default 3100), cost `C3` (default ₹1600)
  - Excess Steps: For impressions beyond Bracket 3, cost increments by `excessStepCost` (default ₹400) per `excessStepImpressions` (default 1000).

---

## Mode A: Single Page Flyer / Poster

### Inputs
- **Quantity (Q)**: Number of final pieces required.
- **Divisor (D)**: Number of pieces per full sheet (or feeding sheet depending on standard).
- **Plates Count (P)**: Total number of plates developed.
- **Wastage (W)**: Paper wastage per plate.
- **Print Sides**: "front" (1 side) or "both" (2 sides).
- **Margin Percent (M)**: Target profit margin percentage.
- **Post-Press Costs**: Array of miscellaneous operations (e.g., cutting, binding).

### Calculations

1. **Material (Paper) Cost**
   - `totalWastage` = $P \times W$
   - `feedingSheets` = $(Q / D) + totalWastage$
   - `fullSheets` = $feedingSheets / 2$
   - `totalPaperCost` = $fullSheets \times pricePerFullSheet$

2. **Plate Cost**
   - `totalPlateCost` = $P \times plateProfileCost$

3. **Printing Impressions & Cost**
   - `impressions` = $feedingSheets \times 2$ (if "both" sides) OR $feedingSheets$ (if "front" only)
   - Determine `baseCost` from Printing Brackets using `impressions` against `maxImpressions`:
     - If $impressions \le Bracket1.max$: `baseCost = Bracket1.cost`
     - If $impressions \le Bracket2.max$: `baseCost = Bracket2.cost`
     - If $impressions \le Bracket3.max$: `baseCost = Bracket3.cost`
     - Else:
       - $excess = impressions - Bracket3.max$
       - $steps = \lceil excess / excessStepImpressions \rceil$
       - `baseCost` = $Bracket3.cost + (steps \times excessStepCost)$
   - `printingCost` = `baseCost`

4. **Totals**
   - `totalPostPressCost` = $\sum postPressCosts$
   - `totalProductionCost` = $totalPaperCost + totalPlateCost + printingCost + totalPostPressCost$
   - `finalTotalPrice` = $totalProductionCost \times (1 + M / 100)$
   - `perPieceCost` = $finalTotalPrice / Q$

---

## Mode B: Multiple Pages Booklet / Catalog

### Inputs
- **Quantity (Q)**: Number of booklets required.
- **Margin Percent (M)**: Target profit margin percentage.

**Inner Pages (Supports Single Section or Multi-Section config)**:
For each section:
- **Pages Count**: Number of pages in the section.
- **Ups (U_inner)**: Pages per plate.
- **Wastage (W_inner)**: Wastage sheets per plate.
- **Divisor (D_inner)**: Divisor to convert feeding sheets to full sheets.

**Wrapper Pages**:
- **Ups (U_wrapper)**: Wrapper pages per plate.
- **Wastage (W_wrapper)**: Wastage sheets for wrapper.
- **Divisor (D_wrapper)**: Divisor to convert feeding sheets to full sheets.

**Lamination**:
- **Paper Dimensions**: `paperHeight` x `paperWidth`
- **Lamination Sides**: Number of sides to laminate (e.g., 1 or 2).
- **Lamination Rate**: Cost per square inch per 100 sq inches.
- **Lamination Sheets Used**: Custom manual input or $(Q / U\_wrapper)$.

### Calculations

1. **Inner Pages Calculations (Per Section)**
   - `platesCountInner` = $pagesCount / U\_inner$
   - `formsCount` = $platesCountInner / 2$
   - `innerTotalWastage` = $platesCountInner \times W\_inner$
   - `feedingSheetsInner` = $(formsCount \times Q) + innerTotalWastage$
   - `fullSheetsInner` = $feedingSheetsInner / D\_inner$
   - `innerPaperCost` = $fullSheetsInner \times activePaperInner.pricePerFullSheet$
   - `plateCostInner` = $platesCountInner \times activePlateInner.cost$

   *If Multi-Section is used, these values are aggregated across all sections.*

2. **Wrapper Calculations**
   - `platesCountWrapper` = $2 / U\_wrapper$
   - `feedingSheetsWrapper` = $\lceil Q / U\_wrapper \rceil + W\_wrapper$
   - `fullSheetsWrapper` = $feedingSheetsWrapper / D\_wrapper$
   - `wrapperPaperCost` = $fullSheetsWrapper \times activePaperWrapper.pricePerFullSheet$
   - `plateCostWrapper` = $platesCountWrapper \times activePlateWrapper.cost$

3. **Lamination Cost**
   - `laminationAreaSqIn` = $paperHeight \times paperWidth$
   - `baseLaminationCost` = $(laminationAreaSqIn \times ratePerSqInch) / 100$
   - `laminationCost` = $baseLaminationCost \times laminationSides \times laminationSheetsUsed$

4. **Printing Impressions & Cost**
   - *Note: Mode B Printing Cost uses Quantity against the Brackets, then multiplies by the Total Plate Count.*
   - `totalPlatesCount` = $platesCountInner + platesCountWrapper$
   - Determine `baseCost` from Printing Brackets using `Q` against `maxImpressions`:
     - If $Q \le Bracket1.max$: `baseCost = Bracket1.cost`
     - If $Q \le Bracket2.max$: `baseCost = Bracket2.cost`
     - If $Q \le Bracket3.max$: `baseCost = Bracket3.cost`
     - Else:
       - $excess = Q - Bracket3.max$
       - $steps = \lceil excess / excessStepImpressions \rceil$
       - `baseCost` = $Bracket3.cost + (steps \times excessStepCost)$
   - `printingCost` = $baseCost \times totalPlatesCount$

5. **Totals**
   - `totalMaterialCost` = $innerPaperCost + wrapperPaperCost + laminationCost$
   - `totalPlateCost` = $plateCostInner + plateCostWrapper$
   - `totalMiscCosts` = $\sum postPressCosts$
   - `totalProductionCost` = $totalMaterialCost + totalPlateCost + printingCost + totalMiscCosts$
   - `finalTotalPrice` = $totalProductionCost \times (1 + M / 100)$
   - `perPieceCost` = $finalTotalPrice / Q$

