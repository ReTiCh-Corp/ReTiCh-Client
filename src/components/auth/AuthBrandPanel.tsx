import { MessageSquare } from 'lucide-react';

export default function AuthBrandPanel() {
  return (
    <div className="hidden md:flex md:w-1/2 lg:w-[45%] relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 flex-col items-center justify-center p-12 text-white">
      {/* Decorative floating blobs */}
      <div
        className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-15"
        style={{
          background:
            'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute top-1/4 -right-16 w-56 h-56 rounded-full opacity-10"
        style={{
          background:
            'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute -bottom-12 left-1/4 w-64 h-64 rounded-full opacity-12"
        style={{
          background:
            'radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-1/3 -left-8 w-40 h-40 rounded-full opacity-8"
        style={{
          background:
            'radial-gradient(circle, rgba(255,255,255,0.35) 0%, transparent 70%)',
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-sm">
        {/* Logo */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/15 backdrop-blur-sm mb-8 shadow-lg shadow-primary-900/20">
          <MessageSquare className="w-10 h-10 text-white" />
        </div>

        <h2 className="font-display font-bold text-4xl lg:text-5xl mb-4 leading-tight tracking-tight">
          ReTiCh
        </h2>
        <p className="text-primary-100 text-base lg:text-lg leading-relaxed font-light">
          Discutez en temps réel avec vos proches, simplement et en toute
          sécurité.
        </p>

        {/* Decorative dots */}
        <div className="flex items-center justify-center gap-2 mt-10">
          <span className="w-2 h-2 rounded-full bg-white/40" />
          <span className="w-2 h-2 rounded-full bg-white/25" />
          <span className="w-2 h-2 rounded-full bg-white/15" />
        </div>
      </div>
    </div>
  );
}
