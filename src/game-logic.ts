export let state = {
  flippedCards: [] as HTMLElement[],
  scores: { blue: 0, orange: 0 },
  currentPlayer: 'blue' as 'blue' | 'orange',
  isLocked: false,
  matchedPairs: 0,
  currentSize: 0
};

export function getCardValues(size: number): number[] {
  const pairs = Array.from({ length: size / 2 }, (_, i) => i + 1)
    .flatMap(val => [val, val]);
  return pairs.sort(() => Math.random() - 0.5);
}

export function resetGameState(size: number, startPlayer: 'blue' | 'orange') {
  state.scores = { blue: 0, orange: 0 };
  state.currentPlayer = startPlayer;
  state.flippedCards = [];
  state.matchedPairs = 0;
  state.currentSize = size;
  state.isLocked = false;
}