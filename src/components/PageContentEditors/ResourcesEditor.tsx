import React, { useState, useRef } from 'react';
import { Input } from '../Common/Input';
import { Plus, Trash2, ChevronDown, ChevronUp, FileText, FileCheck, Calendar, Upload, Loader2 } from 'lucide-react';
import { Button } from '../Common/Button';
import mediaService from '../../services/mediaService';

interface ResourceDocument {
  id: string;
  title: string;
  description: string;
  category: string;
  fileSize: string;
  pages: number;
  fileType: string;
  publishedDate: string;
  downloadUrl: string;
}

interface ResourceCategory {
  title: string;
  description: string;
  documents: ResourceDocument[];
}

interface ResourcesContent {
  // Hero Section
  heroTitle?: string;
  heroSubtitle?: string;

  // Stats
  stats?: {
    documentsAvailable?: number;
    policyDocuments?: number;
    researchStudies?: number;
    annualReports?: number;
  };

  // Document Categories
  annualReports?: ResourceCategory;
  policiesGuidelines?: ResourceCategory;
  researchStudies?: ResourceCategory;
  strategicPublications?: ResourceCategory;

  // Newsletter Subscription
  newsletterTitle?: string;
  newsletterSubtitle?: string;
  newsletterPlaceholder?: string;
  newsletterButtonText?: string;
  newsletterFooterText?: string;
  newsletterContactEmail?: string;
  newsletterContactPhone?: string;
}

interface ResourcesEditorProps {
  content: ResourcesContent;
  onChange: (content: ResourcesContent) => void;
}

type TabKey = 'hero' | 'stats' | 'annual-reports' | 'policies' | 'research' | 'strategic' | 'newsletter';

// File Upload Component for Documents
interface FileUploadProps {
  onUploadSuccess: (url: string, fileSize: string, fileType: string) => void;
  currentUrl?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess, currentUrl }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileType = (mimeType: string): string => {
    if (mimeType.includes('pdf')) return 'PDF';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'DOCX';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'XLSX';
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'PPTX';
    return mimeType.split('/')[1]?.toUpperCase() || 'FILE';
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate file type - allow documents
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF, Word, Excel, or PowerPoint document.');
      return;
    }

    // Validate file size (max 50MB for documents)
    const maxSizeBytes = 50 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError('File too large. Maximum size is 50MB.');
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 150);

      const media = await mediaService.upload(file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Get the full URL
      const fullUrl = mediaService.getFullUrl(media.url);

      setTimeout(() => {
        onUploadSuccess(fullUrl, formatFileSize(file.size), getFileType(file.type));
        setIsUploading(false);
        setUploadProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 300);
    } catch (err: any) {
      setIsUploading(false);
      setUploadProgress(0);
      setError(err.response?.data?.error || 'Failed to upload file');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
          onChange={handleFileSelect}
        />
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          variant="secondary"
          size="sm"
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload File
            </>
          )}
        </Button>
        {currentUrl && (
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline truncate max-w-[200px]"
          >
            View current file
          </a>
        )}
      </div>

      {isUploading && (
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      <p className="text-xs text-gray-500">
        Supported: PDF, Word, Excel, PowerPoint (max 50MB)
      </p>
    </div>
  );
};

// Document Editor Component
interface DocumentEditorProps {
  documents: ResourceDocument[];
  onChange: (documents: ResourceDocument[]) => void;
  categoryLabel: string;
  defaultCategory: string;
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({ documents, onChange, categoryLabel, defaultCategory }) => {
  const [expandedDocs, setExpandedDocs] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedDocs);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedDocs(newExpanded);
  };

  const addDocument = () => {
    const newDoc: ResourceDocument = {
      id: `doc-${Date.now()}`,
      title: '',
      description: '',
      category: defaultCategory,
      fileSize: '',
      pages: 0,
      fileType: 'PDF',
      publishedDate: '',
      downloadUrl: ''
    };
    onChange([...documents, newDoc]);
    setExpandedDocs(new Set([...expandedDocs, newDoc.id]));
  };

  const updateDocument = (id: string, updates: Partial<ResourceDocument>) => {
    onChange(documents.map(doc => doc.id === id ? { ...doc, ...updates } : doc));
  };

  const removeDocument = (id: string) => {
    onChange(documents.filter(doc => doc.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">{documents.length} document(s)</p>
        <Button onClick={addDocument} variant="secondary" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Document
        </Button>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">No documents added yet.</p>
          <p className="text-xs mt-1">Click "Add Document" to add your first {categoryLabel}.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((doc, index) => (
            <div key={doc.id} className="border border-gray-200 rounded-lg bg-white overflow-hidden">
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleExpanded(doc.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {doc.title || 'Untitled Document'}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {doc.fileType} • {doc.fileSize || 'Size not set'} • {doc.publishedDate || 'Date not set'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeDocument(doc.id);
                    }}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {expandedDocs.has(doc.id) ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>

              {expandedDocs.has(doc.id) && (
                <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Document Title"
                      value={doc.title}
                      onChange={(e) => updateDocument(doc.id, { title: e.target.value })}
                      placeholder="e.g., GETFund Annual Report 2023"
                    />
                    <Input
                      label="Category Label"
                      value={doc.category}
                      onChange={(e) => updateDocument(doc.id, { category: e.target.value })}
                      placeholder={defaultCategory}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={doc.description}
                      onChange={(e) => updateDocument(doc.id, { description: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Brief description of the document..."
                    />
                  </div>

                  {/* File Upload Section */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Document File
                    </label>
                    <FileUpload
                      currentUrl={doc.downloadUrl}
                      onUploadSuccess={(url, fileSize, fileType) => {
                        updateDocument(doc.id, {
                          downloadUrl: url,
                          fileSize: fileSize,
                          fileType: fileType
                        });
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Input
                      label="File Type"
                      value={doc.fileType}
                      onChange={(e) => updateDocument(doc.id, { fileType: e.target.value })}
                      placeholder="PDF"
                    />
                    <Input
                      label="File Size"
                      value={doc.fileSize}
                      onChange={(e) => updateDocument(doc.id, { fileSize: e.target.value })}
                      placeholder="2.4 MB"
                    />
                    <Input
                      label="Pages"
                      type="number"
                      value={doc.pages.toString()}
                      onChange={(e) => updateDocument(doc.id, { pages: parseInt(e.target.value) || 0 })}
                      placeholder="98"
                    />
                    <Input
                      label="Published Date"
                      value={doc.publishedDate}
                      onChange={(e) => updateDocument(doc.id, { publishedDate: e.target.value })}
                      placeholder="Jan 2024"
                    />
                  </div>

                  <Input
                    label="Download URL (auto-filled on upload, or enter manually)"
                    value={doc.downloadUrl}
                    onChange={(e) => updateDocument(doc.id, { downloadUrl: e.target.value })}
                    placeholder="/resources/pdfs/document.pdf or https://..."
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const ResourcesEditor: React.FC<ResourcesEditorProps> = ({ content, onChange }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('hero');

  const updateContent = (updates: Partial<ResourcesContent>) => {
    onChange({ ...content, ...updates });
  };

  const updateStats = (updates: Partial<NonNullable<ResourcesContent['stats']>>) => {
    updateContent({
      stats: { ...content.stats, ...updates }
    });
  };

  const updateCategory = (
    key: 'annualReports' | 'policiesGuidelines' | 'researchStudies' | 'strategicPublications',
    updates: Partial<ResourceCategory>
  ) => {
    updateContent({
      [key]: { ...content[key], ...updates }
    });
  };

  const tabs = [
    { key: 'hero' as TabKey, label: 'Page Header' },
    { key: 'stats' as TabKey, label: 'Statistics' },
    { key: 'annual-reports' as TabKey, label: 'Annual Reports', icon: <FileText className="w-4 h-4" /> },
    { key: 'policies' as TabKey, label: 'Policies', icon: <FileCheck className="w-4 h-4" /> },
    { key: 'research' as TabKey, label: 'Research', icon: <FileText className="w-4 h-4" /> },
    { key: 'strategic' as TabKey, label: 'Strategic', icon: <Calendar className="w-4 h-4" /> },
    { key: 'newsletter' as TabKey, label: 'Newsletter' },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`
                whitespace-nowrap py-3 px-3 border-b-2 font-medium text-sm flex items-center gap-1.5
                ${activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-4">
        {/* Hero Section Tab */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Page Header</h3>
              <p className="text-sm text-gray-500 mt-1">
                Configure the page title and subtitle displayed at the top of the Resources page.
              </p>
            </div>

            {/* Preview */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                Preview
              </div>
              <div className="bg-white p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {content.heroTitle || 'Resources & Publications'}
                </h1>
                <div className="w-16 h-1 mb-3" style={{ backgroundColor: '#2a3f75' }} />
                <p className="text-gray-600 max-w-2xl">
                  {content.heroSubtitle || 'Access our comprehensive collection of reports, policies, research studies, and strategic documents.'}
                </p>
              </div>
            </div>

            <Input
              label="Page Title"
              value={content.heroTitle || ''}
              onChange={(e) => updateContent({ heroTitle: e.target.value })}
              placeholder="Resources & Publications"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Subtitle
              </label>
              <textarea
                value={content.heroSubtitle || ''}
                onChange={(e) => updateContent({ heroSubtitle: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Access our comprehensive collection of reports, policies, research studies, and strategic documents."
              />
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Resource Statistics</h3>
              <p className="text-sm text-gray-500 mt-1">
                Display key metrics about the resources available. These appear in a row below the page header.
              </p>
            </div>

            {/* Preview */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                Preview
              </div>
              <div className="bg-blue-50/30 p-6">
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold" style={{ color: '#2a3f75' }}>
                      {content.stats?.documentsAvailable || 50}+
                    </div>
                    <div className="text-gray-600 text-xs">Documents</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold" style={{ color: '#2a3f75' }}>
                      {content.stats?.policyDocuments || 15}
                    </div>
                    <div className="text-gray-600 text-xs">Policies</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold" style={{ color: '#2a3f75' }}>
                      {content.stats?.researchStudies || 25}
                    </div>
                    <div className="text-gray-600 text-xs">Research Studies</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold" style={{ color: '#2a3f75' }}>
                      {content.stats?.annualReports || 12}
                    </div>
                    <div className="text-gray-600 text-xs">Annual Reports</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Documents Available"
                type="number"
                value={content.stats?.documentsAvailable?.toString() || '50'}
                onChange={(e) => updateStats({ documentsAvailable: parseInt(e.target.value) || 0 })}
                placeholder="50"
              />
              <Input
                label="Policy Documents"
                type="number"
                value={content.stats?.policyDocuments?.toString() || '15'}
                onChange={(e) => updateStats({ policyDocuments: parseInt(e.target.value) || 0 })}
                placeholder="15"
              />
              <Input
                label="Research Studies"
                type="number"
                value={content.stats?.researchStudies?.toString() || '25'}
                onChange={(e) => updateStats({ researchStudies: parseInt(e.target.value) || 0 })}
                placeholder="25"
              />
              <Input
                label="Annual Reports"
                type="number"
                value={content.stats?.annualReports?.toString() || '12'}
                onChange={(e) => updateStats({ annualReports: parseInt(e.target.value) || 0 })}
                placeholder="12"
              />
            </div>
          </div>
        )}

        {/* Annual Reports Tab */}
        {activeTab === 'annual-reports' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Annual Reports Section</h3>
              <p className="text-sm text-gray-500 mt-1">
                Manage the annual reports section with downloadable documents.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Section Title"
                value={content.annualReports?.title || ''}
                onChange={(e) => updateCategory('annualReports', { title: e.target.value })}
                placeholder="Annual Reports"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Description</label>
                <textarea
                  value={content.annualReports?.description || ''}
                  onChange={(e) => updateCategory('annualReports', { description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Comprehensive yearly summaries of our activities, achievements, and financial performance"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-medium text-gray-900 mb-4">Documents</h4>
              <DocumentEditor
                documents={content.annualReports?.documents || []}
                onChange={(documents) => updateCategory('annualReports', { documents })}
                categoryLabel="annual report"
                defaultCategory="Annual Report"
              />
            </div>
          </div>
        )}

        {/* Policies & Guidelines Tab */}
        {activeTab === 'policies' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Policies & Guidelines Section</h3>
              <p className="text-sm text-gray-500 mt-1">
                Manage policy documents and official guidelines.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Section Title"
                value={content.policiesGuidelines?.title || ''}
                onChange={(e) => updateCategory('policiesGuidelines', { title: e.target.value })}
                placeholder="Policies & Guidelines"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Description</label>
                <textarea
                  value={content.policiesGuidelines?.description || ''}
                  onChange={(e) => updateCategory('policiesGuidelines', { description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Official policies, guidelines, and frameworks governing our operations and programs"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-medium text-gray-900 mb-4">Documents</h4>
              <DocumentEditor
                documents={content.policiesGuidelines?.documents || []}
                onChange={(documents) => updateCategory('policiesGuidelines', { documents })}
                categoryLabel="policy document"
                defaultCategory="Policy Document"
              />
            </div>
          </div>
        )}

        {/* Research & Studies Tab */}
        {activeTab === 'research' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Research & Studies Section</h3>
              <p className="text-sm text-gray-500 mt-1">
                Manage research studies and impact assessments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Section Title"
                value={content.researchStudies?.title || ''}
                onChange={(e) => updateCategory('researchStudies', { title: e.target.value })}
                placeholder="Research & Studies"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Description</label>
                <textarea
                  value={content.researchStudies?.description || ''}
                  onChange={(e) => updateCategory('researchStudies', { description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="In-depth research studies and impact assessments of our educational initiatives"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-medium text-gray-900 mb-4">Documents</h4>
              <DocumentEditor
                documents={content.researchStudies?.documents || []}
                onChange={(documents) => updateCategory('researchStudies', { documents })}
                categoryLabel="research study"
                defaultCategory="Research Study"
              />
            </div>
          </div>
        )}

        {/* Strategic Publications Tab */}
        {activeTab === 'strategic' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Strategic Publications Section</h3>
              <p className="text-sm text-gray-500 mt-1">
                Manage strategic plans and roadmaps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Section Title"
                value={content.strategicPublications?.title || ''}
                onChange={(e) => updateCategory('strategicPublications', { title: e.target.value })}
                placeholder="Strategic Publications"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Description</label>
                <textarea
                  value={content.strategicPublications?.description || ''}
                  onChange={(e) => updateCategory('strategicPublications', { description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Strategic plans, frameworks, and roadmaps for Ghana's educational development"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-medium text-gray-900 mb-4">Documents</h4>
              <DocumentEditor
                documents={content.strategicPublications?.documents || []}
                onChange={(documents) => updateCategory('strategicPublications', { documents })}
                categoryLabel="strategic publication"
                defaultCategory="Strategic Plan"
              />
            </div>
          </div>
        )}

        {/* Newsletter Tab */}
        {activeTab === 'newsletter' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Newsletter Subscription Section</h3>
              <p className="text-sm text-gray-500 mt-1">
                Configure the newsletter signup section at the bottom of the page.
              </p>
            </div>

            {/* Preview */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                Preview
              </div>
              <div className="p-6 text-center text-white" style={{ backgroundColor: '#1e3a5f' }}>
                <h2 className="text-xl font-bold mb-2">
                  {content.newsletterTitle || 'Stay Updated'}
                </h2>
                <p className="text-gray-300 text-sm mb-4">
                  {content.newsletterSubtitle || 'Subscribe to receive notifications about new publications.'}
                </p>
                <div className="flex gap-2 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder={content.newsletterPlaceholder || 'Enter your email'}
                    className="flex-1 px-3 py-2 rounded text-gray-900 text-sm"
                    disabled
                  />
                  <button className="bg-amber-500 text-white px-4 py-2 rounded text-sm font-medium">
                    {content.newsletterButtonText || 'Subscribe'}
                  </button>
                </div>
              </div>
            </div>

            <Input
              label="Newsletter Title"
              value={content.newsletterTitle || ''}
              onChange={(e) => updateContent({ newsletterTitle: e.target.value })}
              placeholder="Stay Updated"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Newsletter Subtitle
              </label>
              <textarea
                value={content.newsletterSubtitle || ''}
                onChange={(e) => updateContent({ newsletterSubtitle: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Subscribe to receive notifications about new publications."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Email Placeholder"
                value={content.newsletterPlaceholder || ''}
                onChange={(e) => updateContent({ newsletterPlaceholder: e.target.value })}
                placeholder="Enter your email"
              />
              <Input
                label="Subscribe Button Text"
                value={content.newsletterButtonText || ''}
                onChange={(e) => updateContent({ newsletterButtonText: e.target.value })}
                placeholder="Subscribe"
              />
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-medium text-gray-900 mb-4">Contact Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Contact Email"
                  type="email"
                  value={content.newsletterContactEmail || ''}
                  onChange={(e) => updateContent({ newsletterContactEmail: e.target.value })}
                  placeholder="info@getfund.gov.gh"
                />
                <Input
                  label="Contact Phone"
                  type="tel"
                  value={content.newsletterContactPhone || ''}
                  onChange={(e) => updateContent({ newsletterContactPhone: e.target.value })}
                  placeholder="+233 (0)302 664 928-930"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
