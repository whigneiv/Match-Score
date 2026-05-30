import { ROUNDS } from '../constants/game'

export function getRoundTimeStatus(roundId, clock) {
  const round = ROUNDS.find((r) => r.id === roundId)
  if (!round) return 'closed'

  const schedMin = (round.day - 1) * 24 * 60 + round.hour * 60
  const clockMin = (clock.day - 1) * 24 * 60 + clock.hour * 60 + clock.minute
  const windowSize = round.id === 1 ? 24 * 60 : 10

  if (clockMin < schedMin) return 'upcoming'
  if (clockMin <= schedMin + windowSize) return 'open'
  return 'expired'
}
