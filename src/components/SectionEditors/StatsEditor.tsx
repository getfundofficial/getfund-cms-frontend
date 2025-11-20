import React, { useState } from 'react';
import { Button } from '../Common/Button';

interface Stat {
  icon: string;
  label: string;
  value: string;
}

interface StatsEditorProps {
  initialData?: { stats: Stat[] };
  onChange: (data: { stats: Stat[] }) => void;
}

export const StatsEditor: React.FC<StatsEditorProps> = ({ initialData, onChange }) => {
  const [stats, setStats] = useState<Stat[]>(initialData?.stats || []);

  const availableIcons = [
    { value: 'school', label: '🏫 School' },
    { value: 'users', label: '👥 Users/Students' },
    { value: 'book', label: '📚 Book/Education' },
    { value: 'award', label: '🏆 Award/Achievement' },
    { value: 'briefcase', label: '💼 Briefcase/Work' },
    { value: 'globe', label: '🌍 Globe/Global' },
    { value: 'trending-up', label: '📈 Trending Up' },
    { value: 'heart', label: '❤️ Heart' },
  ];

  const addStat = () => {
    const newStats = [...stats, { icon: 'school', label: '', value: '' }];
    setStats(newStats);
    onChange({ stats: newStats });
  };

  const removeStat = (index: number) => {
    const newStats = stats.filter((_, i) => i !== index);
    setStats(newStats);
    onChange({ stats: newStats });
  };

  const updateStat = (index: number, field: keyof Stat, value: string) => {
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setStats(newStats);
    onChange({ stats: newStats });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Statistics</h3>
        <Button onClick={addStat} variant="primary" size="sm">
          + Add Stat
        </Button>
      </div>

      {stats.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500">No statistics yet. Click "Add Stat" to get started.</p>
        </div>
      )}

      {stats.map((stat, index) => (
        <div key={index} className="p-4 border border-gray-300 rounded-lg bg-white">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-medium text-gray-900">Stat {index + 1}</h4>
            <button
              onClick={() => removeStat(index)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Remove
            </button>
          </div>

          <div className="space-y-3">
            {/* Icon Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon
              </label>
              <select
                value={stat.icon}
                onChange={(e) => updateStat(index, 'icon', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableIcons.map((icon) => (
                  <option key={icon.value} value={icon.value}>
                    {icon.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Label */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Label
              </label>
              <input
                type="text"
                value={stat.label}
                onChange={(e) => updateStat(index, 'label', e.target.value)}
                placeholder="e.g., Schools Supported"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Value
              </label>
              <input
                type="text"
                value={stat.value}
                onChange={(e) => updateStat(index, 'value', e.target.value)}
                placeholder="e.g., 5,000+"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Preview:</p>
            <div className="text-center">
              <div className="text-2xl mb-1">{availableIcons.find(i => i.value === stat.icon)?.label || '📊'}</div>
              <div className="text-sm text-gray-600">{stat.label || 'Label'}</div>
              <div className="text-lg font-bold text-gray-900">{stat.value || '0'}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
