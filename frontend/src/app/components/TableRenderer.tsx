import React from 'react';

// Helper to parse cell content into React nodes supporting lists, bolding, and color styling
export function parseCellContent(text: string) {
  if (!text) return null;
  const lines = text.split('\n');
  
  return (
    <div className="space-y-1.5">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="min-h-[1rem]" />;
        
        const isListItem = trimmed.startsWith('*') || trimmed.startsWith('-') || trimmed.startsWith('•');
        let cleanText = trimmed;
        if (isListItem) {
          cleanText = trimmed.substring(1).trim();
        }
        
        // Parse bold: **text** and color: [text](color-or-hex)
        const regex = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
        const parts = cleanText.split(regex);
        
        const parsedLine = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={pIdx} className="font-extrabold text-gray-900">
                {part.slice(2, -2)}
              </strong>
            );
          } else if (part.startsWith('[') && part.includes('](')) {
            const closeBracketIdx = part.indexOf(']');
            const content = part.slice(1, closeBracketIdx);
            const target = part.slice(closeBracketIdx + 2, -1);
            
            const isLink = target.startsWith('http') || target.startsWith('www') || target.includes('.') || target.startsWith('/');
            if (isLink) {
              let href = target;
              if (!/^https?:\/\//i.test(target)) {
                href = 'https://' + target;
              }
              return (
                <a 
                  key={pIdx} 
                  href={href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-bold text-orange-600 hover:text-orange-800 underline transition-colors"
                >
                  {content}
                </a>
              );
            }
            
            let colorStyle = target;
            if (target === 'red') colorStyle = '#e11d48'; // rose-600
            else if (target === 'green') colorStyle = '#16a34a'; // green-600
            else if (target === 'orange') colorStyle = '#ea580c'; // orange-600
            else if (target === 'blue') colorStyle = '#2563eb'; // blue-600
            
            return (
              <span key={pIdx} style={{ color: colorStyle }} className="font-bold">
                {content}
              </span>
            );
          }
          return part;
        });
        
        if (isListItem) {
          return (
            <div key={idx} className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed pl-1">
              <span className="text-gray-400 mt-1.5 flex-shrink-0 text-[8px]">•</span>
              <span className="flex-1">{parsedLine}</span>
            </div>
          );
        } else {
          return (
            <div key={idx} className="text-sm text-gray-700 leading-relaxed">
              {parsedLine}
            </div>
          );
        }
      })}
    </div>
  );
}

interface HeaderCell {
  text: string;
  bgColor?: string;
  textColor?: string;
}

interface TableData {
  style?: string;
  showTitle?: boolean;
  titleText?: string;
  titleBgColor?: string;
  titleTextColor?: string;
  colWidths?: number[];
  headers: HeaderCell[];
  rows: string[][];
}

interface TableRendererProps {
  tableData: TableData;
}

export function TableRenderer({ tableData }: TableRendererProps) {
  if (!tableData || !tableData.headers || !tableData.headers.length) return null;
  
  const { headers, rows } = tableData;
  const colCount = headers.length;
  
  // Calculate column widths safely
  const getColWidths = (tData: TableData) => {
    if (tData.colWidths && tData.colWidths.length === colCount) {
      return tData.colWidths;
    }
    const share = Math.floor(100 / colCount);
    const widths = Array(colCount).fill(share);
    const sum = widths.reduce((a, b) => a + b, 0);
    if (sum < 100) {
      widths[colCount - 1] += (100 - sum);
    }
    return widths;
  };

  const colWidths = getColWidths(tableData);
  const gridTemplateColumns = colWidths.map(w => `${w}%`).join(' ');
  
  return (
    <div className="w-full my-6 overflow-hidden rounded-2xl border border-gray-200 shadow-md bg-white">
      {/* Main Title Header if enabled */}
      {tableData.showTitle && tableData.titleText && (
        <div 
          className="p-4 text-center font-extrabold text-base sm:text-lg border-b border-gray-200 uppercase tracking-wider"
          style={{ 
            backgroundColor: tableData.titleBgColor || '#1e3a8a', 
            color: tableData.titleTextColor || '#ffffff' 
          }}
        >
          {tableData.titleText}
        </div>
      )}
      
      {/* Header Grid */}
      <div 
        className="grid border-b border-gray-200" 
        style={{ gridTemplateColumns }}
      >
        {headers.map((h, i) => (
          <div 
            key={i} 
            className="p-4 text-center font-bold text-sm sm:text-base border-r last:border-r-0 border-gray-200 flex items-center justify-center uppercase tracking-wide"
            style={{ 
              backgroundColor: h.bgColor || '#1e293b', 
              color: h.textColor || '#ffffff' 
            }}
          >
            {h.text}
          </div>
        ))}
      </div>
      
      {/* Body Rows Grid */}
      <div className="divide-y divide-gray-200">
        {rows && rows.map((row, rowIdx) => (
          <div 
            key={rowIdx} 
            className="grid divide-x divide-gray-200"
            style={{ gridTemplateColumns }}
          >
            {row.map((cellText, colIdx) => (
              <div 
                key={colIdx} 
                className="p-4 bg-white hover:bg-gray-50/50 transition-colors duration-150 overflow-x-auto"
              >
                {parseCellContent(cellText)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TableRenderer;
