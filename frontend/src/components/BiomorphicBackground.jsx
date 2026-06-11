
export const BiomorphicBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-bento-bg transition-colors duration-300">
      {/* Dynamic Floating Biomorphic Blobs */}
      {/* Blob 1: Top Right (Soft Emerald-ish/Theme matched) */}
      <div className="absolute top-0 right-0 w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] opacity-[0.25] dark:opacity-[0.15] translate-x-[15%] -translate-y-[15%] mix-blend-multiply dark:mix-blend-screen transition-all duration-1000 animate-biomorphic-float">
        <svg viewBox="0 0 200 200" className="w-full h-full fill-zinc-500/15 dark:fill-zinc-700/10">
          <path d="M45,-63C58,-56,69,-43,74,-28C79,-13,78,3,73,17C68,31,59,42,47,51C35,60,20,67,4,69C-12,71,-29,68,-43,60C-57,52,-68,39,-73,24C-78,9,-77,-8,-71,-22C-65,-36,-54,-47,-41,-54C-28,-61,-14,-64,1,-66C16,-68,32,-70,45,-63Z" transform="translate(100, 100)" />
        </svg>
      </div>

      {/* Blob 2: Bottom Left (Soft Neutral/Theme matched) */}
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] opacity-[0.25] dark:opacity-[0.12] -translate-x-[15%] translate-y-[15%] mix-blend-multiply dark:mix-blend-screen transition-all duration-1000 animate-biomorphic-float-reverse">
        <svg viewBox="0 0 200 200" className="w-full h-full fill-zinc-400/20 dark:fill-zinc-600/15">
          <path d="M51,-62C65,-54,77,-38,81,-20C85,-2,81,20,72,37C63,54,49,67,31,74C13,81,-7,82,-27,77C-47,72,-67,61,-76,44C-85,27,-83,4,-77,-17C-71,-38,-61,-57,-46,-65C-31,-73,-15,-70,1,-72C17,-73,34,-70,51,-62Z" transform="translate(100, 100)" />
        </svg>
      </div>

      {/* Topographic organic curves */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <g stroke="currentColor" strokeWidth="0.5" fill="none" className="text-bento-text-faint/8 dark:text-bento-text-faint/4 transition-colors duration-300">
          {/* Contour Set 1 */}
          <path d="M-100,200 C300,100 200,600 800,400 C1200,300 900,900 1300,800" />
          <path d="M-100,225 C310,120 210,615 810,415 C1210,315 910,915 1310,815" />
          <path d="M-100,250 C320,140 220,630 820,430 C1220,330 920,930 1320,830" />
          <path d="M-100,275 C330,160 230,645 830,445 C1230,345 930,945 1330,845" />

          {/* Contour Set 2 (Sweeping organic curves in top-right) */}
          <path d="M800,-50 C950,150 1100,50 1350,200" />
          <path d="M780,-50 C930,135 1085,35 1335,185" />
          <path d="M760,-50 C910,120 1070,20 1320,170" />
          <path d="M740,-50 C890,105 1055,5 1305,155" />
        </g>
      </svg>
    </div>
  );
};
