import { 
  PaperProfile, PlateProfile, LaminationRate, MiscCost, 
  PrintingBracketsConfig, Quotation, User 
} from './types';

// Initial default data
const DEFAULT_PAPERS = [
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
];
const DEFAULT_PLATES = [
  { id: 'pl1', name: 'Standard Thermal Plate', cost: 400 },
  { id: 'pl2', name: 'Premium UV Plate', cost: 550 }
];;

const DEFAULT_LAM = [
  { id: 'l1', name: 'Gloss Lamination', ratePerSqInch: 0.12 },
  { id: 'l2', name: 'Thermal Matte Lamination', ratePerSqInch: 0.15 },
  { id: 'l3', name: 'Velvet Touch', ratePerSqInch: 0.25 }
];;

const DEFAULT_MISC = [
  { id: 'm1', name: 'Perfect Binding', type: 'per_unit', cost: 12 },
  { id: 'm2', name: 'Center Pinning', type: 'per_unit', cost: 3 },
  { id: 'm3', name: 'Folding (16 Pages)', type: 'per_unit', cost: 1.5 },
  { id: 'm4', name: 'Logistics / Transport', type: 'fixed', cost: 500 }
];;

const DEFAULT_BRACKETS: PrintingBracketsConfig = {
  bracket1: { maxImpressions: 1100, cost: 1200 },
  bracket2: { maxImpressions: 2100, cost: 1400 },
  bracket3: { maxImpressions: 3100, cost: 1600 },
  excessStepImpressions: 1000,
  excessStepCost: 400
};

const getStorage = (key: string, def: any) => {
  const item = localStorage.getItem(`press_db_${key}`);
  if (item) {
    try {
      const parsed = JSON.parse(item);
      // Force update if the stored papers list is significantly smaller than the new defaults
      // or if it still has old dummy prices
      if (key === 'papers' && Array.isArray(parsed)) {
        if (parsed.length < 20 || (parsed.length > 0 && parsed[0].pricePerFullSheet === 10)) {
          localStorage.setItem(`press_db_${key}`, JSON.stringify(def));
          return def;
        }
      }
      return parsed;
    } catch (e) {
      return def;
    }
  }
  return def;
};

const setStorage = (key: string, data: any) => {
  localStorage.setItem(`press_db_${key}`, JSON.stringify(data));
};


  const originalFetch = window.fetch;
  
  export const apiFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    let url = '';
    if (typeof input === 'string') {
      url = input;
    } else if (input instanceof URL) {
      url = input.toString();
    } else if (input && typeof input === 'object' && 'url' in input) {
      url = (input as any).url;
    } else {
      url = input.toString();
    }
    const urlObj = new URL(url, window.location.origin);
    const path = urlObj.pathname;
    
    // Only mock /api/ calls
    if (!path.startsWith('/api/')) {
      return fetch(input, init);
    }
    
    console.log(`Mock API Intercept: ${init?.method || 'GET'} ${path}`);
    const method = init?.method || 'GET';
    const bodyStr = typeof init?.body === 'string' ? init.body : '{}';
    let body: any = {};
    try { body = JSON.parse(bodyStr); } catch (e) {}

    const res = (data: any, status = 200) => {
      return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' }
      });
    };

    if (path === '/api/pricing/paper') {
      const material = urlObj.searchParams.get('material');
      const gsm = parseInt(urlObj.searchParams.get('gsm') || '0', 10);
      const size = urlObj.searchParams.get('size');
      
      let papers = getStorage('papers', DEFAULT_PAPERS);
      const matchingPaper = papers.find((p: any) => 
        p.paperType === material && 
        p.gsm === gsm && 
        p.size === size
      );

      if (matchingPaper) {
        return res({
          success: true,
          price_per_sheet: matchingPaper.pricePerFullSheet,
          currency: "INR",
          paperId: matchingPaper.id
        });
      } else {
        return res({ success: false, error: 'Not found' }, 404);
      }
    }

    if (path === '/api/papers') {
      let papers = getStorage('papers', DEFAULT_PAPERS);
      if (method === 'GET') return res(papers);
      if (method === 'POST') {
        const idx = papers.findIndex((p: any) => p.id === body.id);
        if (idx >= 0) papers[idx] = body;
        else { body.id = `p_${Date.now()}`; papers.push(body); }
        setStorage('papers', papers);
        return res(body);
      }
    }
    
    if (path.match(/^\/api\/papers\/(.+)$/)) {
      const match = path.match(/^\/api\/papers\/(.+)$/);
      const id = match ? match[1] : '';
      if (method === 'DELETE') {
        let papers = getStorage('papers', DEFAULT_PAPERS).filter((p: any) => p && p.id !== id);
        setStorage('papers', papers);
        return res({ success: true });
      }
    }

    if (path === '/api/lamination') {
      let lams = getStorage('lamination', DEFAULT_LAM);
      if (method === 'GET') return res(lams);
      if (method === 'POST') {
        const idx = lams.findIndex((p: any) => p.id === body.id);
        if (idx >= 0) lams[idx] = body;
        else { body.id = `l_${Date.now()}`; lams.push(body); }
        setStorage('lamination', lams);
        return res(body);
      }
    }
    
    if (path.match(/^\/api\/lamination\/(.+)$/)) {
      const match = path.match(/^\/api\/lamination\/(.+)$/);
      const id = match ? match[1] : '';
      if (method === 'DELETE') {
        let lams = getStorage('lamination', DEFAULT_LAM).filter((p: any) => p && p.id !== id);
        setStorage('lamination', lams);
        return res({ success: true });
      }
    }

    if (path === '/api/misc-costs') {
      let misc = getStorage('misc', DEFAULT_MISC);
      if (method === 'GET') return res(misc);
      if (method === 'POST') {
        const idx = misc.findIndex((p: any) => p.id === body.id);
        if (idx >= 0) misc[idx] = body;
        else { body.id = `m_${Date.now()}`; misc.push(body); }
        setStorage('misc', misc);
        return res(body);
      }
    }
    
    if (path.match(/^\/api\/misc-costs\/(.+)$/)) {
      const match = path.match(/^\/api\/misc-costs\/(.+)$/);
      const id = match ? match[1] : '';
      if (method === 'DELETE') {
        let misc = getStorage('misc', DEFAULT_MISC).filter((p: any) => p && p.id !== id);
        setStorage('misc', misc);
        return res({ success: true });
      }
    }

    if (path === '/api/plate-profiles') {
      let plates = getStorage('plates', DEFAULT_PLATES);
      if (method === 'GET') return res(plates);
      if (method === 'POST') {
        const idx = plates.findIndex((p: any) => p.id === body.id);
        if (idx >= 0) plates[idx] = body;
        else { body.id = `pl_${Date.now()}`; plates.push(body); }
        setStorage('plates', plates);
        return res(body);
      }
    }
    
    if (path.match(/^\/api\/plate-profiles\/(.+)$/)) {
      const match = path.match(/^\/api\/plate-profiles\/(.+)$/);
      const id = match ? match[1] : '';
      if (method === 'DELETE') {
        let plates = getStorage('plates', DEFAULT_PLATES).filter((p: any) => p && p.id !== id);
        setStorage('plates', plates);
        return res({ success: true });
      }
    }

    if (path === '/api/brackets') {
      let brackets = getStorage('brackets', DEFAULT_BRACKETS);
      if (method === 'GET') return res(brackets);
      if (method === 'POST') {
        setStorage('brackets', body);
        return res(body);
      }
    }

    if (path === '/api/quotations') {
      let quotes = getStorage('quotations', []);
      if (method === 'GET') return res(quotes);
      if (method === 'POST') {
        body.id = `q_${Date.now()}`;
        
        // Use token to identify user
        const tokenStr = (init?.headers as any)?.['Authorization']?.replace('Bearer ', '');
        if (tokenStr === 'admin-token-123') {
          body.createdBy = { id: 'u_1', name: 'Admin User', email: 'admin@press.local' };
        } else if (tokenStr === 'emp-token-456') {
          body.createdBy = { id: 'u_2', name: 'Estimator John', email: 'john@press.local' };
        } else {
          body.createdBy = { id: 'u_unknown', name: 'Unknown User', email: 'unknown' };
        }
        body.date = body.date || new Date().toISOString();
        
        quotes.unshift(body); // Add to beginning
        setStorage('quotations', quotes);
        return res(body);
      }
    }
    
    if (path.match(/^\/api\/quotations\/(.+)$/)) {
      const match = path.match(/^\/api\/quotations\/(.+)$/);
      const id = match ? match[1] : '';
      if (method === 'DELETE') {
        let quotes = getStorage('quotations', []).filter((p: any) => p && p.id !== id);
        setStorage('quotations', quotes);
        return res({ success: true });
      }
    }
    
    if (path === '/api/users') {
      if (method === 'GET') return res([]);
      if (method === 'POST') return res(body);
    }
    
    if (path.match(/^\/api\/users\/(.+)$/)) {
      if (method === 'DELETE') return res({ success: true });
    }
    
    // Auth
    if (path === '/api/auth/login') {
      return res({
        token: 'mock_token',
        user: { id: 'u1', name: 'Admin', email: 'admin@admin', role: 'admin' }
      });
    }

    return res({ error: 'Not found' }, 404);
};

