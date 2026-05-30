import { describe, it, expect, beforeEach } from 'vitest'
import {
  STORAGE_KEY,
  serializeHiddenOptions,
  rehydrateHiddenOptions,
  saveGameState,
  loadGameState,
  clearGameState,
  createDefaultCurrentUser,
} from './gamePersistence'
import { INITIAL_VIRTUAL_CLOCK } from '../constants/game'

const storage = new Map()

function installLocalStorageMock() {
  globalThis.localStorage = {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: (key) => storage.delete(key),
    clear: () => storage.clear(),
  }
}

installLocalStorageMock()

const candidates = [
  { id: 1, nick: 'Alpha', avatar: '', vibe: 'v', redFlags: [], qualities: [] },
  { id: 2, nick: 'Beta', avatar: '', vibe: 'v', redFlags: [], qualities: [] },
]

describe('gamePersistence', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('serializes and rehydrates hidden options', () => {
    const hidden = [{ candidate: candidates[0], description: 'Test bio' }]
    const stored = serializeHiddenOptions(hidden)
    const restored = rehydrateHiddenOptions(stored, candidates)
    expect(restored).toHaveLength(1)
    expect(restored[0].candidate.nick).toBe('Alpha')
    expect(restored[0].description).toBe('Test bio')
  })

  it('saves and loads game state', () => {
    saveGameState({
      currentUser: { ...createDefaultCurrentUser(), currentRound: 3, nick: 'TestUser' },
      quizAnswers: { q1: 'a' },
      roundMatches: { 2: 1 },
      virtualClock: INITIAL_VIRTUAL_CLOCK,
      activeQuestionIndex: 2,
      hiddenOptions: [],
      selectedCandidateId: 1,
      showReveal: true,
      revealedCandidateIds: [1],
      chatLogs: [],
      likes: [],
    })

    const loaded = loadGameState(candidates)
    expect(loaded).not.toBeNull()
    expect(loaded.currentUser.nick).toBe('TestUser')
    expect(loaded.currentUser.currentRound).toBe(3)
    expect(loaded.roundMatches[2]).toBe(1)
    expect(loaded.showReveal).toBe(true)
  })

  it('clears saved state', () => {
    saveGameState({
      currentUser: createDefaultCurrentUser(),
      quizAnswers: {},
      roundMatches: {},
      virtualClock: INITIAL_VIRTUAL_CLOCK,
      activeQuestionIndex: 0,
      hiddenOptions: [],
      selectedCandidateId: null,
      showReveal: false,
      revealedCandidateIds: [],
      chatLogs: [],
      likes: [],
    })
    clearGameState()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    expect(loadGameState(candidates)).toBeNull()
  })

  it('returns null for invalid JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{broken')
    expect(loadGameState(candidates)).toBeNull()
  })
})
