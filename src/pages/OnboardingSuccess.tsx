import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const REDIRECT_SECONDS = 5;

const CONFETTI_COLORS = [
  '#e14d74', // primary-500
  '#ed7896', // primary-400
  '#cd2d5a', // primary-600
  '#22c55e', // leaf-500
  '#4ade80', // leaf-400
  '#f4a9ba', // primary-300
  '#fce7eb', // primary-100
  '#86efac', // leaf-300
  '#f9d0d9', // primary-200
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  gravity: number;
  drag: number;
  opacity: number;
  fadeRate: number;
  shape: 'rect' | 'circle' | 'strip';
}

function createBurst(
  cx: number,
  cy: number,
  count: number,
  spread: number,
  power: number,
): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = spread * (Math.random() - 0.5) + Math.PI * 1.5;
    const speed = power * (0.4 + Math.random() * 0.6);
    const shapes: Particle['shape'][] = ['rect', 'circle', 'strip'];
    particles.push({
      x: cx + (Math.random() - 0.5) * 20,
      y: cy + (Math.random() - 0.5) * 10,
      vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 3,
      vy: Math.sin(angle) * speed,
      w: 4 + Math.random() * 8,
      h: 3 + Math.random() * 5,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.3,
      gravity: 0.12 + Math.random() * 0.08,
      drag: 0.98 + Math.random() * 0.015,
      opacity: 1,
      fadeRate: 0.003 + Math.random() * 0.004,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    });
  }
  return particles;
}

export default function OnboardingSuccess() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);

  const goHome = useCallback(() => {
    navigate('/', { replace: true });
  }, [navigate]);

  // Countdown + redirect
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          goHome();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [goHome]);

  // Confetti canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Launch bursts from multiple origins
    const w = canvas.width;
    const h = canvas.height;

    // Center burst — big and dramatic
    particlesRef.current = [
      ...createBurst(w * 0.5, h * 0.45, 80, Math.PI * 2, 14),
      // Left burst
      ...createBurst(w * 0.15, h * 0.6, 40, Math.PI * 1.2, 10),
      // Right burst
      ...createBurst(w * 0.85, h * 0.6, 40, Math.PI * 1.2, 10),
      // Top-left cascade
      ...createBurst(w * 0.3, h * 0.2, 30, Math.PI * 0.8, 8),
      // Top-right cascade
      ...createBurst(w * 0.7, h * 0.2, 30, Math.PI * 0.8, 8),
    ];

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter((p) => p.opacity > 0.01);

      for (const p of particlesRef.current) {
        p.vy += p.gravity;
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.opacity -= p.fadeRate;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        } else if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.w / 2, -1, p.w, 2.5);
        }

        ctx.restore();
      }

      if (particlesRef.current.length > 0) {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    };

    // Slight delay so the card animation starts first
    const timer = setTimeout(() => {
      animFrameRef.current = requestAnimationFrame(animate);
    }, 300);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrameRef.current);
      clearTimeout(timer);
    };
  }, []);

  const progress = ((REDIRECT_SECONDS - secondsLeft) / REDIRECT_SECONDS) * 100;

  return (
    <div className="min-h-dvh flex items-center justify-center bg-grey-50 relative overflow-hidden">
      {/* Confetti canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 20 }}
      />

      {/* Soft radial glow behind card */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, var(--color-primary-100) 0%, var(--color-leaf-50) 50%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
        }}
      />

      {/* Card */}
      <div
        className="relative w-full max-w-sm mx-4"
        style={{
          zIndex: 10,
          animation: 'onboarding-success-card-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        }}
      >
        <div className="bg-white rounded-3xl shadow-xl shadow-grey-200/60 border border-border-light px-8 pt-12 pb-10 text-center">
          {/* Animated checkmark */}
          <div
            className="relative w-24 h-24 mx-auto mb-6"
            style={{
              animation:
                'onboarding-success-bounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both',
            }}
          >
            {/* Pulse rings */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                backgroundColor: 'var(--color-leaf-100)',
                animation:
                  'onboarding-success-pulse 1.2s cubic-bezier(0, 0, 0.2, 1) 0.5s both',
              }}
            />
            <div
              className="absolute inset-0 rounded-full"
              style={{
                backgroundColor: 'var(--color-leaf-50)',
                animation:
                  'onboarding-success-pulse-wide 1.2s cubic-bezier(0, 0, 0.2, 1) 0.7s both',
              }}
            />

            {/* Circle + Check SVG */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 52 52" className="w-20 h-20" aria-hidden="true">
                <circle
                  cx="26"
                  cy="26"
                  r="24"
                  fill="none"
                  stroke="var(--color-leaf-500)"
                  strokeWidth="2.5"
                  style={{
                    strokeDasharray: 151,
                    strokeDashoffset: 151,
                    strokeLinecap: 'round',
                    animation:
                      'onboarding-success-circle 0.7s cubic-bezier(0.65, 0, 0.35, 1) 0.4s forwards',
                  }}
                />
                <path
                  d="M15 27l7 7 15-15"
                  fill="none"
                  stroke="var(--color-leaf-600)"
                  strokeWidth="3"
                  style={{
                    strokeDasharray: 36,
                    strokeDashoffset: 36,
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                    animation:
                      'onboarding-success-check 0.4s cubic-bezier(0.65, 0, 0.35, 1) 0.9s forwards',
                  }}
                />
              </svg>
            </div>
          </div>

          {/* Text content */}
          <div
            style={{
              animation:
                'onboarding-success-fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.7s both',
            }}
          >
            <h1 className="font-display font-bold text-2xl text-text mb-2">
              {t('onboarding.welcome')}
            </h1>
            <p className="text-sm text-text-muted leading-relaxed mb-8">
              {t('onboarding.profileReady')}
            </p>

            {/* CTA Button */}
            <button
              type="button"
              onClick={goHome}
              className="w-full py-3 px-6 rounded-xl font-semibold text-white text-sm transition-all duration-200 hover:shadow-lg hover:shadow-primary-200/40 active:scale-[0.98] cursor-pointer"
              style={{
                background:
                  'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-600) 100%)',
              }}
            >
              {t('onboarding.goToApp')}
            </button>

            {/* Countdown */}
            <p className="text-xs text-text-light mt-4">
              {t('onboarding.redirectCountdown', { seconds: secondsLeft })}
            </p>

            {/* Progress bar */}
            <div className="mt-3 h-1 rounded-full bg-grey-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-linear"
                style={{
                  width: `${progress}%`,
                  background:
                    'linear-gradient(90deg, var(--color-primary-400), var(--color-primary-500))',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Keyframes injected via style tag */}
      <style>{`
        @keyframes onboarding-success-card-in {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes onboarding-success-bounce {
          from {
            opacity: 0;
            transform: scale(0.3);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes onboarding-success-pulse {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(2); opacity: 0; }
        }

        @keyframes onboarding-success-pulse-wide {
          0% { transform: scale(1); opacity: 0.25; }
          100% { transform: scale(2.5); opacity: 0; }
        }

        @keyframes onboarding-success-circle {
          to { stroke-dashoffset: 0; }
        }

        @keyframes onboarding-success-check {
          to { stroke-dashoffset: 0; }
        }

        @keyframes onboarding-success-fade-up {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
