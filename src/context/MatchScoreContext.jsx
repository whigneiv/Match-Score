/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react'
import { USER_PARTICIPANTS, SEASON_GUEST } from '../constants/participants'
import { ROUNDS, COMPLETED_ROUND, HUBBE_RARES, TOTAL_ROUNDS, INITIAL_VIRTUAL_CLOCK } from '../constants/game'
import { getRoundTimeStatus as computeRoundTimeStatus } from '../lib/roundTime'
import {
  loadGameState,
  saveGameState,
  clearGameState,
  createDefaultCurrentUser,
  createDefaultChatLogs,
} from '../lib/gamePersistence'

const avatarUrl = (nick) => `https://hubbe.biz/avatar/${nick}`

function buildInitialCandidates() {
  let id = 1
  const list = USER_PARTICIPANTS.map((p) => ({
    id: id++,
    nick: p.nick,
    avatar: avatarUrl(p.nick),
    vibe: p.vibe,
    redFlags: p.redFlags,
    qualities: p.qualities,
    isGuest: false,
  }))
  if (SEASON_GUEST.enabled) {
    list.push({
      id: id++,
      nick: SEASON_GUEST.nick,
      avatar: avatarUrl(SEASON_GUEST.nick),
      vibe: SEASON_GUEST.vibe,
      redFlags: SEASON_GUEST.redFlags,
      qualities: SEASON_GUEST.qualities,
      isGuest: true,
    })
  }
  return list
}

import { getSeededRandom, seededShuffle } from '../lib/seededShuffle'

const MatchScoreContext = createContext(null)

const INITIAL_CANDIDATES = buildInitialCandidates()

function createFreshUser() {
  const defaults = createDefaultCurrentUser()
  return {
    ...defaults,
    avatar: avatarUrl(defaults.nick),
  }
}

export function MatchScoreProvider({ children }) {
  const [persisted] = useState(() => loadGameState(INITIAL_CANDIDATES))

  const [currentUser, setCurrentUser] = useState(() => persisted?.currentUser ?? createFreshUser())

  const [candidates] = useState(() => INITIAL_CANDIDATES)
  const [likes, setLikes] = useState(() => persisted?.likes ?? [])
  const [quizAnswers, setQuizAnswers] = useState(() => persisted?.quizAnswers ?? {})
  const [revealedCandidateIds, setRevealedCandidateIds] = useState(
    () => persisted?.revealedCandidateIds ?? [],
  )

  const [chatLogs, setChatLogs] = useState(() => persisted?.chatLogs ?? createDefaultChatLogs())

  const [virtualClock, setVirtualClock] = useState(
    () => persisted?.virtualClock ?? INITIAL_VIRTUAL_CLOCK,
  )
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(
    () => persisted?.activeQuestionIndex ?? 0,
  )
  const [hiddenOptions, setHiddenOptions] = useState(() => persisted?.hiddenOptions ?? [])
  const [selectedCandidateId, setSelectedCandidateId] = useState(
    () => persisted?.selectedCandidateId ?? null,
  )
  const [showReveal, setShowReveal] = useState(() => persisted?.showReveal ?? false)
  const [roundMatches, setRoundMatches] = useState({})
  const [showDailyCeremony, setShowDailyCeremony] = useState(false)
  const [ceremonyData, setCeremonyData] = useState(null)
  const [pendingAdvance, setPendingAdvance] = useState(null)
  const [showShop, setShowShop] = useState(false)
  const [showSpin, setShowSpin] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [helpActiveTab, setHelpActiveTab] = useState('start')
  const [helpActiveSubTab, setHelpActiveSubTab] = useState('global')

  const openHelp = useCallback((tab = 'start', subTab = 'global') => {
    setHelpActiveTab(tab)
    setHelpActiveSubTab(subTab)
    setShowHelp(true)
  }, [])

  useEffect(() => {
    saveGameState({
      currentUser,
      quizAnswers,
      roundMatches,
      virtualClock,
      activeQuestionIndex,
      hiddenOptions,
      selectedCandidateId,
      showReveal,
      revealedCandidateIds,
      chatLogs,
      likes,
    })
  }, [
    currentUser,
    quizAnswers,
    roundMatches,
    virtualClock,
    activeQuestionIndex,
    hiddenOptions,
    selectedCandidateId,
    showReveal,
    revealedCandidateIds,
    chatLogs,
    likes,
  ])

  const currentRoundMeta = useMemo(() => {
    const r = currentUser.currentRound
    if (r < 1 || r > TOTAL_ROUNDS) return null
    const roundObj = ROUNDS[r - 1]
    if (!roundObj) return null

    const seed = `${currentUser.nick}_r${r}`
    const rng = getSeededRandom(seed)
    
    // Shuffle the list of questions
    const shuffledQuestions = seededShuffle(roundObj.questions, rng)
    
    // For each question, shuffle its options
    const fullyShuffledQuestions = shuffledQuestions.map((q) => {
      const qRng = getSeededRandom(`${seed}_q_${q.id}`)
      return {
        ...q,
        options: seededShuffle(q.options, qRng)
      }
    })

    return {
      ...roundObj,
      questions: fullyShuffledQuestions
    }
  }, [currentUser.currentRound, currentUser.nick])

  const addChatLog = useCallback((msg, sender, customAvatar) => {
    setChatLogs((prev) => {
      const id = prev.length ? prev[prev.length - 1].id + 1 : 1
      const timeStr = `${String(virtualClock.hour).padStart(2, '0')}:${String(virtualClock.minute).padStart(2, '0')}`
      return [
        ...prev,
        { id, sender, msg, avatar: customAvatar || avatarUrl(sender), time: timeStr }
      ].slice(-25)
    })
  }, [virtualClock.hour, virtualClock.minute])

  // Virtual clock simulation helper
  const advanceVirtualTime = useCallback((mins) => {
    setVirtualClock((prev) => {
      let newMin = prev.minute + mins
      let newHour = prev.hour + Math.floor(newMin / 60)
      newMin = newMin % 60
      let newDay = prev.day + Math.floor(newHour / 24)
      newHour = newHour % 24
      return { day: newDay, hour: newHour, minute: newMin }
    })
  }, [])

  // Auto-jump to the next scheduled round time status
  const advanceToNextRoundStart = useCallback(() => {
    const targetRoundId = currentUser.currentRound === 0 ? 1 : currentUser.currentRound
    const rMeta = ROUNDS.find((r) => r.id === targetRoundId)
    if (rMeta) {
      setVirtualClock({
        day: rMeta.day,
        hour: rMeta.hour,
        minute: 0
      })
    }
  }, [currentUser.currentRound])

  const advanceToLastRoundStart = useCallback(() => {
    const rMeta = ROUNDS.find((r) => r.id === TOTAL_ROUNDS)
    if (rMeta) {
      setVirtualClock({
        day: rMeta.day,
        hour: rMeta.hour,
        minute: 0
      })
    }
    if (currentUser.currentRound !== TOTAL_ROUNDS) {
      setCurrentUser((prev) => ({
        ...prev,
        currentRound: TOTAL_ROUNDS,
      }))
      setActiveQuestionIndex(0)
      setHiddenOptions([])
      setSelectedCandidateId(null)
      setShowReveal(false)
      setRevealedCandidateIds([])
    }
  }, [currentUser.currentRound])

  const goToInitialRound = useCallback(() => {
    setVirtualClock(INITIAL_VIRTUAL_CLOCK)
    setCurrentUser((prev) => ({
      ...prev,
      currentRound: 0,
    }))
    setActiveQuestionIndex(0)
    setHiddenOptions([])
    setSelectedCandidateId(null)
    setShowReveal(false)
    setRevealedCandidateIds([])
  }, [])

  const jumpToRound = useCallback((roundId) => {
    const isR0 = roundId === 0
    const isR23 = roundId === COMPLETED_ROUND
    
    setCurrentUser((prev) => {
      let badges = prev.purchasedBadges || []
      let unlockedRares = prev.unlockedRares || []
      
      // If jumping to completed screen
      if (isR23) {
        if (!badges.includes('🏆 Ouro Pixels')) {
          badges = [...badges, '🏆 Ouro Pixels']
        }
        if (!unlockedRares.includes('trophy')) {
          unlockedRares = [...unlockedRares, 'trophy']
        }
      }
      
      return {
        ...prev,
        currentRound: roundId,
        purchasedBadges: badges,
        unlockedRares,
        campaignRank: isR23 ? 1 : prev.campaignRank,
        finalAffinity: isR23 ? 95 : prev.finalAffinity,
      }
    })

    // Set virtual clock according to the round
    if (isR0) {
      setVirtualClock(INITIAL_VIRTUAL_CLOCK)
    } else if (isR23) {
      const lastR = ROUNDS[ROUNDS.length - 1]
      setVirtualClock({
        day: lastR.day,
        hour: lastR.hour + 1,
        minute: 0
      })
    } else {
      const rMeta = ROUNDS.find((r) => r.id === roundId)
      if (rMeta) {
        setVirtualClock({
          day: rMeta.day,
          hour: rMeta.hour,
          minute: 0
        })
      }
    }

    // Reset trackers
    setActiveQuestionIndex(0)
    setHiddenOptions([])
    setSelectedCandidateId(null)
    setShowReveal(false)
    setRevealedCandidateIds([])
  }, [])

  const getRoundTimeStatus = useCallback(
    (roundId, clock) => computeRoundTimeStatus(roundId, clock),
    [],
  )

  const canAfford = useCallback(
    (cost) => currentUser.diamonds >= cost,
    [currentUser.diamonds],
  )

  const payAndAdvance = useCallback(
    (nextRound, cost = 0) => {
      if (cost > 0 && currentUser.diamonds < cost) return false
      
      // Intercept daily ceremonies (R4, R7, R10, R13, R16, R19, R22)
      const current = currentUser.currentRound
      if (current === 4 || current === 7 || current === 10 || current === 13 || current === 16 || current === 19 || current === 22) {
        const day = Math.floor((current - 2) / 3) + 1
        const rank = (current * 7) % 4 // 0, 1, 2, 3
        const placements = [1, 2, 3, 4]
        const playerRank = placements[rank]
        
        const currentMatchId = roundMatches[current]
        const chosenMatch = candidates.find((c) => c.id === currentMatchId)
        
        let diamondsReward = 30
        let emblemName
        let isAzarao = playerRank === 4
        
        if (isAzarao) {
          emblemName = '🎖️ Azarão Temático'
        } else {
          emblemName = `🎖️ Match Nível ${4 - playerRank}`
        }
        
        setCeremonyData({
          day,
          playerRank,
          diamondsReward,
          emblemName,
          isAzarao,
          matchNick: chosenMatch ? chosenMatch.nick : 'Ninguém'
        })
        
        setPendingAdvance({ nextRound, cost })
        setShowDailyCeremony(true)
        return true
      }

      setCurrentUser((prev) => {
        let newDiamonds = prev.diamonds
        let badges = prev.purchasedBadges || []
        if (prev.currentRound === 1 && nextRound === 2) {
          newDiamonds += 30
          if (!badges.includes('🎖️ Estreante')) {
            badges = [...badges, '🎖️ Estreante']
          }
        }

        const currentMeta = ROUNDS.find((r) => r.id === prev.currentRound)
        const currentDay = currentMeta ? currentMeta.day : 30
        const nextMeta = ROUNDS.find((r) => r.id === nextRound)
        const nextDay = nextMeta ? nextMeta.day : 30
        const isNewDay = nextDay > currentDay

        const newPowerups = {
          ...prev.powerups,
          boost: false,
          espiarCharges: 0,
        }

        return {
          ...prev,
          diamonds: newDiamonds,
          currentRound: nextRound,
          purchasedBadges: badges,
          hasSpun: isNewDay ? false : prev.hasSpun,
          powerups: newPowerups,
        }
      })

      // Reset round trackers for next round
      setActiveQuestionIndex(0)
      setHiddenOptions([])
      setSelectedCandidateId(null)
      setShowReveal(false)
      setRevealedCandidateIds([])

      if (nextRound === COMPLETED_ROUND) {
        addChatLog('Concluí a última rodada do reality! Que venham as comemorações!', currentUser.nick, currentUser.avatar)
      } else if (nextRound > 1) {
        const nextMeta = ROUNDS[nextRound - 1]
        if (nextMeta) {
          addChatLog(`Pronto para iniciar a Rodada ${nextRound}: ${nextMeta.title}!`, currentUser.nick, currentUser.avatar)
        }
      }
      return true
    },
    [currentUser.diamonds, currentUser.currentRound, currentUser.nick, currentUser.avatar, roundMatches, candidates, addChatLog],
  )

  const enterRound = useCallback((roundId, cost = 0) => {
    let success = false
    setCurrentUser((prev) => {
      if (cost > 0 && prev.diamonds < cost) {
        return prev
      }
      const currentEntered = prev.enteredRounds || [1]
      if (currentEntered.includes(roundId)) {
        success = true
        return prev
      }
      success = true
      return {
        ...prev,
        diamonds: prev.diamonds - cost,
        enteredRounds: [...currentEntered, roundId],
      }
    })
    return success
  }, [])

  const claimDailyReward = useCallback(() => {
    if (!ceremonyData || !pendingAdvance) return

    const { diamondsReward, emblemName, isAzarao } = ceremonyData
    const { nextRound } = pendingAdvance

    setCurrentUser((prev) => {
      let newDiamonds = prev.diamonds + diamondsReward
      let badges = prev.purchasedBadges || []
      if (!isAzarao && !badges.includes(emblemName)) {
        badges = [...badges, emblemName]
      }

      // Check if advancing to final completion screen (COMPLETED_ROUND = 37)
      let campaignRank = 3
      let finalAffinity = 85
      let nextRares = prev.unlockedRares || []

      if (nextRound === COMPLETED_ROUND) {
        const hasBoost = prev.powerups?.boost
        let baseAff = Math.floor(Math.random() * 16) + 82 // 82 - 97
        if (hasBoost) {
          baseAff = Math.min(100, baseAff + 4)
        }
        finalAffinity = baseAff

        if (hasBoost) {
          campaignRank = 1
        } else if (finalAffinity >= 92) {
          campaignRank = 2
        } else if (finalAffinity < 85) {
          campaignRank = 4 // Azarão
        }

        let compDiamonds
        let rareId
        let campaignBadge = '🏆 Ouro Pixels'

        if (campaignRank === 1) {
          compDiamonds = 300
          rareId = 'trophy'
        } else if (campaignRank === 2) {
          compDiamonds = 200
          rareId = 'icecream'
        } else if (campaignRank === 3) {
          compDiamonds = 100
          rareId = 'totem'
        } else {
          compDiamonds = 60
          rareId = 'icecream'
          campaignBadge = '🤡 Azarão Geral'
        }

        newDiamonds += compDiamonds
        if (!badges.includes(campaignBadge)) {
          badges = [...badges, campaignBadge]
        }
        if (!nextRares.includes(rareId)) {
          nextRares = [...nextRares, rareId]
        }
      }

      return {
        ...prev,
        diamonds: newDiamonds,
        purchasedBadges: badges,
        unlockedRares: nextRares,
        currentRound: nextRound,
        campaignRank: nextRound === COMPLETED_ROUND ? campaignRank : prev.campaignRank,
        finalAffinity: nextRound === COMPLETED_ROUND ? finalAffinity : prev.finalAffinity,
        powerups: {
          ...prev.powerups,
          boost: false,
          espiarCharges: 0,
        }
      }
    })

    setShowDailyCeremony(false)
    setCeremonyData(null)
    setPendingAdvance(null)

    // Reset trackers
    setActiveQuestionIndex(0)
    setHiddenOptions([])
    setSelectedCandidateId(null)
    setShowReveal(false)
    setRevealedCandidateIds([])
  }, [ceremonyData, pendingAdvance])

  const updateProfile = useCallback((nick, avatar, initialDiamonds) => {
    setCurrentUser((prev) => ({
      ...prev,
      nick,
      avatar: avatar || avatarUrl(nick),
      diamonds: initialDiamonds !== undefined ? initialDiamonds : prev.diamonds,
    }))
    addChatLog('Acabei de entrar no reality! Quem vai ser meu match? 😎', nick, avatar || avatarUrl(nick))
    setTimeout(() => {
      addChatLog('Olha só, novato na área! Seja bem-vindo!', 'xLuna')
    }, 1000)
    setTimeout(() => {
      addChatLog('Visual legal, gostei!', 'MobyQueen')
    }, 2200)
  }, [addChatLog])

  const earnDiamonds = useCallback((amount) => {
    setCurrentUser((prev) => ({
      ...prev,
      diamonds: prev.diamonds + amount,
    }))
  }, [])

  const spendDiamonds = useCallback((amount) => {
    setCurrentUser((prev) => {
      if (prev.diamonds < amount) return prev
      return {
        ...prev,
        diamonds: prev.diamonds - amount,
      }
    })
  }, [])

  const buyBadge = useCallback((badge, cost) => {
    setCurrentUser((prev) => {
      if (prev.diamonds < cost) return prev
      const badges = prev.purchasedBadges || []
      if (badges.includes(badge)) return prev
      
      setTimeout(() => {
        addChatLog(`Nossa, ostentação! Comprou o emblema ${badge}! 👑`, 'TradeKing')
      }, 500)

      return {
        ...prev,
        diamonds: prev.diamonds - cost,
        purchasedBadges: [...badges, badge],
      }
    })
  }, [addChatLog])

  const buyPowerup = useCallback((powerupKey, cost) => {
    setCurrentUser((prev) => {
      if (prev.diamonds < cost) return prev

      const labels = {
        revealFlags: 'Espiar Ocultos 👁️',
        boost: 'Perfil Impulsionado ⚡',
      }

      // Charge-based powerups (Espiar Ocultos)
      if (powerupKey === 'revealFlags') {
        const currentCharges = prev.powerups?.espiarCharges || 0
        if (currentCharges >= 2) return prev // Max 2 per round

        setTimeout(() => {
          addChatLog(`Ativou o power-up: ${labels[powerupKey]}! Agora a competição ficou séria.`, 'Sunny')
        }, 500)
        return {
          ...prev,
          diamonds: prev.diamonds - cost,
          powerups: {
            ...prev.powerups,
            revealFlags: true,
            espiarCharges: currentCharges + 1,
          },
        }
      }

      // Boolean powerups (boost) — only once per round
      if (powerupKey === 'boost') {
        if (prev.powerups?.boost) return prev // Max 1 per round

        setTimeout(() => {
          addChatLog(`Ativou o power-up: ${labels[powerupKey]}! Agora a competição ficou séria.`, 'Sunny')
        }, 500)

        return {
          ...prev,
          diamonds: prev.diamonds - cost,
          powerups: {
            ...prev.powerups,
            boost: true,
          },
        }
      }

      return prev
    })
  }, [addChatLog])

  const grantPowerup = useCallback((powerupKey, amount = 1) => {
    setCurrentUser((prev) => {
      if (powerupKey === 'revealFlags') {
        return {
          ...prev,
          powerups: {
            ...prev.powerups,
            revealFlags: true,
            espiarCharges: (prev.powerups?.espiarCharges || 0) + amount,
          }
        }
      }
      if (powerupKey === 'boost') {
        return {
          ...prev,
          powerups: {
            ...prev.powerups,
            boost: true,
          }
        }
      }
      return prev
    })
  }, [])

  const useEspiarCharge = useCallback((candidateId) => {
    setCurrentUser((prev) => {
      if ((prev.powerups?.espiarCharges || 0) <= 0) return prev
      return {
        ...prev,
        powerups: {
          ...prev.powerups,
          espiarCharges: prev.powerups.espiarCharges - 1,
        },
      }
    })
    setRevealedCandidateIds((prev) => {
      if (prev.includes(candidateId)) return prev
      return [...prev, candidateId]
    })
  }, [])

  const useMudarVibeCharge = useCallback(() => {
    setCurrentUser((prev) => {
      if ((prev.powerups?.mudarVibeCharges || 0) <= 0) return prev
      return {
        ...prev,
        powerups: {
          ...prev.powerups,
          mudarVibeCharges: prev.powerups.mudarVibeCharges - 1,
        },
      }
    })
    // Reset quiz answers for current round
    setQuizAnswers((prev) => {
      const currentRoundMeta = ROUNDS.find((r) => r.id === currentUser.currentRound)
      if (!currentRoundMeta) return prev
      const cleared = { ...prev }
      currentRoundMeta.questions.forEach((q) => {
        delete cleared[q.id]
      })
      return cleared
    })
    setActiveQuestionIndex(0)
    setHiddenOptions([])
    setSelectedCandidateId(null)
    setShowReveal(false)
    setRevealedCandidateIds([])
  }, [currentUser.currentRound])

  const unlockRare = useCallback((rareId) => {
    setCurrentUser((prev) => {
      const rares = prev.unlockedRares || []
      if (rares.includes(rareId)) return prev
      
      const rareItem = HUBBE_RARES.find(r => r.id === rareId)
      if (rareItem) {
        setTimeout(() => {
          addChatLog(`UAU! Ganhei um ${rareItem.icon} ${rareItem.name} colecionável! 🎁`, prev.nick, prev.avatar)
        }, 300)
        setTimeout(() => {
          addChatLog(`Mentira! Um ${rareItem.name} no inventário?! Sortudo de verdade!`, 'ZedPK')
        }, 1500)
      }

      return {
        ...prev,
        unlockedRares: [...rares, rareId]
      }
    })
  }, [addChatLog])

  const markSpun = useCallback(() => {
    setCurrentUser((prev) => ({
      ...prev,
      hasSpun: true,
    }))
  }, [])

  const setQuizAnswer = useCallback((questionId, optionId) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: optionId }))
  }, [])

  // Dynamic candidate matchmaking description helper
  const generateHiddenDescription = useCallback((c) => {
    const quality = c.qualities[0]
    const redFlag = c.redFlags[0]
    const templates = [
      `Esse user é conhecido por ser "${c.vibe}". Ele(a) tem a qualidade de ser "${quality}", mas dizem que "${redFlag}".`,
      `Com estilo "${c.vibe}", essa pessoa é "${quality}". Mas cuidado: sua red flag é "${redFlag}".`,
      `Destaque como "${c.vibe}". Seus amigos elogiam que ele(a) é "${quality}", porém seu calcanhar de aquiles é "${redFlag}".`
    ]
    return templates[c.id % templates.length]
  }, [])

  // Generate hidden options (3 or 5 if radarExtra)
  const prepareHiddenCandidates = useCallback(() => {
    const count = currentUser.powerups?.radarExtra ? 5 : 3
    const list = candidates.filter((c) => c.nick !== currentUser.nick)
    const shuffled = [...list].sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, count)
    const options = selected.map((c) => ({
      candidate: c,
      description: generateHiddenDescription(c),
    }))
    setHiddenOptions(options)
    setSelectedCandidateId(null)
    setShowReveal(false)
  }, [candidates, currentUser.nick, currentUser.powerups?.radarExtra, generateHiddenDescription])

  const selectCandidate = useCallback((candidateId) => {
    setSelectedCandidateId(candidateId)
    setShowReveal(true)
    setRoundMatches((prev) => ({ ...prev, [currentUser.currentRound]: candidateId }))

    const chosen = candidates.find((c) => c.id === candidateId)
    if (chosen) {
      addChatLog(`Escolhi um parceiro oculto na Rodada ${currentUser.currentRound}! ❤️`, currentUser.nick, currentUser.avatar)
      setTimeout(() => {
        addChatLog(`Ui, babado! Acabou de dar match com ${chosen.nick}! 👀`, 'xLuna')
      }, 1000)
    }
  }, [currentUser.currentRound, candidates, currentUser.nick, currentUser.avatar, addChatLog])

  const isRoundComplete = useCallback((roundId) => {
    const round = ROUNDS.find((r) => r.id === roundId)
    if (!round) return false

    // Check if all 5 questions are answered
    const quizDone = round.questions.every((q) => Boolean(quizAnswers[q.id]))
    if (roundId === 1) {
      return quizDone
    } else {
      return quizDone && selectedCandidateId !== null && showReveal
    }
  }, [quizAnswers, selectedCandidateId, showReveal])

  const competingCandidates = useMemo(
    () => candidates.filter((c) => !c.isGuest),
    [candidates],
  )

  const finalMatch = useMemo(() => {
    // Final match is the one selected in Round TOTAL_ROUNDS
    const finalId = roundMatches[TOTAL_ROUNDS]
    return candidates.find((c) => c.id === finalId) ?? candidates[0]
  }, [candidates, roundMatches])

  const matchAffinity = useMemo(() => {
    if (currentUser.currentRound < COMPLETED_ROUND) return null
    if (currentUser.finalAffinity) return currentUser.finalAffinity
    const rng = getSeededRandom(`${currentUser.nick}_final_affinity`)
    let base = Math.floor(rng() * 16) + 82 // 82 - 97
    if (currentUser.powerups?.boost) {
      base = Math.min(100, base + 4)
    }
    return base
  }, [currentUser.currentRound, currentUser.nick, currentUser.powerups?.boost, currentUser.finalAffinity])

  const completedRoundToday = useMemo(() => {
    const r = currentUser.currentRound
    if (r === 0) return false
    if (r === 1) {
      return isRoundComplete(1)
    }
    const currentDay = Math.floor((r - 2) / 3) + 1
    const firstRoundOfDay = (currentDay - 1) * 3 + 2
    if (r > firstRoundOfDay) return true
    return isRoundComplete(r)
  }, [currentUser.currentRound, isRoundComplete])

  // Custom Ranking score matching the "boost" powerup
  const rankingData = useMemo(() => {
    const boostBonus = currentUser.powerups?.boost ? 180 : 0
    const scored = competingCandidates.map((c) => {
      let score = 380 + (c.id * 15)
      // Boost lets the user exceed NPCs
      return { ...c, score }
    })

    scored.sort((a, b) => b.score - a.score)
    const coveted = scored.slice(0, 3)
    const azarao = scored[scored.length - 1]

    return { coveted, azarao, boostBonus }
  }, [competingCandidates, currentUser.powerups])

  const totalJourneyCost = useMemo(
    () => ROUNDS.reduce((sum, r) => sum + r.cost, 0),
    [],
  )

  const resetGame = useCallback(() => {
    clearGameState()
    setCurrentUser(createFreshUser())
    setLikes([])
    setQuizAnswers({})
    setRevealedCandidateIds([])
    setVirtualClock(INITIAL_VIRTUAL_CLOCK)
    setActiveQuestionIndex(0)
    setHiddenOptions([])
    setSelectedCandidateId(null)
    setShowReveal(false)
    setRoundMatches({})
    setShowDailyCeremony(false)
    setCeremonyData(null)
    setPendingAdvance(null)
    setShowShop(false)
    setShowSpin(false)
    setShowHelp(false)
    setChatLogs(createDefaultChatLogs())
  }, [])

  const value = useMemo(
    () => ({
      currentUser,
      candidates,
      likes,
      quizAnswers,
      chatLogs,
      virtualClock,
      activeQuestionIndex,
      setActiveQuestionIndex,
      hiddenOptions,
      selectedCandidateId,
      showReveal,
      roundMatches,
      currentRoundMeta,
      isRoundComplete,
      totalJourneyCost,
      canAfford,
      payAndAdvance,
      setQuizAnswer,
      selectCandidate,
      prepareHiddenCandidates,
      rankingData,
      resetGame,
      COMPLETED_ROUND,
      updateProfile,
      earnDiamonds,
      spendDiamonds,
      buyBadge,
      buyPowerup,
      unlockRare,
      markSpun,
      advanceVirtualTime,
      advanceToNextRoundStart,
      advanceToLastRoundStart,
      goToInitialRound,
      getRoundTimeStatus,
      finalMatch,
      matchAffinity,
      showDailyCeremony,
      ceremonyData,
      claimDailyReward,
      showShop,
      setShowShop,
      showSpin,
      setShowSpin,
      showHelp,
      setShowHelp,
      helpActiveTab,
      setHelpActiveTab,
      helpActiveSubTab,
      setHelpActiveSubTab,
      openHelp,
      revealedCandidateIds,
      useEspiarCharge,
      useMudarVibeCharge,
      grantPowerup,
      completedRoundToday,
      jumpToRound,
      enterRound,
    }),
    [
      currentUser,
      candidates,
      likes,
      quizAnswers,
      chatLogs,
      virtualClock,
      activeQuestionIndex,
      hiddenOptions,
      selectedCandidateId,
      showReveal,
      roundMatches,
      currentRoundMeta,
      isRoundComplete,
      totalJourneyCost,
      canAfford,
      payAndAdvance,
      setQuizAnswer,
      selectCandidate,
      prepareHiddenCandidates,
      rankingData,
      resetGame,
      updateProfile,
      earnDiamonds,
      spendDiamonds,
      buyBadge,
      buyPowerup,
      unlockRare,
      markSpun,
      advanceVirtualTime,
      advanceToNextRoundStart,
      advanceToLastRoundStart,
      goToInitialRound,
      getRoundTimeStatus,
      finalMatch,
      matchAffinity,
      showDailyCeremony,
      ceremonyData,
      claimDailyReward,
      showShop,
      showSpin,
      showHelp,
      helpActiveTab,
      helpActiveSubTab,
      openHelp,
      revealedCandidateIds,
      useEspiarCharge,
      useMudarVibeCharge,
      grantPowerup,
      completedRoundToday,
      jumpToRound,
      enterRound,
    ],
  )

  return (
    <MatchScoreContext.Provider value={value}>
      {children}
    </MatchScoreContext.Provider>
  )
}

export function useMatchScore() {
  const ctx = useContext(MatchScoreContext)
  if (!ctx) {
    throw new Error('useMatchScore deve ser usado dentro de MatchScoreProvider')
  }
  return ctx
}
