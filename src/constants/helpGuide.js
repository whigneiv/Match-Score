import { ROUNDS, PRIZES, TOTAL_ROUNDS } from './game'

export const HELP_SECTIONS = [
  { id: 'start', label: 'Início', icon: '🏁' },
  { id: 'journey', label: 'Trajeto', icon: '🗺️' },
  { id: 'prizes', label: 'Prêmios', icon: '🎁' },
  { id: 'ranking', label: 'Ranking', icon: '🏆' },
  { id: 'rules', label: 'Regras', icon: '📋' },
]

export const HELP_INTRO = {
  title: 'Match Score — Reality Show Hubbe',
  tagline: 'Conquiste seu par ideal respondendo perguntas e selecionando pretendentes ocultos.',
  steps: [
    { icon: '🗺️', title: 'Horários', text: 'Grade: 9h, 14h, 19h (BR)' },
    { icon: '📝', title: 'Perguntas', text: '5 perguntas por rodada' },
    { icon: '👤', title: 'Ocultos', text: 'Escolha seu par no fim da etapa' },
  ],
}

export function getRoundHelpDetail(roundId) {
  const round = ROUNDS.find((r) => r.id === roundId)
  if (!round) return null

  return {
    ...round,
    action: 'Responda as 5 perguntas e escolha um dos 3 parceiros ocultos no final.',
    costLabel: round.cost === 0 ? 'Entrada grátis' : `Custa ${round.cost} 💎 para jogar`,
  }
}

export const PRIZES_HELP = PRIZES.map((p) => ({
  ...p,
  when: `Desbloqueia na rodada ${p.unlockRound === 23 ? 'final' : p.unlockRound}`,
}))

export const RANKING_HELP = {
  global: {
    title: 'Ranking ao vivo',
    points: [
      'Você poderá acompanhar de forma simultânea quais usuários estão dominando o ranking.',
      'Sua pontuação aumenta à medida que você conclui rodadas, aparece no radar de outros usuários e realiza matches.',
      'Use os poderes da loja a seu favor para acelerar sua subida e garantir posições melhores.',
    ],
  },
  yours: {
    title: 'Rodada',
    points: [
      'Responda as 5 perguntas da rodada.',
      'No final da rodada, escolha um concorrente oculto com base na sua vibe.',
      'A rodada 1 é grátis, e das rodadas 2 a 22, cada rodada custa 30 diamantes, totalizando 630 diamantes ao final do reality.',
    ],
  },
}

export const RULES_HELP = [
  {
    icon: '👤',
    title: 'Apenas Contas Principais',
    text: 'O uso de contas fakes ou secundárias é estritamente proibido. Qualquer abuso resultará em desclassificação imediata e anulação de todos os prêmios.',
  },
  {
    icon: '🤝',
    title: 'Respeito e Convivência',
    text: 'As regras gerais do Hubbe Hotel se estendem a esta atividade. Mantenha a convivência saudável: bullying, assédio, toxicidade ou trapaças levarão à eliminação direta.',
  },
  {
    icon: '⏰',
    title: 'Participação Ativa',
    text: 'Esteja online nos horários oficiais (09h, 14h e 19h BR) para participar das rodadas de 10 minutos e pontuar na tabela diária e geral.',
  },
]

export { TOTAL_ROUNDS }
