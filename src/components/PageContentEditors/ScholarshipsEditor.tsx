import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '../Common/Input';
import { ImageInput } from '../Common/ImageInput';
import { Plus, Trash2, Search, Settings, BookOpen, FileText, Users, Upload } from 'lucide-react';

interface ScholarRecord {
  name: string;
  academicYear: string;
  country: string;
  institution: string;
  course: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface ScholarshipsContent {
  meta: { title: string; description: string };
  hero: { title: string; subtitle: string; heroImage: string };
  programmeOverview: { heading: string; paragraphs: string[] };
  supportProvided: { heading: string; description: string };
  coreBelief: string;
  priorityAreas: { heading: string; items: { title: string; description: string }[] };
  programmeStats: { heading: string; stats: { label: string; value: string }[] };
  scopeOfScholarship: { heading: string; description: string; items: string[] };
  callForApplication: { heading: string; subheading: string; description: string; openingDate: string; closingDate: string };
  applicationProcedure: { heading: string; steps: { title: string; description: string }[] };
  eligibilityRequirements: { heading: string; items: string[] };
  academicRequirements: { heading: string; items: string[] };
  supportingDocuments: { heading: string; items: string[] };
  specialDispensation: { heading: string; description: string; items: string[] };
  applicationSteps: { heading: string; steps: string[] };
  disqualifyingFactors: { heading: string; items: string[] };
  fundingAndDuration: { heading: string; items: FAQItem[] };
  faqs: { heading: string; items: FAQItem[] };
  scholars: { heading: string; subheading: string; totalRecords: string; sampleData: ScholarRecord[] };
  contactInfo: { address: string; phone: string; email: string; website: string };
  cta: { heading: string; description: string; buttonText: string; buttonUrl: string };
}

interface ScholarshipsEditorProps {
  content: ScholarshipsContent;
  onChange: (content: ScholarshipsContent) => void;
}

const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

/* ─── Reusable: editable string list ─── */
function EditableList({ items, path, addLabel, onUpdate, onAdd, onRemove }: {
  items: string[];
  path: string;
  addLabel: string;
  onUpdate: (path: string, idx: number, val: string) => void;
  onAdd: (path: string, template: any) => void;
  onRemove: (path: string, idx: number) => void;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={idx} className="flex gap-2">
          <input type="text" value={item} onChange={(e) => onUpdate(path, idx, e.target.value)} className={inputClass} />
          <button type="button" onClick={() => onRemove(path, idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
        </div>
      ))}
      <button type="button" onClick={() => onAdd(path, '')} className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-medium mt-1"><Plus className="w-4 h-4" />{addLabel}</button>
    </div>
  );
}

export const ScholarshipsEditor: React.FC<ScholarshipsEditorProps> = ({ content, onChange }) => {
  const c = content || {} as ScholarshipsContent;
  const [editorTab, setEditorTab] = useState<'general' | 'overview' | 'apply' | 'scholars'>('general');
  const [scholarsPage, setScholarsPage] = useState(1);
  const [scholarsSearch, setScholarsSearch] = useState('');
  const [scholarsLoaded, setScholarsLoaded] = useState(false);
  const scholarsPerPage = 25;

  const update = (path: string, value: any) => {
    const keys = path.split('.');
    const newContent = { ...c };
    let current: any = newContent;
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    onChange(newContent);
  };

  const get = (path: string, fallback: any = '') => {
    const keys = path.split('.');
    let current: any = c;
    for (const key of keys) {
      if (current === undefined || current === null) return fallback;
      current = current[key];
    }
    return current ?? fallback;
  };

  const updateArrayItem = (path: string, index: number, value: any) => {
    const arr = [...(get(path, []) as any[])];
    arr[index] = value;
    update(path, arr);
  };

  const addArrayItem = (path: string, template: any) => {
    const arr = [...(get(path, []) as any[])];
    arr.push(template);
    update(path, arr);
  };

  const removeArrayItem = (path: string, index: number) => {
    const arr = (get(path, []) as any[]).filter((_: any, i: number) => i !== index);
    update(path, arr);
  };

  // Auto-load full scholars dataset if sampleData is empty or small
  useEffect(() => {
    if (editorTab === 'scholars' && !scholarsLoaded) {
      const currentData = get('scholars.sampleData', []) as ScholarRecord[];
      if (currentData.length < 100) {
        import('../../data/scholars.json')
          .then((module) => {
            const data = module.default as ScholarRecord[];
            // Must update both fields in a single onChange call to avoid the second overwriting the first
            const newContent = { ...c };
            newContent.scholars = {
              ...newContent.scholars,
              sampleData: data,
              totalRecords: data.length.toLocaleString(),
            };
            onChange(newContent);
            setScholarsLoaded(true);
          })
          .catch((err) => {
            console.error('Failed to load scholars.json:', err);
            setScholarsLoaded(true);
          });
      } else {
        setScholarsLoaded(true);
      }
    }
  }, [editorTab]);

  // CSV import handler
  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split('\n').filter(l => l.trim());
      if (lines.length < 2) return;
      const newScholars: ScholarRecord[] = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.replace(/^"|"$/g, '').trim());
        if (cols.length >= 5 && cols[0]) {
          newScholars.push({ name: cols[0], academicYear: cols[1] || '', country: cols[2] || '', institution: cols[3] || '', course: cols[4] || '' });
        }
      }
      if (newScholars.length > 0) {
        const existing = get('scholars.sampleData', []) as ScholarRecord[];
        update('scholars.sampleData', [...existing, ...newScholars]);
        update('scholars.totalRecords', (existing.length + newScholars.length).toLocaleString());
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  /* ─── Scholars pagination logic ─── */
  const allScholars = get('scholars.sampleData', []) as ScholarRecord[];

  const filteredWithIndices = useMemo(() => {
    if (!scholarsSearch) {
      return allScholars.map((s: ScholarRecord, i: number) => ({ scholar: s, originalIndex: i }));
    }
    const term = scholarsSearch.toLowerCase();
    return allScholars
      .map((s: ScholarRecord, i: number) => ({ scholar: s, originalIndex: i }))
      .filter(({ scholar }) =>
        (scholar.name || '').toLowerCase().includes(term) ||
        (scholar.institution || '').toLowerCase().includes(term) ||
        (scholar.course || '').toLowerCase().includes(term) ||
        (scholar.country || '').toLowerCase().includes(term)
      );
  }, [allScholars, scholarsSearch]);

  const totalScholarPages = Math.max(1, Math.ceil(filteredWithIndices.length / scholarsPerPage));
  const safePage = Math.min(scholarsPage, totalScholarPages);
  const startIdx = (safePage - 1) * scholarsPerPage;
  const pageScholars = filteredWithIndices.slice(startIdx, startIdx + scholarsPerPage);

  const getScholarPageNumbers = () => {
    const pages: (number | '...')[] = [];
    if (totalScholarPages <= 7) {
      for (let i = 1; i <= totalScholarPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push('...');
      for (let i = Math.max(2, safePage - 1); i <= Math.min(totalScholarPages - 1, safePage + 1); i++) pages.push(i);
      if (safePage < totalScholarPages - 2) pages.push('...');
      pages.push(totalScholarPages);
    }
    return pages;
  };

  const tabs = [
    { id: 'general' as const, label: 'General', icon: Settings },
    { id: 'overview' as const, label: 'Overview', icon: BookOpen },
    { id: 'apply' as const, label: 'How to Apply', icon: FileText },
    { id: 'scholars' as const, label: 'Scholars', icon: Users, badge: allScholars.length > 0 ? allScholars.length.toLocaleString() : undefined },
  ];

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-0 -mb-px">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setEditorTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                editorTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.badge && <span className="ml-1 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">{tab.badge}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* ═══════════ GENERAL TAB ═══════════ */}
      {editorTab === 'general' && (
        <div className="space-y-6">
          {/* SEO */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">SEO & Meta</h3>
            <div className="space-y-3">
              <Input type="text" label="Page Title" value={get('meta.title')} onChange={(e) => update('meta.title', e.target.value)} />
              <div>
                <label className={labelClass}>Meta Description</label>
                <textarea value={get('meta.description')} onChange={(e) => update('meta.description', e.target.value)} rows={2} className={inputClass} />
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Hero */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Hero Banner</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input type="text" label="Title" value={get('hero.title')} onChange={(e) => update('hero.title', e.target.value)} />
                <Input type="text" label="Subtitle" value={get('hero.subtitle')} onChange={(e) => update('hero.subtitle', e.target.value)} />
              </div>
              <div>
                <ImageInput
                  label="Hero Image"
                  value={get('hero.heroImage') || ''}
                  onChange={(value: string) => update('hero.heroImage', value)}
                  placeholder="/images/scholarship/scholarship-programme-hero.jpg"
                />
                {get('hero.heroImage') && (
                  <img src={get('hero.heroImage')} alt="Hero" className="w-full h-40 object-cover rounded-lg border mt-2" />
                )}
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* CTA */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Call to Action</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input type="text" label="Heading" value={get('cta.heading')} onChange={(e) => update('cta.heading', e.target.value)} />
                <Input type="text" label="Button Text" value={get('cta.buttonText')} onChange={(e) => update('cta.buttonText', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea value={get('cta.description')} onChange={(e) => update('cta.description', e.target.value)} rows={2} className={inputClass} />
              </div>
              <Input type="text" label="Button URL" value={get('cta.buttonUrl')} onChange={(e) => update('cta.buttonUrl', e.target.value)} />
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Contact Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <Input type="text" label="Address" value={get('contactInfo.address')} onChange={(e) => update('contactInfo.address', e.target.value)} />
              <Input type="text" label="Phone" value={get('contactInfo.phone')} onChange={(e) => update('contactInfo.phone', e.target.value)} />
              <Input type="text" label="Email" value={get('contactInfo.email')} onChange={(e) => update('contactInfo.email', e.target.value)} />
              <Input type="text" label="Website" value={get('contactInfo.website')} onChange={(e) => update('contactInfo.website', e.target.value)} />
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ OVERVIEW TAB ═══════════ */}
      {editorTab === 'overview' && (
        <div className="space-y-6">
          {/* Programme Overview */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Programme Overview</h3>
            <div className="space-y-3">
              <Input type="text" label="Heading" value={get('programmeOverview.heading')} onChange={(e) => update('programmeOverview.heading', e.target.value)} />
              <div>
                <label className={labelClass}>Paragraphs</label>
                {(get('programmeOverview.paragraphs', []) as string[]).map((p, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <textarea value={p} onChange={(e) => updateArrayItem('programmeOverview.paragraphs', idx, e.target.value)} rows={2} className={`flex-1 ${inputClass}`} />
                    <button type="button" onClick={() => removeArrayItem('programmeOverview.paragraphs', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg self-start"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
                <button type="button" onClick={() => addArrayItem('programmeOverview.paragraphs', '')} className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-medium"><Plus className="w-4 h-4" />Add Paragraph</button>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Core Belief */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Core Belief</h3>
            <textarea value={get('coreBelief')} onChange={(e) => update('coreBelief', e.target.value)} rows={2} placeholder="Featured quote..." className={inputClass} />
          </div>

          <hr className="border-gray-200" />

          {/* Support Provided */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Support Provided</h3>
            <div className="space-y-3">
              <Input type="text" label="Heading" value={get('supportProvided.heading')} onChange={(e) => update('supportProvided.heading', e.target.value)} />
              <div>
                <label className={labelClass}>Description</label>
                <textarea value={get('supportProvided.description')} onChange={(e) => update('supportProvided.description', e.target.value)} rows={2} className={inputClass} />
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Priority Areas */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Priority Areas</h3>
            <div className="space-y-3">
              <Input type="text" label="Heading" value={get('priorityAreas.heading')} onChange={(e) => update('priorityAreas.heading', e.target.value)} />
              {(get('priorityAreas.items', []) as any[]).map((item, idx) => (
                <div key={idx} className="flex gap-2 items-start bg-gray-50 rounded-lg p-3">
                  <div className="flex-1 space-y-2">
                    <input type="text" value={item.title || ''} placeholder="Title" onChange={(e) => updateArrayItem('priorityAreas.items', idx, { ...item, title: e.target.value })} className={inputClass} />
                    <input type="text" value={item.description || ''} placeholder="Description" onChange={(e) => updateArrayItem('priorityAreas.items', idx, { ...item, description: e.target.value })} className={inputClass} />
                  </div>
                  <button type="button" onClick={() => removeArrayItem('priorityAreas.items', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('priorityAreas.items', { title: '', description: '' })} className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-medium"><Plus className="w-4 h-4" />Add Area</button>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Programme Stats */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Programme Statistics</h3>
            <div className="space-y-3">
              <Input type="text" label="Heading" value={get('programmeStats.heading')} onChange={(e) => update('programmeStats.heading', e.target.value)} />
              {(get('programmeStats.stats', []) as any[]).map((stat, idx) => (
                <div key={idx} className="flex gap-2 items-end">
                  <div className="flex-1"><input type="text" value={stat.label || ''} placeholder="Label" onChange={(e) => updateArrayItem('programmeStats.stats', idx, { ...stat, label: e.target.value })} className={inputClass} /></div>
                  <div className="w-28"><input type="text" value={stat.value || ''} placeholder="Value" onChange={(e) => updateArrayItem('programmeStats.stats', idx, { ...stat, value: e.target.value })} className={inputClass} /></div>
                  <button type="button" onClick={() => removeArrayItem('programmeStats.stats', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('programmeStats.stats', { label: '', value: '' })} className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-medium"><Plus className="w-4 h-4" />Add Stat</button>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Scope of Scholarship */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Scope of Scholarship</h3>
            <div className="space-y-3">
              <Input type="text" label="Heading" value={get('scopeOfScholarship.heading')} onChange={(e) => update('scopeOfScholarship.heading', e.target.value)} />
              <div>
                <label className={labelClass}>Description</label>
                <textarea value={get('scopeOfScholarship.description')} onChange={(e) => update('scopeOfScholarship.description', e.target.value)} rows={2} className={inputClass} />
              </div>
              <EditableList items={get('scopeOfScholarship.items', [])} path="scopeOfScholarship.items" addLabel="Add Item" onUpdate={updateArrayItem} onAdd={addArrayItem} onRemove={removeArrayItem} />
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ HOW TO APPLY TAB ═══════════ */}
      {editorTab === 'apply' && (
        <div className="space-y-6">
          {/* Call for Application */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Call for Application</h3>
            <div className="space-y-3">
              <Input type="text" label="Heading" value={get('callForApplication.heading')} onChange={(e) => update('callForApplication.heading', e.target.value)} />
              <Input type="text" label="Subheading" value={get('callForApplication.subheading')} onChange={(e) => update('callForApplication.subheading', e.target.value)} />
              <div>
                <label className={labelClass}>Description</label>
                <textarea value={get('callForApplication.description')} onChange={(e) => update('callForApplication.description', e.target.value)} rows={2} className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input type="text" label="Opening Date" value={get('callForApplication.openingDate')} onChange={(e) => update('callForApplication.openingDate', e.target.value)} />
                <Input type="text" label="Closing Date" value={get('callForApplication.closingDate')} onChange={(e) => update('callForApplication.closingDate', e.target.value)} />
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Application Procedure */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Application Procedure</h3>
            <div className="space-y-3">
              <Input type="text" label="Heading" value={get('applicationProcedure.heading')} onChange={(e) => update('applicationProcedure.heading', e.target.value)} />
              {(get('applicationProcedure.steps', []) as any[]).map((step, idx) => (
                <div key={idx} className="flex gap-2 items-start bg-gray-50 rounded-lg p-3">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex-shrink-0 mt-1">{idx + 1}</span>
                  <div className="flex-1 space-y-2">
                    <input type="text" value={step.title || ''} placeholder="Step title" onChange={(e) => updateArrayItem('applicationProcedure.steps', idx, { ...step, title: e.target.value })} className={inputClass} />
                    <textarea value={step.description || ''} placeholder="Description" onChange={(e) => updateArrayItem('applicationProcedure.steps', idx, { ...step, description: e.target.value })} rows={2} className={inputClass} />
                  </div>
                  <button type="button" onClick={() => removeArrayItem('applicationProcedure.steps', idx)} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('applicationProcedure.steps', { title: '', description: '' })} className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-medium"><Plus className="w-4 h-4" />Add Step</button>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Requirements - grouped together */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Eligibility Requirements</h3>
            <div className="space-y-3">
              <Input type="text" label="Heading" value={get('eligibilityRequirements.heading')} onChange={(e) => update('eligibilityRequirements.heading', e.target.value)} />
              <EditableList items={get('eligibilityRequirements.items', [])} path="eligibilityRequirements.items" addLabel="Add Requirement" onUpdate={updateArrayItem} onAdd={addArrayItem} onRemove={removeArrayItem} />
            </div>
          </div>

          <hr className="border-gray-200" />

          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Academic Requirements</h3>
            <div className="space-y-3">
              <Input type="text" label="Heading" value={get('academicRequirements.heading')} onChange={(e) => update('academicRequirements.heading', e.target.value)} />
              <EditableList items={get('academicRequirements.items', [])} path="academicRequirements.items" addLabel="Add Requirement" onUpdate={updateArrayItem} onAdd={addArrayItem} onRemove={removeArrayItem} />
            </div>
          </div>

          <hr className="border-gray-200" />

          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Supporting Documents</h3>
            <div className="space-y-3">
              <Input type="text" label="Heading" value={get('supportingDocuments.heading')} onChange={(e) => update('supportingDocuments.heading', e.target.value)} />
              <EditableList items={get('supportingDocuments.items', [])} path="supportingDocuments.items" addLabel="Add Document" onUpdate={updateArrayItem} onAdd={addArrayItem} onRemove={removeArrayItem} />
            </div>
          </div>

          <hr className="border-gray-200" />

          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Special Dispensation</h3>
            <div className="space-y-3">
              <Input type="text" label="Heading" value={get('specialDispensation.heading')} onChange={(e) => update('specialDispensation.heading', e.target.value)} />
              <Input type="text" label="Description" value={get('specialDispensation.description')} onChange={(e) => update('specialDispensation.description', e.target.value)} />
              <EditableList items={get('specialDispensation.items', [])} path="specialDispensation.items" addLabel="Add Item" onUpdate={updateArrayItem} onAdd={addArrayItem} onRemove={removeArrayItem} />
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Application Steps */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Application Steps</h3>
            <div className="space-y-3">
              <Input type="text" label="Heading" value={get('applicationSteps.heading')} onChange={(e) => update('applicationSteps.heading', e.target.value)} />
              {(get('applicationSteps.steps', []) as string[]).map((step, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-800 text-xs font-bold flex-shrink-0">{idx + 1}</span>
                  <input type="text" value={step} onChange={(e) => updateArrayItem('applicationSteps.steps', idx, e.target.value)} className={`flex-1 ${inputClass}`} />
                  <button type="button" onClick={() => removeArrayItem('applicationSteps.steps', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('applicationSteps.steps', '')} className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-medium"><Plus className="w-4 h-4" />Add Step</button>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Disqualifying Factors */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Disqualifying Factors</h3>
            <div className="space-y-3">
              <Input type="text" label="Heading" value={get('disqualifyingFactors.heading')} onChange={(e) => update('disqualifyingFactors.heading', e.target.value)} />
              <EditableList items={get('disqualifyingFactors.items', [])} path="disqualifyingFactors.items" addLabel="Add Factor" onUpdate={updateArrayItem} onAdd={addArrayItem} onRemove={removeArrayItem} />
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Funding & Duration */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Funding & Duration</h3>
            <div className="space-y-3">
              <Input type="text" label="Heading" value={get('fundingAndDuration.heading')} onChange={(e) => update('fundingAndDuration.heading', e.target.value)} />
              {(get('fundingAndDuration.items', []) as FAQItem[]).map((item, idx) => (
                <div key={idx} className="flex gap-2 items-start bg-gray-50 rounded-lg p-3">
                  <div className="flex-1 space-y-2">
                    <input type="text" value={item.question || ''} placeholder="Title" onChange={(e) => updateArrayItem('fundingAndDuration.items', idx, { ...item, question: e.target.value })} className={inputClass} />
                    <textarea value={item.answer || ''} placeholder="Answer" onChange={(e) => updateArrayItem('fundingAndDuration.items', idx, { ...item, answer: e.target.value })} rows={2} className={inputClass} />
                  </div>
                  <button type="button" onClick={() => removeArrayItem('fundingAndDuration.items', idx)} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('fundingAndDuration.items', { question: '', answer: '' })} className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-medium"><Plus className="w-4 h-4" />Add Item</button>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* FAQs */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Frequently Asked Questions</h3>
            <div className="space-y-3">
              <Input type="text" label="Heading" value={get('faqs.heading')} onChange={(e) => update('faqs.heading', e.target.value)} />
              {(get('faqs.items', []) as FAQItem[]).map((item, idx) => (
                <div key={idx} className="flex gap-2 items-start bg-gray-50 rounded-lg p-3">
                  <div className="flex-1 space-y-2">
                    <input type="text" value={item.question || ''} placeholder="Question" onChange={(e) => updateArrayItem('faqs.items', idx, { ...item, question: e.target.value })} className={inputClass} />
                    <textarea value={item.answer || ''} placeholder="Answer" onChange={(e) => updateArrayItem('faqs.items', idx, { ...item, answer: e.target.value })} rows={2} className={inputClass} />
                  </div>
                  <button type="button" onClick={() => removeArrayItem('faqs.items', idx)} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('faqs.items', { question: '', answer: '' })} className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-medium"><Plus className="w-4 h-4" />Add FAQ</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ SCHOLARS TAB ═══════════ */}
      {editorTab === 'scholars' && (
        <div className="space-y-4">
          {/* Header fields */}
          <div className="grid grid-cols-3 gap-3">
            <Input type="text" label="Heading" value={get('scholars.heading')} onChange={(e) => update('scholars.heading', e.target.value)} />
            <Input type="text" label="Subheading" value={get('scholars.subheading')} onChange={(e) => update('scholars.subheading', e.target.value)} />
            <Input type="text" label="Total Records Display" value={get('scholars.totalRecords')} onChange={(e) => update('scholars.totalRecords', e.target.value)} />
          </div>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-700">{allScholars.length.toLocaleString()} scholars</span>
              {!scholarsLoaded && editorTab === 'scholars' && (
                <span className="text-xs text-blue-600 animate-pulse">Loading full dataset...</span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, institution, course..."
                  value={scholarsSearch}
                  onChange={(e) => { setScholarsSearch(e.target.value); setScholarsPage(1); }}
                  className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-green-700 hover:text-green-800 cursor-pointer bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg">
                <Upload className="w-3.5 h-3.5" />
                Import CSV
                <input type="file" accept=".csv" onChange={handleCSVImport} className="hidden" />
              </label>
              <button type="button" onClick={() => { addArrayItem('scholars.sampleData', { name: '', academicYear: '', country: '', institution: '', course: '' }); setScholarsPage(totalScholarPages); }} className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg">
                <Plus className="w-3.5 h-3.5" />Add Scholar
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 w-12">#</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500">Name</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 w-28">Year</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 w-24">Country</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500">Institution</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500">Course</th>
                  <th className="px-3 py-2.5 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {pageScholars.map(({ scholar, originalIndex }) => (
                  <tr key={originalIndex} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="px-3 py-1.5 text-xs text-gray-400 font-mono">{originalIndex + 1}</td>
                    <td className="px-2 py-1.5"><input type="text" value={scholar.name || ''} onChange={(e) => updateArrayItem('scholars.sampleData', originalIndex, { ...scholar, name: e.target.value })} className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" /></td>
                    <td className="px-2 py-1.5"><input type="text" value={scholar.academicYear || ''} onChange={(e) => updateArrayItem('scholars.sampleData', originalIndex, { ...scholar, academicYear: e.target.value })} className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" /></td>
                    <td className="px-2 py-1.5"><input type="text" value={scholar.country || ''} onChange={(e) => updateArrayItem('scholars.sampleData', originalIndex, { ...scholar, country: e.target.value })} className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" /></td>
                    <td className="px-2 py-1.5"><input type="text" value={scholar.institution || ''} onChange={(e) => updateArrayItem('scholars.sampleData', originalIndex, { ...scholar, institution: e.target.value })} className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" /></td>
                    <td className="px-2 py-1.5"><input type="text" value={scholar.course || ''} onChange={(e) => updateArrayItem('scholars.sampleData', originalIndex, { ...scholar, course: e.target.value })} className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" /></td>
                    <td className="px-2 py-1.5"><button type="button" onClick={() => removeArrayItem('scholars.sampleData', originalIndex)} className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button></td>
                  </tr>
                ))}
                {pageScholars.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">{scholarsSearch ? 'No scholars match your search.' : 'No scholar records yet. Click "Add Scholar" or "Import CSV" to get started.'}</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredWithIndices.length > scholarsPerPage && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-gray-500">
                Showing {startIdx + 1}–{Math.min(startIdx + scholarsPerPage, filteredWithIndices.length)} of {filteredWithIndices.length.toLocaleString()}{scholarsSearch ? ' matching' : ''} scholars
              </p>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => setScholarsPage(1)} disabled={safePage === 1} className="px-2 py-1 text-xs rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">First</button>
                <button type="button" onClick={() => setScholarsPage(p => Math.max(1, p - 1))} disabled={safePage === 1} className="px-2.5 py-1 text-xs rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">Prev</button>
                {getScholarPageNumbers().map((page, pIdx) =>
                  page === '...' ? (
                    <span key={`e-${pIdx}`} className="px-1.5 py-1 text-xs text-gray-400">...</span>
                  ) : (
                    <button key={page} type="button" onClick={() => setScholarsPage(page)} className={`px-2.5 py-1 text-xs rounded border ${safePage === page ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>{page}</button>
                  )
                )}
                <button type="button" onClick={() => setScholarsPage(p => Math.min(totalScholarPages, p + 1))} disabled={safePage === totalScholarPages} className="px-2.5 py-1 text-xs rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
                <button type="button" onClick={() => setScholarsPage(totalScholarPages)} disabled={safePage === totalScholarPages} className="px-2 py-1 text-xs rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">Last</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
