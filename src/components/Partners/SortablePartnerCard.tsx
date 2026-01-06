import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Partner } from '../../services/partnersService';
import { GripVertical, Edit, Trash2, ExternalLink } from 'lucide-react';

interface SortablePartnerCardProps {
  partner: Partner;
  onEdit: (partner: Partner) => void;
  onDelete: (id: string) => void;
}

export const SortablePartnerCard: React.FC<SortablePartnerCardProps> = ({
  partner,
  onEdit,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: partner.id });

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

      {/* Logo */}
      <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border p-2">
        <img
          src={partner.logo_url}
          alt={partner.name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Partner Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{partner.name}</h3>
          {partner.is_active ? (
            <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800">
              Active
            </span>
          ) : (
            <span className="px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-800">
              Inactive
            </span>
          )}
        </div>
        {partner.website_url && (
          <a
            href={partner.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <ExternalLink className="w-3 h-3" />
            {partner.website_url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
          </a>
        )}
        {partner.description && (
          <p className="text-sm text-gray-500 mt-1 truncate">{partner.description}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(partner)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          aria-label="Edit"
        >
          <Edit className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete(partner.id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          aria-label="Delete"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
