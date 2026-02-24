import React, { useEffect, useState } from 'react';
import { Breadcrumb } from '../components/Common/Breadcrumb';
import { partnersService, Partner } from '../services/partnersService';
import { Button } from '../components/Common/Button';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortablePartnerCard } from '../components/Partners/SortablePartnerCard';
import { PartnerModal } from '../components/Partners/PartnerModal';
import LoadingScreen from '../components/Common/LoadingScreen';
import { Handshake, GraduationCap } from 'lucide-react';

export const PartnersListPage: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [defaultCategory, setDefaultCategory] = useState<string>('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      setIsLoading(true);
      const data = await partnersService.getAll();
      setPartners(data);
    } catch (error) {
      console.error('Failed to load partners:', error);
      alert('Failed to load partners');
    } finally {
      setIsLoading(false);
    }
  };

  const fundraisingPartners = partners.filter(p => !p.category || p.category === '');
  const universityPartners = partners.filter(p => p.category === 'university');

  const handleCreate = (category: string) => {
    setEditingPartner(null);
    setDefaultCategory(category);
    setIsModalOpen(true);
  };

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setDefaultCategory(partner.category || '');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this partner?')) return;

    try {
      await partnersService.delete(id);
      setPartners(partners.filter(p => p.id !== id));
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to delete partner');
    }
  };

  const handleSave = async () => {
    setIsModalOpen(false);
    await loadPartners();
  };

  const handleDragEnd = async (event: any, list: Partner[]) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = list.findIndex(p => p.id === active.id);
    const newIndex = list.findIndex(p => p.id === over.id);

    const newOrder = arrayMove(list, oldIndex, newIndex);

    // Optimistically update UI
    setPartners(prev => {
      const otherPartners = prev.filter(p => !newOrder.find(n => n.id === p.id));
      return [...otherPartners, ...newOrder];
    });

    const updates = newOrder.map((partner, index) => ({
      id: partner.id,
      display_order: index + 1,
    }));

    try {
      await partnersService.updateOrders(updates);
      await loadPartners();
    } catch (error) {
      console.error('Failed to update order:', error);
      alert('Failed to update order');
      await loadPartners();
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Loading partners..." />;
  }

  return (
    <>
      <Breadcrumb />
      <div className="space-y-6 p-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Partners</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Manage fundraising partners and partner universities separately
          </p>
        </div>

        {/* Fundraising Partners Section */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-5 border-b bg-gradient-to-r from-blue-50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Handshake className="w-5 h-5 text-blue-700" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">GETFund Partners</h2>
                <p className="text-sm text-gray-500">
                  Displayed on the Fundraising &amp; Partnerships page
                  <span className="ml-2 text-xs text-gray-400">({fundraisingPartners.length} partner{fundraisingPartners.length !== 1 ? 's' : ''})</span>
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={() => handleCreate('')}
              className="w-full sm:w-auto"
            >
              + Add Partner
            </Button>
          </div>

          {fundraisingPartners.length === 0 ? (
            <div className="text-center py-10">
              <Handshake className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-3">No fundraising partners yet</p>
              <Button variant="primary" onClick={() => handleCreate('')}>
                Add First Partner
              </Button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(e) => handleDragEnd(e, fundraisingPartners)}
            >
              <SortableContext
                items={fundraisingPartners.map(p => p.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="divide-y divide-gray-200">
                  {fundraisingPartners.map((partner) => (
                    <SortablePartnerCard
                      key={partner.id}
                      partner={partner}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* Partner Universities Section */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-5 border-b bg-gradient-to-r from-emerald-50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Partner Universities</h2>
                <p className="text-sm text-gray-500">
                  Displayed on the Scholarships page
                  <span className="ml-2 text-xs text-gray-400">({universityPartners.length} universit{universityPartners.length !== 1 ? 'ies' : 'y'})</span>
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={() => handleCreate('university')}
              className="w-full sm:w-auto"
            >
              + Add University
            </Button>
          </div>

          {universityPartners.length === 0 ? (
            <div className="text-center py-10">
              <GraduationCap className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-3">No partner universities yet</p>
              <Button variant="primary" onClick={() => handleCreate('university')}>
                Add First University
              </Button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(e) => handleDragEnd(e, universityPartners)}
            >
              <SortableContext
                items={universityPartners.map(p => p.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="divide-y divide-gray-200">
                  {universityPartners.map((partner) => (
                    <SortablePartnerCard
                      key={partner.id}
                      partner={partner}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Drag and drop partners to reorder them within each section</li>
            <li>• Use PNG or SVG logos for best quality</li>
            <li>• Set partners to "Inactive" to hide them from the website</li>
            <li>• GETFund Partners appear on the Fundraising page, Universities on the Scholarships page</li>
          </ul>
        </div>

        {/* Create/Edit Modal */}
        <PartnerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          partner={editingPartner}
          defaultCategory={defaultCategory}
        />
      </div>
    </>
  );
};
