const avatar = (nick) => `https://hubbe.biz/avatar/${nick}`

/** Ranking global fictício — exibido o tempo todo (não depende do progresso do jogador) */
export const FICTIONAL_RANKING = {
  season: 'Temporada 01',
  label: 'Ranking global · ao vivo',
  top: [
    {
      rank: 1,
      nick: 'Pandora',
      avatar: avatar('Pandora'),
      score: 2840,
      matches: 127,
      trend: '+12%',
      vibe: 'Veterana do hotel',
    },
    {
      rank: 2,
      nick: 'Cheussye',
      avatar: avatar('Cheussye'),
      score: 2710,
      matches: 118,
      trend: '+8%',
      vibe: 'Decoradora',
    },
    {
      rank: 3,
      nick: 'Vaex',
      avatar: avatar('Vaex'),
      score: 2595,
      matches: 104,
      trend: '+3%',
      vibe: 'Rei da feira',
    },
    {
      rank: 4,
      nick: 'Druidown',
      avatar: avatar('Druidown'),
      score: 2410,
      matches: 98,
      trend: '-1%',
      vibe: 'Labirinto pro',
    },
    {
      rank: 5,
      nick: 'j4un3',
      avatar: avatar('j4un3'),
      score: 2280,
      matches: 91,
      trend: '+6%',
      vibe: 'DJ de eventos',
    },
  ],
  azarao: {
    nick: 'Itgit',
    avatar: avatar('Itgit'),
    score: 412,
    vibe: 'Mestre do chill',
    label: 'Friendzone máxima',
  },
  hotStreak: {
    nick: 'Pandora',
    text: '5 matches seguidos esta semana',
  },
}
