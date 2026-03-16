export default function Profile() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-surface-alt px-6 py-10">
      {/* Avatar */}
      <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mb-4 relative">
        <span className="font-display font-bold text-3xl text-primary-700">
          LR
        </span>
        <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-leaf-500 border-[3px] border-surface-alt" />
      </div>

      <h2 className="font-display font-bold text-xl text-text mb-0.5">
        Lucas Rimbault
      </h2>
      <p className="text-sm text-text-muted mb-6">lucas@retich.app</p>

      {/* Info cards */}
      <div className="w-full max-w-sm space-y-3">
        <div className="bg-white rounded-xl border border-border-light p-4">
          <span className="text-[11px] font-semibold text-grey-500 uppercase tracking-wider">
            Phone
          </span>
          <p className="text-sm text-text mt-1">+33 6 12 34 56 78</p>
        </div>
        <div className="bg-white rounded-xl border border-border-light p-4">
          <span className="text-[11px] font-semibold text-grey-500 uppercase tracking-wider">
            Status
          </span>
          <p className="text-sm text-text mt-1">Sky is the limit</p>
        </div>
        <div className="bg-white rounded-xl border border-border-light p-4">
          <span className="text-[11px] font-semibold text-grey-500 uppercase tracking-wider">
            Member since
          </span>
          <p className="text-sm text-text mt-1">March 2026</p>
        </div>
      </div>
    </div>
  );
}
