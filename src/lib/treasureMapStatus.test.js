import { describe, it, expect } from 'vitest'
import { getGameDayFromRound, getTreasureStopStatus } from './treasureMapStatus'

const dayStop = (gameDay) => ({ id: `d${gameDay}`, kind: 'day', gameDay })

describe('getGameDayFromRound', () => {
  it('returns 0 in lobby', () => {
    expect(getGameDayFromRound(0)).toBe(0)
    expect(getGameDayFromRound(1)).toBe(0)
  })

  it('returns 1 for rounds 2-6', () => {
    expect(getGameDayFromRound(2)).toBe(1)
    expect(getGameDayFromRound(6)).toBe(1)
  })

  it('returns 7 for rounds 32-36', () => {
    expect(getGameDayFromRound(32)).toBe(7)
    expect(getGameDayFromRound(36)).toBe(7)
  })

  it('returns 8 when campaign is completed', () => {
    expect(getGameDayFromRound(37)).toBe(8)
  })
})

describe('getTreasureStopStatus', () => {
  it('marks start as current in lobby', () => {
    expect(getTreasureStopStatus({ kind: 'start' }, 0)).toBe('current')
  })

  it('marks start as done after entering game', () => {
    expect(getTreasureStopStatus({ kind: 'start' }, 1)).toBe('done')
  })

  it('unlocks day stops as player progresses', () => {
    expect(getTreasureStopStatus(dayStop(1), 2)).toBe('current')
    expect(getTreasureStopStatus(dayStop(1), 7)).toBe('done')
    expect(getTreasureStopStatus(dayStop(2), 7)).toBe('current')
    expect(getTreasureStopStatus(dayStop(3), 7)).toBe('locked')
  })

  it('marks treasure as done when campaign completes', () => {
    expect(getTreasureStopStatus({ kind: 'treasure' }, 36)).toBe('locked')
    expect(getTreasureStopStatus({ kind: 'treasure' }, 37)).toBe('done')
  })
})
