import { useRef, useState } from 'react'

export default function Avatar3D() {
  const ref = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  function onMove(e: React.MouseEvent) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: py * -14, y: px * 18 })
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className="float-soft [perspective:1000px]"
    >
      <div
        className="transition-transform duration-200 ease-out"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        <svg width="150" height="255" viewBox="0 0 200 340" fill="none">
          {/* ground shadow */}
          <ellipse cx="100" cy="330" rx="46" ry="8" fill="#1A1A2E" opacity="0.15" />

          {/* legs */}
          <rect x="68" y="196" width="29" height="100" rx="14" fill="#24305c" />
          <rect x="103" y="196" width="29" height="100" rx="14" fill="#24305c" />
          <rect x="70" y="196" width="4" height="96" rx="2" fill="#f4f1e8" opacity="0.85" />
          <rect x="126" y="196" width="4" height="96" rx="2" fill="#f4f1e8" opacity="0.85" />
          <rect x="66" y="278" width="33" height="16" rx="8" fill="#1a2247" />
          <rect x="101" y="278" width="33" height="16" rx="8" fill="#1a2247" />

          {/* shoe soles */}
          <rect x="58" y="308" width="48" height="7" rx="3.5" fill="#fdf8ef" />
          <rect x="94" y="308" width="48" height="7" rx="3.5" fill="#fdf8ef" />
          {/* shoes */}
          <rect x="60" y="292" width="44" height="20" rx="10" fill="#b5342c" />
          <rect x="96" y="292" width="44" height="20" rx="10" fill="#b5342c" />
          <path d="M68 296 h20 M68 302 h20" stroke="#fdf8ef" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M104 296 h20 M104 302 h20" stroke="#fdf8ef" strokeWidth="1.6" strokeLinecap="round" />

          {/* sleeves (white shirt), tucked behind vest */}
          <path d="M60 128 Q48 132 50 160 L54 198 Q62 202 70 198 L68 130 Z" fill="#fdf8ef" />
          <path d="M140 128 Q152 132 150 160 L146 198 Q138 202 130 198 L132 130 Z" fill="#fdf8ef" />

          {/* neck */}
          <rect x="90" y="90" width="20" height="18" rx="4" fill="#ffe0c2" />

          {/* hair back / shoulder wisps */}
          <path d="M62 74 Q54 90 58 112 Q62 118 68 114 Q64 96 68 78 Z" fill="#2c2c3d" />
          <path d="M138 74 Q146 90 142 112 Q138 118 132 114 Q136 96 132 78 Z" fill="#2c2c3d" />

          {/* shirt front (fills the V-neck gap) */}
          <path d="M86 104 L100 138 L114 104 L100 118 Z" fill="#fdf8ef" />

          {/* vest torso */}
          <path
            d="M66 120 Q66 106 80 106 L90 106 L100 128 L110 106 L120 106 Q134 106 134 120 L130 196 Q100 208 70 196 Z"
            fill="#f0b429"
          />
          {/* shirt collar */}
          <path d="M86 107 L95 98 L99 111 Z" fill="#fdf8ef" />
          <path d="M114 107 L105 98 L101 111 Z" fill="#fdf8ef" />

          {/* head */}
          <circle cx="100" cy="64" r="36" fill="#ffe0c2" />

          {/* hair front */}
          <path
            d="M64 64c0-22 16-40 36-40s36 18 36 40c0-8-6-14-10-10-4-10-14-16-26-16s-22 6-26 16c-4-4-10 2-10 10z"
            fill="#2c2c3d"
          />

          {/* blush */}
          <circle cx="74" cy="76" r="6" fill="#ff8a65" opacity="0.3" />
          <circle cx="126" cy="76" r="6" fill="#ff8a65" opacity="0.3" />

          {/* glasses */}
          <circle cx="84" cy="67" r="12" stroke="#2a2a3a" strokeWidth="2.2" fill="white" fillOpacity="0.25" />
          <circle cx="116" cy="67" r="12" stroke="#2a2a3a" strokeWidth="2.2" fill="white" fillOpacity="0.25" />
          <line x1="96" y1="67" x2="104" y2="67" stroke="#2a2a3a" strokeWidth="2.2" />

          {/* eyes */}
          <circle cx="84" cy="68" r="2.6" fill="#1a1a2e" />
          <circle cx="116" cy="68" r="2.6" fill="#1a1a2e" />

          {/* smile */}
          <path d="M90 80 Q100 86 110 80" stroke="#1a1a2e" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  )
}
