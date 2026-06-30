import React, { useState } from 'react';
import { Type, Link, Minus, Heading, Table, Trash2, Plus, ArrowUp, ArrowDown, X, Palette, Layout } from 'lucide-react';

// Helper to parse cell content inside admin preview (pure JS React implementation)
function parseCellContentPreview(text) {
  if (!text) return null;
  const lines = text.split('\n');
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} style={{ minHeight: '12px' }} />;
        
        const isListItem = trimmed.startsWith('*') || trimmed.startsWith('-') || trimmed.startsWith('•');
        let cleanText = trimmed;
        if (isListItem) {
          cleanText = trimmed.substring(1).trim();
        }
        
        const regex = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
        const parts = cleanText.split(regex);
        
        const parsedLine = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={pIdx} style={{ fontWeight: 800, color: '#111827' }}>
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
                  style={{ color: '#ea580c', textDecoration: 'underline', fontWeight: 700 }}
                >
                  {content}
                </a>
              );
            }
            
            let colorStyle = target;
            if (target === 'red') colorStyle = '#e11d48';
            else if (target === 'green') colorStyle = '#16a34a';
            else if (target === 'orange') colorStyle = '#ea580c';
            else if (target === 'blue') colorStyle = '#2563eb';
            
            return (
              <span key={pIdx} style={{ color: colorStyle, fontWeight: 700 }}>
                {content}
              </span>
            );
          }
          return part;
        });
        
        if (isListItem) {
          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '13px', color: '#374151', lineHeight: '1.4' }}>
              <span style={{ color: '#9ca3af', marginTop: '4px', flexShrink: 0, fontSize: '10px' }}>•</span>
              <span style={{ flex: 1 }}>{parsedLine}</span>
            </div>
          );
        } else {
          return (
            <div key={idx} style={{ fontSize: '13px', color: '#374151', lineHeight: '1.4' }}>
              {parsedLine}
            </div>
          );
        }
      })}
    </div>
  );
}

const PRESET_DATES_FEES = {
  style: 'dates_fees',
  showTitle: false,
  titleText: '',
  titleBgColor: '#1e3a8a',
  titleTextColor: '#ffffff',
  colWidths: [50, 50],
  headers: [
    { text: 'Important Dates', bgColor: '#800020', textColor: '#ffffff' },
    { text: 'Application Fee', bgColor: '#800020', textColor: '#ffffff' }
  ],
  rows: [
    [
      `* Online Apply Start Date : [March 2026 Tentative](red)
* Online Apply Last Date : [March 2026 Tentative](red)
* Last Date For Fee Payment : [March 2026 Tentative](red)
* Exam Date : [Notify Later](red)
* Admit Card : Before Exam
* Result Date : Will Be Updated Here Soon
* Candidates Are Advised To Confirm From The **Bihar BPSC Official Website.**`,
      `* For All Category Candidates : **₹ 100/-**
* Payment Mode (Online): You Can Make The Payment Using The Following Methods:
  - Debit Card
  - Credit Card
  - Internet Banking
  - IMPS
  - Cash Card / Mobile Wallet`
    ]
  ]
};

const PRESET_AGE_POSTS = {
  style: 'age_posts',
  showTitle: false,
  titleText: '',
  titleBgColor: '#1e3a8a',
  titleTextColor: '#ffffff',
  colWidths: [70, 30],
  headers: [
    { text: 'BPSC School Teacher TRE 4.0 Notification 2026 : Age Limits As On 01 August 2025', bgColor: '#15803d', textColor: '#ffffff' },
    { text: 'Total Post', bgColor: '#ea580c', textColor: '#ffffff' }
  ],
  rows: [
    [
      `* Minimum Age : **18 Years (Class 1, To 05 & 6 To 8)**
* Minimum Age : **21 Years (Class 9 To 10 & 11 To 12)**
* Maximum Age : **37 Years (UR-Male)**
* Maximum Age : **40 Years (UR-Female)**
* Maximum Age : **40 Years (BC/ EBC-Male & Female)**
* Maximum Age : **42 Years (SC/ ST-Male & Female)**
* **Bihar BPSC** Provides Age Relaxation For The **Special School TRE 4.0** Position As Per Their Regulations.`,
      `**44000+ Approx Posts**`
    ]
  ]
};

const PRESET_VACANCY_DETAILS = {
  style: 'vacancy_details',
  showTitle: true,
  titleText: 'BPSC School Teacher TRE 4.0 Recruitment 2026 : Education Qualification',
  titleBgColor: '#1e3a8a',
  titleTextColor: '#ffffff',
  colWidths: [30, 70],
  headers: [
    { text: 'Post Name', bgColor: '#334155', textColor: '#ffffff' },
    { text: 'Eligibility Criteria', bgColor: '#334155', textColor: '#ffffff' }
  ],
  rows: [
    [
      'School Teacher (Class 1 To 5)',
      `* Bachelor Degree With 50% Marks And B.Ed Degree **OR**
* Bachelor Degree In Any Stream With Diploma In Elementary Education **OR**
* 10+2 Inter With 50% Marks With 2 Year Diploma In Elementary Education / Special Diploma **OR**
* 10+2 Inter With 45% Marks (As Per 2002 Norms) With 2 Year Diploma In Elementary Education **OR**
* 10+2 Inter With 50% Marks With 4 Year BLED Degree **OR**
* Master Degree With 55% Marks And B.Ed – Med 3 Year Degree
* CTET Paper I OR BTET Paper I Exam Qualified.`
    ],
    [
      'Middle School Teacher (Class 6 To 8)',
      `* Graduate With 2 Year Diploma In Elementary Education (D.Ed) **OR** Graduate / Post Graduate With 50% Marks With B.Ed **OR** Graduate With 45% Marks And B.Ed (NCTE Norms) **OR** Graduate With 50% Marks And BA BED And B.Sc Ed **OR** Graduate With 50% Marks And B.Ed Special **OR** Post Graduate With 55% Marks And 3 Year B.Ed – M.Ed Course.
* Form More Details, Read Official Notification.`
    ],
    [
      'School Teacher (Class 6 To 10)',
      `* Graduate / Post Graduate In Related Subject With Minimum 50% Marks And B.Ed Degree **OR**
* Graduate / Post Graduate In Related Subject With Minimum 45% Marks (As Per 2002 Norms) And B.Ed Degree **OR**
* 4 Year Degree In BAEd / BScEd
* STET Paper I Exam Passed
* Form More Details, Read Official Notification.`
    ]
  ]
};

const COLOR_PALETTE = [
  { name: 'Maroon', value: '#800020' },
  { name: 'Green', value: '#15803d' },
  { name: 'Orange', value: '#ea580c' },
  { name: 'Dark Blue', value: '#1e3a8a' },
  { name: 'Slate Gray', value: '#334155' },
  { name: 'Dark Gray', value: '#1f2937' },
];

export function BlockBuilder({ blocks, onChange, theme = 'orange' }) {
  const [linkModal, setLinkModal] = useState({
    isOpen: false,
    text: '',
    url: '',
    blockIdx: -1,
    rowIdx: -1,
    colIdx: -1
  });

  const addBlock = (type) => {
    let newBlock;
    if (type === 'link') {
      newBlock = { type, label: '', url: '' };
    } else if (type === 'table') {
      newBlock = {
        type,
        tableData: {
          style: 'dates_fees',
          showTitle: false,
          titleText: '',
          titleBgColor: '#1e3a8a',
          titleTextColor: '#ffffff',
          colWidths: [50, 50],
          headers: JSON.parse(JSON.stringify(PRESET_DATES_FEES.headers)),
          rows: JSON.parse(JSON.stringify(PRESET_DATES_FEES.rows))
        }
      };
    } else {
      newBlock = { type, value: '' };
    }
    onChange([...blocks, newBlock]);
  };

  const updateBlock = (index, field, value) => {
    const updated = blocks.map((b, i) => i === index ? { ...b, [field]: value } : b);
    onChange(updated);
  };

  const removeBlock = (index) => onChange(blocks.filter((_, i) => i !== index));

  const moveBlock = (index, direction) => {
    const arr = [...blocks];
    const swapIdx = index + direction;
    if (swapIdx < 0 || swapIdx >= arr.length) return;
    [arr[index], arr[swapIdx]] = [arr[swapIdx], arr[index]];
    onChange(arr);
  };

  // Helper to handle table changes
  const updateTableData = (blockIdx, updaterFn) => {
    const block = blocks[blockIdx];
    const newTableData = updaterFn(block.tableData || { headers: [], rows: [[]] });
    updateBlock(blockIdx, 'tableData', newTableData);
  };

  // Presets mapping
  const applyPreset = (blockIdx, presetType) => {
    updateTableData(blockIdx, () => {
      if (presetType === 'dates_fees') return JSON.parse(JSON.stringify(PRESET_DATES_FEES));
      if (presetType === 'age_posts') return JSON.parse(JSON.stringify(PRESET_AGE_POSTS));
      if (presetType === 'vacancy_details') return JSON.parse(JSON.stringify(PRESET_VACANCY_DETAILS));
      
      // Custom Grid (default to 2x2 empty)
      return {
        style: 'custom',
        showTitle: false,
        titleText: '',
        titleBgColor: '#1e3a8a',
        titleTextColor: '#ffffff',
        colWidths: [50, 50],
        headers: [
          { text: 'Column 1', bgColor: '#334155', textColor: '#ffffff' },
          { text: 'Column 2', bgColor: '#334155', textColor: '#ffffff' }
        ],
        rows: [['', '']]
      };
    });
  };

  // Helper to get safe column widths
  const getColWidths = (tData) => {
    const colCount = tData.headers.length;
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

  // Update specific column width
  const updateColWidth = (blockIdx, colIdx, widthVal) => {
    updateTableData(blockIdx, (current) => {
      const widths = [...getColWidths(current)];
      widths[colIdx] = parseInt(widthVal) || 0;
      return {
        ...current,
        colWidths: widths
      };
    });
  };

  // Change columns in custom grid
  const setCustomColumns = (blockIdx, count) => {
    updateTableData(blockIdx, (current) => {
      const currentCols = current.headers.length;
      let newHeaders = [...current.headers];
      let newRows = current.rows.map(row => [...row]);
      let currentWidths = [...getColWidths(current)];

      if (count > currentCols) {
        // Add columns
        for (let i = currentCols; i < count; i++) {
          newHeaders.push({ text: `Column ${i + 1}`, bgColor: '#334155', textColor: '#ffffff' });
          newRows = newRows.map(row => [...row, '']);
          currentWidths.push(0); // will recalculate below
        }
      } else if (count < currentCols) {
        // Remove columns
        newHeaders = newHeaders.slice(0, count);
        newRows = newRows.map(row => row.slice(0, count));
        currentWidths = currentWidths.slice(0, count);
      }

      // Re-normalize width percentages
      const share = Math.floor(100 / count);
      const newWidths = Array(count).fill(share);
      const sum = newWidths.reduce((a, b) => a + b, 0);
      if (sum < 100) newWidths[count - 1] += (100 - sum);

      return {
        ...current,
        headers: newHeaders,
        rows: newRows,
        colWidths: newWidths
      };
    });
  };

  // Add row to table
  const addTableRow = (blockIdx) => {
    updateTableData(blockIdx, (current) => {
      const colCount = current.headers.length;
      const newRow = Array(colCount).fill('');
      return {
        ...current,
        rows: [...current.rows, newRow]
      };
    });
  };

  // Remove row from table
  const removeTableRow = (blockIdx, rowIdx) => {
    updateTableData(blockIdx, (current) => {
      if (current.rows.length <= 1) return current; // Keep at least 1 row
      return {
        ...current,
        rows: current.rows.filter((_, idx) => idx !== rowIdx)
      };
    });
  };

  // Update cell text
  const updateTableCell = (blockIdx, rowIdx, colIdx, value) => {
    updateTableData(blockIdx, (current) => {
      const newRows = current.rows.map((row, rIdx) => 
        rIdx === rowIdx 
          ? row.map((cell, cIdx) => cIdx === colIdx ? value : cell)
          : row
      );
      return {
        ...current,
        rows: newRows
      };
    });
  };

  // Update header text/colors
  const updateTableHeader = (blockIdx, colIdx, key, value) => {
    updateTableData(blockIdx, (current) => {
      const newHeaders = current.headers.map((hdr, cIdx) => 
        cIdx === colIdx ? { ...hdr, [key]: value } : hdr
      );
      return {
        ...current,
        headers: newHeaders
      };
    });
  };
  
  // Open custom modal for link insertion
  const openLinkModal = (blockIdx, rowIdx, colIdx) => {
    let initialText = '';
    const textarea = document.getElementById(`cell-textarea-${blockIdx}-${rowIdx}-${colIdx}`);
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      if (start !== end) {
        initialText = textarea.value.substring(start, end);
      }
    }
    setLinkModal({
      isOpen: true,
      text: initialText,
      url: '',
      blockIdx,
      rowIdx,
      colIdx
    });
  };

  // Perform link insertion from modal input
  const handleInsertLink = () => {
    const { blockIdx, rowIdx, colIdx, text, url } = linkModal;
    if (!text || !url) {
      setLinkModal({ isOpen: false, text: '', url: '', blockIdx: -1, rowIdx: -1, colIdx: -1 });
      return;
    }

    const textarea = document.getElementById(`cell-textarea-${blockIdx}-${rowIdx}-${colIdx}`);
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentVal = textarea.value;
      
      const linkText = `[${text}](${url})`;
      const newVal = currentVal.substring(0, start) + linkText + currentVal.substring(end);
      
      // Update cell state
      updateTableCell(blockIdx, rowIdx, colIdx, newVal);
      
      // Close modal
      setLinkModal({ isOpen: false, text: '', url: '', blockIdx: -1, rowIdx: -1, colIdx: -1 });
      
      // Focus textarea back and set cursor position after the link
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + linkText.length, start + linkText.length);
      }, 0);
    }
  };

  // Theme system definitions
  const themeStyles = {
    orange: {
      btnBg: '#fff7ed', btnColor: '#c2410c', btnBorder: '1px dashed #c2410c',
      badgeBg: '#ffedd5', badgeColor: '#c2410c'
    },
    green: {
      btnBg: '#f0fdf4', btnColor: '#15803d', btnBorder: '1px dashed #15803d',
      badgeBg: '#dcfce7', badgeColor: '#15803d'
    },
    purple: {
      btnBg: '#f5f3ff', btnColor: '#7c3aed', btnBorder: '1px dashed #7c3aed',
      badgeBg: '#f3e8ff', badgeColor: '#7c3aed'
    },
    blue: {
      btnBg: '#eff6ff', btnColor: '#2563eb', btnBorder: '1px dashed #2563eb',
      badgeBg: '#dbeafe', badgeColor: '#2563eb'
    }
  }[theme] || {
    btnBg: '#fff7ed', btnColor: '#c2410c', btnBorder: '1px dashed #c2410c',
    badgeBg: '#ffedd5', badgeColor: '#c2410c'
  };

  const BLOCK_TYPES = [
    { type: 'heading', label: 'Heading', icon: <Heading size={14} /> },
    { type: 'text',    label: 'Text',    icon: <Type size={14} /> },
    { type: 'link',    label: 'Link',    icon: <Link size={14} /> },
    { type: 'divider', label: 'Divider', icon: <Minus size={14} /> },
    { type: 'table',   label: 'Table',   icon: <Table size={14} /> },
  ];

  const iconBtn = {
    background: '#f3f4f6', border: 'none', borderRadius: 6,
    width: 24, height: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: 12, transition: 'all 0.15s ease'
  };

  return (
    <div style={{ marginTop: '0.5rem' }}>
      {/* Top action buttons to add blocks */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {BLOCK_TYPES.map(({ type, label, icon }) => (
          <button 
            key={type} 
            type="button" 
            onClick={() => addBlock(type)} 
            style={{
              display: 'flex', alignItems: 'center', gap: '0.3rem',
              background: themeStyles.btnBg, color: themeStyles.btnColor, border: themeStyles.btnBorder,
              borderRadius: 8, padding: '5px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              transition: 'transform 0.1s ease',
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.96)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {icon} + {label}
          </button>
        ))}
      </div>

      {blocks.length === 0 && (
        <div style={{ textAlign: 'center', color: '#aaa', padding: '1.5rem', background: '#fafafa', borderRadius: 10, border: '1px dashed #e5e7eb', fontSize: 13 }}>
          No blocks yet. Click above to add content blocks for the detail page.
        </div>
      )}

      {/* Render blocks list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {blocks.map((block, index) => {
          const isTable = block.type === 'table';
          const tableData = block.tableData || { headers: [], rows: [[]] };

          return (
            <div key={index} style={{ background: '#fafafa', borderRadius: 12, padding: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              {/* Header section of block card */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
                  background: block.type === 'heading' ? '#fef3c7' : block.type === 'link' ? themeStyles.badgeBg : block.type === 'divider' ? '#f3f4f6' : block.type === 'table' ? '#e0f2fe' : '#dcfce7',
                  color: block.type === 'heading' ? '#92400e' : block.type === 'link' ? themeStyles.badgeColor : block.type === 'divider' ? '#6b7280' : block.type === 'table' ? '#0369a1' : '#166534',
                  padding: '2px 8px', borderRadius: 4,
                }}>
                  {block.type}
                </span>
                <div style={{ display: 'flex', gap: '0.3rem' }}>
                  <button type="button" onClick={() => moveBlock(index, -1)} style={iconBtn} title="Move Up"><ArrowUp size={12} /></button>
                  <button type="button" onClick={() => moveBlock(index, 1)}  style={iconBtn} title="Move Down"><ArrowDown size={12} /></button>
                  <button type="button" onClick={() => removeBlock(index)}   style={{ ...iconBtn, color: '#dc2626' }} title="Delete Block"><X size={12} /></button>
                </div>
              </div>

              {/* Input section of block card */}
              {block.type === 'divider' && <hr style={{ borderColor: '#e5e7eb', margin: '8px 0' }} />}
              
              {block.type === 'heading' && (
                <input
                  className="form-input"
                  value={block.value || ''}
                  onChange={e => updateBlock(index, 'value', e.target.value)}
                  placeholder="Heading text..."
                  style={{ fontSize: 13, width: '100%', boxSizing: 'border-box' }}
                />
              )}
              {block.type === 'text' && (
                <textarea
                  className="form-input"
                  value={block.value || ''}
                  onChange={e => updateBlock(index, 'value', e.target.value)}
                  placeholder="Paragraph text (press Enter to write on multiple lines)..."
                  rows={4}
                  style={{ 
                    fontSize: 13, 
                    width: '100%', 
                    boxSizing: 'border-box', 
                    minHeight: '80px', 
                    resize: 'vertical', 
                    fontFamily: 'inherit',
                    lineHeight: '1.4',
                    padding: '8px'
                  }}
                />
              )}

              {block.type === 'link' && (
                <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                  <input className="form-input" value={block.label || ''} onChange={e => updateBlock(index, 'label', e.target.value)} placeholder="Button label (e.g. Apply Here)" style={{ fontSize: 13 }} />
                  <input className="form-input" value={block.url || ''}   onChange={e => updateBlock(index, 'url', e.target.value)}   placeholder="URL (e.g. https://...)" style={{ fontSize: 13 }} />
                </div>
              )}

              {/* TABLE BLOCK EDITOR */}
              {isTable && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                  {/* Preset layout selector */}
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#4b5563' }}>Table Template:</span>
                    <select
                      value={tableData.style || 'dates_fees'}
                      onChange={(e) => applyPreset(index, e.target.value)}
                      style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 12, background: '#fff', cursor: 'pointer' }}
                    >
                      <option value="dates_fees">Dates & Fees Layout (2 Cols)</option>
                      <option value="age_posts">Age Limits & Posts Layout (2 Cols)</option>
                      <option value="vacancy_details">Vacancy Details Table (2 Cols, Custom Title)</option>
                      <option value="custom">Custom Grid</option>
                    </select>

                    {tableData.style === 'custom' && (
                      <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center', marginLeft: '0.5rem' }}>
                        <span style={{ fontSize: 11, color: '#6b7280' }}>Columns:</span>
                        <select
                          value={tableData.headers.length}
                          onChange={(e) => setCustomColumns(index, parseInt(e.target.value))}
                          style={{ padding: '2px 4px', borderRadius: 4, border: '1px solid #d1d5db', fontSize: 11 }}
                        >
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Main Title Header Configuration (Toggleable) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#f8fafc', padding: '0.75rem', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input 
                        type="checkbox" 
                        id={`showTitle-${index}`}
                        checked={!!tableData.showTitle} 
                        onChange={(e) => updateTableData(index, t => ({ ...t, showTitle: e.target.checked }))} 
                        style={{ cursor: 'pointer' }}
                      />
                      <label htmlFor={`showTitle-${index}`} style={{ fontSize: 12, fontWeight: 700, color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Layout size={13} /> Show Main Header / Title (Full Width)
                      </label>
                    </div>
                    {tableData.showTitle && (
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', marginTop: '0.25rem' }}>
                        <input 
                          type="text" 
                          value={tableData.titleText || ''} 
                          onChange={(e) => updateTableData(index, t => ({ ...t, titleText: e.target.value }))} 
                          placeholder="e.g. BPSC School Teacher TRE 4.0 Recruitment 2026 : Education Qualification"
                          style={{ flex: 1, minWidth: '200px', padding: '6px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #cbd5e1' }}
                        />
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Bg:</span>
                          <input 
                            type="color" 
                            value={tableData.titleBgColor || '#1e3a8a'} 
                            onChange={(e) => updateTableData(index, t => ({ ...t, titleBgColor: e.target.value }))} 
                            style={{ width: '24px', height: '24px', padding: 0, border: 'none', cursor: 'pointer', background: 'transparent' }}
                            title="Title background color"
                          />
                          <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600, marginLeft: '0.25rem' }}>Text:</span>
                          <input 
                            type="color" 
                            value={tableData.titleTextColor || '#ffffff'} 
                            onChange={(e) => updateTableData(index, t => ({ ...t, titleTextColor: e.target.value }))} 
                            style={{ width: '24px', height: '24px', padding: 0, border: 'none', cursor: 'pointer', background: 'transparent' }}
                            title="Title text color"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Header Column Config */}
                  <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Palette size={13} /> Header Column Labels
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                      {tableData.headers.map((header, colIdx) => (
                        <div key={colIdx} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <span style={{ fontSize: 11, fontWeight: 600, minWidth: '60px', color: '#64748b' }}>Col {colIdx + 1}:</span>
                          <input
                            type="text"
                            value={header.text || ''}
                            onChange={(e) => updateTableHeader(index, colIdx, 'text', e.target.value)}
                            placeholder={`Header ${colIdx + 1} Label`}
                            style={{ flex: 1, padding: '4px 8px', fontSize: 12, borderRadius: 6, border: '1px solid #cbd5e1' }}
                          />
                          <select
                            value={header.bgColor || '#334155'}
                            onChange={(e) => updateTableHeader(index, colIdx, 'bgColor', e.target.value)}
                            style={{ padding: '4px', fontSize: 11, borderRadius: 6, border: '1px solid #cbd5e1', background: '#fff' }}
                          >
                            {COLOR_PALETTE.map(color => (
                              <option key={color.value} value={color.value}>{color.name}</option>
                            ))}
                            {!COLOR_PALETTE.some(c => c.value === header.bgColor) && (
                              <option value={header.bgColor}>Custom Color</option>
                            )}
                          </select>
                          {/* Custom Color Hex Input */}
                          <input
                            type="color"
                            value={header.bgColor || '#334155'}
                            onChange={(e) => updateTableHeader(index, colIdx, 'bgColor', e.target.value)}
                            style={{ width: '24px', height: '24px', padding: 0, border: 'none', cursor: 'pointer', background: 'transparent' }}
                            title="Choose custom background color"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column Width Ratios Config */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#f8fafc', padding: '0.75rem', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Column Width Ratios (%)</span>
                      {tableData.headers.length === 2 && (
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <button type="button" onClick={() => updateTableData(index, t => ({ ...t, colWidths: [50, 50] }))} style={{ fontSize: 10, padding: '2px 6px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 4, cursor: 'pointer' }}>Equal (50/50)</button>
                          <button type="button" onClick={() => updateTableData(index, t => ({ ...t, colWidths: [30, 70] }))} style={{ fontSize: 10, padding: '2px 6px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 4, cursor: 'pointer' }}>Left Narrow (30/70)</button>
                          <button type="button" onClick={() => updateTableData(index, t => ({ ...t, colWidths: [70, 30] }))} style={{ fontSize: 10, padding: '2px 6px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 4, cursor: 'pointer' }}>Right Narrow (70/30)</button>
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      {tableData.headers.map((hdr, colIdx) => {
                        const widths = getColWidths(tableData);
                        return (
                          <div key={colIdx} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 11 }}>
                            <span style={{ fontWeight: 600, color: '#64748b' }}>Col {colIdx + 1} ({hdr.text.substring(0, 10)}...):</span>
                            <input 
                              type="number" 
                              min="10" 
                              max="90"
                              value={widths[colIdx]} 
                              onChange={(e) => updateColWidth(index, colIdx, e.target.value)} 
                              style={{ width: '45px', padding: '2px 4px', fontSize: 11, borderRadius: 4, border: '1px solid #cbd5e1', textAlign: 'center' }}
                            />
                            <span>%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Table Content Editor */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>
                      Rows Content (Type markdown lists `*`, bold `**bold**`, or colors `[text](red)`)
                    </div>
                    {tableData.rows.map((row, rowIdx) => (
                      <div key={rowIdx} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#ffffff', padding: '0.75rem', borderRadius: 8, border: '1px solid #e2e8f0', position: 'relative' }}>
                        {/* Row management header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>Row {rowIdx + 1}</span>
                          {tableData.rows.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTableRow(index, rowIdx)}
                              style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
                              title="Delete Row"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>

                        {/* Cell textareas and previews side-by-side or stacked, sized by widths */}
                        <div style={{ 
                          display: 'grid', 
                          gridTemplateColumns: getColWidths(tableData).map(w => `${w}%`).join(' '), 
                          gap: '0.75rem' 
                        }}>
                          {row.map((cellText, colIdx) => (
                            <div key={colIdx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: 10, fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
                                  {tableData.headers[colIdx]?.text || `Col ${colIdx + 1}`}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => openLinkModal(index, rowIdx, colIdx)}
                                  style={{
                                    background: 'none', border: 'none', color: '#ea580c', cursor: 'pointer',
                                    fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px',
                                    padding: '2px 4px', borderRadius: 4, transition: 'background 0.15s'
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = '#ffedd5'}
                                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                                >
                                  <Link size={10} /> Add Link
                                </button>
                              </div>
                              <textarea
                                id={`cell-textarea-${index}-${rowIdx}-${colIdx}`}
                                value={cellText}
                                onChange={(e) => updateTableCell(index, rowIdx, colIdx, e.target.value)}
                                placeholder="Enter content..."
                                rows={5}
                                style={{
                                  padding: '6px', fontSize: 12, borderRadius: 6, border: '1px solid #cbd5e1',
                                  fontFamily: 'monospace', resize: 'vertical', width: '100%', boxSizing: 'border-box'
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addTableRow(index)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.2rem', justifyContent: 'center',
                        background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1',
                        borderRadius: 8, padding: '6px', fontSize: 11, fontWeight: 600, cursor: 'pointer',
                        marginTop: '0.25rem', width: 'fit-content'
                      }}
                    >
                      <Plus size={12} /> Add Row
                    </button>
                  </div>

                  {/* Full Table Live Preview */}
                  <div style={{ 
                    marginTop: '1rem', 
                    padding: '1rem', 
                    background: '#ffffff', 
                    borderRadius: 12, 
                    border: '1px solid #cbd5e1', 
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)' 
                  }}>
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', letterSpacing: '0.05em' }}>
                      FULL TABLE LIVE PREVIEW
                    </div>
                    <div style={{ 
                      width: '100%', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '8px', 
                      overflow: 'hidden', 
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)' 
                    }}>
                      {/* Main Title Header if enabled */}
                      {tableData.showTitle && tableData.titleText && (
                        <div style={{ 
                          padding: '10px', 
                          textAlign: 'center', 
                          fontWeight: 700, 
                          fontSize: '13px', 
                          backgroundColor: tableData.titleBgColor || '#1e3a8a', 
                          color: tableData.titleTextColor || '#ffffff',
                          borderBottom: '1px solid #e2e8f0'
                        }}>
                          {tableData.titleText}
                        </div>
                      )}
                      {/* Header Row */}
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: getColWidths(tableData).map(w => `${w}%`).join(' '),
                        borderBottom: '1px solid #cbd5e1' 
                      }}>
                        {tableData.headers.map((h, i) => (
                          <div key={i} style={{ 
                            padding: '8px', 
                            textAlign: 'center', 
                            fontWeight: 700, 
                            fontSize: '12px', 
                            backgroundColor: h.bgColor || '#1e293b', 
                            color: h.textColor || '#ffffff',
                            borderRight: i < tableData.headers.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none'
                          }}>
                            {h.text}
                          </div>
                        ))}
                      </div>
                      {/* Rows */}
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {tableData.rows.map((row, rowIdx) => (
                          <div key={rowIdx} style={{ 
                            display: 'grid', 
                            gridTemplateColumns: getColWidths(tableData).map(w => `${w}%`).join(' '),
                            borderBottom: rowIdx < tableData.rows.length - 1 ? '1px solid #e2e8f0' : 'none'
                          }}>
                            {row.map((cellText, colIdx) => (
                              <div key={colIdx} style={{ 
                                padding: '8px', 
                                backgroundColor: '#ffffff', 
                                borderRight: colIdx < row.length - 1 ? '1px solid #e2e8f0' : 'none',
                                overflowX: 'auto'
                              }}>
                                {parseCellContentPreview(cellText)}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Link Insertion Modal */}
      {linkModal.isOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 16,
            padding: '1.5rem',
            width: '100%',
            maxWidth: 400,
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>Insert Link</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b' }}>Link Text (to show in table):</label>
                <input 
                  type="text" 
                  value={linkModal.text} 
                  onChange={(e) => setLinkModal(prev => ({ ...prev, text: e.target.value }))}
                  placeholder="e.g. Apply Link"
                  style={{
                    padding: '8px 12px',
                    fontSize: 13,
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    outline: 'none',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                  autoFocus
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b' }}>Link URL:</label>
                <input 
                  type="text" 
                  value={linkModal.url} 
                  onChange={(e) => setLinkModal(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="e.g. www.google.com"
                  style={{
                    padding: '8px 12px',
                    fontSize: 13,
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    outline: 'none',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                onClick={() => setLinkModal({ isOpen: false, text: '', url: '', blockIdx: -1, rowIdx: -1, colIdx: -1 })}
                style={{
                  padding: '6px 12px',
                  fontSize: 12,
                  fontWeight: 600,
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#475569',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleInsertLink}
                disabled={!linkModal.text || !linkModal.url}
                style={{
                  padding: '6px 12px',
                  fontSize: 12,
                  fontWeight: 600,
                  borderRadius: 8,
                  border: 'none',
                  background: (!linkModal.text || !linkModal.url) ? '#cbd5e1' : '#ea580c',
                  color: '#ffffff',
                  cursor: (!linkModal.text || !linkModal.url) ? 'not-allowed' : 'pointer'
                }}
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlockBuilder;
