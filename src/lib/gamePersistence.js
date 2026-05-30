import { INITIAL_VIRTUAL_CLOCK } from '../constants/game'

export const STORAGE_KEY = 'match-score-save'
export const STORAGE_VERSION = 1

export function createDefaultCurrentUser() {
  return {
    nick: 'Fagulha',
    avatar: 'https://hubbe.biz/avatar/Fagulha',
    diamonds: 500,
    currentRound: 0,
    enteredRounds: [1],
    purchasedBadges: [],
    powerups: {
      revealFlags: false,
      boost: false,
      radarExtra: false,
      espiarCharges: 0,
      mudarVibeCharges: 0,
    },
    unlockedRares: [],
    hasSpun: false,
  }
}

export function createDefaultChatLogs() {
  return [
    {
      id: 1,
      sender: 'Sunny',
      msg: 'Bem-vindo ao reality Match Score! 🌴',
      avatar: 'https://hubbe.biz/avatar/Sunny',
      time: '08:30',
    },
    {
      id: 2,
      sender: 'AFKinho',
      msg: 'Alguém me paga um HC de graça? kkkkk',
      avatar: 'https://hubbe.biz/avatar/AFKinho',
      time: '08:31',
    },
  ]
}

export function serializeHiddenOptions(hiddenOptions) {
  return hiddenOptions.map((opt) => ({
    candidateId: opt.candidate.id,
    description: opt.description,
  }))
}

export function rehydrateHiddenOptions(stored, candidates) {
  if (!Array.isArray(stored) || stored.length === 0) return []
  return stored
    .map(({ candidateId, description }) => {
      const candidate = candidates.find((c) => c.id === candidateId)
      if (!candidate) return null
      return { candidate, description }
    })
    .filter(Boolean)
}

export function buildSavePayload(state) {
  return {
    version: STORAGE_VERSION,
    savedAt: Date.now(),
    currentUser: state.currentUser,
    quizAnswers: state.quizAnswers,
    roundMatches: state.roundMatches,
    virtualClock: state.virtualClock,
    activeQuestionIndex: state.activeQuestionIndex,
    hiddenOptions: serializeHiddenOptions(state.hiddenOptions),
    selectedCandidateId: state.selectedCandidateId,
    showReveal: state.showReveal,
    revealedCandidateIds: state.revealedCandidateIds,
    chatLogs: state.chatLogs,
    likes: state.likes,
  }
}

export function loadGameState(candidates = []) {
  if (typeof localStorage === 'undefined') return null

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const data = JSON.parse(raw)
    if (data.version !== STORAGE_VERSION) return null

    return {
      currentUser: { ...createDefaultCurrentUser(), ...data.currentUser },
      quizAnswers: data.quizAnswers ?? {},
      roundMatches: data.roundMatches ?? {},
      virtualClock: data.virtualClock ?? INITIAL_VIRTUAL_CLOCK,
      activeQuestionIndex: data.activeQuestionIndex ?? 0,
      hiddenOptions: rehydrateHiddenOptions(data.hiddenOptions, candidates),
      selectedCandidateId: data.selectedCandidateId ?? null,
      showReveal: Boolean(data.showReveal),
      revealedCandidateIds: data.revealedCandidateIds ?? [],
      chatLogs: data.chatLogs ?? createDefaultChatLogs(),
      likes: data.likes ?? [],
    }
  } catch {
    return null
  }
}

export function saveGameState(state) {
  if (typeof localStorage === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(buildSavePayload(state)))
  } catch {
    // Quota exceeded or private mode — ignore silently
  }
}

export function clearGameState() {
  if (typeof localStorage === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}
