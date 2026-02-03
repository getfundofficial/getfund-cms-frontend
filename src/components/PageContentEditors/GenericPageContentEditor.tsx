import React, { useState } from 'react';
import { Button } from '../Common/Button';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface GenericPageContentEditorProps {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
}

/**
 * Generic JSON editor for page_content sections
 * Provides a visual JSON editor with validation
 */
export const GenericPageContentEditor: React.FC<GenericPageContentEditorProps> = ({
  content,
  onChange,
}) => {
  const [jsonValue, setJsonValue] = useState(JSON.stringify(content, null, 2));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleJsonChange = (value: string) => {
    setJsonValue(value);
    setError(null);
    setSuccess(false);

    // Try to parse and validate JSON
    try {
      const parsed = JSON.parse(value);
      onChange(parsed);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonValue);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonValue(formatted);
      setError(null);
    } catch (err) {
      setError('Invalid JSON - cannot format');
    }
  };

  return (
    <div className="space-y-6">
      {/* Preview Section */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h4 className="text-sm font-medium text-gray-500 mb-3">Page Header Preview</h4>
        <div className="bg-white p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {content.hero?.title || content.heroTitle || content.title || 'Page Title'}
          </h2>
          <div className="w-16 h-1 mb-3" style={{ backgroundColor: '#2a3f75' }} />
          <p className="text-gray-600">
            {content.hero?.subtitle || content.heroSubtitle || content.subtitle || 'Page subtitle or description'}
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Advanced: JSON Editor</h3>
        <p className="text-sm text-blue-700">
          Edit the page content as JSON for advanced customization.
        </p>
      </div>

      <div className="flex gap-2 mb-2">
        <Button onClick={formatJson} variant="secondary" size="sm">
          Format JSON
        </Button>
        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Valid JSON</span>
          </div>
        )}
      </div>

      <div className="relative">
        <textarea
          value={jsonValue}
          onChange={(e) => handleJsonChange(e.target.value)}
          className={`w-full h-[600px] px-4 py-3 border rounded-lg font-mono text-sm bg-gray-50 focus:outline-none focus:ring-2 ${
            error
              ? 'border-red-300 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          spellCheck={false}
        />
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-900 mb-2">💡 Tips:</h4>
        <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
          <li>Use the "Format JSON" button to auto-format your JSON</li>
          <li>Strings must be wrapped in double quotes</li>
          <li>Arrays use square brackets: ["item1", "item2"]</li>
          <li>Objects use curly braces: {"{"}"key": "value"{"}"}</li>
          <li>Save your changes using the "Save" button at the bottom of the page</li>
        </ul>
      </div>
    </div>
  );
};
