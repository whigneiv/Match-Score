import { useMatchScore } from '../context/MatchScoreContext'
import { playClick, playCoin } from '../lib/audio'

export default function VipShop({ onClose }) {
  const { currentUser, buyPowerup } = useMatchScore()

  const powerups = [
    {
      id: 'revealFlags',
      label: '👁️ Espiar Ocultos',
      cost: 15,
      desc: 'Revela a identidade real de um candidato oculto por vez. Você pode usar até 2 vezes na mesma rodada.',
      badge: '+1 carga',
      badgeColor: 'text-cyan-400 bg-cyan-400/10',
    },
    {
      id: 'boost',
      label: '⚡ Perfil Impulsionado',
      cost: 60,
      desc: 'Faz seu perfil aparecer mais vezes para outros usuários durante a rodada, maximizando seus pontos acumulados. Limite de 1 por rodada.',
      badge: '1 uso/rodada',
      badgeColor: 'text-amber-400 bg-amber-400/10',
    },
  ]

  const getStatus = (pw) => {
    const p = currentUser.powerups
    if (pw.id === 'revealFlags') {
      const charges = p?.espiarCharges || 0
      return { charges, owned: charges > 0, label: charges > 0 ? `${charges}/2 cargas` : null }
    }
    if (pw.id === 'boost') {
      return { owned: !!p?.boost, label: p?.boost ? 'Ativo na rodada' : null }
    }
    return { owned: false, label: null }
  }

  const handleBuy = (pw) => {
    if (currentUser.diamonds < pw.cost) return
    const p = currentUser.powerups
    if (pw.id === 'boost' && p?.boost) return
    if (pw.id === 'revealFlags' && (p?.espiarCharges || 0) >= 2) return

    playClick()
    playCoin()
    buyPowerup(pw.id, pw.cost)
  }

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#162230] p-5 shadow-xl shadow-black/20 flex flex-col max-h-[90vh] overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
        <div>
          <h3 className="text-base font-black text-[#e8edf2]">🛍️ Loja de Poderes</h3>
          <p className="text-xs text-[#7a8fa3] mt-0.5">Habilidades especiais para vencer o reality</p>
        </div>
        <span className="rounded-lg bg-cyan-400/10 px-2.5 py-1 text-sm font-bold text-cyan-400">
          💎 {currentUser.diamonds}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-2.5" style={{ scrollbarWidth: 'thin', scrollbarColor: '#db277733 transparent' }}>
        {powerups.map((pw) => {
          const { charges, owned, label: statusLabel } = getStatus(pw)
          const isBlocked = (pw.id === 'boost' && owned) || (pw.id === 'revealFlags' && charges >= 2)
          const canBuy = currentUser.diamonds >= pw.cost && !isBlocked

          return (
            <div
              key={pw.id}
              className={`rounded-xl border p-3 transition ${
                isBlocked
                  ? 'border-emerald-500/20 bg-emerald-500/5'
                  : owned
                  ? 'border-[#db2777]/20 bg-[#db2777]/5'
                  : 'border-white/[0.06] bg-[#1c2d3f]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-[#e8edf2]">{pw.label}</p>
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider ${pw.badgeColor}`}>
                      {pw.badge}
                    </span>
                    {statusLabel && (
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider text-emerald-400 bg-emerald-400/10">
                        {statusLabel}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#7a8fa3] leading-snug mt-1">{pw.desc}</p>
                </div>
                <button
                  type="button"
                  disabled={!canBuy}
                  onClick={() => handleBuy(pw)}
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold text-white transition cursor-pointer ${
                    isBlocked
                      ? 'bg-emerald-500 cursor-default'
                      : canBuy
                      ? 'bg-[#db2777] hover:bg-[#ec4899] active:scale-95 shadow-lg shadow-[#db2777]/20'
                      : 'cursor-not-allowed bg-white/5 text-white/20'
                  }`}
                >
                  {isBlocked ? 'Limite' : `${pw.cost} 💎`}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {onClose && (
        <div className="mt-4 border-t border-white/[0.06] pt-3 text-center">
          <button
            type="button"
            onClick={() => { playClick(); onClose() }}
            className="text-xs text-[#7a8fa3] hover:text-[#e8edf2] underline cursor-pointer transition"
          >
            Fechar Loja
          </button>
        </div>
      )}
    </div>
  )
}
