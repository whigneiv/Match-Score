import { useEffect } from 'react'
import { useMatchScore } from '../context/MatchScoreContext'
import Card from '../components/Card'
import PlayerSpotlight from '../components/PlayerSpotlight'
import WelcomePanel from './WelcomePanel'
import CompletedPanel from './CompletedPanel'
import AdvanceButton from '../components/AdvanceButton'
import { COMPLETED_ROUND, TOTAL_ROUNDS } from '../constants/game'
import { getRoundMatchAffinity } from '../lib/compatibility'
import { playClick } from '../lib/audio'
import WaitingScreen from '../components/WaitingScreen'

export default function GameArena() {
  const {
    currentUser,
    currentRoundMeta,
    quizAnswers,
    setQuizAnswer,
    virtualClock,
    activeQuestionIndex,
    setActiveQuestionIndex,
    hiddenOptions,
    selectedCandidateId,
    selectCandidate,
    prepareHiddenCandidates,
    getRoundTimeStatus,
    candidates,
    showDailyCeremony,
    ceremonyData,
    claimDailyReward,
    revealedCandidateIds,
    useEspiarCharge: consumeEspiarCharge,
    useMudarVibeCharge: consumeMudarVibeCharge,
    enterRound,
  } = useMatchScore()

  const round = currentUser.currentRound
  const roundMatchAffinity = getRoundMatchAffinity(round, selectedCandidateId)

  // Auto-generate hidden candidates when the quiz is completed
  const quizDone = currentRoundMeta
    ? currentRoundMeta.questions.every((q) => Boolean(quizAnswers[q.id]))
    : false

  useEffect(() => {
    if (round >= 2 && round <= TOTAL_ROUNDS && quizDone && hiddenOptions.length === 0) {
      prepareHiddenCandidates()
    }
  }, [round, quizDone, hiddenOptions.length, prepareHiddenCandidates])

  const showCompactPlayer = round >= 1 && round <= TOTAL_ROUNDS

  // 1. Checking round schedule window
  const timeStatus = currentRoundMeta ? getRoundTimeStatus(round, virtualClock) : 'closed'
  const isLocked = round >= 1 && round <= TOTAL_ROUNDS && timeStatus !== 'open'

  if (showDailyCeremony && ceremonyData) {
    const { day, playerRank, diamondsReward, emblemName, isAzarao, matchNick } = ceremonyData

    // Define mock podium based on playerRank
    let podium
    if (playerRank === 1) {
      podium = [
        { rank: 2, nick: 'Pandora', avatar: 'https://hubbe.biz/avatar/Pandora', isPlayer: false },
        { rank: 1, nick: currentUser.nick, avatar: currentUser.avatar, isPlayer: true },
        { rank: 3, nick: 'Druidown', avatar: 'https://hubbe.biz/avatar/Druidown', isPlayer: false },
      ]
    } else if (playerRank === 2) {
      podium = [
        { rank: 2, nick: currentUser.nick, avatar: currentUser.avatar, isPlayer: true },
        { rank: 1, nick: 'Vaex', avatar: 'https://hubbe.biz/avatar/Vaex', isPlayer: false },
        { rank: 3, nick: 'Cheussye', avatar: 'https://hubbe.biz/avatar/Cheussye', isPlayer: false },
      ]
    } else if (playerRank === 3) {
      podium = [
        { rank: 2, nick: 'Pandora', avatar: 'https://hubbe.biz/avatar/Pandora', isPlayer: false },
        { rank: 1, nick: 'j4un3', avatar: 'https://hubbe.biz/avatar/j4un3', isPlayer: false },
        { rank: 3, nick: currentUser.nick, avatar: currentUser.avatar, isPlayer: true },
      ]
    } else {
      // player is Azarão (4th)
      podium = [
        { rank: 2, nick: 'Cheussye', avatar: 'https://hubbe.biz/avatar/Cheussye', isPlayer: false },
        { rank: 1, nick: 'Druidown', avatar: 'https://hubbe.biz/avatar/Druidown', isPlayer: false },
        { rank: 3, nick: 'Vaex', avatar: 'https://hubbe.biz/avatar/Vaex', isPlayer: false },
      ]
    }

    const azaraoNick = isAzarao ? currentUser.nick : 'Itgit'
    const azaraoAvatar = isAzarao ? currentUser.avatar : 'https://hubbe.biz/avatar/Itgit'

    return (
      <Card className="shadow-md overflow-hidden relative text-center p-5">
        <div className="mb-4">
          <span className="text-xs font-black text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full">
            🏆 Pódio Diário · Dia {day}
          </span>
          <h2 className="text-lg font-black text-[#e8edf2] mt-3 font-display" style={{ fontFamily: 'Kanit, sans-serif' }}>
            Resultados das Rodadas
          </h2>
          <p className="text-xs text-[#7a8fa3] mt-1">
            Veja a classificação e resgate as premiações do dia no hotel!
          </p>
        </div>

        {/* Visual Podium Columns */}
        <div className="flex items-end justify-center gap-2 my-6 pt-8 border-b border-white/[0.04] pb-4">
          {podium.map((user) => {
            const heightClass = user.rank === 1 ? 'h-24 bg-gradient-to-t from-amber-500/20 to-amber-500/40 border-amber-500/40' :
                               user.rank === 2 ? 'h-20 bg-gradient-to-t from-slate-400/20 to-slate-400/40 border-slate-400/30' :
                               'h-16 bg-gradient-to-t from-amber-700/20 to-amber-700/40 border-amber-700/30'
            const medal = user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'

            return (
              <div key={user.nick} className="flex flex-col items-center flex-1 max-w-[100px]">
                <div className={`relative mb-2 ${user.isPlayer ? 'scale-110' : ''}`}>
                  {user.isPlayer && (
                    <div className="absolute -inset-1 rounded-full bg-cyan-400 blur-sm animate-pulse pointer-events-none" />
                  )}
                  <div className={`h-11 w-11 rounded-full overflow-hidden border bg-[#1c2d3f] flex items-center justify-center shadow-md ${user.isPlayer ? 'border-cyan-400 border-2' : 'border-white/[0.08]'}`}>
                    <img
                      src={user.avatar}
                      alt={user.nick}
                      className="w-auto h-auto object-none object-top scale-90"
                      referrerPolicy="no-referrer"
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                  </div>
                  <span className="absolute -top-2 -right-1 text-sm">{medal}</span>
                </div>
                <p className={`text-xs font-black truncate w-full ${user.isPlayer ? 'text-cyan-400' : 'text-[#e8edf2]'}`}>
                  {user.nick}
                </p>
                <div className={`w-full ${heightClass} border border-b-0 rounded-t-xl flex flex-col justify-end p-2 mt-1 shadow-inner`}>
                  <span className="text-xs font-black text-white/80">{user.rank}º</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Azarão Card */}
        <div className={`mx-auto max-w-xs rounded-xl p-3 border mb-4 text-left flex items-center justify-between gap-3 ${isAzarao ? 'bg-red-500/10 border-red-500/20' : 'bg-[#1c2d3f] border-white/[0.06]'}`}>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-black tracking-wider uppercase text-rose-400 bg-rose-400/10 px-1.5 py-0.5 rounded">
              Azarão do Dia 🤡
            </span>
            <p className="text-sm font-black text-[#e8edf2] mt-1 flex items-center gap-1.5">
              {azaraoNick}
            </p>
            <p className="text-xs text-[#7a8fa3] leading-snug mt-0.5">
              {isAzarao ? 'Você errou quase todas as compatibilidades e levou o consolo!' : 'Ficou no fim da classificação de compatibilidade diária.'}
            </p>
          </div>
          <div className="relative">
            {isAzarao && <div className="absolute -inset-1 rounded-full bg-rose-400 blur-sm pointer-events-none" />}
            <div className={`h-10 w-10 rounded-xl overflow-hidden border bg-[#162230] flex items-center justify-center ${isAzarao ? 'border-rose-400' : 'border-white/[0.08]'}`}>
              <img
                src={azaraoAvatar}
                alt={azaraoNick}
                className="w-auto h-auto object-none object-top scale-75"
                referrerPolicy="no-referrer"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            </div>
          </div>
        </div>

        {/* Player summary card */}
        <div className="mx-auto max-w-xs rounded-xl bg-[#1c2d3f] border border-white/[0.06] p-4 text-left space-y-2.5">
          <p className="text-xs font-black text-[#7a8fa3] uppercase tracking-wider">Seu Resumo de Prêmios:</p>
          
          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            {!isAzarao && (
              <div className="bg-[#162230] border border-white/[0.04] p-2 rounded-lg flex flex-col items-center justify-center text-center">
                <span className="text-xl mb-1">🎖️</span>
                <span className="text-xs text-[#7a8fa3] font-semibold">Emblema</span>
                <span className="text-xs text-[#e8edf2] font-black mt-0.5 truncate w-full">{emblemName}</span>
              </div>
            )}
            
            <div className={`bg-[#162230] border border-white/[0.04] p-2 rounded-lg flex flex-col items-center justify-center text-center ${isAzarao ? 'col-span-2' : ''}`}>
              <span className="text-xl mb-1">💎</span>
              <span className="text-xs text-[#7a8fa3] font-semibold">Diamantes</span>
              <span className="text-xs text-cyan-400 font-black mt-0.5">+{diamondsReward} 💎</span>
            </div>
          </div>

          <div className="border-t border-dashed border-white/[0.06] pt-2 flex items-center justify-between text-xs">
            <span className="text-[#7a8fa3] font-bold">Parceiro do Dia:</span>
            <span className="text-[#e8edf2] font-extrabold flex items-center gap-1">
              💕 {matchNick}
            </span>
          </div>
        </div>

        {/* Collect Action Button */}
        <button
          type="button"
          onClick={() => {
            playClick()
            claimDailyReward()
          }}
          className="mt-5 w-full rounded-xl bg-gradient-to-r from-[#db2777] to-cyan-500 hover:from-[#ec4899] hover:to-cyan-400 py-3 text-xs font-black text-white shadow-lg shadow-[#db2777]/20 transition duration-200 active:scale-[0.98] cursor-pointer"
        >
          Coletar Prêmios e Prosseguir 🎁
        </button>
      </Card>
    )
  }

  return (
    <Card className="shadow-md overflow-hidden relative">
      {showCompactPlayer && (
        <div className="mb-3">
          <PlayerSpotlight variant="compact" />
        </div>
      )}



      {/* Main Panels Routing */}
      {round === 0 && <WelcomePanel />}

      {round >= 1 && round <= TOTAL_ROUNDS && (
        <>
          {isLocked ? (
            <WaitingScreen targetRoundId={round} />
          ) : !currentUser.enteredRounds?.includes(round) ? (
            /* Entry Screen: Pay 30 Diamonds to Enter the Round */
            <div className="py-6 text-center space-y-5 animate-fade-in">
              <span className="text-4xl animate-pulse inline-block">⚔️</span>
              <div>
                <span className="text-xs font-black text-[#db2777] uppercase tracking-widest bg-[#db2777]/10 px-3 py-1 rounded-full">
                  Rodada {round} Aberta!
                </span>
                <h3 className="text-lg font-black text-[#e8edf2] mt-3 font-display" style={{ fontFamily: 'Kanit, sans-serif' }}>
                  {currentRoundMeta?.name || `Etapa ${round}`}
                </h3>
                <p className="text-xs text-[#94a3b8] max-w-xs mx-auto mt-1 leading-relaxed">
                  Para participar do Quiz de Afinidade e selecionar seu match secreto nesta rodada, confirme sua entrada.
                </p>
              </div>

              {/* Cost Box */}
              {(() => {
                const cost = currentRoundMeta?.cost ?? 30
                const canAfford = currentUser.diamonds >= cost
                return (
                  <div className="max-w-xs mx-auto space-y-4">
                    <div className="rounded-xl bg-[#262135] border border-white/[0.06] p-4 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#94a3b8] uppercase">Custo de Entrada:</span>
                      <span className="text-sm font-black text-cyan-400 flex items-center gap-1">
                        💎 {cost} Diamantes
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={!canAfford}
                      onClick={() => {
                        playClick()
                        enterRound(round, cost)
                      }}
                      className={`w-full rounded-xl py-3.5 text-sm font-black text-white transition duration-200 active:scale-[0.98] cursor-pointer shadow-lg ${
                        canAfford
                          ? 'bg-gradient-to-r from-[#db2777] to-pink-500 hover:from-[#ec4899] hover:to-pink-400 shadow-[#db2777]/20'
                          : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/[0.04]'
                      }`}
                    >
                      {canAfford ? 'Confirmar e Jogar 🚀' : `Diamantes Insuficientes (${cost} 💎)`}
                    </button>
                  </div>
                )
              })()}
            </div>
          ) : !quizDone ? (
            /* Phase 1: 5 Questions Quiz */
            <div className="space-y-4 text-left animate-fade-in">
              {/* Progress dots bar */}
              <div className="flex items-center justify-between text-xs font-bold text-[#7a8fa3]">
                <span className="uppercase tracking-wider">Questão {activeQuestionIndex + 1} de 5</span>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
                        i <= activeQuestionIndex ? 'bg-[#db2777]' : 'bg-white/5'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Render Question */}
              {currentRoundMeta?.questions?.[activeQuestionIndex] && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-[#e8edf2] leading-snug">
                    {currentRoundMeta.questions[activeQuestionIndex].question}
                  </p>
                  <div className="space-y-2">
                    {currentRoundMeta.questions[activeQuestionIndex].options.map((opt) => {
                      const questionId = currentRoundMeta.questions[activeQuestionIndex].id
                      const isSelected = quizAnswers[questionId] === opt.id
                      return (
                        <label
                          key={opt.id}
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition duration-200 ${
                            isSelected
                              ? 'border-[#db2777] bg-[#db2777]/10 shadow-md shadow-[#db2777]/10'
                              : 'border-white/[0.06] hover:border-[#db2777]/30 hover:bg-white/[0.03] bg-white/[0.02]'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q-${questionId}`}
                            checked={isSelected}
                            onChange={() => setQuizAnswer(questionId, opt.id)}
                            className="accent-[#db2777]"
                          />
                          <span className="text-sm text-[#e8edf2]">{opt.label}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Mudar Vibe power-up button */}
              {round >= 2 && (currentUser.powerups?.mudarVibeCharges || 0) > 0 && (
                <button
                  type="button"
                  onClick={() => { playClick(); consumeMudarVibeCharge() }}
                  className="w-full rounded-xl border border-violet-500/30 bg-violet-500/10 py-2.5 text-xs font-bold text-violet-300 hover:bg-violet-500/20 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>🌀</span>
                  Mudar Vibe ({currentUser.powerups.mudarVibeCharges} carga{currentUser.powerups.mudarVibeCharges !== 1 ? 's' : ''})
                  <span className="text-violet-400/60 text-[10px]">· Reseta perguntas</span>
                </button>
              )}

              {/* Navigation button */}
              {activeQuestionIndex < 4 ? (
                <button
                  type="button"
                  disabled={!quizAnswers[currentRoundMeta.questions[activeQuestionIndex]?.id]}
                  onClick={() => setActiveQuestionIndex((prev) => prev + 1)}
                  className={`w-full rounded-xl py-3 text-sm font-bold text-white transition duration-200 cursor-pointer ${
                    quizAnswers[currentRoundMeta.questions[activeQuestionIndex]?.id]
                      ? 'bg-[#db2777] hover:bg-[#ec4899] shadow-lg shadow-[#db2777]/20'
                      : 'bg-white/5 text-white/20 cursor-not-allowed'
                  }`}
                >
                  Próxima Pergunta
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!quizAnswers[currentRoundMeta.questions[4]?.id]}
                  onClick={() => {
                    setActiveQuestionIndex(4)
                  }}
                  className={`w-full rounded-xl py-3 text-sm font-bold text-white transition duration-200 cursor-pointer ${
                    quizAnswers[currentRoundMeta.questions[4]?.id]
                      ? 'bg-[#db2777] hover:bg-[#ec4899] shadow-lg shadow-[#db2777]/20'
                      : 'bg-white/5 text-white/20 cursor-not-allowed'
                  }`}
                >
                  {round === 1 ? 'Concluir Estreia' : 'Ver Pretendentes'}
                </button>
              )}
            </div>
          ) : round === 1 ? (
            /* Round 1 Special Reward Screen */
            <div className="py-4 text-center space-y-4 animate-fade-in">
              <span className="text-4xl animate-bounce inline-block">🎖️</span>
              <div>
                <h3 className="text-base font-black text-emerald-400" style={{ fontFamily: 'Kanit, sans-serif' }}>
                  Estreia Concluída!
                </h3>
                <p className="text-xs text-[#7a8fa3] max-w-xs mx-auto mt-1 leading-relaxed">
                  Você respondeu as perguntas de vibe inicial e está pronto para o reality.
                </p>
              </div>

              {/* Rewards Box */}
              <div className="bg-[#1c2d3f] border border-white/[0.06] rounded-xl p-3 max-w-xs mx-auto space-y-2 text-left">
                <p className="text-[10px] font-black text-[#7a8fa3] uppercase tracking-wider">Prêmios Adquiridos:</p>
                <div className="flex items-center gap-2 text-xs font-bold text-[#e8edf2]">
                  <span>🎖️</span>
                  <span>Emblema Oficial de Estreante</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                  <span>💎</span>
                  <span>+100 Diamantes adicionados!</span>
                </div>
              </div>

              <div className="rounded-xl bg-amber-400/5 border border-amber-400/10 p-3 max-w-xs mx-auto text-left">
                <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  ⚠️ Aviso Importante
                </p>
                <p className="text-[10px] text-[#7a8fa3] mt-1 leading-normal">
                  A rodada 1 foi grátis. A partir da segunda, a participação custará <strong>30 💎</strong> por etapa e valerá matches reais no radar do hotel!
                </p>
              </div>

              <AdvanceButton />
            </div>
          ) : selectedCandidateId === null ? (
            /* Phase 2: Hidden Candidates Selection (R2-10) */
            <div className="space-y-4 text-left animate-fade-in">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-black text-[#e8edf2]" style={{ fontFamily: 'Kanit, sans-serif' }}>
                    Escolha seu Match Oculto 🕵️
                  </h3>
                  <p className="text-xs text-[#7a8fa3] leading-snug mt-0.5">
                    Selecione um dos {hiddenOptions.length} parceiros baseando-se em suas vibes.
                  </p>
                </div>
                {(currentUser.powerups?.espiarCharges || 0) > 0 && (
                  <span className="shrink-0 rounded-lg bg-cyan-400/10 border border-cyan-400/20 px-2 py-1 text-[10px] font-black text-cyan-400 uppercase tracking-wider">
                    👁️ {currentUser.powerups.espiarCharges} espiar{currentUser.powerups.espiarCharges !== 1 ? '' : ''}
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {hiddenOptions.map((opt) => {
                  const isRevealed = revealedCandidateIds.includes(opt.candidate.id)
                  const espiarCharges = currentUser.powerups?.espiarCharges || 0
                  const canSpy = espiarCharges > 0 && !isRevealed
                  return (
                    <div
                      key={opt.candidate.id}
                      className={`flex flex-col gap-2.5 rounded-2xl border p-4 transition duration-200 shadow-md relative ${
                        isRevealed
                          ? 'border-cyan-400/30 bg-cyan-400/5'
                          : 'border-white/[0.06] bg-[#1c2d3f]/60'
                      }`}
                    >
                      {isRevealed ? (
                        /* Revealed by Espiar */
                        <div className="flex items-center gap-3 w-full">
                          <div className="h-12 w-12 rounded-xl bg-[#162230] border-2 border-cyan-400 overflow-hidden flex items-center justify-center shrink-0">
                            <img
                              src={opt.candidate.avatar}
                              alt={opt.candidate.nick}
                              className="w-auto h-auto object-none object-top scale-95"
                              referrerPolicy="no-referrer"
                              onError={(e) => { e.target.style.display = 'none' }}
                            />
                          </div>
                          <div className="min-w-0 flex-1 leading-tight">
                            <p className="text-xs font-black text-cyan-400 flex items-center gap-1">
                              👁️ {opt.candidate.nick}
                              <span className="text-[10px] uppercase font-bold text-cyan-400/80 bg-cyan-400/10 px-1 rounded">Revelado</span>
                            </p>
                            <p className="text-xs text-[#7a8fa3] truncate mt-0.5">{opt.candidate.vibe}</p>
                          </div>
                        </div>
                      ) : (
                        /* Hidden State */
                        <div className="flex items-center gap-3 w-full">
                          <div className="h-10 w-10 rounded-full border border-dashed border-[#7a8fa3]/30 bg-[#162230] flex items-center justify-center text-sm shrink-0">
                            ❓
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-black text-[#7a8fa3] uppercase tracking-wider">Candidato Secreto</p>
                          </div>
                          {canSpy && (
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); playClick(); consumeEspiarCharge(opt.candidate.id) }}
                              className="shrink-0 rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-2 py-1 text-[10px] font-black text-cyan-400 hover:bg-cyan-400/20 transition cursor-pointer"
                            >
                              👁️ Espiar
                            </button>
                          )}
                        </div>
                      )}

                      <p className="text-xs text-[#7a8fa3] leading-relaxed text-left w-full">
                        {opt.description}
                      </p>

                      {/* Select button */}
                      <button
                        type="button"
                        onClick={() => selectCandidate(opt.candidate.id)}
                        className="w-full rounded-xl border border-[#db2777]/30 bg-[#db2777]/10 hover:bg-[#db2777]/20 py-2 text-xs font-bold text-[#db2777] transition cursor-pointer"
                      >
                        Escolher este candidato 💕
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            /* Phase 3: Match Reveal / Round Reward Screen */
            <div className="py-4 text-center space-y-4 animate-fade-in">
              <div>
                <span className="text-sm font-black text-[#ff6b81] uppercase tracking-widest bg-[#ff6b81]/10 px-2 py-0.5 rounded-md">
                  É Match! 💕
                </span>
                <h3 className="text-base font-black text-[#e8edf2] mt-1.5" style={{ fontFamily: 'Kanit, sans-serif' }}>
                  Identidade Revelada!
                </h3>
              </div>

              {/* Reveal Card Spotlight */}
              {candidates.find((c) => c.id === selectedCandidateId) && (() => {
                const chosen = candidates.find((c) => c.id === selectedCandidateId)
                return (
                  <>
                    <div className="mx-auto max-w-[260px] rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#1c2d3f] to-[#162230] p-5 shadow-xl relative overflow-hidden">
                      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#db2777]/20 via-transparent to-pink-500/10 blur-sm pointer-events-none" />
                      
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="relative mb-2">
                          <div className="absolute -inset-1.5 rounded-full bg-gradient-to-br from-[#db2777] to-pink-400 blur-sm animate-pulse" />
                          <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-[#162230] bg-[#1c2d3f] flex items-center justify-center shadow-lg">
                            <img
                              src={chosen.avatar}
                              alt={chosen.nick}
                              className="w-auto h-auto object-none object-top"
                              referrerPolicy="no-referrer"
                              onError={(e) => { e.target.style.display = 'none' }}
                            />
                          </div>
                        </div>

                        <h4 className="text-sm font-black text-[#e8edf2]">{chosen.nick}</h4>
                        <p className="text-xs text-[#db2777] font-semibold">{chosen.vibe}</p>

                        <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
                          {chosen.qualities.slice(0, 1).map((q) => (
                            <span
                              key={q}
                              className="rounded bg-emerald-400/10 px-1.5 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-400/15"
                            >
                              ⭐ {q}
                            </span>
                          ))}
                          {chosen.redFlags.slice(0, 1).map((rf) => (
                            <span
                              key={rf}
                              className="rounded bg-rose-400/10 px-1.5 py-0.5 text-xs font-bold text-rose-400 border border-rose-400/15"
                            >
                              🚩 {rf}
                            </span>
                          ))}
                        </div>

                        <p className="mt-4 text-xs font-black text-rose-400 border-t border-dashed border-white/[0.06] pt-2 w-full text-center">
                          {roundMatchAffinity !== null
                            ? `Compatibilidade desta rodada: ${roundMatchAffinity}%`
                            : 'Estreia concluída — escolha seu par nas próximas rodadas!'}
                        </p>
                      </div>
                    </div>

                    {/* Pending match score tip info */}
                    <div className="mx-auto max-w-xs rounded-xl bg-cyan-500/5 border border-cyan-500/15 p-3 text-left">
                      <p className="text-[11px] text-cyan-300 font-bold leading-normal flex items-start gap-1">
                        <span>✨</span>
                        <span>{chosen.nick} ainda não jogou, mas vocês já garantiram 5 pontos cada.</span>
                      </p>
                      <p className="text-[10px] text-[#7a8fa3] leading-normal mt-1 pl-4">
                        Quando ele(a) jogar, se ele(a) der match com você, vocês garantem 10 pontos ao invés de 5.
                      </p>
                    </div>
                  </>
                )
              })()}

              <p className="text-xs text-[#7a8fa3] max-w-xs mx-auto leading-normal">
                {round === TOTAL_ROUNDS
                  ? 'Última rodada concluída! Veja sua retrospectiva e os resultados finais.'
                  : 'Você e seu match acumularam afinidade de pixel. Avance para a próxima rodada!'}
              </p>

              <AdvanceButton />
            </div>
          )}
        </>
      )}

      {round === COMPLETED_ROUND && <CompletedPanel />}
    </Card>
  )
}
