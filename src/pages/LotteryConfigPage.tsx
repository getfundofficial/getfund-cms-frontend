import React, { useEffect, useState } from 'react';
import { Breadcrumb } from '../components/Common/Breadcrumb';
import { useAuth } from '../context/AuthContext';
import { lotteryService, LotteryConfig, LotteryPrize, LotteryStep } from '../services/lotteryService';
import { Button } from '../components/Common/Button';
import LoadingScreen from '../components/Common/LoadingScreen';

export const LotteryConfigPage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [config, setConfig] = useState<LotteryConfig | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    prizes: [] as LotteryPrize[],
    next_draw_date: '',
    draw_frequency: 'monthly' as 'weekly' | 'monthly' | 'quarterly',
    how_it_works_steps: [] as LotteryStep[],
    is_active: true,
    banner_color: '#FCD34D',
    section_title: '',
    section_description: '',
    sharing_enabled: true,
    share_text: '',
    share_hashtags: '',
  });

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setIsLoading(true);
      const data = await lotteryService.getConfig();
      setConfig(data);
      setFormData({
        prizes: data.prizes,
        next_draw_date: data.next_draw_date.split('T')[0],
        draw_frequency: data.draw_frequency,
        how_it_works_steps: data.how_it_works_steps,
        is_active: data.is_active,
        banner_color: data.banner_color,
        section_title: data.section_title || '',
        section_description: data.section_description || '',
        sharing_enabled: data.sharing_enabled !== false,
        share_text: data.share_text || '',
        share_hashtags: data.share_hashtags || '',
      });
    } catch (error) {
      console.error('Failed to load lottery config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addPrize = () => {
    setFormData(prev => ({
      ...prev,
      prizes: [
        ...prev.prizes,
        { rank: prev.prizes.length + 1, amount: 0, description: '', currency: 'GHS' }
      ]
    }));
  };

  const updatePrize = (index: number, field: keyof LotteryPrize, value: any) => {
    const newPrizes = [...formData.prizes];
    newPrizes[index] = { ...newPrizes[index], [field]: value };
    setFormData(prev => ({ ...prev, prizes: newPrizes }));
  };

  const removePrize = (index: number) => {
    const newPrizes = formData.prizes.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, prizes: newPrizes }));
  };

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      how_it_works_steps: [
        ...prev.how_it_works_steps,
        { step: prev.how_it_works_steps.length + 1, title: '', description: '' }
      ]
    }));
  };

  const updateStep = (index: number, field: keyof LotteryStep, value: any) => {
    const newSteps = [...formData.how_it_works_steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setFormData(prev => ({ ...prev, how_it_works_steps: newSteps }));
  };

  const removeStep = (index: number) => {
    const newSteps = formData.how_it_works_steps.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, how_it_works_steps: newSteps }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.prizes.length === 0) {
      newErrors.prizes = 'At least one prize is required';
    } else {
      formData.prizes.forEach((prize, index) => {
        if (!prize.description.trim()) {
          newErrors[`prize_${index}_description`] = 'Prize description is required';
        }
        if (prize.amount <= 0) {
          newErrors[`prize_${index}_amount`] = 'Prize amount must be greater than 0';
        }
      });
    }

    if (!formData.next_draw_date) {
      newErrors.next_draw_date = 'Next draw date is required';
    } else if (new Date(formData.next_draw_date) <= new Date()) {
      newErrors.next_draw_date = 'Next draw date must be in the future';
    }

    if (!/^#[0-9A-Fa-f]{6}$/.test(formData.banner_color)) {
      newErrors.banner_color = 'Banner color must be a valid hex color (e.g., #FCD34D)';
    }

    if (formData.how_it_works_steps.length === 0) {
      newErrors.how_it_works_steps = 'At least one step is required';
    } else {
      formData.how_it_works_steps.forEach((step, index) => {
        if (!step.title.trim()) {
          newErrors[`step_${index}_title`] = 'Step title is required';
        }
        if (!step.description.trim()) {
          newErrors[`step_${index}_description`] = 'Step description is required';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      alert('Please fix the validation errors');
      return;
    }

    try {
      setIsSaving(true);

      await lotteryService.updateConfig({
        ...formData,
        next_draw_date: new Date(formData.next_draw_date).toISOString(),
      });

      alert('Lottery configuration updated successfully');
      await loadConfig();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to update lottery configuration');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (user?.role !== 'admin') {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          You do not have permission to access this page.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Breadcrumb
        items={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Lottery Configuration', path: '' }
        ]}
      />

      <div className="max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            GETfund Scholarship Lottery Configuration
          </h1>
          {config && (
            <div className="text-sm text-gray-500">
              Current entries: {config.current_entries_count || 0}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Next Draw Date *
                  </label>
                  <input
                    type="date"
                    value={formData.next_draw_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, next_draw_date: e.target.value }))}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.next_draw_date ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.next_draw_date && (
                    <p className="mt-1 text-sm text-red-600">{errors.next_draw_date}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Draw Frequency
                  </label>
                  <select
                    value={formData.draw_frequency}
                    onChange={(e) => setFormData(prev => ({ ...prev, draw_frequency: e.target.value as any }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Color (Hex)
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={formData.banner_color}
                    onChange={(e) => setFormData(prev => ({ ...prev, banner_color: e.target.value }))}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.banner_color ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="#FCD34D"
                  />
                  <div
                    className="w-12 h-10 rounded border border-gray-300"
                    style={{ backgroundColor: formData.banner_color }}
                  />
                </div>
                {errors.banner_color && (
                  <p className="mt-1 text-sm text-red-600">{errors.banner_color}</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Lottery is active (visible on website)
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Prize Structure</h2>
              <Button type="button" onClick={addPrize} size="sm">
                Add Prize
              </Button>
            </div>

            {errors.prizes && (
              <p className="mb-4 text-sm text-red-600">{errors.prizes}</p>
            )}

            <div className="space-y-4">
              {formData.prizes.map((prize, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium text-gray-900">Prize {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removePrize(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rank/Position
                      </label>
                      <input
                        type="text"
                        value={prize.rank}
                        onChange={(e) => updatePrize(index, 'rank', isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="1 or 'additional'"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount *
                      </label>
                      <input
                        type="number"
                        value={prize.amount}
                        onChange={(e) => updatePrize(index, 'amount', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors[`prize_${index}_amount`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors[`prize_${index}_amount`] && (
                        <p className="mt-1 text-xs text-red-600">{errors[`prize_${index}_amount`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Currency
                      </label>
                      <select
                        value={prize.currency}
                        onChange={(e) => updatePrize(index, 'currency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="GHS">GHS (₵)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Count (for multiple winners)
                      </label>
                      <input
                        type="number"
                        value={prize.count || ''}
                        onChange={(e) => updatePrize(index, 'count', e.target.value ? parseInt(e.target.value) : undefined)}
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Optional"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                      </label>
                      <input
                        type="text"
                        value={prize.description}
                        onChange={(e) => updatePrize(index, 'description', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors[`prize_${index}_description`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="University Scholarship"
                      />
                      {errors[`prize_${index}_description`] && (
                        <p className="mt-1 text-xs text-red-600">{errors[`prize_${index}_description`]}</p>
                      )}
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Flip Card Description (shown on hover)
                      </label>
                      <textarea
                        value={prize.flip_description || ''}
                        onChange={(e) => updatePrize(index, 'flip_description', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Additional details shown when prize card is flipped..."
                      />
                      <p className="mt-1 text-xs text-gray-500">Optional: This text appears when users hover/tap on the prize card</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">How It Works Steps</h2>
              <Button type="button" onClick={addStep} size="sm">
                Add Step
              </Button>
            </div>

            {errors.how_it_works_steps && (
              <p className="mb-4 text-sm text-red-600">{errors.how_it_works_steps}</p>
            )}

            <div className="space-y-4">
              {formData.how_it_works_steps.map((step, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium text-gray-900">Step {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeStep(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => updateStep(index, 'title', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors[`step_${index}_title`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Donate to Any Campaign"
                      />
                      {errors[`step_${index}_title`] && (
                        <p className="mt-1 text-xs text-red-600">{errors[`step_${index}_title`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                      </label>
                      <textarea
                        value={step.description}
                        onChange={(e) => updateStep(index, 'description', e.target.value)}
                        rows={2}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors[`step_${index}_description`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Every ¢10 donated gives you one lottery entry"
                      />
                      {errors[`step_${index}_description`] && (
                        <p className="mt-1 text-xs text-red-600">{errors[`step_${index}_description`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Flip Card Description (shown on hover)
                      </label>
                      <textarea
                        value={step.flip_description || ''}
                        onChange={(e) => updateStep(index, 'flip_description', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Additional details shown when step card is flipped..."
                      />
                      <p className="mt-1 text-xs text-gray-500">Optional: This text appears when users hover/tap on the step card</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section Title & Description */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Display Settings</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section Title
                </label>
                <input
                  type="text"
                  value={formData.section_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, section_title: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="GETFund Scholarship Lottery"
                />
                <p className="mt-1 text-xs text-gray-500">Main title displayed above the lottery section on the website</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section Description
                </label>
                <textarea
                  value={formData.section_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, section_description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Every contribution to our campaigns automatically enters you into our monthly scholarship lottery..."
                />
                <p className="mt-1 text-xs text-gray-500">This text appears below the title on the website</p>
              </div>
            </div>
          </div>

          {/* Social Sharing Settings */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Social Sharing</h2>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.sharing_enabled}
                  onChange={(e) => setFormData(prev => ({ ...prev, sharing_enabled: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Enable social sharing buttons
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Share Text
                </label>
                <textarea
                  value={formData.share_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, share_text: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Support education in Ghana and enter the GETFund Scholarship Lottery!"
                />
                <p className="mt-1 text-xs text-gray-500">Text that will be pre-filled when sharing on social media</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hashtags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.share_hashtags}
                  onChange={(e) => setFormData(prev => ({ ...prev, share_hashtags: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="GETFund,EducationGhana,ScholarshipLottery"
                />
                <p className="mt-1 text-xs text-gray-500">Hashtags to include when sharing (without # symbol)</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" isLoading={isSaving}>
              Save Configuration
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
