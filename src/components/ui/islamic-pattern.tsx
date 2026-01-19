export function IslamicPattern() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.08] dark:opacity-[0.12]">
      {/* Top Right Geometric Pattern */}
      <svg 
        className="absolute -top-10 -right-10 w-[300px] h-[300px] text-primary"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="islamic-star" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
            <path 
              d="M12.5,0 L14.5,10 L24.5,12.5 L14.5,15 L12.5,25 L10.5,15 L0,12.5 L10.5,10 Z" 
              fill="currentColor"
              fillOpacity="0.6"
            />
            <circle cx="12.5" cy="12.5" r="1.5" fill="currentColor" fillOpacity="0.8" />
          </pattern>
        </defs>
        <rect width="200" height="200" fill="url(#islamic-star)" />
      </svg>

      {/* Bottom Left Arabesque Pattern */}
      <svg 
        className="absolute -bottom-10 -left-10 w-[250px] h-[250px] text-accent rotate-45"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="arabesque" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
            <path 
              d="M15,3 Q18,9 15,15 Q12,9 15,3 Z M3,15 Q9,18 15,15 Q9,12 3,15 Z M15,27 Q18,21 15,15 Q12,21 15,27 Z M27,15 Q21,12 15,15 Q21,18 27,15 Z" 
              fill="currentColor"
              fillOpacity="0.5"
            />
          </pattern>
        </defs>
        <rect width="200" height="200" fill="url(#arabesque)" />
      </svg>

      {/* Center Mandala Pattern */}
      <svg 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] text-primary"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="mandala" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            {/* 8-pointed star */}
            <path 
              d="M30,6 L33,27 L54,30 L33,33 L30,54 L27,33 L6,30 L27,27 Z" 
              fill="currentColor"
              fillOpacity="0.3"
              stroke="currentColor"
              strokeWidth="0.3"
              strokeOpacity="0.4"
            />
            {/* Inner circle */}
            <circle cx="30" cy="30" r="12" fill="none" stroke="currentColor" strokeWidth="0.3" strokeOpacity="0.4" />
            <circle cx="30" cy="30" r="9" fill="none" stroke="currentColor" strokeWidth="0.3" strokeOpacity="0.3" />
          </pattern>
        </defs>
        <rect width="200" height="200" fill="url(#mandala)" />
      </svg>

      {/* Calligraphy Elements - Bismillah styled decorative */}
      <div className="absolute top-10 left-10 text-primary/[0.15] font-arabic text-6xl rotate-[-15deg] select-none">
        ﷽
      </div>
      <div className="absolute bottom-20 right-10 text-accent/[0.2] font-arabic text-5xl rotate-12 select-none">
        ٱللَّٰهُ
      </div>
    </div>
  );
}
