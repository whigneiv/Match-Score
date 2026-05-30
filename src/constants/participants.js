/**
 * Participantes do reality = jogadores do hotel (users).
 * Staff não compete; pode aparecer só como convidado pontual da temporada.
 */

export const USER_PARTICIPANTS = [
  {
    nick: 'Pandora',
    vibe: 'Veterana do hotel',
    redFlags: ['Some do nada', 'Só entra de VIP'],
    qualities: ['Sabe todos os wireds'],
  },
  {
    nick: 'Druidown',
    vibe: 'Speedrunner de labirinto',
    redFlags: ['Competitivo demais', 'Rage quit no BC'],
    qualities: ['Sempre online'],
  },
  {
    nick: 'Cheussye',
    vibe: 'Decoradora de quartos',
    redFlags: ['Gasta tudo em mobi', 'Nunca convida pro quarto'],
    qualities: ['Visual impecável'],
  },
  {
    nick: 'Vaex',
    vibe: 'Rei da feira de mobis',
    redFlags: ['Só fala de créditos', 'Mão de vaca no troca'],
    qualities: ['Bolso cheio'],
  },
  {
    nick: 'Itgit',
    vibe: 'Mestre do chill',
    redFlags: ['Fica AFK no meio do date', 'Responde só "kkk"'],
    qualities: ['Zero drama'],
  },
  {
    nick: 'j4un3',
    vibe: 'DJ de eventos',
    redFlags: ['Playlist suspeita', 'Mutou o som do quarto'],
    qualities: ['Festa garantida'],
  },
  {
    nick: 'Blessy',
    vibe: 'Rainha do Club NX',
    redFlags: ['Ignora no console', 'Dança sozinha no canto'],
    qualities: ['Simpatia contagiante'],
  },
  {
    nick: 'Throne',
    vibe: 'Colecionadora de raros',
    redFlags: ['Preços abusivos na feira', 'Mobi trancado na BC'],
    qualities: ['Negociadora justa'],
  },
  {
    nick: 'Zumi',
    vibe: 'Entusiasta de Wireds',
    redFlags: ['Wired bugado', 'Não sai do modo de teste'],
    qualities: ['Super inteligente'],
  },
  {
    nick: 'Talofok',
    vibe: 'Socializador clássico',
    redFlags: ['Escreve testão', 'Fã de fofocas HC'],
    qualities: ['Dá atenção a todos'],
  },
  {
    nick: 'Gertrude',
    vibe: 'Conselheira do Hotel',
    redFlags: ['Julga os visuais alheios', 'Crítica ferrenha'],
    qualities: ['Sempre ajuda novatos'],
  },
  {
    nick: 'BornToDie',
    vibe: 'Gótica suave de pixels',
    redFlags: ['Quarto escuro total', 'Playlist depressiva'],
    qualities: ['Estilo super único'],
  },
  {
    nick: 'Marianaac',
    vibe: 'Baladeira profissional',
    redFlags: ['Grita no megafone', 'Flood de emoticons'],
    qualities: ['Super animada'],
  },
  {
    nick: 'Lenz',
    vibe: 'Negociante VIP',
    redFlags: ['Visual idêntico ao gerente', 'Negocia silenciada'],
    qualities: ['Cumpre a palavra'],
  },
]

/** Convidado pontual — desligue `enabled` para rodadas só com users */
export const SEASON_GUEST = {
  enabled: true,
  nick: 'Guigo',
  vibe: 'Convidado especial · Host',
  redFlags: ['Entra só pra dar pitaco', 'Cita regra do hotel'],
  qualities: ['Plot twist da temporada'],
  /** Não entra no ranking competitivo entre users */
  isGuest: true,
}
