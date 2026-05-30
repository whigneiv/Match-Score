import { describe, it, expect } from 'vitest'
import { getRoundTimeStatus } from './roundTime'
import { INITIAL_VIRTUAL_CLOCK } from '../constants/game'

describe('getRoundTimeStatus', () => {
  it('returns open when clock is at round 1 start', () => {
    expect(getRoundTimeStatus(1, INITIAL_VIRTUAL_CLOCK)).toBe('open')
  })

  it('returns upcoming before round 1 schedule', () => {
    expect(getRoundTimeStatus(1, { day: 30, hour: 11, minute: 59 })).toBe('upcoming')
  })

  it('returns expired after round 1 window (24h)', () => {
    expect(getRoundTimeStatus(1, { day: 32, hour: 9, minute: 1 })).toBe('expired')
  })

  it('returns open within 10 min window for round 2', () => {
    expect(getRoundTimeStatus(2, { day: 31, hour: 9, minute: 5 })).toBe('open')
  })

  it('returns expired after 10 min window for round 2', () => {
    expect(getRoundTimeStatus(2, { day: 31, hour: 9, minute: 11 })).toBe('expired')
  })

  it('returns closed for unknown round', () => {
    expect(getRoundTimeStatus(99, INITIAL_VIRTUAL_CLOCK)).toBe('closed')
  })
})
