import { useMatchScore } from '../context/MatchScoreContext'
import { FICTIONAL_RANKING } from '../constants/fictionalRanking'
import { TOTAL_ROUNDS } from '../constants/game'

const medal = ['🥇', '🥈', '🥉']

function participantScore(likes, round) {
  // 5 pts per round + 5 pts per radar (avg 3 appearances per round) + 10 pts per match + 20 pts per reciprocal match (approx half)
  const roundPts = Math.min(round, TOTAL_ROUNDS) * 5
  const radarPts = Math.min(round, TOTAL_ROUNDS) * 3 * 5
  const matchPts = likes.length * 10
  const reciprocalPts = Math.floor(likes.length / 2) * 20
  return 50 + roundPts + radarPts + matchPts + reciprocalPts
}

function PlaceholderRow({ rank, index }) {
  return (
    <li className="flex items-center gap-2 px-3 py-2">
      <span className="w-4 shrink-0 text-center text-xs text-[#7a8fa3]">
        {medal[index] ?? <span className="text-xs font-bold text-[#7a8fa3]">{rank}</span>}
      </span>
      <div className="h-6 w-6 shrink-0 rounded-full border border-dashed border-white/[0.10] bg-[#1c2d3f] flex items-center justify-center text-[10px] text-[#7a8fa3]/50">
        👤
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="h-2 w-20 rounded-full bg-white/[0.06] animate-pulse" />
      </div>
      <span className="shrink-0 text-xs font-bold text-white/[0.08]">---</span>
    </li>
  )
}

export default function LiveRankingBoard() {
  const { currentUser, finalMatch, matchAffinity, likes, virtualClock, openHelp } = useMatchScore()
  const { top, azarao } = FICTIONAL_RANKING
  const yourScore = participantScore(likes, currentUser.currentRound)

  // Show placeholders if still in lobby / Round 1
  const isEarlyStage = currentUser.currentRound <= 1

  return (
    <div className="rounded-2xl bg-[#162230] border border-white/[0.06] shadow-xl shadow-black/20 overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-2.5 py-2">
        <p className="text-xs font-bold uppercase tracking-wider text-[#db2777]">Placar Geral do Reality</p>
        <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-xs font-semibold text-emerald-400">
          <span className="h-1 w-1 animate-pulse rounded-full bg-emerald-500" />
          Atualizado às {String(virtualClock.hour).padStart(2, '0')}:{String(virtualClock.minute).padStart(2, '0')}h
        </span>
      </div>

      {/* Current player row */}
      <div className="border-b border-[#db2777]/15 bg-gradient-to-r from-[#db2777]/10 to-transparent px-2.5 py-2.5">
        <p className="mb-1.5 text-center text-xs font-bold uppercase tracking-wide text-[#db2777]">
          Seu Desempenho
        </p>
        <div className="flex items-center gap-2">
          <div className="relative shrink-0">
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-[#db2777]/30 to-[#db2777]/10 blur-sm" />
            <div className="relative h-12 w-12 rounded-xl border-2 border-[#db2777]/50 bg-[#1c2d3f] overflow-hidden flex items-center justify-center shadow-md">
              {currentUser.currentRound === 0 ? (
                <span className="text-xl text-[#7a8fa3]/50">👤</span>
              ) : (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.nick}
                  className="w-auto h-auto object-none object-top"
                  referrerPolicy="no-referrer"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              )}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-black text-[#e8edf2]">
              {currentUser.currentRound === 0 ? 'Aguardando...' : currentUser.nick}
            </p>
            <p className="text-xs font-semibold text-[#db2777]">
              {currentUser.currentRound === 0 ? 'Entre no reality' : 'Você · Participante'}
            </p>
          </div>
          <div className="text-right flex flex-col items-end">
            <button
              type="button"
              onClick={() => openHelp('ranking', 'yours')}
              className="text-base font-black text-[#db2777] underline hover:text-[#ec4899] transition cursor-pointer text-right block"
            >
              {isEarlyStage ? '---' : yourScore}
            </button>
            <button
              type="button"
              onClick={() => openHelp('ranking', 'yours')}
              className="text-[10px] font-bold text-[#7a8fa3] underline hover:text-[#e8edf2] transition cursor-pointer text-right block mt-0.5"
            >
              Sua pontuação
            </button>
          </div>
        </div>
      </div>

      <p className="bg-[#1c2d3f]/50 px-2 py-1 text-center text-xs text-[#7a8fa3]">
        {isEarlyStage ? 'Ranking disponível a partir da Rodada 2' : 'Top global da temporada'}
      </p>

      {/* Ranking list */}
      <ul className="divide-y divide-white/[0.04]">
        {isEarlyStage
          ? Array.from({ length: 5 }).map((_, i) => (
              <PlaceholderRow key={i} rank={i + 1} index={i} />
            ))
          : top.map((player, i) => (
              <li key={player.nick} className="flex items-center gap-2 px-3 py-2">
                <span className="w-4 shrink-0 text-center text-xs">
                  {medal[i] ?? <span className="text-xs font-bold text-[#7a8fa3]">{player.rank}</span>}
                </span>
                <div className="h-6 w-6 shrink-0 rounded-full border border-white/[0.08] bg-[#1c2d3f] overflow-hidden flex items-center justify-center">
                  <img
                    src={player.avatar}
                    alt={player.nick}
                    className="w-auto h-auto object-none object-top"
                    referrerPolicy="no-referrer"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                </div>
                <p className="min-w-0 flex-1 truncate text-xs font-semibold text-[#e8edf2]">{player.nick}</p>
                <span className="shrink-0 text-xs font-bold text-[#7a8fa3]">{player.score}</span>
              </li>
            ))}
      </ul>

      {/* Azarão row */}
      {!isEarlyStage && (
        <div className="flex items-center gap-2 border-t border-dashed border-white/[0.06] bg-[#1c2d3f]/30 px-2.5 py-2">
          <span className="text-xs">😢</span>
          <div className="h-6 w-6 shrink-0 bg-[#1c2d3f] rounded-full border border-white/[0.08] overflow-hidden flex items-center justify-center opacity-75">
            <img
              src={azarao.avatar}
              alt={azarao.nick}
              className="w-auto h-auto object-none object-top"
              referrerPolicy="no-referrer"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          </div>
          <p className="min-w-0 flex-1 truncate text-xs text-[#7a8fa3]">{azarao.nick}</p>
          <span className="text-xs text-[#7a8fa3]/60">{azarao.score}</span>
        </div>
      )}

      {finalMatch && matchAffinity !== null && (
        <div className="border-t border-[#db2777]/15 bg-[#db2777]/5 px-2 py-1.5 text-center">
          <p className="text-xs font-bold text-rose-400">
            Seu match: {finalMatch.nick} · {matchAffinity}%
          </p>
        </div>
      )}
    </div>
  )
}
