import { useMatchScore } from '../context/MatchScoreContext'
import { HUBBE_RARES } from '../constants/game'

export default function RaresInventory() {
  const { currentUser } = useMatchScore()
  const unlocked = currentUser.unlockedRares || []

  return (
    <div className="h-full rounded-2xl bg-[#162230] border border-white/[0.06] shadow-xl shadow-black/20 p-3">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 mb-3">
        <p className="text-xs font-bold uppercase tracking-wider text-[#db2777]">🎒 Seus Raros do Hubbe</p>
        <span className="rounded-full bg-[#db2777]/10 px-2 py-0.5 text-xs font-black text-[#db2777]">
          {unlocked.length}/{HUBBE_RARES.length}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {HUBBE_RARES.map((rare) => {
          const isUnlocked = unlocked.includes(rare.id)

          return (
            <div
              key={rare.id}
              className={`group relative flex flex-col items-center justify-center rounded-xl border p-2 transition duration-200 select-none ${
                isUnlocked
                  ? 'border-amber-500/20 bg-amber-500/5 shadow-sm shadow-amber-500/10'
                  : 'border-white/[0.06] bg-[#1c2d3f]/50 opacity-40'
              }`}
            >
              {/* Ícone do raro em pixel art (tamanho real) */}
              <div className="h-10 w-10 shrink-0 overflow-hidden flex items-center justify-center">
                <img
                  src={rare.imageUrl}
                  alt={rare.name}
                  className={`w-auto h-auto object-none object-center transition duration-300 group-hover:scale-110 ${
                    isUnlocked ? 'filter drop-shadow-md' : 'grayscale brightness-75'
                  }`}
                  referrerPolicy="no-referrer"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              </div>

              {/* Nome reduzido */}
              <span className="mt-1 text-xs font-bold text-[#7a8fa3] text-center truncate w-full">
                {rare.name.split(' ')[0]}
              </span>

              {/* Cadeado para bloqueados */}
              {!isUnlocked && (
                <span className="absolute right-1 top-1 text-xs" title="Bloqueado">
                  🔒
                </span>
              )}

              {/* Tooltip customizado */}
              <div className="pointer-events-none absolute bottom-full mb-2 left-1/2 z-50 -translate-x-1/2 scale-75 opacity-0 transition-all duration-150 group-hover:scale-100 group-hover:opacity-100 w-44 rounded-lg bg-[#1a1625]/95 p-2 text-center text-xs text-[#e8edf2] shadow-lg backdrop-blur border border-white/[0.08]">
                <p className="font-extrabold text-[#db2777]">{rare.name}</p>
                <p className="mt-0.5 text-[#7a8fa3] leading-normal">{rare.desc}</p>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1a1625]" />
              </div>
            </div>
          )
        })}
      </div>

      <p className="mt-3 text-center text-xs text-[#7a8fa3]">
        Ganhe raros no <strong className="text-[#e8edf2]">Giro Diário</strong> ou em momentos da rota!
      </p>
    </div>
  )
}
