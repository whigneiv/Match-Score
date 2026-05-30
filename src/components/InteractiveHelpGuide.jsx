import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMatchScore } from '../context/MatchScoreContext'
import {
  HELP_SECTIONS,
  HELP_INTRO,
  RANKING_HELP,
  RULES_HELP,
} from '../constants/helpGuide'

const fade = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
}

function IntroPanel() {
  return (
    <div className="space-y-3 animate-fade-in">
      <p className="text-center text-sm text-[#7a8fa3] font-semibold leading-relaxed">{HELP_INTRO.tagline}</p>
      <div className="grid grid-cols-3 gap-2.5">
        {HELP_INTRO.steps.map((s) => (
          <div
            key={s.title}
            className="rounded-xl border border-white/[0.06] bg-[#1c2d3f] p-3.5 text-center flex flex-col justify-between"
          >
            <span className="text-2xl">{s.icon}</span>
            <p className="text-sm font-black text-[#478dde] mt-1.5">{s.title}</p>
            <p className="text-xs text-[#7a8fa3] mt-1 leading-normal">{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function JourneyPanel() {
  return (
    <div className="space-y-4 animate-fade-in text-left">
      <p className="text-sm text-[#7a8fa3] font-medium leading-relaxed">
        A jornada do reality show é dividida em 3 grandes momentos ao longo dos dias:
      </p>

      <div className="space-y-3.5">
        {/* Phase 1 */}
        <div className="rounded-xl border border-white/[0.06] bg-[#1c2d3f] p-4 text-sm leading-relaxed">
          <p className="font-extrabold text-[#e8edf2] flex items-center gap-2">
            <span className="text-lg">🏁</span>
            <span className="text-[#db2777] font-black">Estreia (Rodada 1)</span>
          </p>
          <p className="mt-1.5 text-[#7a8fa3]">
            Uma rodada inicial <strong>gratuita</strong> e aberta por 24 horas. Responda às perguntas iniciais para calibrar sua vibe e garanta <strong>+30 💎</strong> e o <strong>Emblema de Estreante</strong>.
          </p>
        </div>

        {/* Phase 2 */}
        <div className="rounded-xl border border-white/[0.06] bg-[#1c2d3f] p-4 text-sm leading-relaxed">
          <p className="font-extrabold text-[#e8edf2] flex items-center gap-2">
            <span className="text-lg">⚔️</span>
            <span className="text-[#db2777] font-black">Rodadas Regulares (2 a 22)</span>
          </p>
          <p className="mt-1.5 text-[#7a8fa3]">
            Acontecem 3 vezes ao dia (às <strong>9h, 14h e 19h (BR)</strong>) com apenas <strong>10 minutos</strong> de abertura. Cada etapa custa <strong>30 💎</strong>. Você responde ao quiz de afinidade e escolhe um match oculto.
          </p>
        </div>

        {/* Phase 3 */}
        <div className="rounded-xl border border-white/[0.06] bg-[#1c2d3f] p-4 text-sm leading-relaxed">
          <p className="font-extrabold text-[#e8edf2] flex items-center gap-2">
            <span className="text-lg">🏆</span>
            <span className="text-[#db2777] font-black">Pódio Diário & Consolação</span>
          </p>
          <p className="mt-1.5 text-[#7a8fa3]">
            Ao final de cada dia (a cada 3 rodadas oficiais: rodadas 4, 7, 10, 13, 16, 19, 22) ocorre a apuração do dia. Os 3 jogadores mais compatíveis ganham prêmios de diamantes (+30 💎) e emblemas de nível (1 a 3). O jogador com menos compatibilidade vira o <strong>Azarão do Dia 🤡</strong> e ganha 30 💎 de consolo!
          </p>
        </div>

        {/* Phase 4 */}
        <div className="rounded-xl border border-white/[0.06] bg-[#1c2d3f] p-4 text-sm leading-relaxed">
          <p className="font-extrabold text-[#e8edf2] flex items-center gap-2">
            <span className="text-lg">🎁</span>
            <span className="text-[#db2777] font-black">Grande Final (Rodada 23)</span>
          </p>
          <p className="mt-1.5 text-[#7a8fa3]">
            Após concluir a rodada 22, o sistema calcula sua afinidade final. Você descobre seu match definitivo, ganha emblemas lendários de finalista e recebe <strong>Mobis Raros Clássicos</strong> em sua coleção!
          </p>
        </div>
      </div>
    </div>
  )
}

function PrizesPanel() {
  return (
    <div className="space-y-4 animate-fade-in text-left">
      {/* Podio Diario */}
      <div className="rounded-xl border border-white/[0.06] bg-[#1c2d3f] p-4">
        <p className="text-sm font-black text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <span>🏆</span> Pódio Diário
        </p>
        <p className="text-xs text-[#7a8fa3] mb-3 leading-normal">Ao final de cada dia:</p>
        <div className="space-y-2 text-sm text-[#e8edf2]">
          <div className="flex items-start gap-2 bg-[#162230] p-2.5 rounded-lg border border-white/[0.04]">
            <span className="text-emerald-400 font-bold shrink-0">🥇🥈🥉</span>
            <div>
              <p className="font-bold">Top 3 com mais pontos</p>
              <p className="text-xs text-[#7a8fa3] mt-0.5">Emblema de nível (1 a 3) + 30 diamantes 💎</p>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-[#162230] p-2.5 rounded-lg border border-white/[0.04]">
            <span className="text-rose-400 font-bold shrink-0">🤡</span>
            <div>
              <p className="font-bold">Azarão do dia</p>
              <p className="text-xs text-[#7a8fa3] mt-0.5">Emblema azarão (ganha só uma vez) + 30 diamantes 💎</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ranking Final */}
      <div className="rounded-xl border border-white/[0.06] bg-[#1c2d3f] p-4">
        <p className="text-sm font-black text-pink-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <span>👑</span> Ranking Final
        </p>
        <div className="space-y-2 text-sm text-[#e8edf2]">
          <div className="flex justify-between items-center bg-[#162230] p-2.5 rounded-lg border border-white/[0.04]">
            <div>
              <p className="font-bold">1° Lugar</p>
              <p className="text-xs text-[#7a8fa3] mt-0.5">Raro da campanha + Emblema</p>
            </div>
            <span className="text-xs font-black text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded border border-cyan-400/20">500 💎</span>
          </div>

          <div className="flex justify-between items-center bg-[#162230] p-2.5 rounded-lg border border-white/[0.04]">
            <div>
              <p className="font-bold">2° Lugar</p>
              <p className="text-xs text-[#7a8fa3] mt-0.5">Raro da campanha + Emblema</p>
            </div>
            <span className="text-xs font-black text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded border border-cyan-400/20">400 💎</span>
          </div>

          <div className="flex justify-between items-center bg-[#162230] p-2.5 rounded-lg border border-white/[0.04]">
            <div>
              <p className="font-bold">3° Lugar</p>
              <p className="text-xs text-[#7a8fa3] mt-0.5">Raro da campanha + Emblema</p>
            </div>
            <span className="text-xs font-black text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded border border-cyan-400/20">300 💎</span>
          </div>

          <div className="flex justify-between items-center bg-[#162230] p-2.5 rounded-lg border border-white/[0.04]">
            <div>
              <p className="font-bold">Azarão Geral 🤡</p>
              <p className="text-xs text-[#7a8fa3] mt-0.5">Emblema exclusivo</p>
            </div>
            <span className="text-xs font-black text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded border border-cyan-400/20">250 💎</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function RankingPanel() {
  const { helpActiveSubTab, setHelpActiveSubTab } = useMatchScore()

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex rounded-xl bg-[#1a1625] p-0.5 border border-white/[0.06]">
        {['global', 'yours'].map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setHelpActiveSubTab(key)}
            className={`flex-1 rounded-lg py-2 text-sm font-black uppercase transition-all duration-200 cursor-pointer ${
              helpActiveSubTab === key ? 'bg-[#478dde] text-white shadow-sm shadow-[#478dde]/25' : 'text-[#7a8fa3] hover:text-[#e8edf2]'
            }`}
          >
            {key === 'global' ? 'Ranking ao vivo' : 'Rodada'}
          </button>
        ))}
      </div>
      <ul className="space-y-2.5">
        {RANKING_HELP[helpActiveSubTab].points.map((point) => (
          <li key={point} className="flex gap-2.5 text-sm text-[#7a8fa3] leading-relaxed font-semibold">
            <span className="text-[#478dde] text-base">•</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>

      {helpActiveSubTab === 'yours' && (
        <div className="mt-4 rounded-xl border border-white/[0.06] bg-[#162230] overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-white/5 border-b border-white/[0.06] text-[#e8edf2] font-black uppercase tracking-wider">
                <th className="p-2.5">Ação / Atividade</th>
                <th className="p-2.5 text-right">Pontuação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-[#7a8fa3] font-semibold">
              <tr>
                <td className="p-2.5">Pontuação Base (Lobby)</td>
                <td className="p-2.5 text-right text-emerald-400 font-bold">+50 pts</td>
              </tr>
              <tr>
                <td className="p-2.5">Concluir cada Rodada</td>
                <td className="p-2.5 text-right text-[#db2777] font-bold">+5 pts</td>
              </tr>
              <tr>
                <td className="p-2.5">Aparição no radar de outros</td>
                <td className="p-2.5 text-right text-[#db2777] font-bold">+5 pts</td>
              </tr>
              <tr>
                <td className="p-2.5">Match simples</td>
                <td className="p-2.5 text-right text-rose-400 font-bold">+10 pts</td>
              </tr>
              <tr>
                <td className="p-2.5">Match recíproco</td>
                <td className="p-2.5 text-right text-rose-400 font-bold">+20 pts</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function RulesPanel() {
  return (
    <ul className="space-y-2.5 animate-fade-in">
      {RULES_HELP.map((rule) => (
        <li
          key={rule.title}
          className="flex gap-3 rounded-xl bg-[#1c2d3f] border border-white/[0.06] px-4 py-3 text-sm text-[#7a8fa3] leading-relaxed"
        >
          <span className="text-lg shrink-0 select-none">{rule.icon}</span>
          <span className="font-medium text-left">
            <strong className="text-[#e8edf2] font-black block text-sm uppercase tracking-wider mb-1">{rule.title}</strong>
            {rule.text}
          </span>
        </li>
      ))}
    </ul>
  )
}

const PANELS = {
  start: IntroPanel,
  journey: JourneyPanel,
  prizes: PrizesPanel,
  ranking: RankingPanel,
  rules: RulesPanel,
}

export default function InteractiveHelpGuide({ onClose }) {
  const { helpActiveTab, setHelpActiveTab } = useMatchScore()
  const Panel = PANELS[helpActiveTab]

  return (
    <div className="rounded-2xl bg-[#162230] border border-white/[0.06] shadow-xl shadow-black/20 overflow-hidden flex flex-col max-h-[90vh] w-full max-w-[500px]">
      {/* Header do Guia */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4.5 py-3.5 bg-[#1c2d3f]/50 shrink-0">
        <span className="text-base font-black text-[#e8edf2] uppercase tracking-wider flex items-center gap-1.5">
          📖 Guia do Reality
        </span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-[#7a8fa3] hover:text-[#e8edf2] font-bold text-xl cursor-pointer h-7 w-7 flex items-center justify-center rounded-lg hover:bg-white/5 transition"
          >
            ×
          </button>
        )}
      </div>

      {/* Abas Superiores */}
      <div className="flex gap-2 overflow-x-auto border-b border-white/[0.06] px-3.5 py-2.5 bg-[#162230] shrink-0">
        {HELP_SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setHelpActiveTab(s.id)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold uppercase transition flex items-center gap-1 cursor-pointer ${
              helpActiveTab === s.id
                ? 'bg-[#db2777] text-white shadow-sm shadow-[#db2777]/25'
                : 'bg-white/5 text-[#7a8fa3] hover:bg-white/10 hover:text-[#e8edf2]'
            }`}
          >
            <span>{s.icon}</span>
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      {/* Conteúdo Aba */}
      <div className="flex-1 overflow-y-auto p-5" style={{ scrollbarWidth: 'thin', scrollbarColor: '#db277733 transparent' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={helpActiveTab}
            variants={fade}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Panel />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Rodapé com botão */}
      {onClose && (
        <div className="border-t border-white/[0.06] p-4 bg-[#1c2d3f]/30">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-[#db2777] py-3 text-sm font-bold text-white hover:bg-[#ec4899] transition active:scale-95 shadow-lg shadow-[#db2777]/20 cursor-pointer"
          >
            Fechar Guia
          </button>
        </div>
      )}
    </div>
  )
}
