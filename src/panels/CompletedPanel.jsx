import { useState, useEffect, useMemo } from 'react'
import { useMatchScore } from '../context/MatchScoreContext'
import { HUBBE_RARES, TOTAL_ROUNDS } from '../constants/game'
import { getCandidateAffinity } from '../lib/compatibility'
import { playClick } from '../lib/audio'

export default function CompletedPanel() {
  const { currentUser, finalMatch, matchAffinity, resetGame, roundMatches, candidates } = useMatchScore()
  const [activeSlide, setActiveSlide] = useState(0)

  // Auto-advance logic for stories (slides 0 to 5)
  useEffect(() => {
    if (activeSlide >= 6) return
    const timer = setTimeout(() => {
      setActiveSlide((prev) => prev + 1)
    }, 8000)
    return () => clearTimeout(timer)
  }, [activeSlide])

  const stats = useMemo(() => {
    if (!finalMatch) {
      return null
    }

    const matchCounts = {}
    Object.values(roundMatches).forEach((cId) => {
      const cand = candidates.find((c) => c.id === cId)
      if (cand) {
        matchCounts[cand.nick] = (matchCounts[cand.nick] || 0) + 1
      }
    })

    let topMatchedNick = 'Ninguém'
    let topMatchedCount = 0
    Object.entries(matchCounts).forEach(([nick, count]) => {
      if (count > topMatchedCount) {
        topMatchedCount = count
        topMatchedNick = nick
      }
    })

    if (topMatchedNick === 'Ninguém' && finalMatch) {
      topMatchedNick = finalMatch.nick
      topMatchedCount = 1
    }

    // 2. Mocked appearances in radar based on username length
    const radarCounts = candidates
      .filter((c) => c.nick !== currentUser.nick)
      .map((c) => {
        const count = 4 + ((c.id + currentUser.nick.length) % 6)
        return { nick: c.nick, count, avatar: c.avatar }
      })
    radarCounts.sort((a, b) => b.count - a.count)
    const topRadar1 = radarCounts[0] || { nick: 'MobyQueen', count: 12, avatar: 'https://hubbe.biz/avatar/MobyQueen' }
    const topRadar2 = radarCounts[1] || { nick: 'ZedPK', count: 9, avatar: 'https://hubbe.biz/avatar/ZedPK' }

    // 3. Fictional times player appeared on other participants' radars
    const baseRadar = 9 + (currentUser.nick.length % 6)
    const radarAppearances = currentUser.powerups?.boost 
      ? baseRadar * 2 + 10 
      : baseRadar

    // 4. Missed connections
    const neverMatched = candidates.filter(
      (c) => c.nick !== currentUser.nick && !Object.values(roundMatches).includes(c.id)
    )
    const missedUserX = neverMatched[0]?.nick || 'AFKinho'
    const missedUserY = neverMatched[1]?.nick || 'TradeKing'

    return {
      topMatchedNick,
      topMatchedCount,
      topRadar1,
      topRadar2,
      radarAppearances,
      missedUserX,
      missedUserY
    }
  }, [roundMatches, candidates, currentUser.nick, currentUser.powerups, finalMatch])

  if (!finalMatch || matchAffinity === null || !stats) return null

  const handleRestart = () => {
    playClick()
    resetGame()
  }

  const campaignRank = currentUser.campaignRank || 3
  const isAzaraoGeral = campaignRank === 4

  let generalPodium
  if (campaignRank === 1) {
    generalPodium = [
      { rank: 2, nick: 'Vaex', avatar: 'https://hubbe.biz/avatar/Vaex', isPlayer: false },
      { rank: 1, nick: currentUser.nick, avatar: currentUser.avatar, isPlayer: true },
      { rank: 3, nick: 'Pandora', avatar: 'https://hubbe.biz/avatar/Pandora', isPlayer: false },
    ]
  } else if (campaignRank === 2) {
    generalPodium = [
      { rank: 2, nick: currentUser.nick, avatar: currentUser.avatar, isPlayer: true },
      { rank: 1, nick: 'Vaex', avatar: 'https://hubbe.biz/avatar/Vaex', isPlayer: false },
      { rank: 3, nick: 'Pandora', avatar: 'https://hubbe.biz/avatar/Pandora', isPlayer: false },
    ]
  } else if (campaignRank === 3) {
    generalPodium = [
      { rank: 2, nick: 'Vaex', avatar: 'https://hubbe.biz/avatar/Vaex', isPlayer: false },
      { rank: 1, nick: 'Pandora', avatar: 'https://hubbe.biz/avatar/Pandora', isPlayer: false },
      { rank: 3, nick: currentUser.nick, avatar: currentUser.avatar, isPlayer: true },
    ]
  } else {
    generalPodium = [
      { rank: 2, nick: 'Vaex', avatar: 'https://hubbe.biz/avatar/Vaex', isPlayer: false },
      { rank: 1, nick: 'Pandora', avatar: 'https://hubbe.biz/avatar/Pandora', isPlayer: false },
      { rank: 3, nick: 'Druidown', avatar: 'https://hubbe.biz/avatar/Druidown', isPlayer: false },
    ]
  }

  const generalAzaraoNick = isAzaraoGeral ? currentUser.nick : 'Itgit'
  const generalAzaraoAvatar = isAzaraoGeral ? currentUser.avatar : 'https://hubbe.biz/avatar/Itgit'

  const handleStoryTap = (e) => {
    if (activeSlide >= 6) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const width = rect.width

    if (x < width * 0.35) {
      // Tap left: go back
      playClick()
      setActiveSlide((prev) => Math.max(0, prev - 1))
    } else {
      // Tap right: go forward
      playClick()
      setActiveSlide((prev) => Math.min(6, prev + 1))
    }
  }

  const skipStory = () => {
    playClick()
    setActiveSlide(6)
  }

  return (
    <div className="space-y-4 text-center pb-6">
      <style>{`
        @keyframes playStory {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>

      {/* Retro Stories Card Player */}
      {activeSlide < 6 ? (
        <div className="relative rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#1c2d3f] to-[#162230] p-4 shadow-xl overflow-hidden min-h-[360px] flex flex-col justify-between">
          {/* Subtle decoration */}
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-pink-500/10 via-transparent to-[#db2777]/10 blur-md pointer-events-none" />

          {/* Progress Indicators */}
          <div className="relative z-10 flex gap-1 px-1 py-1 shrink-0">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="h-1 flex-1 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-[#db2777]"
                  style={{
                    width: idx < activeSlide ? '100%' : idx === activeSlide ? '100%' : '0%',
                    animation: idx === activeSlide ? 'playStory 8000ms linear forwards' : 'none'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Interactive Tap Area (covers the body) */}
          <div 
            onClick={handleStoryTap}
            className="flex-1 flex flex-col items-center justify-center p-3 select-none cursor-pointer relative z-10"
          >
            {/* Slide 0: Cover */}
            {activeSlide === 0 && (
              <div className="space-y-4 animate-fade-in flex flex-col items-center">
                <span className="text-5xl animate-bounce">🎬</span>
                <div className="space-y-1">
                  <span className="text-[11px] font-black text-[#db2777] uppercase tracking-widest bg-[#db2777]/15 px-2.5 py-0.5 rounded">
                    Retrospectiva
                  </span>
                  <h3 className="text-lg font-black text-[#e8edf2] font-display" style={{ fontFamily: 'Kanit, sans-serif' }}>
                    Sua Jornada de Pixels
                  </h3>
                  <p className="text-xs text-[#7a8fa3] max-w-[240px] leading-relaxed mt-1">
                    Confira os fatos, estatísticas e curiosidades de suas escolhas nos 7 dias de Match Score!
                  </p>
                </div>
                <p className="text-[10px] text-[#7a8fa3] italic mt-4">
                  (Toque no lado direito para avançar ➔)
                </p>
              </div>
            )}

            {/* Slide 1: Radar Frequents */}
            {activeSlide === 1 && (
              <div className="space-y-4 animate-fade-in flex flex-col items-center w-full">
                <span className="text-4xl">📡</span>
                <div className="space-y-1 text-center">
                  <h4 className="text-sm font-black text-amber-400 uppercase tracking-wider">Figurinhas do Radar</h4>
                  <p className="text-xs text-[#7a8fa3] max-w-[260px] mx-auto mt-0.5">
                    Estes participantes foram os que mais apareceram ocultos no seu radar durante as rodadas:
                  </p>
                </div>

                <div className="flex gap-4 justify-center w-full mt-2">
                  <div className="bg-[#162230] border border-white/[0.04] p-2.5 rounded-xl text-center w-28 shadow-md">
                    <div className="h-10 w-10 mx-auto rounded-full overflow-hidden bg-[#1c2d3f] border border-white/[0.08] flex items-center justify-center mb-1">
                      <img src={stats.topRadar1.avatar} alt="" className="w-auto h-auto object-none object-top scale-75" />
                    </div>
                    <p className="text-xs font-bold text-[#e8edf2] truncate">{stats.topRadar1.nick}</p>
                    <p className="text-xs text-[#7a8fa3] mt-0.5">{stats.topRadar1.count} aparições</p>
                  </div>

                  <div className="bg-[#162230] border border-white/[0.04] p-2.5 rounded-xl text-center w-28 shadow-md">
                    <div className="h-10 w-10 mx-auto rounded-full overflow-hidden bg-[#1c2d3f] border border-white/[0.08] flex items-center justify-center mb-1">
                      <img src={stats.topRadar2.avatar} alt="" className="w-auto h-auto object-none object-top scale-75" />
                    </div>
                    <p className="text-xs font-bold text-[#e8edf2] truncate">{stats.topRadar2.nick}</p>
                    <p className="text-xs text-[#7a8fa3] mt-0.5">{stats.topRadar2.count} aparições</p>
                  </div>
                </div>
              </div>
            )}

            {/* Slide 2: Top Match */}
            {activeSlide === 2 && (
              <div className="space-y-4 animate-fade-in flex flex-col items-center">
                <span className="text-4xl animate-pulse">💕</span>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-rose-400 uppercase tracking-wider">Maior Afinidade</h4>
                  <p className="text-xs text-[#7a8fa3] max-w-[240px] leading-relaxed mt-0.5">
                    O par romântico que você mais selecionou ao longo de todo o reality:
                  </p>
                </div>

                <div className="bg-[#162230] border border-white/[0.08] p-3 rounded-2xl flex items-center gap-3 max-w-[240px] shadow-lg">
                  <div className="h-12 w-12 rounded-xl overflow-hidden bg-[#1c2d3f] border border-rose-400/40 flex items-center justify-center shrink-0">
                    <img 
                      src={`https://hubbe.biz/avatar/${stats.topMatchedNick}`} 
                      alt="" 
                      className="w-auto h-auto object-none object-top scale-95" 
                      onError={(e) => { e.target.src = currentUser.avatar }}
                    />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-sm font-black text-rose-400 truncate">{stats.topMatchedNick}</p>
                    <p className="text-xs text-[#e8edf2] font-semibold mt-0.5">
                      Você deu match <span className="font-extrabold text-white">{stats.topMatchedCount} vezes</span>!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Slide 3: Popularity */}
            {activeSlide === 3 && (
              <div className="space-y-4 animate-fade-in flex flex-col items-center">
                <span className="text-4xl">👑</span>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-cyan-400 uppercase tracking-wider">Sua Fama no Hotel</h4>
                  <p className="text-xs text-[#7a8fa3] max-w-[240px] leading-relaxed mt-0.5">
                    Você não foi apenas espectador, você também foi o centro das atenções!
                  </p>
                </div>

                <div className="bg-gradient-to-r from-cyan-500/10 to-[#db2777]/10 border border-cyan-400/20 px-4 py-3 rounded-xl max-w-[240px]">
                  <p className="text-xs font-bold text-[#e8edf2]">
                    Você apareceu no radar secreto dos outros usuários
                  </p>
                  <p className="text-xl font-black text-cyan-400 mt-1">
                    {stats.radarAppearances} vezes
                  </p>
                  {currentUser.powerups?.boost && (
                    <p className="text-[10px] font-black uppercase text-cyan-300 mt-1">
                      ⚡ Impulsionado por seu Boost
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Slide 4: Missed Connections */}
            {activeSlide === 4 && (
              <div className="space-y-4 animate-fade-in flex flex-col items-center">
                <span className="text-4xl">💔</span>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-rose-400 uppercase tracking-wider">Desencontros de Pixels</h4>
                  <p className="text-xs text-[#7a8fa3] max-w-[250px] leading-normal mt-0.5">
                    Fatos engraçados sobre sua rede de conexões românticas no hotel:
                  </p>
                </div>

                <div className="space-y-2 max-w-[260px] text-left">
                  <div className="bg-[#162230] border border-white/[0.04] p-2.5 rounded-xl flex items-center gap-2">
                    <span className="text-base shrink-0">❌</span>
                    <p className="text-xs text-[#7a8fa3]">
                      Você e <strong className="text-[#e8edf2]">{stats.missedUserX}</strong> nunca se cruzaram em matches nas rodadas!
                    </p>
                  </div>
                  <div className="bg-[#162230] border border-white/[0.04] p-2.5 rounded-xl flex items-center gap-2">
                    <span className="text-base shrink-0">🚫</span>
                    <p className="text-xs text-[#7a8fa3]">
                      O participante <strong className="text-[#e8edf2]">{stats.missedUserY}</strong> nunca apareceu como opção no seu radar!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Slide 5: Ranking Position with Custom Texts */}
            {activeSlide === 5 && (
              <div className="space-y-4 animate-fade-in flex flex-col items-center">
                <span className="text-4xl">🏆</span>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-amber-400 uppercase tracking-wider">Sua Classificação Final</h4>
                  <p className="text-xs text-[#7a8fa3] max-w-[240px] mt-0.5">
                    O placar de pontuação consolidado de todo o hotel:
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-xl font-black text-[#e8edf2]">
                    Você ficou na posição <span className="text-cyan-400 font-extrabold">{campaignRank}º</span> no Ranking Geral!
                  </p>
                  
                  <p className="text-xs text-[#7a8fa3] italic max-w-xs mx-auto leading-relaxed px-4">
                    {campaignRank === 1 && "🥇 Elite do Hotel! Você alcançou o topo da popularidade e de compatibilidade amorosa. Lendário!"}
                    {campaignRank === 2 && "🥈 Pódio de Prata! Você jogou com maestria e cativou o hotel todo."}
                    {campaignRank === 3 && "🥉 Pódio de Bronze! Sua presença marcou a temporada com matches fantásticos."}
                    {(campaignRank >= 4 && campaignRank <= 8 && !isAzaraoGeral) && "🎖️ Foi por muito pouco! Você garantiu uma popularidade forte no lobby e liderou várias rodadas."}
                    {(campaignRank > 8 && !isAzaraoGeral) && "🌟 Jornada divertida! Suas decisões e amizades valeram cada pixel nessa disputa."}
                    {isAzaraoGeral && "🤡 Azarão Supremo! A sorte no amor não sorriu, mas você faturou o consolo clássico e a Sorveteira Clássica."}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Jump Retro Button */}
          <div className="relative z-10 pt-2 shrink-0 border-t border-white/[0.04]">
            <button
              type="button"
              onClick={skipStory}
              className="text-xs text-[#7a8fa3] hover:text-[#e8edf2] underline cursor-pointer transition"
            >
              Pular retrospectiva ➔
            </button>
          </div>
        </div>
      ) : (
        /* Slide 6: Consolidated View (Final Screen) */
        <div className="space-y-5 animate-fade-in text-center">
          {/* Cerimônia Geral */}
          <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#1c2d3f] to-[#162230] p-4 shadow-xl relative overflow-hidden">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-500/10 via-transparent to-cyan-500/10 blur-sm pointer-events-none" />
            
            <div className="relative z-10">
              <span className="text-xs font-black text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full">
                🏆 Encerramento Geral
              </span>
              <h2 className="text-lg font-black text-[#e8edf2] mt-3" style={{ fontFamily: 'Kanit, sans-serif' }}>
                Pódio da Temporada de 7 Dias
              </h2>
              <p className="text-xs text-[#7a8fa3] mt-0.5">
                Classificação geral com base no somatório das {TOTAL_ROUNDS} rodadas.
              </p>

              {/* Visual General Podium Columns */}
              <div className="flex items-end justify-center gap-2 mt-5 mb-4 border-b border-white/[0.04] pb-4">
                {generalPodium.map((user) => {
                  const heightClass = user.rank === 1 ? 'h-24 bg-gradient-to-t from-amber-500/30 to-amber-500/60 border-amber-500/50' :
                                     user.rank === 2 ? 'h-20 bg-gradient-to-t from-slate-400/30 to-slate-400/50 border-slate-400/40' :
                                     'h-16 bg-gradient-to-t from-amber-700/30 to-amber-700/50 border-amber-700/40'
                  const medal = user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'

                  return (
                    <div key={user.nick} className="flex flex-col items-center flex-1 max-w-[100px]">
                      <div className={`relative mb-2 ${user.isPlayer ? 'scale-110' : ''}`}>
                        {user.isPlayer && (
                          <div className="absolute -inset-1.5 rounded-full bg-cyan-400 blur-sm animate-pulse pointer-events-none" />
                        )}
                        <div className={`h-11 w-11 rounded-full overflow-hidden border bg-[#1c2d3f] flex items-center justify-center shadow-lg ${user.isPlayer ? 'border-cyan-400 border-2 shadow-cyan-400/10' : 'border-white/[0.08]'}`}>
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
                      <p className={`text-xs font-black truncate w-full ${user.isPlayer ? 'text-cyan-400 font-extrabold' : 'text-[#e8edf2]'}`}>
                        {user.nick}
                      </p>
                      <div className={`w-full ${heightClass} border border-b-0 rounded-t-xl flex flex-col justify-end p-2 mt-1 shadow-2xl`}>
                        <span className="text-xs font-black text-white">{user.rank}º</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Azarão Geral Row */}
              <div className={`mx-auto max-w-xs rounded-xl p-2.5 border text-left flex items-center justify-between gap-3 ${isAzaraoGeral ? 'bg-red-500/10 border-red-500/20' : 'bg-[#1c2d3f] border-white/[0.06]'}`}>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-black tracking-wider uppercase text-rose-400 bg-rose-400/10 px-1.5 py-0.5 rounded">
                    Azarão da Campanha 🤡
                  </span>
                  <p className="text-sm font-black text-[#e8edf2] mt-1">
                    {generalAzaraoNick}
                  </p>
                  <p className="text-xs text-[#7a8fa3] leading-snug">
                    {isAzaraoGeral ? 'Você se provou o azarão máximo e conquistou a Sorveteira!' : 'O participante com menor compatibilidade da temporada.'}
                  </p>
                </div>
                <div className="relative">
                  {isAzaraoGeral && <div className="absolute -inset-1 rounded-full bg-rose-400 blur-sm pointer-events-none" />}
                  <div className={`h-9 w-9 rounded-xl overflow-hidden border bg-[#162230] flex items-center justify-center ${isAzaraoGeral ? 'border-rose-400' : 'border-white/[0.08]'}`}>
                    <img
                      src={generalAzaraoAvatar}
                      alt={generalAzaraoNick}
                      className="w-auto h-auto object-none object-top scale-75"
                      referrerPolicy="no-referrer"
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Título de Afinidade e Casal */}
          <div className="pt-2">
            <p className="text-sm font-black text-[#7a8fa3] uppercase tracking-widest">Seu Match de Alma</p>
            <p className="text-5xl font-black text-rose-400 mt-1 animate-pulse">{matchAffinity}%</p>
            <p className="text-xs text-[#7a8fa3] max-w-xs mx-auto mt-2 leading-relaxed">
              O match final é uma junção de pontuações e interesses refinados pela nossa Afrodite.
            </p>
          </div>

          <div className="flex items-end justify-center gap-3">
            <div className="relative">
              <div className="h-14 w-14 bg-[#1c2d3f] rounded-full border border-white/[0.08] shadow-lg shadow-black/20 overflow-hidden flex items-center justify-center">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.nick}
                  className="w-auto h-auto object-none object-top"
                  referrerPolicy="no-referrer"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              </div>
              {currentUser.purchasedBadges?.length > 0 && (
                <div className="absolute -bottom-1 -right-1 flex gap-0.5 scale-90">
                  {currentUser.purchasedBadges.slice(0, 2).map((badge, idx) => (
                    <span key={idx} title={badge} className="text-sm filter drop-shadow">
                      {badge.split(' ')[0]}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <span className="text-xl pb-2">💕</span>
            <div className="h-14 w-14 bg-[#1c2d3f] rounded-full border border-white/[0.08] shadow-lg shadow-black/20 overflow-hidden flex items-center justify-center">
              <img
                src={finalMatch.avatar}
                alt={finalMatch.nick}
                className="w-auto h-auto object-none object-top"
                referrerPolicy="no-referrer"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            </div>
          </div>

          <div>
            <p className="text-lg font-extrabold text-[#e8edf2]">
              {currentUser.nick} + {finalMatch.nick}
            </p>
            <p className="text-sm text-[#7a8fa3] mt-0.5">{finalMatch.vibe}</p>
          </div>

          {/* Seção de matches consolidada em tabela */}
          <div className="mx-auto max-w-xs rounded-xl bg-[#1c2d3f] p-3 border border-white/[0.06] text-left">
            <p className="text-xs font-black uppercase tracking-wider text-[#7a8fa3] mb-2 text-center">
              Resumo Geral de Todas as Rodadas:
            </p>
            <div className="max-h-40 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#db277733 transparent' }}>
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.06] text-[#7a8fa3]">
                    <th className="py-1 text-left font-black">Rodada</th>
                    <th className="py-1 text-left font-black">Match</th>
                    <th className="py-1 text-right font-black">Afinidade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-[#e8edf2]">
                  {Array.from({ length: TOTAL_ROUNDS }).map((_, idx) => {
                    const rId = idx + 1
                    const cId = roundMatches[rId]
                    const candidate = candidates.find((c) => c.id === cId)
                    return (
                      <tr key={rId}>
                        <td className="py-1 font-bold text-[#7a8fa3]">R{rId}</td>
                        <td className="py-1 font-extrabold text-[#e8edf2]">
                          {candidate ? candidate.nick : rId === 1 ? 'Estreia (Grátis)' : 'Nenhum'}
                        </td>
                        <td className="py-1 text-right font-bold text-cyan-400">
                          {rId === 1 ? '-' : candidate ? `${getCandidateAffinity(cId, rId)}%` : '-'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {currentUser.purchasedBadges?.length > 0 && (
            <div className="mx-auto max-w-xs rounded-xl bg-[#1c2d3f] p-2.5 border border-white/[0.06] text-left">
              <p className="text-xs font-black uppercase tracking-wider text-[#7a8fa3] mb-1">
                Conquistas Colecionadas:
              </p>
              <div className="flex flex-wrap justify-center gap-1.5">
                {currentUser.purchasedBadges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-white/5 px-2 py-0.5 text-xs font-bold text-[#e8edf2] border border-white/[0.06]"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          )}

          {currentUser.unlockedRares?.length > 0 && (
            <div className="mx-auto max-w-xs rounded-xl bg-amber-400/5 p-2.5 border border-amber-400/10">
              <p className="text-xs font-black uppercase tracking-wider text-amber-400 mb-1.5">
                🎒 Raros Desbloqueados na Temporada:
              </p>
              <div className="flex justify-center gap-2">
                {currentUser.unlockedRares.map((rareId) => {
                  const rare = HUBBE_RARES.find((r) => r.id === rareId)
                  if (!rare) return null
                  return (
                    <div
                      key={rareId}
                      className="h-10 w-10 shrink-0 overflow-hidden flex items-center justify-center rounded-xl bg-[#1c2d3f] border border-amber-400/20 shadow-lg shadow-black/20"
                      title={rare.name}
                    >
                      <img
                        src={rare.imageUrl}
                        alt={rare.name}
                        className="w-auto h-auto object-none object-center animate-bounce"
                        referrerPolicy="no-referrer"
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <p className="text-sm text-[#7a8fa3]">
            Parabéns por concluir! Tire print do seu story e compartilhe!
          </p>

          <button
            type="button"
            onClick={handleRestart}
            className="w-full rounded-xl border border-[#db2777]/30 bg-white/5 py-3 text-base font-semibold text-[#db2777] hover:bg-[#db2777]/10 active:scale-[0.98] transition duration-200 cursor-pointer"
          >
            Jogar novamente
          </button>
        </div>
      )}
    </div>
  )
}
