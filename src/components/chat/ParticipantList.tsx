import { Crown, Loader2, Shield, UserMinus } from 'lucide-react';
import type { Participant } from '../../api/conversations';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const ROLE_CONFIG: Record<
  string,
  { icon: typeof Crown; label: string; className: string }
> = {
  owner: {
    icon: Crown,
    label: 'Owner',
    className: 'bg-primary-50 text-primary-600 border-primary-100',
  },
  admin: {
    icon: Shield,
    label: 'Admin',
    className: 'bg-leaf-50 text-leaf-600 border-leaf-200',
  },
};

interface ParticipantListProps {
  participants: Participant[];
  currentUserId: string;
  currentUserRole: string;
  onRemove: (userId: string) => void;
  removingUserId: string | null;
}

export default function ParticipantList({
  participants,
  currentUserId,
  currentUserRole,
  onRemove,
  removingUserId,
}: ParticipantListProps) {
  const canManage = currentUserRole === 'owner' || currentUserRole === 'admin';

  return (
    <div className="space-y-1">
      {participants.map((participant) => {
        const displayName = participant.nickname ?? participant.user_id;
        const roleConfig = ROLE_CONFIG[participant.role];
        const RoleIcon = roleConfig?.icon;
        const isCurrentUser = participant.user_id === currentUserId;
        const canRemove =
          canManage && !isCurrentUser && participant.role !== 'owner';
        const isRemoving = removingUserId === participant.user_id;

        return (
          <div
            key={participant.id}
            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-grey-50"
          >
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-grey-200 flex items-center justify-center font-display font-semibold text-xs text-grey-600 shrink-0">
              {getInitials(displayName)}
            </div>

            {/* Name + Role */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm text-text truncate">
                  {displayName}
                  {isCurrentUser && (
                    <span className="text-grey-400 ml-1">(you)</span>
                  )}
                </span>
                {roleConfig && (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-wider shrink-0 ${roleConfig.className}`}
                  >
                    {RoleIcon && <RoleIcon size={10} />}
                    {roleConfig.label}
                  </span>
                )}
              </div>
            </div>

            {/* Remove button */}
            {canRemove && (
              <button
                type="button"
                onClick={() => onRemove(participant.user_id)}
                disabled={isRemoving}
                className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-grey-400 hover:text-red-500 transition-all cursor-pointer disabled:cursor-not-allowed"
                aria-label={`Remove ${displayName}`}
              >
                {isRemoving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <UserMinus size={14} />
                )}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
