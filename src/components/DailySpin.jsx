import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMatchScore } from '../context/MatchScoreContext'
import { playClick, playCoin, playSuccess } from '../lib/audio'

export default function DailySpin({ onClose }) {
  const {
    currentUser,
    earnDiamonds,
    unlockRare,
    grantPowerup,
    markSpun,
    virtualClock,
    getRoundTimeStatus,
    currentRoundMeta,
    completedRoundToday,
  } = useMatchScore()

  const [spinning, setSpinning] = useState(false)
  const [prize, setPrize] = useState(null)
  const [rotation, setRotation] = useState(0)

   const items = [
    { label: '15 💎', type: 'diamonds', value: 15, color: '#1a3a58', probability: 20, name: '15 Diamantes' },
    { label: '30 💎', type: 'diamonds', value: 30, color: '#0f4a2a', probability: 15, name: '30 Diamantes' },
    { label: 'Espiar 👁️', type: 'espiar', value: 1, color: '#3d2080', probability: 10, name: 'Poder Espiar (1 Carga)' },
    { label: 'Boost ⚡', type: 'boost', value: 1, color: '#0f3a6a', probability: 5, name: 'Poder Boost (1 Uso)' },
    { label: 'Pato 🦆', type: 'rare', value: 'duck', color: '#7a4a10', probability: 45, name: 'Pato de Borracha (Mobi Lixo)', iconUrl: 'https://images.habbo.com/c_images/album1584/Xmas11_duck.png' },
    { label: 'Raro 🐉', type: 'rare', value: 'dragon', color: '#5a1040', probability: 5, name: 'Dragão de Fogo Raro', iconUrl: 'https://images.habbo.com/c_images/album1584/LAV01.png' },
  ]

  // Check if spin is available (within active round window)
  const round = currentUser.currentRound
  const timeStatus = currentRoundMeta ? getRoundTimeStatus(round, virtualClock) : 'closed'
  const isWindowOpen = timeStatus === 'open'
  const canSpin = isWindowOpen && !currentUser.hasSpun && completedRoundToday && !spinning

  const spin = () => {
    if (!canSpin) return
    playClick()
    setSpinning(true)
    setPrize(null)

    const r = Math.random() * 100
    let cumulative = 0
    let randomIndex = 0
    for (let i = 0; i < items.length; i++) {
      cumulative += items[i].probability
      if (r <= cumulative) {
        randomIndex = i
        break
      }
    }

    const extraSpins = 6
    const anglePerItem = 360 / items.length
    const targetRotation = 360 * extraSpins + (360 - (randomIndex * anglePerItem + anglePerItem / 2) - 90)
    setRotation(targetRotation)

    setTimeout(() => {
      const selectedPrize = items[randomIndex]
      setPrize(selectedPrize)
      if (selectedPrize.type === 'diamonds') {
        earnDiamonds(selectedPrize.value)
      } else if (selectedPrize.type === 'espiar') {
        grantPowerup('revealFlags', 1)
      } else if (selectedPrize.type === 'boost') {
        grantPowerup('boost', 1)
      } else {
        unlockRare(selectedPrize.value)
      }
      markSpun()
      setSpinning(false)
      playSuccess()
      playCoin()
    }, 4000)
  }

  const getWindowMessage = () => {
    if (currentUser.hasSpun) return null
    if (round === 0) return { type: 'locked', text: 'Entre no reality primeiro para girar.' }
    if (!completedRoundToday) return { type: 'locked', text: 'Você precisa concluir a rodada atual antes de poder girar!' }
    if (timeStatus === 'upcoming') return { type: 'upcoming', text: 'A rodada ainda não começou. Aguarde para girar.' }
    if (timeStatus === 'expired') return { type: 'expired', text: 'A janela desta rodada expirou. Aguarde a próxima rodada do dia.' }
    if (timeStatus === 'closed') return { type: 'locked', text: 'Nenhuma rodada ativa no momento.' }
    return null
  }

  const windowMsg = getWindowMessage()

  return (
    <div className="p-5 flex flex-col max-h-[90vh] overflow-hidden">
      {/* Header */}
      <div className="shrink-0 text-center pb-3 border-b border-white/[0.06] mb-3">
        <h3 className="text-base font-black text-[#e8edf2]">🎡 Giro da Sorte</h3>
        <p className="text-xs text-[#7a8fa3] mt-0.5">
          Gire para faturar diamantes, raros ou poderes especiais!
        </p>
      </div>

      {/* Time constraint warning */}
      <div className="shrink-0 mb-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-2.5">
        <p className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
          ⏱️ Regra do Giro da Sorte
        </p>
        <p className="text-[11px] text-[#7a8fa3] mt-1 leading-snug">
          Você tem direito a apenas <strong className="text-amber-400">1 giro por dia</strong>, o qual é liberado <strong className="text-amber-400">após a conclusão de pelo menos 1 rodada no dia</strong>. Ele pode ser usado em qualquer rodada aberta subsequente.
        </p>
      </div>

      {/* Locked state message */}
      {windowMsg && (
        <div className={`shrink-0 mb-3 rounded-xl border p-2.5 ${
          windowMsg.type === 'expired'
            ? 'border-rose-500/20 bg-rose-500/5'
            : 'border-white/[0.06] bg-white/[0.02]'
        }`}>
          <p className="text-xs font-bold text-[#7a8fa3] flex items-center gap-1.5">
            {windowMsg.type === 'expired' ? '🔒' : windowMsg.type === 'upcoming' ? '⏳' : '🔒'}
            {windowMsg.text}
          </p>
        </div>
      )}

      <div className="overflow-y-auto pr-1 flex-1 space-y-3" style={{ scrollbarWidth: 'thin', scrollbarColor: '#db277733 transparent' }}>
        {/* Wheel */}
        <div className="relative mx-auto flex h-52 w-52 items-center justify-center">
          {/* Pointer */}
          <div className="absolute top-0 z-20 text-xl -translate-y-1 drop-shadow-lg">👇</div>

          <motion.svg
            animate={{ rotate: rotation }}
            transition={spinning ? { ease: [0.1, 0.8, 0.1, 1], duration: 4 } : { duration: 0.1 }}
            className="h-44 w-44 rounded-full border-4 border-[#db2777]/50 shadow-lg shadow-[#db2777]/10"
            viewBox="0 0 100 100"
          >
            {items.map((item, idx) => {
              const angle = 360 / items.length
              const startAngle = idx * angle
              const endAngle = (idx + 1) * angle
              const midAngle = startAngle + angle / 2

              const radStart = (Math.PI * startAngle) / 180
              const radEnd = (Math.PI * endAngle) / 180

              const x1 = 50 + 50 * Math.cos(radStart)
              const y1 = 50 + 50 * Math.sin(radStart)
              const x2 = 50 + 50 * Math.cos(radEnd)
              const y2 = 50 + 50 * Math.sin(radEnd)

              const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`

              // Text position along the midpoint radius (at 60% of radius)
              const textRad = (Math.PI * midAngle) / 180
              const tx = 50 + 32 * Math.cos(textRad)
              const ty = 50 + 32 * Math.sin(textRad)

              return (
                <g key={idx}>
                  <path d={pathData} fill={item.color} stroke="rgba(255,255,255,0.10)" strokeWidth="0.5" />
                  <text
                    x={tx}
                    y={ty}
                    transform={`rotate(${midAngle} ${tx} ${ty})`}
                    fill="white"
                    fontSize="4"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {item.label}
                  </text>
                </g>
              )
            })}
          </motion.svg>

          {/* Center pin */}
          <div className="absolute h-6 w-6 rounded-full border-2 border-white/30 bg-[#db2777] shadow-lg shadow-[#db2777]/40 flex items-center justify-center z-10">
            <span className="text-xs text-white font-bold">🎁</span>
          </div>
        </div>

        <div className="text-center space-y-3">
          <AnimatePresence mode="wait">
            {currentUser.hasSpun && !spinning && prize && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                className="animate-fade-in"
              >
                {prize.type === 'diamonds' && (
                  <p className="text-sm font-bold text-emerald-400">
                    Parabéns! Você faturou <span className="text-base font-black">{prize.label}</span>! 💎
                  </p>
                )}
                {prize.type === 'espiar' && (
                  <p className="text-sm font-bold text-cyan-400">
                    Incrível! Você faturou <span className="text-base font-black">1 Carga de Espiar</span>! 👁️
                  </p>
                )}
                {prize.type === 'boost' && (
                  <p className="text-sm font-bold text-amber-400">
                    Espetacular! Você faturou o <span className="text-base font-black">Poder Boost</span>! ⚡
                  </p>
                )}
                {prize.type === 'rare' && (
                  <div className="flex flex-col items-center gap-1 bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 max-w-[240px] mx-auto">
                    <p className="text-xs font-black text-amber-400 uppercase tracking-wider">🔥 RECOMPENSA DESBLOQUEADA!</p>
                    <div className="h-10 w-10 overflow-hidden flex items-center justify-center bg-[#1c2d3f] rounded-lg border border-amber-500/20">
                      <img
                        src={prize.iconUrl}
                        alt={prize.name}
                        className="w-auto h-auto object-none object-center"
                        referrerPolicy="no-referrer"
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                    </div>
                    <p className="text-sm font-bold text-[#e8edf2]">{prize.name}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            disabled={!canSpin}
            onClick={spin}
            className={`w-full rounded-xl py-3 text-sm font-bold text-white transition cursor-pointer ${
              canSpin
                ? 'bg-[#db2777] hover:bg-[#ec4899] active:scale-95 shadow-lg shadow-[#db2777]/20'
                : 'cursor-not-allowed bg-white/5 text-white/20'
            }`}
          >
            {spinning
              ? 'Girando...'
              : currentUser.hasSpun
              ? '✅ Giro já efetuado hoje'
              : !isWindowOpen && round > 0
              ? '🔒 Fora da janela ativa'
              : round === 0
              ? '🔒 Entre no reality primeiro'
              : 'Girar Roleta (Grátis) 🎡'}
          </button>

          {/* Probability table */}
          <div className="mt-3 border-t border-white/[0.06] pt-3 text-left">
            <p className="text-xs font-black uppercase tracking-wider text-[#7a8fa3] mb-2.5 flex items-center gap-1.5">
              <span>📊</span> Prêmios & Probabilidades
            </p>
            
            <div className="space-y-3">
              {/* Category: Diamantes */}
              <div>
                <p className="text-[10px] font-black uppercase text-cyan-400 mb-1">💎 Diamantes</p>
                <div className="grid grid-cols-2 gap-2">
                  {items.filter(i => i.type === 'diamonds').map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-xl bg-[#1c2d3f] border border-white/[0.04] p-2 text-xs font-bold">
                      <span className="text-[#e8edf2]">{item.name}</span>
                      <span className="text-[10px] font-black text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded border border-cyan-400/15">{item.probability}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category: Poderes */}
              <div>
                <p className="text-[10px] font-black uppercase text-amber-400 mb-1">⚡ Poderes da Loja</p>
                <div className="grid grid-cols-2 gap-2">
                  {items.filter(i => i.type === 'espiar' || i.type === 'boost').map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-xl bg-[#1c2d3f] border border-white/[0.04] p-2 text-xs font-bold">
                      <span className="text-[#e8edf2]">{item.label}</span>
                      <span className="text-[10px] font-black text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/15">{item.probability}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category: Mobis & Raros */}
              <div>
                <p className="text-[10px] font-black uppercase text-pink-400 mb-1">🎒 Colecionáveis (Mobis)</p>
                <div className="grid grid-cols-2 gap-2">
                  {items.filter(i => i.type === 'rare').map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-1.5 rounded-xl bg-[#1c2d3f] border border-white/[0.04] p-2 text-xs font-bold min-w-0">
                      <div className="flex items-center gap-1 min-w-0 flex-1">
                        <img
                          src={item.iconUrl}
                          alt=""
                          className="h-4 w-4 object-contain shrink-0"
                          referrerPolicy="no-referrer"
                          onError={(e) => { e.target.style.display = 'none' }}
                        />
                        <span className="text-[#e8edf2] truncate">{item.label}</span>
                      </div>
                      <span className="text-[10px] font-black text-pink-400 bg-pink-400/10 px-1.5 py-0.5 rounded border border-pink-400/15 shrink-0">{item.probability}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {onClose && (
        <div className="shrink-0 text-center border-t border-white/[0.06] pt-2 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-[#7a8fa3] hover:text-[#e8edf2] underline cursor-pointer transition"
          >
            Fechar
          </button>
        </div>
      )}
    </div>
  )
}
