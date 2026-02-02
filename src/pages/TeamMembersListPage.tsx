import React, { useEffect, useState } from 'react';
import { Breadcrumb } from '../components/Common/Breadcrumb';
import { teamMembersService, TeamMember } from '../services/teamMembersService';
import { Button } from '../components/Common/Button';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableTeamMemberCard } from '../components/TeamMembers/SortableTeamMemberCard';
import { TeamMemberModal } from '../components/TeamMembers/TeamMemberModal';
import LoadingScreen from '../components/Common/LoadingScreen';

export const TeamMembersListPage: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadMembers();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [members, roleFilter, statusFilter]);

  const loadMembers = async () => {
    try {
      setIsLoading(true);
      const data = await teamMembersService.getAll();
      setMembers(data);
    } catch (error) {
      console.error('Failed to load team members:', error);
      alert('Failed to load team members');
    } finally {
      setIsLoading(false);
    }
  };

  const filterMembers = () => {
    let filtered = [...members];

    if (roleFilter !== 'all') {
      filtered = filtered.filter(item => item.role === roleFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    setFilteredMembers(filtered);
  };

  const handleCreate = () => {
    setEditingMember(null);
    setIsModalOpen(true);
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;

    try {
      await teamMembersService.delete(id);
      setMembers(members.filter(item => item.id !== id));
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to delete team member');
    }
  };

  const handleSave = async () => {
    setIsModalOpen(false);
    await loadMembers();
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = filteredMembers.findIndex(item => item.id === active.id);
      const newIndex = filteredMembers.findIndex(item => item.id === over.id);

      const newOrder = arrayMove(filteredMembers, oldIndex, newIndex);
      setFilteredMembers(newOrder);

      // Update display_order for all affected items
      const updates = newOrder.map((member, index) => ({
        id: member.id,
        display_order: index + 1,
      }));

      try {
        await teamMembersService.updateOrders(updates);
        await loadMembers();
      } catch (error) {
        console.error('Failed to update order:', error);
        alert('Failed to update order');
        await loadMembers(); // Reload to revert changes
      }
    }
  };

  const getRoleBadge = (role: TeamMember['role']) => {
    const styles: Record<string, string> = {
      board_chairman: 'bg-purple-100 text-purple-800',
      board_member: 'bg-blue-100 text-blue-800',
      management: 'bg-green-100 text-green-800',
      deputy_administrator: 'bg-indigo-100 text-indigo-800',
      financial_controller: 'bg-emerald-100 text-emerald-800',
      historical_admin: 'bg-gray-100 text-gray-800',
    };

    const labels: Record<string, string> = {
      board_chairman: 'Board Chairman',
      board_member: 'Board Member',
      management: 'Management',
      deputy_administrator: 'Deputy Admin',
      financial_controller: 'Financial Controller',
      historical_admin: 'Historical',
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded ${styles[role] || 'bg-gray-100 text-gray-800'}`}>
        {labels[role] || role}
      </span>
    );
  };

  const getStatusBadge = (status: TeamMember['status']) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded ${styles[status]}`}>
        {status === 'active' ? 'Active' : 'Inactive'}
      </span>
    );
  };

  if (isLoading) {
    return <LoadingScreen message="Loading team members..." />;
  }

  return (
    <>
      <Breadcrumb />
      <div className="space-y-4 sm:space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">Team Members</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Manage leadership team members (Board, Management, Historical Administrators)
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleCreate}
          className="w-full sm:w-auto"
        >
          + Add Team Member
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex-1">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Roles</option>
              <option value="board_chairman">Board Chairman</option>
              <option value="board_member">Board Member</option>
              <option value="management">Management</option>
              <option value="deputy_administrator">Deputy Administrator</option>
              <option value="financial_controller">Financial Controller</option>
              <option value="historical_admin">Historical Administrator</option>
            </select>
          </div>

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
            Showing {filteredMembers.length} of {members.length} members
          </div>
        </div>
      </div>

      {/* Team Members List with Drag & Drop */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredMembers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No team members found</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredMembers.map(m => m.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="divide-y divide-gray-200">
                {filteredMembers.map((member) => (
                  <SortableTeamMemberCard
                    key={member.id}
                    member={member}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    getRoleBadge={getRoleBadge}
                    getStatusBadge={getStatusBadge}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Create/Edit Modal */}
      <TeamMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        member={editingMember}
      />
    </div>
    </>
  );
};
