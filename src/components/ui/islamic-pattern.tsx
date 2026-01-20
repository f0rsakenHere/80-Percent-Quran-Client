export function IslamicPattern() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Calligraphy Background Image */}
      <div 
        className="absolute inset-0 opacity-[0.06] dark:opacity-[0.10]"
        style={{
          backgroundImage: 'url(/bg-pattern.jpg)',
          backgroundSize: '150%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background/70" />
      
      {/* Geometric Patterns */}
      <div className="opacity-[0.05] dark:opacity-[0.08]">
        {/* Top Right Geometric Pattern */}
        <svg 
          className="absolute -top-5 -right-5 w-[180px] h-[180px] text-primary"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="islamic-star" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path 
                d="M10,0 L11.5,8 L19.5,10 L11.5,12 L10,20 L8.5,12 L0,10 L8.5,8 Z" 
                fill="currentColor"
                fillOpacity="0.5"
              />
              <circle cx="10" cy="10" r="1" fill="currentColor" fillOpacity="0.6" />
            </pattern>
          </defs>
          <rect width="200" height="200" fill="url(#islamic-star)" />
        </svg>

        {/* Bottom Left Arabesque Pattern */}
        <svg 
          className="absolute -bottom-5 -left-5 w-[150px] h-[150px] text-accent rotate-45"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="arabesque" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path 
                d="M10,2 Q12,6 10,10 Q8,6 10,2 Z M2,10 Q6,12 10,10 Q6,8 2,10 Z M10,18 Q12,14 10,10 Q8,14 10,18 Z M18,10 Q14,8 10,10 Q14,12 18,10 Z" 
                fill="currentColor"
                fillOpacity="0.4"
              />
            </pattern>
          </defs>
          <rect width="200" height="200" fill="url(#arabesque)" />
        </svg>

        {/* Center Mandala Pattern */}
        <svg 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] text-primary"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="mandala" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              {/* 8-pointed star */}
              <path 
                d="M20,4 L22,18 L36,20 L22,22 L20,36 L18,22 L4,20 L18,18 Z" 
                fill="currentColor"
                fillOpacity="0.2"
                stroke="currentColor"
                strokeWidth="0.2"
                strokeOpacity="0.3"
              />
              {/* Inner circle */}
              <circle cx="20" cy="20" r="8" fill="none" stroke="currentColor" strokeWidth="0.2" strokeOpacity="0.3" />
              <circle cx="20" cy="20" r="6" fill="none" stroke="currentColor" strokeWidth="0.2" strokeOpacity="0.2" />
            </pattern>
          </defs>
          <rect width="200" height="200" fill="url(#mandala)" />
        </svg>

        {/* Calligraphy Elements - Hidden on mobile, visible on desktop */}
        <div className="hidden md:block absolute top-8 left-8 text-primary/[0.1] font-arabic text-4xl rotate-[-15deg] select-none">
          ﷽
        </div>
        <div className="hidden md:block absolute bottom-16 right-8 text-accent/[0.12] font-arabic text-3xl rotate-12 select-none">
          ٱللَّٰهُ
        </div>
      </div>
    </div>
  );
}
