import React, { useState, useEffect } from 'react';
import { Input } from '../Common/Input';
import { Button } from '../Common/Button';
import { Plus, Trash2, Heart } from 'lucide-react';

interface Stat {
  number: string;
  label: string;
  icon?: 'users' | 'building' | 'heart';
}

interface SupportOption {
  title: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
  icon?: 'heart' | 'building' | 'users';
}

interface ScholarshipType {
  title: string;
  description: string;
}

interface SupportUsEditorProps {
  initialData: any;
  onChange: (data: any) => void;
}

export const SupportUsEditor: React.FC<SupportUsEditorProps> = ({ initialData, onChange }) => {
  const [content, setContent] = useState({
    // Hero Section
    heroTitle: initialData?.heroTitle || '',
    heroSubtitle: initialData?.heroSubtitle || '',
    heroCtaText: initialData?.heroCtaText || '',
    heroCtaLink: initialData?.heroCtaLink || '',

    // Impact Stats
    impactTitle: initialData?.impactTitle || '',
    impactSubtitle: initialData?.impactSubtitle || '',
    stats: initialData?.stats || [],

    // GETFund Act
    actTitle: initialData?.actTitle || '',
    actIntro: initialData?.actIntro || '',
    legalFoundationTitle: initialData?.legalFoundationTitle || '',
    legalFoundationText: initialData?.legalFoundationText || '',
    fundingMechanismTitle: initialData?.fundingMechanismTitle || '',
    fundingMechanismText: initialData?.fundingMechanismText || '',
    constitutionalMandate: initialData?.constitutionalMandate || '',

    // Ways to Support
    waysToSupportTitle: initialData?.waysToSupportTitle || '',
    waysToSupportSubtitle: initialData?.waysToSupportSubtitle || '',
    supportOptions: initialData?.supportOptions || [],

    // Scholarship
    scholarshipTitle: initialData?.scholarshipTitle || '',
    scholarshipSubtitle: initialData?.scholarshipSubtitle || '',
    scholarshipTypes: initialData?.scholarshipTypes || [],
    scholarshipAmount: initialData?.scholarshipAmount || '',
    scholarshipAmountText: initialData?.scholarshipAmountText || '',
    scholarshipCtaText: initialData?.scholarshipCtaText || '',
    scholarshipCtaLink: initialData?.scholarshipCtaLink || '',

    // Final CTA
    ctaTitle: initialData?.ctaTitle || '',
    ctaDescription: initialData?.ctaDescription || '',
    ctaButtonText: initialData?.ctaButtonText || '',
    ctaButtonLink: initialData?.ctaButtonLink || '',
    ctaSecondaryText: initialData?.ctaSecondaryText || '',
    ctaSecondaryLink: initialData?.ctaSecondaryLink || '',
    contactEmail: initialData?.contactEmail || '',
    contactPhone: initialData?.contactPhone || '',
  });

  useEffect(() => {
    onChange(content);
  }, [content]);

  const updateField = (field: string, value: any) => {
    setContent(prev => ({ ...prev, [field]: value }));
  };

  const addStat = () => {
    updateField('stats', [...content.stats, { number: '', label: '', icon: 'users' }]);
  };

  const removeStat = (index: number) => {
    updateField('stats', content.stats.filter((_: any, i: number) => i !== index));
  };

  const updateStat = (index: number, field: keyof Stat, value: any) => {
    const updated = [...content.stats];
    updated[index] = { ...updated[index], [field]: value };
    updateField('stats', updated);
  };

  const addSupportOption = () => {
    updateField('supportOptions', [...content.supportOptions, { 
      title: '', 
      description: '', 
      ctaText: '', 
      ctaLink: '', 
      icon: 'heart' 
    }]);
  };

  const removeSupportOption = (index: number) => {
    updateField('supportOptions', content.supportOptions.filter((_: any, i: number) => i !== index));
  };

  const updateSupportOption = (index: number, field: keyof SupportOption, value: any) => {
    const updated = [...content.supportOptions];
    updated[index] = { ...updated[index], [field]: value };
    updateField('supportOptions', updated);
  };

  const addScholarshipType = () => {
    updateField('scholarshipTypes', [...content.scholarshipTypes, { title: '', description: '' }]);
  };

  const removeScholarshipType = (index: number) => {
    updateField('scholarshipTypes', content.scholarshipTypes.filter((_: any, i: number) => i !== index));
  };

  const updateScholarshipType = (index: number, field: keyof ScholarshipType, value: string) => {
    const updated = [...content.scholarshipTypes];
    updated[index] = { ...updated[index], [field]: value };
    updateField('scholarshipTypes', updated);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-green-600" />
          Hero Section
        </h3>
        <div className="space-y-4">
          <Input
            label="Hero Title"
            value={content.heroTitle}
            onChange={(e) => updateField('heroTitle', e.target.value)}
            placeholder="Support Ghana's Educational Future"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
            <textarea
              value={content.heroSubtitle}
              onChange={(e) => updateField('heroSubtitle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={2}
              placeholder="Join us in transforming lives through education..."
            />
          </div>
          {/* Live Preview */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
            <h4 className="text-sm font-medium text-gray-500 mb-3">Preview</h4>
            <div className="bg-white p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {content.heroTitle || "Support Ghana's Educational Future"}
              </h2>
              <div className="w-16 h-1 mb-3" style={{ backgroundColor: '#2a3f75' }} />
              <p className="text-gray-600 mb-4">
                {content.heroSubtitle || 'Join us in transforming lives through education'}
              </p>
              {content.heroCtaText && (
                <span className="inline-block bg-green-600 text-white px-4 py-2 rounded text-sm">
                  {content.heroCtaText}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="CTA Button Text"
              value={content.heroCtaText}
              onChange={(e) => updateField('heroCtaText', e.target.value)}
              placeholder="Donate Now"
            />
            <Input
              label="CTA Button Link"
              value={content.heroCtaLink}
              onChange={(e) => updateField('heroCtaLink', e.target.value)}
              placeholder="https://donate.getfund.gov.gh/"
            />
          </div>
        </div>
      </div>

      {/* Impact Stats */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Impact Statistics</h3>
        <div className="space-y-4">
          <Input
            label="Section Title"
            value={content.impactTitle}
            onChange={(e) => updateField('impactTitle', e.target.value)}
            placeholder="Our Impact by Numbers"
          />
          <Input
            label="Section Subtitle"
            value={content.impactSubtitle}
            onChange={(e) => updateField('impactSubtitle', e.target.value)}
            placeholder="Since our establishment..."
          />
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">Stats</label>
              <Button onClick={addStat} variant="secondary" size="sm">
                <Plus className="w-4 h-4 mr-1" /> Add Stat
              </Button>
            </div>
            {content.stats.map((stat: Stat, index: number) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="grid grid-cols-12 gap-3 items-start">
                  <div className="col-span-3">
                    <Input
                      label="Number"
                      value={stat.number}
                      onChange={(e) => updateStat(index, 'number', e.target.value)}
                      placeholder="500,000+"
                    />
                  </div>
                  <div className="col-span-5">
                    <Input
                      label="Label"
                      value={stat.label}
                      onChange={(e) => updateStat(index, 'label', e.target.value)}
                      placeholder="Students Reached"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                    <select
                      value={stat.icon || 'users'}
                      onChange={(e) => updateStat(index, 'icon', e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="users">Users</option>
                      <option value="building">Building</option>
                      <option value="heart">Heart</option>
                    </select>
                  </div>
                  <div className="col-span-1 pt-7">
                    <Button onClick={() => removeStat(index)} variant="danger" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GETFund Act */}
      <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">GETFund Act Section</h3>
        <div className="space-y-4">
          <Input
            label="Section Title"
            value={content.actTitle}
            onChange={(e) => updateField('actTitle', e.target.value)}
            placeholder="The Ghana Education Trust Fund (GETFund) Act"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Introduction</label>
            <textarea
              value={content.actIntro}
              onChange={(e) => updateField('actIntro', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                label="Legal Foundation Title"
                value={content.legalFoundationTitle}
                onChange={(e) => updateField('legalFoundationTitle', e.target.value)}
                placeholder="Legal Foundation"
              />
              <textarea
                value={content.legalFoundationText}
                onChange={(e) => updateField('legalFoundationText', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-2"
                rows={4}
                placeholder="The GETFund Act, 2000..."
              />
            </div>
            <div>
              <Input
                label="Funding Mechanism Title"
                value={content.fundingMechanismTitle}
                onChange={(e) => updateField('fundingMechanismTitle', e.target.value)}
                placeholder="Funding Mechanism"
              />
              <textarea
                value={content.fundingMechanismText}
                onChange={(e) => updateField('fundingMechanismText', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-2"
                rows={4}
                placeholder="The fund primarily finances..."
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Constitutional Mandate (Quote)</label>
            <textarea
              value={content.constitutionalMandate}
              onChange={(e) => updateField('constitutionalMandate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={2}
              placeholder="It support our nation's drive towards equity education..."
            />
          </div>
        </div>
      </div>

      {/* Ways to Support */}
      <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ways to Support</h3>
        <div className="space-y-4">
          <Input
            label="Section Title"
            value={content.waysToSupportTitle}
            onChange={(e) => updateField('waysToSupportTitle', e.target.value)}
            placeholder="Ways to Support Our Mission"
          />
          <Input
            label="Section Subtitle"
            value={content.waysToSupportSubtitle}
            onChange={(e) => updateField('waysToSupportSubtitle', e.target.value)}
          />
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">Support Options</label>
              <Button onClick={addSupportOption} variant="secondary" size="sm">
                <Plus className="w-4 h-4 mr-1" /> Add Option
              </Button>
            </div>
            {content.supportOptions.map((option: SupportOption, index: number) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="space-y-3">
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-8">
                      <Input
                        label="Title"
                        value={option.title}
                        onChange={(e) => updateSupportOption(index, 'title', e.target.value)}
                        placeholder="Direct Donations"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                      <select
                        value={option.icon || 'heart'}
                        onChange={(e) => updateSupportOption(index, 'icon', e.target.value as any)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="heart">Heart</option>
                        <option value="building">Building</option>
                        <option value="users">Users</option>
                      </select>
                    </div>
                    <div className="col-span-1 pt-7">
                      <Button onClick={() => removeSupportOption(index)} variant="danger" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={option.description}
                      onChange={(e) => updateSupportOption(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="CTA Text"
                      value={option.ctaText || ''}
                      onChange={(e) => updateSupportOption(index, 'ctaText', e.target.value)}
                      placeholder="Donate Now"
                    />
                    <Input
                      label="CTA Link"
                      value={option.ctaLink || ''}
                      onChange={(e) => updateSupportOption(index, 'ctaLink', e.target.value)}
                      placeholder="/donate"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scholarship Programs */}
      <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Scholarship Programs</h3>
        <div className="space-y-4">
          <Input
            label="Section Title"
            value={content.scholarshipTitle}
            onChange={(e) => updateField('scholarshipTitle', e.target.value)}
            placeholder="Support Scholarship Programs"
          />
          <Input
            label="Section Subtitle"
            value={content.scholarshipSubtitle}
            onChange={(e) => updateField('scholarshipSubtitle', e.target.value)}
          />
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">Scholarship Types</label>
              <Button onClick={addScholarshipType} variant="secondary" size="sm">
                <Plus className="w-4 h-4 mr-1" /> Add Type
              </Button>
            </div>
            {content.scholarshipTypes.map((type: ScholarshipType, index: number) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-4">
                    <Input
                      label="Title"
                      value={type.title}
                      onChange={(e) => updateScholarshipType(index, 'title', e.target.value)}
                      placeholder="Undergraduate Programs"
                    />
                  </div>
                  <div className="col-span-7">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={type.description}
                      onChange={(e) => updateScholarshipType(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      rows={2}
                    />
                  </div>
                  <div className="col-span-1 pt-7">
                    <Button onClick={() => removeScholarshipType(index)} variant="danger" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-4 rounded-lg border border-indigo-200 mt-4">
            <h4 className="font-medium text-gray-900 mb-3">Featured Scholarship Amount</h4>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Amount"
                value={content.scholarshipAmount}
                onChange={(e) => updateField('scholarshipAmount', e.target.value)}
                placeholder="GH₵ 5,000"
              />
              <Input
                label="Amount Description"
                value={content.scholarshipAmountText}
                onChange={(e) => updateField('scholarshipAmountText', e.target.value)}
                placeholder="can fund a full scholarship for one student"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <Input
                label="CTA Button Text"
                value={content.scholarshipCtaText}
                onChange={(e) => updateField('scholarshipCtaText', e.target.value)}
                placeholder="Invest in Brilliance"
              />
              <Input
                label="CTA Button Link"
                value={content.scholarshipCtaLink}
                onChange={(e) => updateField('scholarshipCtaLink', e.target.value)}
                placeholder="https://donate.getfund.gov.gh/"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-red-50 p-6 rounded-lg border border-red-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Final Call-to-Action</h3>
        <div className="space-y-4">
          <Input
            label="CTA Title"
            value={content.ctaTitle}
            onChange={(e) => updateField('ctaTitle', e.target.value)}
            placeholder="Ready to Make a Difference?"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CTA Description</label>
            <textarea
              value={content.ctaDescription}
              onChange={(e) => updateField('ctaDescription', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Primary Button Text"
              value={content.ctaButtonText}
              onChange={(e) => updateField('ctaButtonText', e.target.value)}
              placeholder="Make a Donation"
            />
            <Input
              label="Primary Button Link"
              value={content.ctaButtonLink}
              onChange={(e) => updateField('ctaButtonLink', e.target.value)}
              placeholder="https://donate.getfund.gov.gh/"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Secondary Button Text"
              value={content.ctaSecondaryText}
              onChange={(e) => updateField('ctaSecondaryText', e.target.value)}
              placeholder="Contact Our Team"
            />
            <Input
              label="Secondary Button Link"
              value={content.ctaSecondaryLink}
              onChange={(e) => updateField('ctaSecondaryLink', e.target.value)}
              placeholder="/contact"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Contact Email"
              type="email"
              value={content.contactEmail}
              onChange={(e) => updateField('contactEmail', e.target.value)}
              placeholder="donations@getfund.gov.gh"
            />
            <Input
              label="Contact Phone"
              value={content.contactPhone}
              onChange={(e) => updateField('contactPhone', e.target.value)}
              placeholder="+233 302 681 681"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
