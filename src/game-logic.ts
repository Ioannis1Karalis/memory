/**
 * The central state object that stores the current game state.
 */
export const state = {
  flippedCards: [] as HTMLElement[],
  scores: { blue: 0, orange: 0 },
  currentPlayer: 'blue' as 'blue' | 'orange',
  isLocked: false,
  matchedPairs: 0,
  currentSize: 0
};

/**
 * Generates a list of randomly shuffled card values in pairs.
 * 
 * @param size - Total number of cards on the board.
 * @returns A shuffled array of numerical values.
 */
export const getCardValues = (size: number): number[] => {
  const pairs = Array.from({ length: size / 2 }, (_, i) => i + 1).flatMap(val => [val, val]);
  return pairs.sort(() => Math.random() - 0.5);
};

/**
 * Resets the game state to its initial values.
 * 
 * @param size - The chosen board size for the new round.
 * @param startPlayer - The player who starts the round.
 */
export const resetGameState = (size: number, startPlayer: 'blue' | 'orange'): void => {
  state.scores = { blue: 0, orange: 0 };
  state.currentPlayer = startPlayer;
  state.flippedCards = [];
  state.matchedPairs = 0;
  state.currentSize = size;
  state.isLocked = false;
};