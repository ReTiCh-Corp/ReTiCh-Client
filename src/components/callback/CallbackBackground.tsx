export default function CallbackBackground() {
  return (
    <>
      {/* Background texture — subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, var(--color-primary-600) 0.8px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Soft radial glow behind card */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-30 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, var(--color-primary-100) 0%, transparent 70%)',
        }}
      />
    </>
  );
}
