import { apiFetch } from '../mockApi';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quotation } from '../types';
import { 
  Search, 
  Trash2, 
  Printer, 
  Download,
  Edit2,
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  User, 
  Tag 
} from 'lucide-react';
import { generateQuotationPDF } from '../utils/pdfGenerator';

interface QuotationHistoryProps {
  quotations: Quotation[];
  token: string;
  currentUser: { id: string; name: string; email: string; role: 'admin' | 'employee' };
  onRefreshData: () => void;
  onEditQuote?: (quote: Quotation) => void;
}

export default function QuotationHistory({ 
  quotations, 
  token, 
  currentUser, 
  onRefreshData,
  onEditQuote
}: QuotationHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedQuoteId, setExpandedQuoteId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedQuoteId(expandedQuoteId === id ? null : id);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to permanently delete this quotation record from logs?')) return;

    try {
      const res = await apiFetch(`/api/quotations/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to delete');
      }
      onRefreshData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handlePrint = (e: React.MouseEvent, quote: Quotation) => {
    e.stopPropagation();
    
    // Create professional print view in standard browser window
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up blocked. Please enable pop-ups to open print layouts.');
      return;
    }

    const modeText = quote.mode === 'A' ? 'Single Page Flyer / Poster' : 'Multiple Pages Booklet / Catalog';
    const breakHtml = quote.mode === 'A' ? `
      <div class="row">
        <span>Feeding Sheets:</span>
        <strong>${quote.results?.feedingSheets}</strong>
      </div>
      <div class="row">
        <span>Full Sheets (23x36):</span>
        <strong>${(quote.results?.fullSheets || 0).toFixed(1)}</strong>
      </div>
      <div class="row">
        <span>Impressions Run:</span>
        <strong>${quote.results?.impressions}</strong>
      </div>
    ` : `
      <div class="row">
        <span>Total Inner Pages:</span>
        <strong>${quote.inputs.modeB?.totalPages} pages</strong>
      </div>
      <div class="row">
        <span>Forms / Signatures:</span>
        <strong>${quote.results?.formsCount}</strong>
      </div>
      <div class="row">
        <span>Inner Paper Cost:</span>
        <strong>₹${quote.results?.innerPaperCost?.toFixed(2)}</strong>
      </div>
      <div class="row">
        <span>Wrapper Paper Cost:</span>
        <strong>₹${quote.results?.wrapperPaperCost?.toFixed(2)}</strong>
      </div>
      <div class="row">
        <span>Cover Lamination:</span>
        <strong>₹${quote.results?.laminationCost?.toFixed(2)}</strong>
      </div>
    `;

    printWindow.document.write(`
      <html>
        <head>
          <title>Quotation Receipt - ${quote.customerName}</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #333; line-height: 1.5; }
            .header { border-b: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-start; }
            .logo { font-size: 24px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #111; }
            .meta { text-align: right; font-size: 13px; color: #666; }
            .title { font-size: 18px; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px; color: #555; }
            .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed #eee; font-size: 14px; }
            .totals { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 30px; border: 1px solid #eee; }
            .price { font-size: 26px; font-weight: bold; color: #1e3a8a; font-family: monospace; }
            .footer { margin-top: 50px; font-size: 12px; text-align: center; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
            @media print {
              body { padding: 0; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">PRINTING PRESS ESTIMATE</div>
              <div style="font-size: 12px; color: #666; margin-top: 5px;">Quotation Log ID: ${quote.id}</div>
            </div>
            <div class="meta">
              <div>Date: ${quote.date}</div>
              <div>Estimator: ${quote.createdBy?.name || "Unknown"}</div>
            </div>
          </div> boss

          <div style="margin-bottom: 30px;">
            <div class="title">Customer & Job Details</div>
            <div class="row"><span>Customer:</span><strong>${quote.customerName}</strong></div>
            <div class="row"><span>Job Name:</span><strong>${quote.jobName}</strong></div>
            <div class="row"><span>Quantity Ordered:</span><strong>${quote.inputs.quantity} items</strong></div>
            <div class="row"><span>Calculation Mode:</span><strong>${modeText}</strong></div>
          </div>

          <div style="margin-bottom: 30px;">
            <div class="title">Technical Calculations Breakdown</div>
            ${breakHtml}
          </div>

          <div style="margin-bottom: 30px;">
            <div class="title">Costings Summary</div>
            <div class="row"><span>Total Paper Material:</span><strong>₹${(quote.results?.paperCost || 0).toFixed(2)}</strong></div>
            <div class="row"><span>Printing Run Impressions Cost:</span><strong>₹${(quote.results?.printingCost || 0).toFixed(2)}</strong></div>
            <div class="row"><span>Plates / Form Setup:</span><strong>₹${(quote.results?.plateCost || 0).toFixed(2)}</strong></div>
            <div class="row"><span>Post-Press & Logistics:</span><strong>₹${(quote.results?.miscCost || 0).toFixed(2)}</strong></div>
            <div class="row" style="font-weight: bold; border-bottom: 2px solid #ddd; padding-top: 10px;">
              <span>Base Production Cost:</span>
              <strong>₹${(quote.results?.totalProductionCost || 0).toFixed(2)}</strong>
            </div>
          </div>

          <div class="totals">
            <div style="font-size: 12px; color: #666; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Final Client Quote (+${quote.inputs.marginPercent}% margin)</div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
              <span class="price">₹${(quote.results?.finalTotalPrice || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              <span style="font-size: 14px; font-weight: bold; color: #10b981;">₹${(quote.results?.perPieceCost || 0).toFixed(2)} / piece</span>
            </div>
          </div>

          <div class="footer">
            Generated via Printing Press Quotation Workspace. Authorized Signature Required.
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const filteredQuotes = quotations.filter(q => {
    if (!q) return false;
    const cName = q.customerName || '';
    const jName = q.jobName || '';
    return cName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           jName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-700 pb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Search className="w-5 h-5 text-indigo-600" />
            Saved Estimations Directory
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {currentUser?.role === 'admin' 
              ? 'Global ledger of all corporate quotations.' 
              : 'Ledger of quotations created by you.'}
          </p>
        </div>
        
        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search customer or job..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-600 transition bg-slate-50 dark:bg-slate-800/50"
          />
        </div>
      </div>

      {filteredQuotes.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50/50">
          <Search className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No estimations found</p>
          <p className="text-xs text-slate-400 mt-1">Try typing a different keyword or save a new quotation in calculations tabs.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuotes.map((quote) => {
            if (!quote) return null;
            const isExpanded = expandedQuoteId === quote.id;
            const isOwner = quote.createdBy?.id === currentUser?.id;
            const canDelete = currentUser?.role === 'admin' || isOwner;

            return (
              <div 
                key={quote.id} 
                onClick={() => toggleExpand(quote.id)}
                className={`border rounded-xl transition-all cursor-pointer ${
                  isExpanded ? 'border-indigo-300 shadow-md bg-indigo-50/10' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm'
                }`}
              >
                {/* Header summary row */}
                <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                        {quote.customerName}
                      </span>
                      <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-full tracking-wider ${
                        quote.mode === 'A' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-violet-50 text-violet-700 border border-violet-200'
                      }`}>
                        {quote.mode === 'A' ? 'Single Page' : 'Multi-Page Booklet'}
                      </span>
                    </div>
                    
                    <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 line-clamp-1">
                      {quote.jobName}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {quote.date}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Tag className="w-3.5 h-3.5 text-slate-400" />
                        Qty: {quote.inputs.quantity}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {quote.createdBy?.name || "Unknown"}
                      </span>
                    </div>
                  </div>

                  {/* Pricing Display & Action utilities */}
                  <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-700">
                    <div className="text-left sm:text-right">
                      <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">Total Quote</span>
                      <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                        ₹{(quote.results?.finalTotalPrice || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {onEditQuote && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditQuote(quote);
                          }}
                          className="p-2 text-slate-500 dark:text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition rounded-xl cursor-pointer"
                          title="Load & Edit Quote"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          generateQuotationPDF(quote);
                        }}
                        className="p-2 text-slate-500 dark:text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition rounded-xl cursor-pointer"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handlePrint(e, quote)}
                        className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:bg-slate-700/50 transition rounded-xl cursor-pointer"
                        title="Print Quote Receipt"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      {canDelete && (
                        <button
                          onClick={(e) => handleDelete(e, quote.id)}
                          className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition rounded-xl cursor-pointer"
                          title="Delete Log"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-1 text-slate-400">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expandable Breakdown Card */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-b-xl font-mono text-[11px] text-slate-600 dark:text-slate-400 space-y-4"
                    >
                      <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-700 pb-1.5">
                        Cost Calculations Breakdown Sheet
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                          <span className="text-slate-400 text-[10px] uppercase">Paper & Lamination</span>
                          <div className="flex justify-between">
                            <span>Feeding sheets:</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{quote.results?.feedingSheets}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Full sheets size:</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{(quote.results?.fullSheets || 0).toFixed(1)}</span>
                          </div>
                          <div className="flex justify-between text-indigo-600 font-bold border-t border-dashed border-slate-200 dark:border-slate-700 pt-1 mt-1">
                            <span>Total Paper:</span>
                            <span>₹{(quote.results?.paperCost || 0).toFixed(2)}</span>
                          </div>
                          {quote.results?.laminationCost !== undefined && (
                            <div className="flex justify-between text-emerald-600 font-bold">
                              <span>Lamination:</span>
                              <span>₹{(quote.results?.laminationCost || 0).toFixed(2)}</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-1.5 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                          <span className="text-slate-400 text-[10px] uppercase">Press Operations</span>
                          <div className="flex justify-between">
                            <span>Impressions:</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{quote.results?.impressions}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Plate Charge:</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">₹{(quote.results?.plateCost || 0).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-indigo-600 font-bold border-t border-dashed border-slate-200 dark:border-slate-700 pt-1 mt-1">
                            <span>Press Run:</span>
                            <span>₹{(quote.results?.printingCost || 0).toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="space-y-1.5 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                          <span className="text-slate-400 text-[10px] uppercase">Marginal Geometry</span>
                          <div className="flex justify-between">
                            <span>Production:</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">₹{(quote.results?.totalProductionCost || 0).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Margin setup:</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">+{quote.inputs.marginPercent}%</span>
                          </div>
                          <div className="flex justify-between text-emerald-600 font-bold border-t border-dashed border-slate-200 dark:border-slate-700 pt-1 mt-1">
                            <span>Per item cost:</span>
                            <span>₹{(quote.results?.perPieceCost || 0).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {quote.mode === 'B' && quote.inputs.modeB && (
                        <div className="space-y-3">
                          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-4 text-slate-500 dark:text-slate-400">
                            <div>
                              <span className="text-[9px] block text-slate-400 uppercase">Booklet forms:</span>
                              <span className="font-bold text-slate-800 dark:text-slate-200">{quote.results?.formsCount}</span>
                            </div>
                            <div>
                              <span className="text-[9px] block text-slate-400 uppercase">Booklet plates:</span>
                              <span className="font-bold text-slate-800 dark:text-slate-200">{quote.results?.platesCount?.toFixed(1)}</span>
                            </div>
                            <div>
                              <span className="text-[9px] block text-slate-400 uppercase">Lamination Area:</span>
                              <span className="font-bold text-slate-800 dark:text-slate-200">{quote.results?.laminationAreaSqIn} sq. inch</span>
                            </div>
                            <div>
                              <span className="text-[9px] block text-slate-400 uppercase">Folding & binding:</span>
                              <span className="font-bold text-slate-800 dark:text-slate-200">₹{(quote.results?.miscCost || 0).toFixed(2)}</span>
                            </div>
                          </div>

                          {quote.inputs.modeB.innerSections && quote.inputs.modeB.innerSections.length > 0 && (
                            <div className="p-3.5 bg-violet-50/40 rounded-xl border border-violet-100 space-y-2">
                              <span className="text-[10px] font-bold text-violet-700 uppercase tracking-wider block">
                                Configured Inside Paper Sections (Multiple GSMs)
                              </span>
                              <div className="space-y-1.5">
                                {quote.inputs.modeB.innerSections.map((sec: any, sIdx: number) => !sec ? null : (
                                  <div key={sec?.id || sIdx} className="flex flex-wrap items-center justify-between text-[11px] py-1 border-b border-dashed border-violet-150 last:border-b-0 text-slate-600 dark:text-slate-400">
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">{sec?.name || `Section ${sIdx + 1}`}</span>
                                    <div className="flex gap-3 text-slate-500 dark:text-slate-400">
                                      <span>Pages: <strong className="text-slate-800 dark:text-slate-200 font-bold">{sec?.pagesCount}</strong></span>
                                      <span>Ups: <strong className="text-slate-800 dark:text-slate-200">{sec?.ups}</strong></span>
                                      <span>Wastage: <strong className="text-slate-800 dark:text-slate-200">{sec?.wastage}</strong></span>
                                      <span>Divisor: <strong className="text-slate-800 dark:text-slate-200">{sec?.divisor}</strong></span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
