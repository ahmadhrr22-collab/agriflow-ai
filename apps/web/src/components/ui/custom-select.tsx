'use client';

import { useState, useRef, useEffect } from 'react';

interface Option {
  id: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
}

export function CustomSelect({ value, onChange, options, placeholder = 'Pilih...', className = '' }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.id === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ag-button flex items-center justify-between gap-2 text-xs px-3 py-2 outline-none cursor-pointer w-full bg-white border shadow-sm"
        style={{ fontWeight: 600, borderColor: 'var(--border)' }}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 text-gray-500 ${isOpen ? 'rotate-180' : ''}`}>
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full rounded-lg border bg-white shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2" style={{ borderColor: 'var(--border)' }}>
          <div className="max-h-60 overflow-y-auto py-1">
            {options.map((option) => (
              <button
                key={option.id}
                className="w-full text-left px-3 py-2.5 text-xs font-semibold transition-colors hover:bg-gray-50"
                style={{ 
                  color: value === option.id ? 'var(--ag-primary)' : 'var(--foreground)',
                  background: value === option.id ? 'var(--ag-soft)' : 'transparent'
                }}
                onClick={() => {
                  onChange(option.id);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
