import { useMatchScore } from '../context/MatchScoreContext'
import { TOTAL_ROUNDS, COMPLETED_ROUND } from '../constants/game'
import { playClick } from '../lib/audio'

export default function AdvanceButton({ disabled }) {
  const { currentUser, payAndAdvance, isRoundComplete } = useMatchScore()
  const round = currentUser.currentRound
  const nextRound = round + 1
  const isFinalRound = round === TOTAL_ROUNDS
  const canAdvance = !disabled && isRoundComplete(round)

  const handleAdvance = () => {
    if (!canAdvance) return
    playClick()
    payAndAdvance(nextRound, 0) // No diamond cost paid upon advancing
  }

  if (round >= COMPLETED_ROUND) return null

  return (
    <button
      type="button"
      disabled={!canAdvance}
      onClick={handleAdvance}
      className={`mt-4 w-full rounded-xl py-3 text-base font-semibold transition active:scale-[0.98] cursor-pointer ${
        canAdvance
          ? 'bg-[#db2777] hover:bg-[#ec4899] text-white shadow-lg shadow-[#db2777]/20'
          : 'bg-white/5 text-white/20 cursor-not-allowed'
      }`}
    >
      {isFinalRound
        ? 'Ver stories e resultados 🎬'
        : 'Aguardar próxima rodada ⏳'}
    </button>
  )
}
