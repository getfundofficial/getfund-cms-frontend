import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TeamMember } from '../../services/teamMembersService';
import { GripVertical, Edit, Trash2 } from 'lucide-react';

interface SortableTeamMemberCardProps {
  member: TeamMember;
  onEdit: (member: TeamMember) => void;
  onDelete: (id: string) => void;
  getRoleBadge: (role: TeamMember['role']) => React.ReactNode;
  getStatusBadge: (status: TeamMember['status']) => React.ReactNode;
}

export const SortableTeamMemberCard: React.FC<SortableTeamMemberCardProps> = ({
  member,
  onEdit,
  onDelete,
  getRoleBadge,
  getStatusBadge,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: member.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-4 p-4 hover:bg-gray-50">
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-5 h-5" />
      </button>

      {/* Image */}
      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
        {member.image_url ? (
          <img
            src={member.image_url}
            alt={member.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-2xl font-bold">{member.name.charAt(0)}</span>
          </div>
        )}
      </div>

      {/* Member Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{member.name}</h3>
          {getRoleBadge(member.role)}
          {getStatusBadge(member.status)}
        </div>
        <p className="text-sm text-gray-600 truncate">{member.title}</p>
        {member.date_range && (
          <p className="text-xs text-gray-500 mt-1">{member.date_range}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(member)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          aria-label="Edit"
        >
          <Edit className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete(member.id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          aria-label="Delete"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
