import { motion } from 'motion/react';

interface OathScrollProps {
  callsign: string;
  territoryName?: string | null;
}

export function OathScroll({ callsign, territoryName }: OathScrollProps) {
  const displayTerritory = territoryName || 'سرزمین ناشناخته';

  return (
    <motion.div
      initial={{ scaleY: 0.1, opacity: 0 }}
      animate={{ scaleY: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative w-full max-w-2xl mx-auto"
      style={{ transformOrigin: 'top center' }}
    >
      {/* Scroll container */}
      <div
        className="relative rounded-lg overflow-hidden shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #e8e0cc 0%, #d4cbb3 50%, #e8e0cc 100%)',
          boxShadow: 'inset 0 0 60px rgba(42, 36, 22, 0.3), 0 20px 60px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Right edge decoration */}
        <div
          className="absolute top-0 right-0 bottom-0 w-3"
          style={{
            background: 'linear-gradient(to left, rgba(42, 36, 22, 0.4), transparent)',
          }}
        />

        {/* Left edge decoration */}
        <div
          className="absolute top-0 left-0 bottom-0 w-3"
          style={{
            background: 'linear-gradient(to right, rgba(42, 36, 22, 0.4), transparent)',
          }}
        />

        {/* Content */}
        <div className="relative px-8 py-12 md:px-16 md:py-16">
          {/* Title */}
          <h2
            className="text-center text-3xl md:text-4xl font-bold mb-8"
            style={{
              fontFamily: 'var(--font-serif-epic)',
              color: '#2a2416',
            }}
          >
            سوگند فرمانده
          </h2>

          {/* Decorative divider */}
          <div className="flex items-center justify-center mb-8">
            <div className="h-px w-16 bg-amber-900/40" />
            <div className="mx-4 text-2xl" style={{ color: '#2a2416' }}>
              ⚔
            </div>
            <div className="h-px w-16 bg-amber-900/40" />
          </div>

          {/* Oath text */}
          <div
            className="text-lg md:text-xl leading-relaxed space-y-6 text-justify"
            style={{
              fontFamily: 'var(--font-sans-body)',
              color: '#2a2416',
            }}
          >
            <p>
              من، <strong>{callsign}</strong>، فرمانده‌ی سرزمین «{displayTerritory}»، در برابر
              قلعه‌ی ذهن خود سوگند یاد می‌کنم:
            </p>

            <p>
              که از این لحظه به بعد، در نبرد با عادت‌های تاریک خویش، چون سربازی استوار خواهم ایستاد.
              هر لغزش، یک دشمن است. هر روز پاک، یک پیروزی.
            </p>

            <p>
              سوگند یاد می‌کنم که در برابر وسوسه‌ها تسلیم نشوم، در برابر خستگی عقب‌نشینی نکنم، و
              در برابر ناامیدی، پرچم امید را بر فراز قلعه‌ام برافرازم.
            </p>

            <p>
              این قلعه، ذهن من است. این سرزمین، زندگی من است. و من، فرمانده‌ی آن هستم.
            </p>

            <p className="text-center font-bold mt-8">
              به امید پیروزی،<br />
              {callsign}
            </p>
          </div>

          {/* Bottom decorative divider */}
          <div className="flex items-center justify-center mt-8">
            <div className="h-px w-16 bg-amber-900/40" />
            <div className="mx-4 text-2xl" style={{ color: '#2a2416' }}>
              ✦
            </div>
            <div className="h-px w-16 bg-amber-900/40" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
