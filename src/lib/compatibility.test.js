import { describe, it, expect } from 'vitest'
import { getCandidateAffinity, getRoundMatchAffinity } from './compatibility'

describe('getCandidateAffinity', () => {
  it('returns a value between 80 and 99', () => {
    for (let id = 1; id <= 20; id++) {
      const affinity = getCandidateAffinity(id, 5)
      expect(affinity).toBeGreaterThanOrEqual(80)
      expect(affinity).toBeLessThanOrEqual(99)
    }
  })

  it('is deterministic for the same inputs', () => {
    expect(getCandidateAffinity(3, 10)).toBe(getCandidateAffinity(3, 10))
  })

  it('returns null without candidate id', () => {
    expect(getCandidateAffinity(null)).toBeNull()
  })
})

describe('getRoundMatchAffinity', () => {
  it('returns null for round 1 (estreia)', () => {
    expect(getRoundMatchAffinity(1, 5)).toBeNull()
  })

  it('returns affinity for rounds 2+', () => {
    expect(getRoundMatchAffinity(2, 5)).toBe(getCandidateAffinity(5, 2))
  })
})
