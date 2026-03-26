import { useNavigate } from 'react-router-dom';
import {
  Pencil,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  User,
  SmilePlus,
} from 'lucide-react';
import { useMyProfile } from '../hooks/useProfile';
import { useAuthStore } from '../stores/useAuthStore';

const STATUS_CONFIG: Record<string, { color: string; ring: string; label: string }> = {
  online: { color: 'bg-leaf-500', ring: 'ring-leaf-200', label: 'En ligne' },
  away: { color: 'bg-amber-400', ring: 'ring-amber-100', label: 'Absent' },
  busy: { color: 'bg-red-500', ring: 'ring-red-200', label: 'Occupé' },
  offline: { color: 'bg-grey-300', ring: 'ring-grey-100', label: 'Hors ligne' },
  invisible: { color: 'bg-grey-300', ring: 'ring-grey-100', label: 'Invisible' },
};

const GENDER_LABELS: Record<string, string> = {
  male: 'Homme',
  female: 'Femme',
  other: 'Autre',
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso));
}

function getInitials(firstName: string | null, lastName: string | null, username: string | null) {
  if (firstName && lastName) return (firstName[0] + lastName[0]).toUpperCase();
  if (firstName) return firstName[0].toUpperCase();
  if (username) return username[0].toUpperCase();
  return '?';
}

function ProfileSkeleton() {
  return (
    <div className="flex flex-col items-center h-full bg-surface-alt animate-pulse">
      {/* Hero skeleton */}
      <div className="w-full bg-gradient-to-b from-primary-50 to-surface-alt pt-10 pb-8 flex flex-col items-center">
        <div className="w-28 h-28 rounded-full bg-grey-200" />
        <div className="mt-4 h-7 w-40 rounded-lg bg-grey-200" />
        <div className="mt-2 h-4 w-24 rounded-md bg-grey-200" />
        <div className="mt-4 h-5 w-20 rounded-full bg-grey-200" />
      </div>
      {/* Cards skeleton */}
      <div className="w-full max-w-md px-5 mt-4 space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-surface rounded-xl border border-border-light p-4">
            <div className="h-3 w-16 rounded bg-grey-200 mb-2" />
            <div className="h-4 w-36 rounded bg-grey-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { data: profile, isLoading, isError } = useMyProfile();
  const email = useAuthStore((s) => s.user?.email);

  if (isLoading) return <ProfileSkeleton />;

  if (isError || !profile) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-surface-alt px-6 gap-3">
        <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center">
          <User className="w-7 h-7 text-primary-400" />
        </div>
        <p className="text-text-muted text-sm text-center">
          Impossible de charger le profil.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[profile.status] ?? STATUS_CONFIG.offline;
  const displayName =
    profile.first_name || profile.last_name
      ? [profile.first_name, profile.last_name].filter(Boolean).join(' ')
      : profile.display_name ?? profile.username ?? 'Utilisateur';
  const initials = getInitials(profile.first_name, profile.last_name, profile.username);

  const infoRows = [
    profile.bio && {
      icon: <MessageCircle className="w-[18px] h-[18px]" />,
      label: 'Bio',
      value: profile.bio,
    },
    profile.custom_status && {
      icon: <SmilePlus className="w-[18px] h-[18px]" />,
      label: 'Statut',
      value: profile.custom_status,
    },
    profile.phone && {
      icon: <Phone className="w-[18px] h-[18px]" />,
      label: 'Téléphone',
      value: profile.phone,
    },
    email && {
      icon: <Mail className="w-[18px] h-[18px]" />,
      label: 'Email',
      value: email,
    },
    profile.gender && {
      icon: <User className="w-[18px] h-[18px]" />,
      label: 'Genre',
      value: GENDER_LABELS[profile.gender] ?? profile.gender,
    },
    profile.created_at && {
      icon: <Calendar className="w-[18px] h-[18px]" />,
      label: 'Membre depuis',
      value: formatDate(profile.created_at),
    },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string }[];

  return (
    <div className="flex flex-col items-center h-full bg-surface-alt overflow-y-auto">
      {/* ── Hero Section ── */}
      <div className="w-full bg-gradient-to-b from-primary-50 via-primary-50/40 to-surface-alt pt-10 pb-6 flex flex-col items-center relative">
        {/* Avatar */}
        <div className="relative">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={displayName}
              className="w-28 h-28 rounded-full object-cover ring-4 ring-surface shadow-lg"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center ring-4 ring-surface shadow-lg">
              <span className="font-display font-bold text-4xl text-white drop-shadow-sm">
                {initials}
              </span>
            </div>
          )}
          {/* Status dot */}
          <div
            className={`absolute bottom-1 right-1 w-6 h-6 rounded-full ${statusCfg.color} ring-[3px] ${statusCfg.ring} border-[3px] border-surface`}
            title={statusCfg.label}
          />
        </div>

        {/* Name & username */}
        <h2 className="mt-4 font-display font-bold text-2xl text-text leading-tight">
          {displayName}
        </h2>
        {profile.username && (
          <p className="mt-0.5 text-sm text-text-muted font-semibold">
            @{profile.username}
          </p>
        )}

        {/* Status badge */}
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface/70 backdrop-blur-sm border border-border-light shadow-sm">
          <span className={`w-2 h-2 rounded-full ${statusCfg.color}`} />
          <span className="text-xs font-semibold text-text-muted">
            {statusCfg.label}
          </span>
        </div>
      </div>

      {/* ── Edit Button ── */}
      <div className="w-full max-w-md px-5 mt-2">
        <button
          onClick={() => navigate('/profile/edit')}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 active:scale-[0.98] transition-all shadow-sm"
        >
          <Pencil className="w-4 h-4" />
          Modifier le profil
        </button>
      </div>

      {/* ── Info Cards ── */}
      <div className="w-full max-w-md px-5 mt-5 pb-10 space-y-2.5">
        {infoRows.map((row, i) => (
          <div
            key={i}
            className="flex items-start gap-3.5 bg-surface rounded-xl border border-border-light px-4 py-3.5 transition-shadow hover:shadow-sm"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <span className="mt-0.5 text-primary-400 shrink-0">{row.icon}</span>
            <div className="min-w-0">
              <span className="block text-[11px] font-bold text-text-light uppercase tracking-wider leading-none mb-1">
                {row.label}
              </span>
              <p className="text-sm text-text leading-snug break-words">
                {row.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
