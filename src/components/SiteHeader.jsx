import { useState, useRef, useEffect } from 'react'
import { useMatchScore } from '../context/MatchScoreContext'
import MatchScoreLogo from './MatchScoreLogo'
import { playClick } from '../lib/audio'

export default function SiteHeader() {
  const {
    currentUser,
    jumpToRound,
  } = useMatchScore()

  const [devMenuOpen, setDevMenuOpen] = useState(false)
  const devMenuRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (devMenuRef.current && !devMenuRef.current.contains(e.target)) {
        setDevMenuOpen(false)
      }
    }
    if (devMenuOpen) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [devMenuOpen])

  return (
    <header className="sticky top-0 z-50 bg-[#1a1625]/80 backdrop-blur-xl border-b border-white/[0.04]">
      <div className="relative mx-auto w-full max-w-4xl px-3 py-2 flex items-center justify-center">
        {/* Dev Tools Button (Absolute Right) */}
        <div className="absolute right-3" ref={devMenuRef}>
            <button
              type="button"
              onClick={() => {
                playClick()
                setDevMenuOpen((v) => !v)
              }}
              className="rounded-xl bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-500/20 px-2 py-1 text-xs font-black text-cyan-400 transition active:scale-95 cursor-pointer flex items-center gap-1"
              title="Painel do Desenvolvedor (Simulação)"
            >
              <span>🛠️</span>
            </button>

            {/* Dev Dropdown Menu */}
            {devMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-[#162230]/95 backdrop-blur-xl border border-white/[0.08] shadow-2xl py-2.5 animate-fade-in z-50 space-y-2">
                <div className="px-3 py-0.5 text-[9px] font-black text-cyan-400 uppercase tracking-wider">
                  Saltar para Rodada
                </div>
                
                {/* Lobby and Final buttons */}
                <div className="px-3 flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      playClick()
                      jumpToRound(0)
                      setDevMenuOpen(false)
                    }}
                    className={`flex-1 rounded py-1 text-[10px] font-bold transition cursor-pointer text-center ${
                      currentUser.currentRound === 0
                        ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/40'
                        : 'bg-white/5 text-[#7a8fa3] border border-white/[0.04] hover:bg-white/10'
                    }`}
                  >
                    Lobby (R0)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playClick()
                      jumpToRound(23)
                      setDevMenuOpen(false)
                    }}
                    className={`flex-1 rounded py-1 text-[10px] font-bold transition cursor-pointer text-center ${
                      currentUser.currentRound === 23
                        ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/40'
                        : 'bg-white/5 text-[#7a8fa3] border border-white/[0.04] hover:bg-white/10'
                    }`}
                  >
                    Final (R23)
                  </button>
                </div>

                {/* Grid of rounds 1 to 22 */}
                <div className="px-3 grid grid-cols-5 gap-1 border-t border-b border-white/[0.04] py-2">
                  {Array.from({ length: 22 }).map((_, idx) => {
                    const rId = idx + 1
                    return (
                      <button
                        key={rId}
                        type="button"
                        onClick={() => {
                          playClick()
                          jumpToRound(rId)
                          setDevMenuOpen(false)
                        }}
                        className={`flex h-7 items-center justify-center rounded text-[10px] font-black transition cursor-pointer ${
                          currentUser.currentRound === rId
                            ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/45'
                            : 'bg-white/5 text-[#7a8fa3] border border-white/[0.03] hover:bg-white/10 hover:text-white'
                        }`}
                        title={`Pular para rodada ${rId}`}
                      >
                        {rId}
                      </button>
                    )
                  })}
                </div>

              </div>
            )}
        </div>

        {/* Centered Logo */}
        <MatchScoreLogo size="lg" />
      </div>
    </header>
  )
}
