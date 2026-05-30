import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useMatchScore } from '../context/MatchScoreContext'
import { MAP_STOPS } from '../constants/treasureMap'
import { getGameDayFromRound, getTreasureStopStatus } from '../lib/treasureMapStatus'

export default function TreasureMap() {
  const { currentUser } = useMatchScore()
  const round = currentUser.currentRound
  const [tooltip, setTooltip] = useState(null)

  const currentDay = useMemo(() => getGameDayFromRound(round), [round])

  const progress = useMemo(() => {
    if (round === 0) return 0
    if (currentDay >= 8) return 100
    return ((currentDay - 0.5) / 7.5) * 100
  }, [round, currentDay])

  if (round === 0) return null

  return (
    <section
      aria-label="Progresso da jornada"
      className="rounded-2xl bg-[#162230] border border-white/[0.06] p-3 shadow-lg shadow-black/20"
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold uppercase tracking-wider text-[#7a8fa3]">
          Calendário do Reality
        </p>
        <p className="text-xs font-semibold text-[#db2777]">
          {currentDay >= 8
            ? 'Concluída!'
            : currentDay === 0
              ? 'Lobby'
              : `Dia ${currentDay} · Rodada ${((round - 2) % 3) + 1}/3`}
        </p>
      </div>

      <div className="relative py-1">
        <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 rounded-full bg-white/[0.04] pointer-events-none" />
        <div className="absolute top-1/2 left-0 h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#db2777] to-cyan-400 pointer-events-none transition-all duration-500" style={{ width: `${progress}%` }} />

        <div className="relative flex items-center justify-between z-10">
          {MAP_STOPS.map((stop) => {
            const status = getTreasureStopStatus(stop, round)
            const isCurrent = status === 'current'
            const isTooltipOpen = tooltip === stop.id

            return (
              <div key={stop.id} className="relative flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => setTooltip(isTooltipOpen ? null : stop.id)}
                  onMouseEnter={() => setTooltip(stop.id)}
                  onMouseLeave={() => setTooltip(null)}
                  className="focus:outline-none cursor-pointer"
                  aria-label={`${stop.label} · ${stop.time}`}
                >
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-black transition-all duration-300 ${
                      status === 'done'
                        ? 'bg-[#db2777] text-white shadow-sm shadow-[#db2777]/35'
                        : isCurrent
                          ? 'bg-[#db2777]/20 text-[#db2777] ring-2 ring-[#db2777]/40 shadow-glow'
                          : 'bg-[#1c2d3f] border border-white/[0.06] text-[#7a8fa3]/40'
                    }`}
                  >
                    {status === 'done' ? '✓' : stop.kind === 'day' ? stop.gameDay : stop.kind === 'start' ? '▸' : '◆'}
                  </div>
                </button>

                {isTooltipOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-8 z-30 whitespace-nowrap rounded-xl bg-[#1c2d3f] border border-white/[0.08] px-3 py-2 shadow-2xl text-left min-w-[140px]"
                  >
                    <p className="text-xs font-black text-[#e8edf2]">{stop.title ?? stop.label}</p>
                    <p className="text-[10px] text-[#7a8fa3] mt-0.5">{stop.time}</p>
                    <p className="text-[10px] text-[#db2777] mt-1 italic font-medium">{stop.hint}</p>

                    {stop.kind === 'day' && (
                      <div className="mt-2 space-y-1 border-t border-white/[0.06] pt-2">
                        {[
                          { label: 'Rodada 09h', rId: (stop.gameDay - 1) * 3 + 2 },
                          { label: 'Rodada 14h', rId: (stop.gameDay - 1) * 3 + 3 },
                          { label: 'Rodada 19h', rId: (stop.gameDay - 1) * 3 + 4 },
                        ].map((rInfo) => {
                          const isCompleted = round > rInfo.rId
                          const isCurrent = round === rInfo.rId
                          return (
                            <div
                              key={rInfo.rId}
                              className={`flex items-center justify-between gap-4 text-[10px] ${
                                isCompleted
                                  ? 'line-through text-[#7a8fa3]/50 font-normal'
                                  : isCurrent
                                    ? 'text-[#db2777] font-bold'
                                    : 'text-[#7a8fa3]'
                              }`}
                            >
                              <div className="flex items-center gap-1.5">
                                <span>{isCompleted ? '✓' : isCurrent ? '●' : '○'}</span>
                                <span>{rInfo.label}</span>
                              </div>
                              {isCurrent && (
                                <span className="text-[8px] font-black bg-[#db2777]/10 px-1 py-0.2 rounded border border-[#db2777]/20 uppercase tracking-wide text-[#db2777]">
                                  Agora
                                </span>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {stop.id === 'start' && (
                      <div className="mt-2 space-y-1 border-t border-white/[0.06] pt-2">
                        <div
                          className={`flex items-center justify-between gap-4 text-[10px] ${
                            round > 1
                              ? 'line-through text-[#7a8fa3]/50 font-normal'
                              : round === 1
                                ? 'text-[#db2777] font-bold'
                                : 'text-[#7a8fa3]'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span>{round > 1 ? '✓' : round === 1 ? '●' : '○'}</span>
                            <span>Rodada Estreia</span>
                          </div>
                          {round === 1 && (
                            <span className="text-[8px] font-black bg-[#db2777]/10 px-1 py-0.2 rounded border border-[#db2777]/20 uppercase tracking-wide text-[#db2777]">
                              Agora
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {stop.id === 'treasure' && (
                      <div className="mt-2 space-y-1 border-t border-white/[0.06] pt-2">
                        <div
                          className={`flex items-center gap-1.5 text-[10px] ${
                            round >= 23
                              ? 'line-through text-[#7a8fa3]/50 font-normal'
                              : 'text-[#7a8fa3]'
                          }`}
                        >
                          <span>{round >= 23 ? '✓' : '○'}</span>
                          <span>Grande Final</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
