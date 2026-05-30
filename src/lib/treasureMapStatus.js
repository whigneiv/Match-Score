import { COMPLETED_ROUND } from '../constants/game'

export function getGameDayFromRound(currentRound) {
  if (currentRound <= 1) return 0
  if (currentRound >= COMPLETED_ROUND) return 8
  return Math.floor((currentRound - 2) / 3) + 1
}

export function getTreasureStopStatus(stop, currentRound) {
  if (stop.kind === 'start') {
    return currentRound > 0 ? 'done' : 'current'
  }
  if (stop.kind === 'treasure') {
    return currentRound >= COMPLETED_ROUND ? 'done' : 'locked'
  }
  const gameDay = stop.gameDay
  const currentDay = getGameDayFromRound(currentRound)
  if (currentDay > gameDay) return 'done'
  if (currentDay < gameDay) return 'locked'
  return 'current'
}
