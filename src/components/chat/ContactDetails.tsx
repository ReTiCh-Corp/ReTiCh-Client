import { Image, X } from 'lucide-react';

interface ContactDetailsProps {
  name: string | null;
  onClose: () => void;
}

export default function ContactDetails({ name, onClose }: ContactDetailsProps) {
  if (!name) return null;

  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('');

  return (
    <div className="w-[280px] min-w-[280px] h-full border-l border-border bg-white flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <span className="text-xs font-semibold text-grey-500 uppercase tracking-wider">
          Details
        </span>
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-lg hover:bg-grey-100 flex items-center justify-center text-grey-400 hover:text-grey-600 transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      {/* Avatar & Name */}
      <div className="flex flex-col items-center px-5 pb-6">
        <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mb-3 relative">
          <span className="font-display font-bold text-2xl text-primary-700">
            {initials}
          </span>
          <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-leaf-500 border-2 border-white" />
        </div>
        <h3 className="font-display font-bold text-lg text-text">{name}</h3>
        <span className="text-sm text-text-muted">Sky is the limit</span>
      </div>

      {/* Info Section */}
      <div className="px-5 pb-5">
        <h4 className="text-[11px] font-semibold text-grey-500 uppercase tracking-wider mb-3">
          Contact Info
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted">Mobile</span>
            <span className="text-xs text-primary-600 font-medium">
              +48 943 333 123
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted">Email</span>
            <span className="text-xs text-primary-600 font-medium">
              user@retich.app
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted">Joined</span>
            <span className="text-xs text-grey-600">March 2026</span>
          </div>
        </div>
      </div>

      {/* Shared Media */}
      <div className="px-5 pb-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-[11px] font-semibold text-grey-500 uppercase tracking-wider">
            Shared Media
          </h4>
          <button
            type="button"
            className="text-[11px] text-primary-600 font-medium hover:text-primary-700 cursor-pointer"
          >
            View all
          </button>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-square rounded-lg bg-grey-100 flex items-center justify-center"
            >
              <Image size={16} strokeWidth={1.5} className="text-grey-300" />
            </div>
          ))}
        </div>
      </div>

      {/* Shared Files */}
      <div className="px-5 pb-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-[11px] font-semibold text-grey-500 uppercase tracking-wider">
            Files
          </h4>
          <button
            type="button"
            className="text-[11px] text-primary-600 font-medium hover:text-primary-700 cursor-pointer"
          >
            View all
          </button>
        </div>
        <div className="space-y-2">
          {[
            {
              name: 'Timeschedule_2024',
              type: 'PDF',
              size: '376 KB',
              color: 'text-red-500',
            },
            {
              name: 'Design System article...',
              type: 'DOC',
              size: '1.34 MB',
              color: 'text-blue-500',
            },
          ].map((file) => (
            <div
              key={file.name}
              className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-grey-50 transition-colors cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-grey-100 flex items-center justify-center">
                <span
                  className={`text-[9px] font-bold uppercase ${file.color}`}
                >
                  {file.type}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-text truncate">
                  {file.name}
                </p>
                <p className="text-[11px] text-grey-400">{file.size}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
