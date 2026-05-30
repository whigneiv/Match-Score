export const TOTAL_ROUNDS = 22
export const COMPLETED_ROUND = 23

export const INITIAL_VIRTUAL_CLOCK = { day: 30, hour: 12, minute: 20 }

const QUESTION_POOL = [
  {
    question: 'No quarto oficial do reality, você senta onde?',
    options: [
      { id: 'a', label: 'No sofá HC majestoso' },
      { id: 'b', label: 'No tapete de pixels com a galera' },
      { id: 'c', label: 'Ficar dançando em pé perto do som' }
    ]
  },
  {
    question: 'Como você saúda os outros concorrentes?',
    options: [
      { id: 'a', label: 'Olá, lindos e lindas! ✨' },
      { id: 'b', label: 'Eae bobbas, de boa?' },
      { id: 'c', label: 'Só dou joinha (o/) e fico quieto' }
    ]
  },
  {
    question: 'Se alguém começar a floodar o console com besteiras:',
    options: [
      { id: 'a', label: 'Muto na hora e sigo jogando' },
      { id: 'b', label: 'Respondo à altura na mesma velocidade' },
      { id: 'c', label: 'Dou risada e chamo para o papo' }
    ]
  },
  {
    question: 'Qual visual você escolheu para o dia de hoje?',
    options: [
      { id: 'a', label: 'Casual clássico (moletom e tênis)' },
      { id: 'b', label: 'Rico luxuoso (coroa dourada e terno)' },
      { id: 'c', label: 'Cosplay engraçado (pato ou dinossauro)' }
    ]
  },
  {
    question: 'Você prefere quartos públicos ou quartos de usuários?',
    options: [
      { id: 'a', label: 'Públicos, pela nostalgia da piscina' },
      { id: 'b', label: 'Quartos de amigos para fofocar' },
      { id: 'c', label: 'Meus próprios quartos configurando Wired' }
    ]
  },
  {
    question: 'Qual jogo clássico do hotel você mais domina?',
    options: [
      { id: 'a', label: 'Dança das Cadeiras rápido' },
      { id: 'b', label: 'Labirintos Wired complexos (BC)' },
      { id: 'c', label: 'Sobrevivência/Futebol de quarto' }
    ]
  },
  {
    question: 'Se você perder uma rodada de jogo por lag, você:',
    options: [
      { id: 'a', label: 'Reclamo com o organizador do Wired' },
      { id: 'b', label: 'Dou rage quit silencioso do quarto' },
      { id: 'c', label: 'Digo "bobba kkk" e sigo assistindo' }
    ]
  },
  {
    question: 'Para vencer um evento do hotel, você é do tipo que:',
    options: [
      { id: 'a', label: 'Faz alianças com todos na sala' },
      { id: 'b', label: 'Joga focado, frio e solitário' },
      { id: 'c', label: 'Fica tentando distrair os adversários' }
    ]
  },
  {
    question: 'O que você acha de quem usa ferramentas de clique rápido?',
    options: [
      { id: 'a', label: 'Patético, prefiro habilidade pura' },
      { id: 'b', label: 'Se o Wired permitir, vale tudo' },
      { id: 'c', label: 'Nem sei do que se trata' }
    ]
  },
  {
    question: 'Qual prêmio você mais prefere ganhar em torneios?',
    options: [
      { id: 'a', label: 'Badges raras para ostentar' },
      { id: 'b', label: 'Mobis raros para meu inventário' },
      { id: 'c', label: 'Diamantes e reconhecimento geral' }
    ]
  },
  {
    question: 'Quando você entra na Feira de Mobis, você foca em:',
    options: [
      { id: 'a', label: 'Procurar pechinchas e revender' },
      { id: 'b', label: 'Vender meus mobis por preços altos' },
      { id: 'c', label: 'Só ver os valores e bater papo' }
    ]
  },
  {
    question: 'Alguém te oferece um raro falso em troca de moedas:',
    options: [
      { id: 'a', label: 'Denuncio ao suporte imediatamente' },
      { id: 'b', label: 'Dou block no espertinho e sigo a vida' },
      { id: 'c', label: 'Dou risada da tentativa frustrada' }
    ]
  },
  {
    question: 'Qual o seu nível de ostentação de moedas?',
    options: [
      { id: 'a', label: 'Tenho cofres cheios de barras de ouro' },
      { id: 'b', label: 'Prefiro gastar tudo em emblemas' },
      { id: 'c', label: 'Sou humilde e vivo de doações' }
    ]
  },
  {
    question: 'Se um amigo pedir 10 câmbios emprestados, você:',
    options: [
      { id: 'a', label: 'Empresto sem pensar duas vezes' },
      { id: 'b', label: 'Peço um raro de volta como garantia' },
      { id: 'c', label: 'Finjo que caí ou fiquei AFK' }
    ]
  },
  {
    question: 'O que vale mais para você no Hubbe?',
    options: [
      { id: 'a', label: 'Amizades sinceras do console' },
      { id: 'b', label: 'Um inventário valioso de raros' },
      { id: 'c', label: 'Fama e estar no topo dos rankings' }
    ]
  },
  {
    question: 'Onde seria o encontro ideal com o seu match?',
    options: [
      { id: 'a', label: 'Dançando eletrônica no Club NX' },
      { id: 'b', label: 'Em uma cafeteria aconchegante' },
      { id: 'c', label: 'Ficar AFK na piscina pública juntinhos' }
    ]
  },
  {
    question: 'Qual mobi de iluminação você escolheria para o date?',
    options: [
      { id: 'a', label: 'Luz negra misteriosa de balada' },
      { id: 'b', label: 'Velas românticas clássicas' },
      { id: 'c', label: 'Nenhuma, prefiro escuro total' }
    ]
  },
  {
    question: 'Para puxar assunto no date, você fala sobre:',
    options: [
      { id: 'a', label: 'Histórias e piadas internas do hotel' },
      { id: 'b', label: 'Nossos raros e emblemas favoritos' },
      { id: 'c', label: 'Fofocas de outros participantes' }
    ]
  },
  {
    question: 'Se seu par te mandar um presente surpresa, o que espera?',
    options: [
      { id: 'a', label: 'Um raro de Dragão de Fogo 🐉' },
      { id: 'b', label: 'Uma clássica Sorveteira clássica 🍦' },
      { id: 'c', label: 'Um emblema fofo de coração/Especial' }
    ]
  },
  {
    question: 'No final de um encontro agradável, qual a sua fala?',
    options: [
      { id: 'a', label: '"Foi perfeito, me adiciona no console!"' },
      { id: 'b', label: '"Te vejo amanhã na Feira de Mobis!"' },
      { id: 'c', label: '"Não sai pelo teleporte ainda, fica mais!"' }
    ]
  }
]

export function getQuestionsForRound(roundId) {
  const startIdx = ((roundId - 1) * 3) % QUESTION_POOL.length
  const list = []
  for (let i = 0; i < 5; i++) {
    const q = QUESTION_POOL[(startIdx + i) % QUESTION_POOL.length]
    list.push({
      ...q,
      id: `r${roundId}_q${i + 1}`
    })
  }
  return list
}

const titles = [
  'Lobby & Perfil', // Day 0
  'Competição de Elite', 'Estratégia de Quarto', 'Festa no Club NX', 'Feira de Raros', 'Pódio de Popularidade', // Day 1
  'Lógica dos Wireds', 'Fogo Retro', 'Piscina AFK', 'Teleporte Secreto', 'Desafio de Jogo', // Day 2
  'Rei dos Labirintos', 'Negócios HC', 'Fofocas no Quarto', 'Segredos do Hotel', 'Tribunal de Flags', // Day 3
  'Visual Ostentação', 'Líder Supremo', 'Festas Privadas', 'Carona de Teleporte', 'Fama no Hotel', // Day 4
  'Alianças de Quarto', 'Amizade de Pixel', 'Química Explosiva', 'Prova de Habilidade', 'Giro da Sorte', // Day 5
  'Date do Reality', 'Confissões no Escuro', 'Guerra de Clãs', 'Decoração de Bloco', 'Votos da Rodada', // Day 6
  'Último Embate', 'Cabine de Segredos', 'Aliança Final', 'A Prova de Fogo', 'Reta de Decisão' // Day 7
]

export function formatVirtualDate(day) {
  if (day === 30) return '30 de Maio'
  if (day === 31) return '31 de Maio'
  const offset = day - 31 // Day 32 is 1 de Junho
  return `${offset} de Junho`
}

export const ROUNDS = Array.from({ length: 22 }).map((_, idx) => {
  const id = idx + 1
  const isR1 = id === 1
  const day = isR1 ? 30 : Math.floor((id - 2) / 3) + 31
  const hours = [9, 14, 19]
  const hour = isR1 ? 12 : hours[(id - 2) % 3]
  
  const iconList = ['🏁', '✨', '🪙', '🏠', '🔑', '🔮', '⚡', '🏆', '💎', '💝']
  const icon = isR1 ? '🏁' : iconList[(id - 2) % iconList.length]
  
  // Custom titles
  const tIndex = isR1 ? 0 : id
  const title = isR1 ? 'Estreia & Vibe' : `${formatVirtualDate(day)} · ${titles[tIndex] ?? 'Rodada ' + id}`
  const short = isR1 ? 'Estreia' : `R${id}`
  const cost = isR1 ? 0 : 30
  const summary = isR1
    ? 'Apresente sua vibe e ganhe as boas-vindas.'
    : `Parada número ${id} da competição principal no hotel.`
  
  return {
    id,
    title,
    short,
    cost,
    icon,
    hour,
    day,
    summary,
    questions: getQuestionsForRound(id)
  }
})

export const ROUND_COSTS = Object.fromEntries(ROUNDS.map((r) => [r.id, r.cost]))

export const HUBBE_RARES = [
  { id: 'duck', name: 'Pato de Borracha', icon: '🦆', imageUrl: 'https://images.habbo.com/c_images/album1584/Xmas11_duck.png', desc: 'Um clássico patinho amarelo de plástico... Quack!' },
  { id: 'dragon', name: 'Dragão de Fogo', icon: '🐉', imageUrl: 'https://images.habbo.com/c_images/album1584/LAV01.png', desc: 'Sopra chamas de neon e lava vermelha no hotel.' },
  { id: 'totem', name: 'Totem Sagrado HC', icon: '🗿', imageUrl: 'https://images.habbo.com/c_images/album1584/ACH_Bazaar10.png', desc: 'Três partes empilháveis que garantem respeito instantâneo.' },
  { id: 'icecream', name: 'Sorveteira Clássica', icon: '🍦', imageUrl: 'https://images.habbo.com/c_images/album1584/ICM08.png', desc: 'Dá sorvete infinito e deixa seu quarto super clássico.' },
  { id: 'fan', name: 'Emblema Pixels Emotion', icon: '🎖️', imageUrl: 'https://images.habbo.com/c_images/album1584/PT323.png', desc: 'Símbolo oficial do portal de fã da Pixels Emotion.' },
  { id: 'egg', name: 'Ovo de Dragão Dourado', icon: '🥚', imageUrl: 'https://images.habbo.com/c_images/album1584/EGA10.png', desc: 'Dizem que racha se você deixar no quarto por 7 temporadas.' },
  { id: 'trophy', name: 'Troféu de Ouro Pixels', icon: '🏆', imageUrl: 'https://images.habbo.com/c_images/album1584/TDF01.png', desc: 'Troféu dourado exclusivo dos maiores campeões de Match Score.' },
]

export const PRIZES = [
  {
    id: 'story',
    name: 'Story do Match',
    icon: '📸',
    unlockRound: 22,
    description: 'Cena 9:16 pronta para gravar e viralizar no hotel.',
  },
  {
    id: 'ranking',
    name: 'Ranking Geral',
    icon: '🏆',
    unlockRound: 23,
    description: 'Pódio geral com os mais desejados da rodada.',
  },
  {
    id: 'badge',
    name: 'Badge Match Score',
    icon: '🎖️',
    unlockRound: 23,
    description: 'Emblema exclusivo MVP do hotel no seu perfil.',
  },
]

export const HELP_POINTS = [
  '22 rodadas distribuídas em 7 dias competitivos de jogo.',
  'A rodada 1 é grátis. Da rodada 2 à 22, o custo é de 30 💎.',
  'Ao final de cada dia com 3 rodadas oficiais, ocorre a cerimônia do Ranking Diário.',
  'Ao final dos 7 dias, a cerimônia final recompensa o Top 3 com Moedas e Raros.',
]
