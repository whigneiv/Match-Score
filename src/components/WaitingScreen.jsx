import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMatchScore } from '../context/MatchScoreContext'
import { ROUNDS, formatVirtualDate } from '../constants/game'
import { playClick } from '../lib/audio'

const TIPS = [
  "🎡 Giro da Sorte: Gire de graça clicando em 'Giro Diário' nas ações rápidas. Ele só fica disponível após você concluir pelo menos 1 rodada no dia!",
  "👁️ Poder Espião (Loja): Custa 15 💎 por uso. Revela o avatar de um candidato oculto. Use para comparar com os líderes do ranking antes de escolher seu par!",
  "⚡ Poder Boost (Loja): Custa 60 💎 por uso. Dica estratégica: Ative o Boost logo na abertura da rodada para aparecer no radar de mais usuários e subir no ranking!",
  "🏆 Pódio Diário: Ao final de cada dia (a cada 3 rodadas oficiais), o Top 3 e o Azarão do dia ganham 30 diamantes extras e emblemas exclusivos de nível.",
  "🏁 Rodada de Boas-Vindas: A Rodada 1 é 100% grátis e recompensa com o Emblema de Estreante e diamantes na carteira para você já começar com saldo.",
  "🤡 Azarão da Temporada: O jogador que terminar os 7 dias de reality com o menor acúmulo de matchs faturará a Sorveteira Clássica e um Emblema temático.",
  "💰 Gestão de Moedas: Planeje seus gastos! A Rodada 1 é grátis, mas da rodada 2 à 22 o custo é de 30 💎 cada. Mantenha saldo suficiente no Giro da Sorte.",
  "⏰ Janela Curta de 10 Min: As rodadas regulares (9h, 14h, 19h BR) fecham após 10 minutos de abertura. Fique atento para não perder o horário!",
  "📈 Pontuação de Match: Concluir rodada dá +5 pontos. Aparecer no radar dá +5. Match simples vale +10 e Match Recíproco (ambos escolhem) dá +20 pontos!",
  "🧠 Sintonia de Vibe: Responda as perguntas do quiz de forma sincera ou estratégica. O algoritmo calcula a afinidade com base nas preferências selecionadas.",
  "❤️ Match Recíproco (+20): Leia atentamente a dica de biografia dos candidatos ocultos e deduza qual deles combina mais com a sua vibe da rodada."
]

export default function WaitingScreen({ targetRoundId }) {
  const { virtualClock } = useMatchScore()
  const [tipIndex, setTipIndex] = useState(0)

  // Auto-rotate tips every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length)
    }, 10000)
    return () => clearInterval(timer)
  }, [])

  const handleNextTip = () => {
    playClick()
    setTipIndex((prev) => (prev + 1) % TIPS.length)
  }

  // Find target round info
  const round = ROUNDS.find((r) => r.id === targetRoundId)
  if (!round) return null

  // Calculate virtual time difference
  const targetTotalMinutes = (round.day - 1) * 24 * 60 + round.hour * 60
  const currentTotalMinutes = (virtualClock.day - 1) * 24 * 60 + virtualClock.hour * 60 + virtualClock.minute
  const diffMinutes = Math.max(0, targetTotalMinutes - currentTotalMinutes)

  const [secondsLeft, setSecondsLeft] = useState(diffMinutes * 60)

  useEffect(() => {
    setSecondsLeft(diffMinutes * 60)
  }, [diffMinutes])

  useEffect(() => {
    if (secondsLeft <= 0) return
    const interval = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [secondsLeft])

  const formatCountdown = (totalSecs) => {
    if (totalSecs <= 0) return "Carregando rodada..."
    const hrs = Math.floor(totalSecs / 3600)
    const mins = Math.floor((totalSecs % 3600) / 60)
    const secs = totalSecs % 60

    if (hrs > 0) {
      return `${hrs}h ${mins}m ${String(secs).padStart(2, '0')}s`
    }
    return `${mins}m ${String(secs).padStart(2, '0')}s`
  }

  const countdownText = formatCountdown(secondsLeft)

  const isR1 = targetRoundId === 1

  return (
    <div className="py-6 text-center space-y-5 animate-fade-in text-left max-w-sm mx-auto w-full">
      {isR1 && (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center space-y-1">
          <h4 className="text-sm font-black text-emerald-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
            <span>🎉</span> Parabéns!
          </h4>
          <p className="text-xs font-semibold text-[#e8edf2] leading-relaxed">
            Você se inscreveu no MatchScore!
          </p>
        </div>
      )}

      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#db2777]/10 border-4 border-[#db2777]/40 shadow-lg shadow-[#db2777]/10 animate-pulse text-2xl">
        ⏳
      </div>

      <div className="space-y-1 text-center">
        <h3 className="text-base font-black text-[#e8edf2]" style={{ fontFamily: 'Kanit, sans-serif' }}>
          {isR1 ? 'Estreia em breve!' : `Próxima Rodada: R${targetRoundId}`}
        </h3>
        <p className="text-xs text-[#7a8fa3] max-w-xs mx-auto leading-relaxed">
          {isR1 
            ? `O reality show começa em ${formatVirtualDate(round.day)} às ${String(round.hour).padStart(2, '0')}:00. Aguarde a liberação!`
            : `A Rodada ${targetRoundId} se inicia às ${String(round.hour).padStart(2, '0')}:00 de ${formatVirtualDate(round.day)}.`}
        </p>
      </div>

      {/* Countdown Card */}
      <div className="bg-[#1c2d3f]/80 border border-white/[0.06] rounded-xl p-3 max-w-[280px] mx-auto text-center space-y-1">
        <p className="text-[10px] font-black text-[#7a8fa3] uppercase tracking-wider">A rodada começa em</p>
        <p className="text-sm font-black text-[#db2777]">
          {countdownText}
        </p>
      </div>

      {/* Rotating Tips Box */}
      <div 
        onClick={handleNextTip}
        className="mx-auto max-w-[320px] rounded-xl bg-[#1c2d3f]/40 border border-white/[0.04] p-3 text-left relative overflow-hidden cursor-pointer hover:bg-[#1c2d3f]/60 transition select-none group min-h-[70px] flex items-center justify-center"
        title="Clique para ver a próxima dica"
      >
        <div className="absolute right-2 top-2 text-[10px] text-[#7a8fa3] opacity-0 group-hover:opacity-100 transition">
          Próxima ➔
        </div>
        
        <AnimatePresence mode="wait">
          <motion.p
            key={tipIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="text-xs text-[#7a8fa3] leading-normal pr-4"
          >
            {TIPS[tipIndex]}
          </motion.p>
        </AnimatePresence>
      </div>



    </div>
  )
}
