import { motion } from 'framer-motion'
import { useMatchScore } from '../context/MatchScoreContext'
import { TOTAL_ROUNDS, COMPLETED_ROUND } from '../constants/game'

export default function PlayerSpotlight({ variant = 'sidebar' }) {
  const { currentUser, likes, selectedRedFlags, finalMatch, matchAffinity } =
    useMatchScore()
  const round = currentUser.currentRound

  const status =
    round === 0
      ? 'Aguardando estreia'
      : round >= COMPLETED_ROUND
        ? 'Temporada concluída'
        : `Rodada ${round}/${TOTAL_ROUNDS}`

  const isCompact = variant === 'compact'

  if (isCompact) {
    return (
      <div className="flex items-center gap-2.5 rounded-xl bg-[#1c2d3f] border border-white/[0.06] p-2 shadow-lg shadow-black/20">
        <div className="h-10 w-10 shrink-0 rounded-lg bg-[#1c2d3f] border border-white/[0.08] overflow-hidden flex items-center justify-center">
          <img
            src={currentUser.avatar}
            alt={currentUser.nick}
            className="w-auto h-auto object-none object-top"
            referrerPolicy="no-referrer"
            onError={(e) => { e.target.style.display = 'none' }}
          />
        </div>
        <div className="min-w-0 flex-1 leading-tight text-left">
          <p className="truncate text-sm font-black text-[#e8edf2]">{currentUser.nick}</p>
          <p className="text-xs text-[#7a8fa3]">{status}</p>
        </div>
        <div className="text-right text-xs font-black text-cyan-400">
          💎 {currentUser.diamonds}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      layout
      className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#162230] p-3 text-center shadow-xl shadow-black/20"
    >
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[#db2777]/10 blur-xl"
        aria-hidden
      />

      <div className="relative flex flex-col items-center">
        {/* Avatar Ring com indicador */}
        <div className="relative mb-2">
          <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-[#db2777]/30 to-[#db2777]/10 blur-sm" aria-hidden />
          <div className="relative h-16 w-16 overflow-hidden rounded-xl border-2 border-[#db2777]/50 bg-[#1c2d3f] shadow-lg shadow-[#db2777]/10">
            <img
              src={currentUser.avatar}
              alt={currentUser.nick}
              className="w-auto h-auto object-none object-top"
              referrerPolicy="no-referrer"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          </div>
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#db2777] px-1.5 py-0.5 text-xs font-black uppercase tracking-wider text-white shadow-sm">
            Você
          </span>
        </div>

        {/* Informações textuais */}
        <div className="w-full min-w-0">
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <p className="truncate text-base font-black text-[#e8edf2]">{currentUser.nick}</p>
            {currentUser.purchasedBadges?.length > 0 && (
              <div className="flex gap-0.5" aria-label="Emblemas comprados">
                {currentUser.purchasedBadges.map((badge, idx) => (
                  <span
                    key={idx}
                    title={badge}
                    className="cursor-help text-sm filter drop-shadow select-none"
                  >
                    {badge.split(' ')[0]}
                  </span>
                ))}
              </div>
            )}
          </div>
          <p className="text-xs font-bold text-[#7a8fa3] mt-0.5">{status}</p>

          {/* Grid de Estatísticas */}
          <div className="mt-2.5 grid grid-cols-3 gap-1 text-xs">
            <div className="rounded-lg bg-[#1c2d3f] border border-white/[0.06] py-1.5 font-bold text-cyan-400 shadow-sm">
              💎 {currentUser.diamonds}
            </div>
            <div className="rounded-lg bg-[#1c2d3f] border border-white/[0.06] py-1.5 font-bold text-rose-400 shadow-sm">
              ❤️ {likes.length}
            </div>
            <div className="rounded-lg bg-[#1c2d3f] border border-white/[0.06] py-1.5 font-bold text-[#7a8fa3] shadow-sm">
              🚩 {selectedRedFlags.length}/2
            </div>
          </div>

          {/* Indicadores de Power-up */}
          {(currentUser.powerups?.revealFlags || currentUser.powerups?.affinityBooster) && (
            <div className="mt-2 flex flex-wrap justify-center gap-1">
              {currentUser.powerups?.revealFlags && (
                <span className="rounded bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 text-xs font-black border border-emerald-500/20 shadow-sm">
                  👁️ Espiar
                </span>
              )}
              {currentUser.powerups?.affinityBooster && (
                <span className="rounded bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 text-xs font-black border border-emerald-500/20 shadow-sm">
                  ❤️ Booster
                </span>
              )}
            </div>
          )}

          {finalMatch && matchAffinity !== null && (
            <p className="mt-2.5 text-xs font-black text-rose-400 border-t border-dashed border-white/[0.06] pt-2">
              Match: {finalMatch.nick} · {matchAffinity}%
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
