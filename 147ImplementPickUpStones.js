/**
 * There is a pile of n (n > 0) stones.
 * Players alternate taking 1 or 2 stones. A starts.
 * IMPORTANT RULE (misère play): the player who takes the LAST stone LOSES.
 *
 * Task: Return who has a winning strategy ('A' or 'B').
 * If no winning strategy exists, return null. (For n > 0 here, there is always a winner.)
 *
 * Examples:
 * winningStonePicking(1) -> 'B'
 * winningStonePicking(2) -> 'A'
 * winningStonePicking(3) -> 'A'
 * winningStonePicking(4) -> 'B'
 *
 * Solving approach (reasoning):
 * ------------------------------------------------------------
 * Think in terms of game states:
 * - A "losing state" is a state where the current player (whose turn it is)
 *   will lose if both play optimally.
 * - A "winning state" is a state where the current player can force a win.
 *
 * Let's analyze small n (A to move initially):
 *
 * n=1:
 *   A must take 1 -> pile becomes 0, A took the last stone -> A loses -> winner B
 *   So n=1 is a losing state for the current player.
 *
 * n=2:
 *   A can take 1 -> leaves 1 for B
 *   B must take 1 -> B takes last stone -> B loses -> A wins
 *   So n=2 is winning for the current player.
 *
 * n=3:
 *   A can take 2 -> leaves 1 for B
 *   B must take 1 -> B takes last -> B loses -> A wins
 *   So n=3 is winning.
 *
 * n=4:
 *   If A takes 1 -> leaves 3 (which is winning for next player, as seen above)
 *   If A takes 2 -> leaves 2 (also winning for next player)
 *   So A cannot move to a losing state for B -> A loses -> winner B
 *   So n=4 is losing.
 *
 * Pattern emerges:
 *   Losing states happen at n = 1, 4, 7, 10, ... i.e. n % 3 === 1
 *
 * Why this pattern holds:
 * - From a losing state (n % 3 === 1), removing 1 or 2 stones moves to
 *   n % 3 === 0 or 2, which are winning for the opponent.
 * - From any other state (n % 3 !== 1), the current player can remove
 *   1 or 2 stones to FORCE the opponent into n % 3 === 1.
 *
 * Therefore:
 * - If n % 3 === 1, the starter (A) is in a losing position -> B wins.
 * - Else, A can force B into a losing position -> A wins.
 *
 * Time/Space:
 * - O(1) time, O(1) space (just a modulo check).
 *
 * @param {number} n
 * @return {'A' | 'B' | null}
 */
function canWinStonePicking(n) {
  // Defensive check: the prompt says n > 0, but we handle bad input anyway.
  if (typeof n !== "number" || !Number.isFinite(n) || n <= 0) {
    return null;
  }

  // Losing positions for the player to move are exactly when n % 3 === 1.
  // If A starts on a losing position, B has the winning strategy.
  return n % 3 === 1 ? "B" : "A";
}

// Quick sanity checks:
console.log(canWinStonePicking(1)); // 'B'
console.log(canWinStonePicking(2)); // 'A'
console.log(canWinStonePicking(3)); // 'A'
console.log(canWinStonePicking(4)); // 'B'
console.log(canWinStonePicking(7)); // 'B'
console.log(canWinStonePicking(10)); // 'B'
