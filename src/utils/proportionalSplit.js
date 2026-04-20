/**
 * proportionalSplit.js
 * Calculates each user's share of a restaurant bill
 * proportionally based on menu prices vs final bill amount.
 */

/**
 * @param {Array} items  - RestaurantItem[]
 * @param {number} finalAmount - actual billed amount
 * @param {Array} users  - User[]
 * @returns {Object} { userId: finalShare }
 */
export function calculateProportionalSplit(items, finalAmount, users) {
  if (!items.length || finalAmount <= 0) return {};

  const totalMenuPrice = items.reduce((sum, item) => sum + item.menuPrice, 0);
  if (totalMenuPrice === 0) return {};

  const scaleFactor = finalAmount / totalMenuPrice;

  const shares = {};
  users.forEach((u) => {
    shares[u.id] = 0;
  });

  items.forEach((item) => {
    if (!item.eatenBy || item.eatenBy.length === 0) return;
    // Each item is assigned to specific users (one user per item in this model)
    item.eatenBy.forEach((userId) => {
      const portion = item.menuPrice / item.eatenBy.length;
      if (shares[userId] !== undefined) {
        shares[userId] += portion * scaleFactor;
      }
    });
  });

  // Round to 2 decimals
  Object.keys(shares).forEach((id) => {
    shares[id] = Math.round(shares[id] * 100) / 100;
  });

  return shares;
}
