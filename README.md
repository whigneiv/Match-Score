# Match Score

MVP de web-game competitivo no estilo "app de relacionamentos + reality show" entre **jogadores do hotel** (users). Staff não participa do ranking; pode aparecer como convidado pontual da temporada.

## Stack

- React (Vite)
- Tailwind CSS v4
- React Router (rota única)
- Framer Motion
- Context API (estado global, sem backend)

## Como rodar

```bash
npm install
npm run dev
```

Abra `http://localhost:5173/`

```bash
npm test      # testes unitários (Vitest)
npm run build # build de produção
```

## Layout (UX condensado)

Tudo em **`/`** (`max-w-[520px]`):

1. **Mapa** — 9 paradas (lobby + 7 dias + tesouro final)
2. **Guia** — modal via ⚙️ no cabeçalho
3. **Arena + Ranking** — empilhados verticalmente
4. **Tabs inferiores** — Arena e Coleção (após entrar no jogo)

## Estrutura

```
src/
  constants/game.js         # regras, 36 rodadas, prêmios
  constants/treasureMap.js  # paradas do mapa de progresso
  constants/helpGuide.js    # conteúdo do guia de ajuda
  lib/roundTime.js          # lógica de janela de rodada
  lib/treasureMapStatus.js  # progresso do mapa
  panels/                   # Welcome, GameArena, Completed
  pages/Overview.jsx
  context/
  components/
```

## Fluxo (36 rodadas · 7 dias)

- **Rodada 1** — estreia grátis (quiz de 5 perguntas)
- **Rodadas 2–36** — quiz + escolha de match oculto (30 💎 cada, ~1050 💎 no total)
- **Cerimônias diárias** — ao fim dos dias 1–7 (R6, R11, R16, R21, R26, R31, R36)
- **Conclusão** — retrospectiva em stories + pódio geral + match final

Janelas de tempo: R1 aberta por 24h; rodadas 2–36 expiram após 10 min de abertura (09h, 12h, 15h, 18h, 21h).

**Progresso salvo automaticamente** no `localStorage` do navegador (rodada, diamantes, matches, quiz, relógio).

Avatares: `https://hubbe.biz/avatar/{nick}`

### Participantes

- Lista principal: `src/constants/participants.js` → `USER_PARTICIPANTS`
- Convidado opcional (ex. Staff): `SEASON_GUEST` com `enabled: true/false`
