import React, { useEffect, useState } from 'react';
import { Breadcrumb } from '../components/Common/Breadcrumb';
import { partnersService, Partner } from '../services/partnersService';
import { Button } from '../components/Common/Button';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortablePartnerCard } from '../components/Partners/SortablePartnerCard';
import { PartnerModal } from '../components/Partners/PartnerModal';
import LoadingScreen from '../components/Common/LoadingScreen';

export const PartnersListPage: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadPartners();
  }, []);

  useEffect(() => {
    filterPartners();
  }, [partners, statusFilter]);

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

  const filterPartners = () => {
    let filtered = [...partners];

    if (statusFilter === 'active') {
      filtered = filtered.filter(p => p.is_active);
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter(p => !p.is_active);
    }

    setFilteredPartners(filtered);
  };

  const handleCreate = () => {
    setEditingPartner(null);
    setIsModalOpen(true);
  };

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
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

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = filteredPartners.findIndex(p => p.id === active.id);
      const newIndex = filteredPartners.findIndex(p => p.id === over.id);

      const newOrder = arrayMove(filteredPartners, oldIndex, newIndex);
      setFilteredPartners(newOrder);

      // Update display_order for all affected items
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
        await loadPartners(); // Reload to revert changes
      }
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Loading partners..." />;
  }

  return (
    <>
      <Breadcrumb />
      <div className="space-y-4 sm:space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">Partners</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Manage partnership logos displayed on the Partnerships page
            </p>
          </div>
          <Button
            variant="primary"
            onClick={handleCreate}
            className="w-full sm:w-auto"
          >
            + Add Partner
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex-1">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-right pt-6">
              Showing {filteredPartners.length} of {partners.length} partners
            </div>
          </div>
        </div>

        {/* Partners List with Drag & Drop */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredPartners.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-gray-500 mb-4">No partners found</p>
              <Button variant="primary" onClick={handleCreate}>
                Add Your First Partner
              </Button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={filteredPartners.map(p => p.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="divide-y divide-gray-200">
                  {filteredPartners.map((partner) => (
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
            <li>• Drag and drop partners to reorder them</li>
            <li>• Use PNG or SVG logos for best quality</li>
            <li>• Set partners to "Inactive" to hide them from the website</li>
            <li>• Add website URLs to make logos clickable on the website</li>
          </ul>
        </div>

        {/* Create/Edit Modal */}
        <PartnerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          partner={editingPartner}
        />
      </div>
    </>
  );
};
