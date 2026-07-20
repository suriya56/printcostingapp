import { PaperProfile, PlateProfile, LaminationRate, MiscCost, PrintingBracketsConfig } from './types';

export const DEFAULT_PAPERS: PaperProfile[] = 
[
  {
    "id": "paper-1",
    "name": "Art Paper 70 GSM (23x36)",
    "size": "23x36",
    "gsm": 70,
    "paperType": "Art Paper",
    "pricePerFullSheet": 0.0
  },
  {
    "id": "paper-2",
    "name": "Art Paper 70 GSM (25x36)",
    "size": "25x36",
    "gsm": 70,
    "paperType": "Art Paper",
    "pricePerFullSheet": 0.0
  },
  {
    "id": "paper-3",
    "name": "Art Paper 70 GSM (30x40)",
    "size": "30x40",
    "gsm": 70,
    "paperType": "Art Paper",
    "pricePerFullSheet": 0.0
  },
  {
    "id": "paper-4",
    "name": "Art Paper 80 GSM (23x36)",
    "size": "23x36",
    "gsm": 80,
    "paperType": "Art Paper",
    "pricePerFullSheet": 0.0
  },
  {
    "id": "paper-5",
    "name": "Art Paper 80 GSM (25x36)",
    "size": "25x36",
    "gsm": 80,
    "paperType": "Art Paper",
    "pricePerFullSheet": 0.0
  },
  {
    "id": "paper-6",
    "name": "Art Paper 80 GSM (30x40)",
    "size": "30x40",
    "gsm": 80,
    "paperType": "Art Paper",
    "pricePerFullSheet": 0.0
  },
  {
    "id": "paper-7",
    "name": "Art Paper 90 GSM (23x36)",
    "size": "23x36",
    "gsm": 90,
    "paperType": "Art Paper",
    "pricePerFullSheet": 4.1
  },
  {
    "id": "paper-8",
    "name": "Art Paper 90 GSM (25x36)",
    "size": "25x36",
    "gsm": 90,
    "paperType": "Art Paper",
    "pricePerFullSheet": 4.4
  },
  {
    "id": "paper-9",
    "name": "Art Paper 90 GSM (30x40)",
    "size": "30x40",
    "gsm": 90,
    "paperType": "Art Paper",
    "pricePerFullSheet": 0.0
  },
  {
    "id": "paper-10",
    "name": "Art Paper 100 GSM (23x36)",
    "size": "23x36",
    "gsm": 100,
    "paperType": "Art Paper",
    "pricePerFullSheet": 4.4
  },
  {
    "id": "paper-11",
    "name": "Art Paper 100 GSM (25x36)",
    "size": "25x36",
    "gsm": 100,
    "paperType": "Art Paper",
    "pricePerFullSheet": 4.9
  },
  {
    "id": "paper-12",
    "name": "Art Paper 100 GSM (30x40)",
    "size": "30x40",
    "gsm": 100,
    "paperType": "Art Paper",
    "pricePerFullSheet": 6.4
  },
  {
    "id": "paper-13",
    "name": "Art Paper 130 GSM (23x36)",
    "size": "23x36",
    "gsm": 130,
    "paperType": "Art Paper",
    "pricePerFullSheet": 5.75
  },
  {
    "id": "paper-14",
    "name": "Art Paper 130 GSM (25x36)",
    "size": "25x36",
    "gsm": 130,
    "paperType": "Art Paper",
    "pricePerFullSheet": 6.3
  },
  {
    "id": "paper-15",
    "name": "Art Paper 130 GSM (30x40)",
    "size": "30x40",
    "gsm": 130,
    "paperType": "Art Paper",
    "pricePerFullSheet": 8.4
  },
  {
    "id": "paper-16",
    "name": "Art Paper 170 GSM (23x36)",
    "size": "23x36",
    "gsm": 170,
    "paperType": "Art Paper",
    "pricePerFullSheet": 7.8
  },
  {
    "id": "paper-17",
    "name": "Art Paper 170 GSM (25x36)",
    "size": "25x36",
    "gsm": 170,
    "paperType": "Art Paper",
    "pricePerFullSheet": 8.3
  },
  {
    "id": "paper-18",
    "name": "Art Paper 170 GSM (30x40)",
    "size": "30x40",
    "gsm": 170,
    "paperType": "Art Paper",
    "pricePerFullSheet": 11.0
  },
  {
    "id": "paper-19",
    "name": "Art Board 210 GSM (23x36)",
    "size": "23x36",
    "gsm": 210,
    "paperType": "Art Board",
    "pricePerFullSheet": 9.5
  },
  {
    "id": "paper-20",
    "name": "Art Board 210 GSM (25x36)",
    "size": "25x36",
    "gsm": 210,
    "paperType": "Art Board",
    "pricePerFullSheet": 10.3
  },
  {
    "id": "paper-21",
    "name": "Art Board 210 GSM (30x40)",
    "size": "30x40",
    "gsm": 210,
    "paperType": "Art Board",
    "pricePerFullSheet": 12.5
  },
  {
    "id": "paper-22",
    "name": "Art Board 250 GSM (23x36)",
    "size": "23x36",
    "gsm": 250,
    "paperType": "Art Board",
    "pricePerFullSheet": 11.5
  },
  {
    "id": "paper-23",
    "name": "Art Board 250 GSM (25x36)",
    "size": "25x36",
    "gsm": 250,
    "paperType": "Art Board",
    "pricePerFullSheet": 14.8
  },
  {
    "id": "paper-24",
    "name": "Art Board 250 GSM (30x40)",
    "size": "30x40",
    "gsm": 250,
    "paperType": "Art Board",
    "pricePerFullSheet": 19.0
  },
  {
    "id": "paper-25",
    "name": "Art Board 300 GSM (23x36)",
    "size": "23x36",
    "gsm": 300,
    "paperType": "Art Board",
    "pricePerFullSheet": 15.5
  },
  {
    "id": "paper-26",
    "name": "Art Board 300 GSM (25x36)",
    "size": "25x36",
    "gsm": 300,
    "paperType": "Art Board",
    "pricePerFullSheet": 16.0
  },
  {
    "id": "paper-27",
    "name": "Art Board 300 GSM (30x40)",
    "size": "30x40",
    "gsm": 300,
    "paperType": "Art Board",
    "pricePerFullSheet": 22.0
  },
  {
    "id": "paper-28",
    "name": "Art Board 350 GSM (23x36)",
    "size": "23x36",
    "gsm": 350,
    "paperType": "Art Board",
    "pricePerFullSheet": 0.0
  },
  {
    "id": "paper-29",
    "name": "Art Board 350 GSM (25x36)",
    "size": "25x36",
    "gsm": 350,
    "paperType": "Art Board",
    "pricePerFullSheet": 19.5
  },
  {
    "id": "paper-30",
    "name": "Art Board 350 GSM (30x40)",
    "size": "30x40",
    "gsm": 350,
    "paperType": "Art Board",
    "pricePerFullSheet": 0.0
  },
  {
    "id": "paper-31",
    "name": "Maplitho 70 GSM (23x36)",
    "size": "23x36",
    "gsm": 70,
    "paperType": "Maplitho",
    "pricePerFullSheet": 3.1
  },
  {
    "id": "paper-32",
    "name": "Maplitho 70 GSM (25x36)",
    "size": "25x36",
    "gsm": 70,
    "paperType": "Maplitho",
    "pricePerFullSheet": 3.3
  },
  {
    "id": "paper-33",
    "name": "Maplitho 70 GSM (30x40)",
    "size": "30x40",
    "gsm": 70,
    "paperType": "Maplitho",
    "pricePerFullSheet": 4.6
  },
  {
    "id": "paper-34",
    "name": "Maplitho 80 GSM (23x36)",
    "size": "23x36",
    "gsm": 80,
    "paperType": "Maplitho",
    "pricePerFullSheet": 3.5
  },
  {
    "id": "paper-35",
    "name": "Maplitho 80 GSM (25x36)",
    "size": "25x36",
    "gsm": 80,
    "paperType": "Maplitho",
    "pricePerFullSheet": 3.8
  },
  {
    "id": "paper-36",
    "name": "Maplitho 80 GSM (30x40)",
    "size": "30x40",
    "gsm": 80,
    "paperType": "Maplitho",
    "pricePerFullSheet": 5.3
  },
  {
    "id": "paper-37",
    "name": "Maplitho 90 GSM (23x36)",
    "size": "23x36",
    "gsm": 90,
    "paperType": "Maplitho",
    "pricePerFullSheet": 4.1
  },
  {
    "id": "paper-38",
    "name": "Maplitho 90 GSM (25x36)",
    "size": "25x36",
    "gsm": 90,
    "paperType": "Maplitho",
    "pricePerFullSheet": 4.4
  },
  {
    "id": "paper-39",
    "name": "Maplitho 90 GSM (30x40)",
    "size": "30x40",
    "gsm": 90,
    "paperType": "Maplitho",
    "pricePerFullSheet": 6.3
  },
  {
    "id": "paper-40",
    "name": "Maplitho 100 GSM (23x36)",
    "size": "23x36",
    "gsm": 100,
    "paperType": "Maplitho",
    "pricePerFullSheet": 4.5
  },
  {
    "id": "paper-41",
    "name": "Maplitho 100 GSM (25x36)",
    "size": "25x36",
    "gsm": 100,
    "paperType": "Maplitho",
    "pricePerFullSheet": 5.0
  },
  {
    "id": "paper-42",
    "name": "Maplitho 100 GSM (30x40)",
    "size": "30x40",
    "gsm": 100,
    "paperType": "Maplitho",
    "pricePerFullSheet": 6.9
  },
  {
    "id": "paper-43",
    "name": "Maplitho 120 GSM (23x36)",
    "size": "23x36",
    "gsm": 120,
    "paperType": "Maplitho",
    "pricePerFullSheet": 5.8
  },
  {
    "id": "paper-44",
    "name": "Maplitho 120 GSM (25x36)",
    "size": "25x36",
    "gsm": 120,
    "paperType": "Maplitho",
    "pricePerFullSheet": 6.0
  },
  {
    "id": "paper-45",
    "name": "Maplitho 120 GSM (30x40)",
    "size": "30x40",
    "gsm": 120,
    "paperType": "Maplitho",
    "pricePerFullSheet": 8.0
  },
  {
    "id": "paper-46",
    "name": "Bond Paper 90 GSM (17x24)",
    "size": "17x24",
    "gsm": 90,
    "paperType": "Bond Paper",
    "pricePerFullSheet": 0.0
  },
  {
    "id": "paper-47",
    "name": "Bond Paper 90 GSM (18x23)",
    "size": "18x23",
    "gsm": 90,
    "paperType": "Bond Paper",
    "pricePerFullSheet": 0.0
  },
  {
    "id": "paper-48",
    "name": "Bond Paper 100 GSM (17x24)",
    "size": "17x24",
    "gsm": 100,
    "paperType": "Bond Paper",
    "pricePerFullSheet": 3.0
  },
  {
    "id": "paper-49",
    "name": "Bond Paper 100 GSM (18x23)",
    "size": "18x23",
    "gsm": 100,
    "paperType": "Bond Paper",
    "pricePerFullSheet": 3.0
  },
  {
    "id": "paper-50",
    "name": "Gum Sheet 90 GSM (18 x 23)",
    "size": "18 x 23",
    "gsm": 90,
    "paperType": "Gum Sheet",
    "pricePerFullSheet": 9.4
  },
  {
    "id": "paper-51",
    "name": "Gum Sheet 90 GSM (18 x 25)",
    "size": "18 x 25",
    "gsm": 90,
    "paperType": "Gum Sheet",
    "pricePerFullSheet": 10.0
  },
  {
    "id": "paper-52",
    "name": "Gum Sheet 90 GSM (20x30)",
    "size": "20x30",
    "gsm": 90,
    "paperType": "Gum Sheet",
    "pricePerFullSheet": 13.0
  },
  {
    "id": "paper-53",
    "name": "Gum Sheet 100 GSM (23x36)",
    "size": "23x36",
    "gsm": 100,
    "paperType": "Gum Sheet",
    "pricePerFullSheet": 0.0
  },
  {
    "id": "paper-54",
    "name": "Gum Sheet 100 GSM (25x36)",
    "size": "25x36",
    "gsm": 100,
    "paperType": "Gum Sheet",
    "pricePerFullSheet": 0.0
  },
  {
    "id": "paper-55",
    "name": "Gum Sheet 100 GSM (20x30)",
    "size": "20x30",
    "gsm": 100,
    "paperType": "Gum Sheet",
    "pricePerFullSheet": 0.0
  },
  {
    "id": "paper-56",
    "name": "White back Board 250 GSM (23x36)",
    "size": "23x36",
    "gsm": 250,
    "paperType": "White back Board",
    "pricePerFullSheet": 0.0
  },
  {
    "id": "paper-57",
    "name": "White back Board 250 GSM (25x36)",
    "size": "25x36",
    "gsm": 250,
    "paperType": "White back Board",
    "pricePerFullSheet": 0.0
  },
  {
    "id": "paper-58",
    "name": "White back Board 250 GSM (30x40)",
    "size": "30x40",
    "gsm": 250,
    "paperType": "White back Board",
    "pricePerFullSheet": 0.0
  },
  {
    "id": "paper-59",
    "name": "White back Board 300 GSM (23x36)",
    "size": "23x36",
    "gsm": 300,
    "paperType": "White back Board",
    "pricePerFullSheet": 12.0
  },
  {
    "id": "paper-60",
    "name": "White back Board 300 GSM (25x36)",
    "size": "25x36",
    "gsm": 300,
    "paperType": "White back Board",
    "pricePerFullSheet": 12.5
  },
  {
    "id": "paper-61",
    "name": "White back Board 300 GSM (30x40)",
    "size": "30x40",
    "gsm": 300,
    "paperType": "White back Board",
    "pricePerFullSheet": 0.0
  },
  {
    "id": "paper-62",
    "name": "White back Board 350 GSM (23x36)",
    "size": "23x36",
    "gsm": 350,
    "paperType": "White back Board",
    "pricePerFullSheet": 0.0
  },
  {
    "id": "paper-63",
    "name": "White back Board 350 GSM (25x36)",
    "size": "25x36",
    "gsm": 350,
    "paperType": "White back Board",
    "pricePerFullSheet": 0.0
  },
  {
    "id": "paper-64",
    "name": "White back Board 350 GSM (30x40)",
    "size": "30x40",
    "gsm": 350,
    "paperType": "White back Board",
    "pricePerFullSheet": 0.0
  },
  {
    "id": "paper-65",
    "name": "White back Board 400 GSM (23x36)",
    "size": "23x36",
    "gsm": 400,
    "paperType": "White back Board",
    "pricePerFullSheet": 0.0
  },
  {
    "id": "paper-66",
    "name": "White back Board 400 GSM (25x36)",
    "size": "25x36",
    "gsm": 400,
    "paperType": "White back Board",
    "pricePerFullSheet": 0.0
  },
  {
    "id": "paper-67",
    "name": "White back Board 400 GSM (30x40)",
    "size": "30x40",
    "gsm": 400,
    "paperType": "White back Board",
    "pricePerFullSheet": 0.0
  },
  {
    "id": "paper-68",
    "name": "Grey back Board 250 GSM (23x36)",
    "size": "23x36",
    "gsm": 250,
    "paperType": "Grey back Board",
    "pricePerFullSheet": 0.0
  },
  {
    "id": "paper-69",
    "name": "Grey back Board 250 GSM (25x36)",
    "size": "25x36",
    "gsm": 250,
    "paperType": "Grey back Board",
    "pricePerFullSheet": 0.0
  },
  {
    "id": "paper-70",
    "name": "Grey back Board 250 GSM (30x40)",
    "size": "30x40",
    "gsm": 250,
    "paperType": "Grey back Board",
    "pricePerFullSheet": 0.0
  },
  {
    "id": "paper-71",
    "name": "Grey back Board 300 GSM (23x36)",
    "size": "23x36",
    "gsm": 300,
    "paperType": "Grey back Board",
    "pricePerFullSheet": 0.0
  },
  {
    "id": "paper-72",
    "name": "Grey back Board 300 GSM (25x36)",
    "size": "25x36",
    "gsm": 300,
    "paperType": "Grey back Board",
    "pricePerFullSheet": 0.0
  },
  {
    "id": "paper-73",
    "name": "Grey back Board 300 GSM (30x40)",
    "size": "30x40",
    "gsm": 300,
    "paperType": "Grey back Board",
    "pricePerFullSheet": 0.0
  },
  {
    "id": "paper-74",
    "name": "Grey back Board 350 GSM (23x36)",
    "size": "23x36",
    "gsm": 350,
    "paperType": "Grey back Board",
    "pricePerFullSheet": 0.0
  },
  {
    "id": "paper-75",
    "name": "Grey back Board 350 GSM (25x36)",
    "size": "25x36",
    "gsm": 350,
    "paperType": "Grey back Board",
    "pricePerFullSheet": 0.0
  },
  {
    "id": "paper-76",
    "name": "Grey back Board 350 GSM (30x40)",
    "size": "30x40",
    "gsm": 350,
    "paperType": "Grey back Board",
    "pricePerFullSheet": 0.0
  },
  {
    "id": "paper-77",
    "name": "Grey back Board 400 GSM (23x36)",
    "size": "23x36",
    "gsm": 400,
    "paperType": "Grey back Board",
    "pricePerFullSheet": 0.0
  },
  {
    "id": "paper-78",
    "name": "Grey back Board 400 GSM (25x36)",
    "size": "25x36",
    "gsm": 400,
    "paperType": "Grey back Board",
    "pricePerFullSheet": 0.0
  },
  {
    "id": "paper-79",
    "name": "Grey back Board 400 GSM (30x40)",
    "size": "30x40",
    "gsm": 400,
    "paperType": "Grey back Board",
    "pricePerFullSheet": 0.0
  }
]
export const DEFAULT_LAMINATION: LaminationRate[] = [
  { id: 'lam-1', name: 'Gloss Lamination', ratePerSqInch: 0.15 },
  { id: 'lam-2', name: 'Matte Lamination', ratePerSqInch: 0.20 },
  { id: 'lam-3', name: 'Velvet Lamination', ratePerSqInch: 0.35 }
];

export const DEFAULT_MISC: MiscCost[] = [
  { id: 'misc-1', name: 'Folding', type: 'fixed', cost: 1500 },
  { id: 'misc-2', name: 'Perfect Binding', type: 'per_unit', cost: 12 },
  { id: 'misc-3', name: 'Center Pinning', type: 'per_unit', cost: 3 },
  { id: 'misc-4', name: 'Transportation', type: 'fixed', cost: 2000 },
  { id: 'misc-5', name: 'Packing & Handling', type: 'fixed', cost: 800 }
];

export const DEFAULT_BRACKETS: PrintingBracketsConfig = {
  bracket1: { maxImpressions: 1100, cost: 1200 },
  bracket2: { maxImpressions: 2100, cost: 1400 },
  bracket3: { maxImpressions: 3100, cost: 1600 },
  excessStepImpressions: 1000,
  excessStepCost: 400,
  singleColor: {
    bracket1: { maxImpressions: 1000, cost: 300 },
    excessStepImpressions: 1000,
    excessStepCost: 200
  },
  singleColorDoubleDummy: {
    bracket1: { maxImpressions: 1000, cost: 350 },
    excessStepImpressions: 1000,
    excessStepCost: 300
  }
};


export const DEFAULT_PLATES: PlateProfile[] = [
  { id: 'pl1', name: 'Standard Thermal Plate', cost: 400 },
  { id: 'pl2', name: 'Premium UV Plate', cost: 550 }
];
