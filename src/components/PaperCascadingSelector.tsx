import React, { useState, useEffect, useRef } from 'react';
import { PaperProfile } from '../types';

import { ChevronLeft } from 'lucide-react';

interface PaperCascadingSelectorProps {
  papers: PaperProfile[];
  selectedPaperId: string;
  onChange: (paperId: string, price?: number) => void;
  className?: string;
}

export default function PaperCascadingSelector({ papers, selectedPaperId, onChange, className }: PaperCascadingSelectorProps) {
  // State for selections
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [selectedGsm, setSelectedGsm] = useState<number | ''>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  
  const [fetchedPrice, setFetchedPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Drill-down menu state
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'material' | 'gsm' | 'size'>('material');
  const containerRef = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync with selectedPaperId
  useEffect(() => {
    if (selectedPaperId) {
      const paper = papers.find(p => p.id === selectedPaperId);
      if (paper) {
        setSelectedMaterial(paper.paperType);
        setSelectedGsm(paper.gsm);
        setSelectedSize(paper.size);
      }
    } else {
      setSelectedMaterial('');
      setSelectedGsm('');
      setSelectedSize('');
      setFetchedPrice(null);
    }
  }, [selectedPaperId, papers]);

  // Fetch price when all 3 are selected
  useEffect(() => {
    if (selectedMaterial && selectedGsm && selectedSize && !isOpen) {
      const fetchPrice = async () => {
        setIsLoading(true);
        try {
          const paper = papers.find(p => 
            p.paperType === selectedMaterial && 
            p.gsm === selectedGsm && 
            p.size === selectedSize
          );
          if (paper) {
            setFetchedPrice(paper.pricePerFullSheet);
            onChange(paper.id, paper.pricePerFullSheet);
          }
        } catch (error) {
          console.error("Failed to fetch price", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchPrice();
    }
  }, [selectedMaterial, selectedGsm, selectedSize, isOpen, papers, onChange]);

  // Extract unique materials
  const materials = Array.from(new Set(papers.map(p => p.paperType))).filter(Boolean);
  
  const availableGsms = selectedMaterial 
    ? Array.from(new Set(papers.filter(p => p.paperType === selectedMaterial).map(p => p.gsm)))
    : [];

  const availableSizes = selectedGsm && selectedMaterial
    ? Array.from(new Set(papers.filter(p => p.paperType === selectedMaterial && p.gsm === selectedGsm).map(p => p.size)))
    : [];

  const handleInputClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Clear previous value and start at paper material when opened
      setSelectedMaterial('');
      setSelectedGsm('');
      setSelectedSize('');
      setFetchedPrice(null);
      setStep('material');
      onChange('');
    }
  };

  const displayValue = selectedMaterial && selectedGsm && selectedSize 
    ? `${selectedGsm} GSM`
    : selectedMaterial && selectedGsm
    ? `${selectedGsm} GSM...`
    : selectedMaterial
    ? `${selectedMaterial}...`
    : '';

  return (
    <div className={`relative ${className || ''}`} ref={containerRef}>
      <div className="flex gap-2 items-center">
        <input
          type="text"
          readOnly
          value={displayValue}
          onClick={handleInputClick}
          placeholder="Choose Material, GSM, Size..."
          className="flex-1 w-full bg-white dark:bg-slate-800 px-3 py-1.5 rounded-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 transition text-xs text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
        />
        {fetchedPrice !== null && !isOpen && (
          <div className="flex-shrink-0 text-xs font-mono font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-2 py-1.5 rounded-sm border border-slate-200 dark:border-slate-700">
            ₹{fetchedPrice.toFixed(2)}/fs
          </div>
        )}
        {isLoading && (
          <div className="flex-shrink-0 text-[10px] text-slate-400 animate-pulse">
            Fetching...
          </div>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm shadow-lg z-50 overflow-hidden">
          {step !== 'material' && (
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  if (step === 'size') setStep('gsm');
                  else if (step === 'gsm') setStep('material');
                }}
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </button>
              <span className="text-slate-400">|</span>
              <span className="truncate">
                {step === 'gsm' ? selectedMaterial : `${selectedMaterial} > ${selectedGsm} GSM`}
              </span>
            </div>
          )}
          
          <ul className="max-h-48 overflow-y-auto py-1 m-0 list-none">
            {step === 'material' && materials.map(mat => (
              <li 
                key={mat}
                onClick={() => {
                  setSelectedMaterial(mat);
                  setSelectedGsm('');
                  setSelectedSize('');
                  setStep('gsm');
                  onChange(''); // Reset selection
                  setFetchedPrice(null);
                }}
                className="px-4 py-2 text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-700/50 cursor-pointer border-b border-slate-50 last:border-0"
              >
                {mat}
              </li>
            ))}

            {step === 'gsm' && availableGsms.map(gsm => (
              <li 
                key={gsm}
                onClick={() => {
                  setSelectedGsm(gsm);
                  setSelectedSize('');
                  setStep('size');
                  onChange('');
                  setFetchedPrice(null);
                }}
                className="px-4 py-2 text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-700/50 cursor-pointer border-b border-slate-50 last:border-0"
              >
                {gsm} GSM
              </li>
            ))}

            {step === 'size' && availableSizes.map(size => (
              <li 
                key={size}
                onClick={() => {
                  setSelectedSize(size);
                  setIsOpen(false);
                }}
                className="px-4 py-2 text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:bg-slate-700/50 cursor-pointer border-b border-slate-50 last:border-0"
              >
                {size}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
