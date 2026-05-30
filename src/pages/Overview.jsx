import { useState } from 'react'
import TreasureMap from '../components/TreasureMap'
import LiveRankingBoard from '../components/LiveRankingBoard'
import GameArena from '../panels/GameArena'
import { useMatchScore } from '../context/MatchScoreContext'
import { playClick, toggleMute, getMuteState } from '../lib/audio'

export default function Overview() {
  const {
    currentUser,
    setShowSpin,
    setShowShop,
    setShowHelp,
    resetGame,
    getRoundTimeStatus,
    virtualClock,
    currentRoundMeta,
    completedRoundToday,
  } = useMatchScore()

  const [muted, setMuted] = useState(getMuteState())
  const inGame = currentUser.currentRound >= 1

  const handleMuteToggle = () => {
    const isMuted = toggleMute()
    setMuted(isMuted)
    playClick()
  }

  // Determine if the giro is available
  const round = currentUser.currentRound
  const timeStatus = currentRoundMeta ? getRoundTimeStatus(round, virtualClock) : 'closed'
  const spinAvailable = round >= 1 && timeStatus === 'open' && !currentUser.hasSpun && completedRoundToday
  const spinDoneToday = currentUser.hasSpun

  return (
    <div className="mx-auto w-full max-w-[520px] animate-fade-in pb-8 space-y-3">
      {/* Top Quick Actions Row */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap">
        {/* Sound button - always visible */}
        <button
          type="button"
          onClick={handleMuteToggle}
          className="rounded border border-white/[0.06] bg-[#322c45]/60 hover:bg-[#322c45]/80 px-3.5 py-2 text-sm font-bold text-[#e8edf2] transition cursor-pointer flex items-center justify-center shadow-sm"
          title="Alternar Som"
        >
          <span>{muted ? '🔇' : '🔊'}</span>
        </button>

        {/* Other actions - hidden in Lobby */}
        {inGame && (
          <>
            <button
              type="button"
              onClick={() => { playClick(); setShowHelp(true) }}
              className="rounded border border-white/[0.06] bg-[#322c45]/60 hover:bg-[#322c45]/80 px-3.5 py-2 text-[12.5px] font-bold text-[#e8edf2] transition cursor-pointer flex items-center gap-1 shadow-sm"
            >
              <span>📖</span>
              <span>Guia</span>
            </button>

            <button
              type="button"
              onClick={() => { playClick(); setShowShop(true) }}
              className="rounded border border-white/[0.06] bg-[#322c45]/60 hover:bg-[#322c45]/80 px-3.5 py-2 text-[12.5px] font-bold text-[#e8edf2] transition cursor-pointer flex items-center gap-1 shadow-sm"
            >
              <span>🛍️</span>
              <span>Loja</span>
            </button>

            <button
              type="button"
              onClick={() => { playClick(); setShowSpin(true) }}
              className="rounded border border-white/[0.06] bg-[#322c45]/60 hover:bg-[#322c45]/80 px-3.5 py-2 text-[12.5px] font-bold text-[#e8edf2] transition cursor-pointer flex items-center gap-1 shadow-sm"
            >
              <span>🎡</span>
              <span>Giro Diário</span>
            </button>
          </>
        )}
      </div>

      {/* Progress stepper */}
      <TreasureMap />

      {/* Daily Spin Prominent CTA */}
      {inGame && (
        <div>
          {spinAvailable ? (
            <button
              type="button"
              id="daily-spin-btn"
              onClick={() => { playClick(); setShowSpin(true) }}
              className="relative w-full overflow-hidden rounded-2xl border-2 border-amber-400/60 bg-gradient-to-r from-amber-500/20 via-yellow-400/15 to-amber-500/20 px-4 py-3 text-center transition active:scale-[0.98] cursor-pointer animate-pulse-slow"
            >
              {/* Shine sweep */}
              <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                <span className="absolute -inset-y-1 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-shine" />
              </span>
              <span className="relative flex items-center justify-center gap-2">
                <span className="text-xl">🎡</span>
                <span className="text-sm font-black text-amber-300 uppercase tracking-wider">Giro Diário Disponível!</span>
                <span className="text-xl">🎡</span>
              </span>
              <p className="relative text-xs text-amber-400/80 mt-0.5">
                ⏱️ Válido agora · Toque para girar grátis
              </p>
            </button>
          ) : spinDoneToday ? (
            <div className="w-full rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-2.5 text-center">
              <p className="text-xs font-bold text-emerald-400">✅ Giro diário já efetuado hoje</p>
            </div>
          ) : (
            <button
              type="button"
              id="daily-spin-locked-btn"
              onClick={() => { playClick(); setShowSpin(true) }}
              className="w-full rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-center transition hover:bg-white/[0.04] cursor-pointer"
            >
              <p className="text-xs font-bold text-[#7a8fa3]">🎡 Giro da Sorte · Fora de rodada ativa</p>
              <p className="text-[10px] text-[#7a8fa3]/60 mt-0.5">Disponível em qualquer rodada oficial ativa do dia (limite: 1 por dia)</p>
            </button>
          )}
        </div>
      )}

      {/* Main Arena */}
      <GameArena />

      {/* Live Ranking — only visible after game starts */}
      {inGame && (
        <div>
          <LiveRankingBoard />
        </div>
      )}
    </div>
  )
}
