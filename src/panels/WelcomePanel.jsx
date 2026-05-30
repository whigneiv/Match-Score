import { useEffect, useRef, useState } from 'react'
import { useMatchScore } from '../context/MatchScoreContext'
import { playClick, playCoin } from '../lib/audio'
import { motion, AnimatePresence } from 'framer-motion'

export default function WelcomePanel() {
  const { payAndAdvance, currentUser, updateProfile, goToInitialRound } = useMatchScore()
  const [nick, setNick] = useState(currentUser.nick || '')
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncStep, setSyncStep] = useState(0)
  const loadingTimerRef = useRef(null)
  
  // Onboarding Step State: 1 (Welcome), 2 (Rules/Rounds), 3 (Prizes), 4 (Register)
  const [step, setStep] = useState(1)

  const trimmedNick = nick.trim()
  const avatarUrl = trimmedNick ? `https://hubbe.biz/avatar/${encodeURIComponent(trimmedNick)}` : ''

  const handleNickChange = (value) => {
    setNick(value)
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current)
    }
    if (!value.trim()) {
      setLoading(false)
      return
    }
    setLoading(true)
    loadingTimerRef.current = setTimeout(() => {
      setLoading(false)
      loadingTimerRef.current = null
    }, 450)
  }

  useEffect(() => (
    () => {
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current)
      }
    }
  ), [])

  const handleRegister = () => {
    if (!trimmedNick) return
    playClick()
    playCoin()
    setSyncing(true)

    setSyncStep(1)
    setTimeout(() => {
      setSyncStep(2)
      setTimeout(() => {
        setSyncStep(3)
        setTimeout(() => {
          const initialDiamonds = ((trimmedNick.length * 37) % 150) + 150
          goToInitialRound() // Reset virtual clock to 7 AM
          updateProfile(trimmedNick, avatarUrl, initialDiamonds)
          setSyncing(false)
          payAndAdvance(1, 0)
        }, 1000)
      }, 1000)
    }, 1000)
  }

  if (syncing) {
    return (
      <div className="py-10 text-center space-y-6 animate-fade-in max-w-[460px] mx-auto w-full">
        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-[#db2777]/10 border-4 border-[#db2777] shadow-lg shadow-[#db2777]/20 animate-pulse">
          <span className="text-5xl">💎</span>
        </div>
        <div className="space-y-3">
          <h3 className="text-lg font-black text-[#e8edf2]">Sincronizando carteira Hubbe...</h3>
          <p className="text-sm text-[#7a8fa3] max-w-sm mx-auto leading-relaxed">
            Acessando os servidores do Hubbe Hotel para recuperar seus diamantes.
          </p>
        </div>

        <div className="mx-auto max-w-xs overflow-hidden rounded-full bg-white/5 h-3 border border-white/[0.06]">
          <div
            className="h-full bg-gradient-to-r from-[#db2777] to-cyan-400 transition-all duration-300 rounded-full"
            style={{ width: `${(syncStep / 3) * 100}%` }}
          />
        </div>

        <div className="text-xs font-bold text-[#db2777] uppercase tracking-wider h-4">
          {syncStep === 1 && '🔌 Conectando ao banco de dados do Hubbe...'}
          {syncStep === 2 && '📂 Recuperando dados do avatar e inventário...'}
          {syncStep === 3 && '💎 Carregando carteira de diamantes...'}
        </div>
      </div>
    )
  }

  const nextStep = () => {
    playClick()
    setStep((s) => Math.min(s + 1, 4))
  }

  const prevStep = () => {
    playClick()
    setStep((s) => Math.max(s - 1, 1))
  }

  return (
    <div className="py-2 text-center animate-fade-in space-y-5 max-w-[460px] mx-auto w-full">
      {/* Onboarding steps rendering */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-4 text-left w-full"
          >
            <div className="rounded-2xl border border-[#db2777]/25 bg-[#db2777]/5 p-5 space-y-3">
              <h3 className="text-base font-black text-[#e8edf2] flex items-center gap-2">
                <span>🏆</span> Bem-vindo ao Match Score!
              </h3>
              <p className="text-sm text-[#7a8fa3] leading-relaxed">
                Você acaba de pousar no maior reality show de afinidade pixelada do <strong>Hubbe Hotel</strong>!
              </p>
              <p className="text-sm text-[#7a8fa3] leading-relaxed">
                Sua missão ao longo dos próximos dias será responder perguntas rápidas e escolher matchs "secretos" para encontrar a sua alma gêmea.
              </p>
            </div>
            
            <div className="rounded-2xl border border-white/[0.06] bg-[#1c2d3f] p-5 text-left">
              <p className="text-sm text-[#7a8fa3] leading-relaxed">
                ⚠️ <strong>Importante:</strong> Este reality é uma brincadeira interativa e fictícia. Os temas propostos serão diretamente ligados ao mundo Hubbe, respeitando os seus respectivos namorados(a) reais.
              </p>
            </div>
            
            <button
              type="button"
              onClick={nextStep}
              className="w-full rounded-xl bg-[#db2777] hover:bg-[#ec4899] py-3 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-[#db2777]/20 transition cursor-pointer"
            >
              Conhecer as Regras ➔
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-4 text-left w-full"
          >
            <div className="rounded-2xl border border-white/[0.06] bg-[#1c2d3f] p-5 space-y-3.5">
              <h3 className="text-sm font-black text-[#e8edf2] uppercase tracking-wider">
                ⏰ Como funciona o Reality?
              </h3>
              <ul className="space-y-3 text-sm text-[#7a8fa3] leading-relaxed">
                <li>
                  <strong className="text-[#db2777]">1. Primeira Rodada Grátis:</strong> A rodada inicial é grátis com janela de 24 horas para reunir o máximo de usuários e suas preferências iniciais.
                </li>
                <li>
                  <strong className="text-[#db2777]">2. Rodadas Oficiais:</strong> Após as 24h iniciais, começam as rodadas oficiais. Serão 3 rodadas por dia, durante 7 dias, sempre nos horários: <strong>9h, 14h e 19h (BR)</strong>.
                </li>
                <li>
                  <strong className="text-[#db2777]">3. Janelas Curtas:</strong> Cada rodada terá 5 perguntas rápidas e uma janela de duração de <strong>10 minutos</strong>. Não perca o horário!
                </li>
              </ul>
            </div>
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/[0.06] py-3 text-xs font-black uppercase tracking-wider text-[#7a8fa3] transition cursor-pointer"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 rounded-xl bg-[#db2777] hover:bg-[#ec4899] py-3 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-[#db2777]/20 transition cursor-pointer"
              >
                Ver Prêmios ➔
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-4 text-left w-full"
          >
            <div className="rounded-2xl border border-white/[0.06] bg-[#1c2d3f] p-5 space-y-4">
              <h3 className="text-sm font-black text-[#e8edf2] uppercase tracking-wider">
                ⚡ Prêmios e Benefícios
              </h3>
              
              <div className="space-y-3 text-sm text-[#7a8fa3] leading-relaxed">
                <div>
                  <p className="font-bold text-cyan-400 flex items-center gap-1">🏁 Estreia Grátis</p>
                  <p className="text-xs text-[#7a8fa3]/80 pl-4 mt-0.5">
                    Participe da rodada inicial grátis para garantir o <strong>emblema de estreia + 30 diamantes</strong>.
                  </p>
                </div>

                <div>
                  <p className="font-bold text-emerald-400 flex items-center gap-1">🎖️ Ranking Diário</p>
                  <p className="text-xs text-[#7a8fa3]/80 pl-4 mt-0.5">
                    Ao final de cada dia, teremos o ranking diário que premiará: o <strong>Top 3 Matchs</strong> ganha um emblema de nível (de 1 a 3) + <strong>30 diamantes</strong>.
                  </p>
                </div>

                <div>
                  <p className="font-bold text-rose-400 flex items-center gap-1">🤡 Prêmio de Consolação</p>
                  <p className="text-xs text-[#7a8fa3]/80 pl-4 mt-0.5">
                    Para o azarão que ficou em último no ranking diário com menos matchs: 1 <strong>emblema temático</strong> (só ganha uma vez) + <strong>30 diamantes</strong>.
                  </p>
                </div>

                <div>
                  <p className="font-bold text-amber-500 flex items-center gap-1">🎡 Giro da Sorte</p>
                  <p className="text-xs text-[#7a8fa3]/80 pl-4 mt-0.5">
                    Apenas <strong>1 giro por dia</strong>, que pode ser usado durante qualquer rodada ativa. Gire a roleta para faturar diamantes ou raros extras!
                  </p>
                </div>

                <div>
                  <p className="font-bold text-violet-400 flex items-center gap-1">🏆 Ranking Geral</p>
                  <p className="text-xs text-[#7a8fa3]/80 pl-4 mt-0.5">
                    Além das premiações diárias, também teremos ao final dos 7 dias, o <strong>ranking geral</strong>, premiando os 3 usuários que mais acumularam pontos e também o azarão do reality, o que menos teve matchs.
                  </p>
                </div>

                <div>
                  <p className="font-bold text-[#db2777] flex items-center gap-1.5">
                    <span>👁️ Poder Espião</span>
                    <span className="text-[9px] font-black uppercase text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/15">Loja</span>
                  </p>
                  <p className="text-xs text-[#7a8fa3]/80 pl-4 mt-0.5">
                    Ao final de cada rodada aparecem 3 cards ocultos. Use a intuição ou adquira o poder <strong>Espião</strong> na Loja para revelar os candidatos e tomar a melhor decisão.
                  </p>
                </div>

                <div>
                  <p className="font-bold text-amber-400 flex items-center gap-1.5">
                    <span>⚡ Poder Boost</span>
                    <span className="text-[9px] font-black uppercase text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/15">Loja</span>
                  </p>
                  <p className="text-xs text-[#7a8fa3]/80 pl-4 mt-0.5">
                    Faz seu perfil aparecer mais vezes durante a rodada. A estratégia ideal é ativar o <strong>Boost</strong> assim que a rodada abrir para maximizar seus pontos.
                  </p>
                </div>
              </div>
            </div>

            {/* Points System Table */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#1c2d3f] p-5 space-y-3">
              <p className="text-xs font-black text-rose-400 uppercase tracking-wider">📊 Tabela de Pontuação:</p>
              <div className="grid grid-cols-2 gap-3 text-xs text-[#7a8fa3]">
                <div className="bg-[#162230] p-3 rounded-xl text-center border border-white/[0.04] flex flex-col justify-between">
                  <p className="font-black text-lg text-[#e8edf2]">+5</p>
                  <p className="text-[10px] uppercase font-bold mt-0.5 text-[#7a8fa3] leading-tight">Rodada Concluída</p>
                </div>
                <div className="bg-[#162230] p-3 rounded-xl text-center border border-white/[0.04] flex flex-col justify-between">
                  <p className="font-black text-lg text-[#e8edf2]">+5</p>
                  <p className="text-[10px] uppercase font-bold mt-0.5 text-[#7a8fa3] leading-tight">Aparecer no Radar (Mesmo Oculto)</p>
                </div>
                <div className="bg-[#162230] p-3 rounded-xl text-center border border-white/[0.04] flex flex-col justify-between">
                  <p className="font-black text-lg text-[#e8edf2]">+10</p>
                  <p className="text-[10px] uppercase font-bold mt-0.5 text-[#7a8fa3] leading-tight">Dar Match (Não Correspondido)</p>
                </div>
                <div className="bg-[#162230] p-3 rounded-xl text-center border border-white/[0.04] flex flex-col justify-between">
                  <p className="font-black text-lg text-[#e8edf2]">+20</p>
                  <p className="text-[10px] uppercase font-bold mt-0.5 text-[#7a8fa3] leading-tight">Match Recíproco (Ambos Escolhem)</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/[0.06] py-3 text-xs font-black uppercase tracking-wider text-[#7a8fa3] transition cursor-pointer"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 rounded-xl bg-[#db2777] hover:bg-[#ec4899] py-3 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-[#db2777]/20 transition cursor-pointer"
              >
                Criar Perfil ➔
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-4 text-left w-full animate-fade-in"
          >
            <div className="rounded-2xl border border-white/[0.06] bg-[#1c2d3f] p-5 space-y-4">
              <h3 className="text-sm font-black text-[#e8edf2] uppercase tracking-wider flex items-center gap-1.5 border-b border-white/[0.04] pb-2">
                <span>🔒</span> Conecte sua Conta Hubbe
              </h3>

              <p className="text-xs text-[#7a8fa3] leading-relaxed">
                💡 Conectaremos diretamente na sua conta Hubbe e as rodadas pagas ou poderes na loja serão debitados da sua carteira de diamantes.
              </p>

              <div className="relative mx-auto my-6 h-32 w-32">
                <div className="player-avatar-ring absolute -inset-2 rounded-2xl animate-pulse" />
                <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border-4 border-[#db2777]/40 bg-[#162230] shadow-xl shadow-black/30">
                  {loading ? (
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#db2777]/30 border-t-[#db2777]" />
                  ) : avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={nick}
                      style={{ width: '64px', height: '110px', objectFit: 'none', objectPosition: 'top' }}
                      referrerPolicy="no-referrer"
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                  ) : (
                    <span className="text-4xl">👤</span>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="nick-input"
                  className="block text-[11px] font-bold uppercase tracking-wider text-[#7a8fa3]"
                >
                  SEU NICK NO HUBBE
                </label>
                <input
                  id="nick-input"
                  type="text"
                  value={nick}
                  onChange={(e) => handleNickChange(e.target.value)}
                  placeholder="Digite seu nick..."
                  className="mt-1.5 w-full rounded-xl bg-[#1c2d3f] border border-white/[0.08] px-4 py-3 text-center text-lg font-bold text-[#e8edf2] transition focus:border-[#db2777] focus:outline-none placeholder:text-[#7a8fa3]/60"
                />
              </div>
            </div>

            {/* Basic Rules Warning Block */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#1c2d3f] p-5 space-y-2">
              <p className="text-xs font-black text-rose-400 uppercase tracking-wider">⚠️ Diretrizes de Jogo Limpo:</p>
              <ul className="space-y-1.5 text-xs text-[#7a8fa3] leading-relaxed list-disc pl-4">
                <li><strong>Apenas contas principais:</strong> O uso de contas fakes ou secundárias resultará em desclassificação imediata e anulação de prêmios.</li>
                <li><strong>Respeito mútuo:</strong> As regras gerais do Hubbe se estendem a esta atividade. Respeite os colegas e não pratique bullying, assédio ou toxicidade sob pena de desclassificação imediata.</li>
                <li><strong>Participação ativa:</strong> Serão 3 rodadas diárias de 10 min. Esteja online nos horários (9h, 14h, 19h BR) para pontuar!</li>
              </ul>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={prevStep}
                className="rounded-xl bg-white/5 hover:bg-white/10 border border-white/[0.06] px-5 py-3 text-xs font-black uppercase tracking-wider text-[#7a8fa3] transition cursor-pointer"
              >
                Voltar
              </button>
              <button
                type="button"
                disabled={!trimmedNick || loading}
                onClick={handleRegister}
                className="flex-1 rounded-xl bg-[#db2777] hover:bg-[#ec4899] px-5 py-3 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-[#db2777]/20 transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-white/5 disabled:text-white/20 disabled:shadow-none cursor-pointer"
              >
                Fazer Inscrição
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress dots mapping steps */}
      <div className="flex justify-center gap-1.5 py-2">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
              step === s ? 'bg-[#db2777] w-4' : 'bg-white/10'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
