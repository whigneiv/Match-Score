/** Deterministic affinity % for a candidate in a given round (80–99). */
export function getCandidateAffinity(candidateId, roundId = 1) {
  if (!candidateId) return null
  return 80 + ((candidateId * 3 + roundId) % 20)
}

/** Affinity for the player's match in a specific round. */
export function getRoundMatchAffinity(roundId, candidateId) {
  if (roundId === 1 || !candidateId) return null
  return getCandidateAffinity(candidateId, roundId)
}
