/**
 * balanceCalculator.js
 * Computes net balance for each participant across all expenses.
 * Positive balance = owed money. Negative = owes money.
 */

import { calculateProportionalSplit } from './proportionalSplit.js';

/**
 * @param {Array} expenses - Expense[]
 * @param {Array} restaurantBills - RestaurantBill[]
 * @param {Array} users - User[]
 * @returns {Object} { userId: netBalance }
 */
export function calculateBalances(expenses, restaurantBills, users) {
  const balances = {};
  users.forEach((u) => {
    balances[u.id] = 0;
  });

  // Normal expenses — split evenly among participants
  expenses.forEach((exp) => {
    const { totalAmount, paidBy, participants } = exp;
    if (!participants || participants.length === 0) return;

    const share = totalAmount / participants.length;

    // Payer gets credited the full amount
    if (balances[paidBy] !== undefined) {
      balances[paidBy] += totalAmount;
    }

    // Each participant (including payer) owes their share
    participants.forEach((uid) => {
      if (balances[uid] !== undefined) {
        balances[uid] -= share;
      }
    });
  });

  // Restaurant bills — proportional split
  restaurantBills.forEach((bill) => {
    const { items, finalAmount, paidBy } = bill;
    if (!items || items.length === 0 || !finalAmount) return;

    const shares = calculateProportionalSplit(items, finalAmount, users);

    // Payer gets credited the full final bill
    if (paidBy && balances[paidBy] !== undefined) {
      balances[paidBy] += finalAmount;
    }

    // Deduct each user's proportional share
    Object.entries(shares).forEach(([uid, amount]) => {
      if (balances[uid] !== undefined) {
        balances[uid] -= amount;
      }
    });
  });

  // Round to 2 decimal places to avoid floating point drift
  Object.keys(balances).forEach((id) => {
    balances[id] = Math.round(balances[id] * 100) / 100;
  });

  return balances;
}
