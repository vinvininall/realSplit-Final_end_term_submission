/**
 * settlement.js
 * Generates minimum number of payment transactions to settle all debts.
 * Uses a greedy matching algorithm between highest creditor and highest debtor.
 */

/**
 * @param {Object} balances - { userId: netBalance }
 * @param {Array} users - User[]
 * @returns {Array} [{ from, to, amount }]
 */
export function minimizeSettlements(balances, users) {
  const userMap = {};
  users.forEach((u) => {
    userMap[u.id] = u.name;
  });

  // Separate into creditors (positive) and debtors (negative)
  let creditors = [];
  let debtors = [];

  Object.entries(balances).forEach(([id, bal]) => {
    const rounded = Math.round(bal * 100) / 100;
    if (rounded > 0.005) creditors.push({ id, amount: rounded });
    else if (rounded < -0.005) debtors.push({ id, amount: Math.abs(rounded) });
  });

  const transactions = [];

  while (creditors.length > 0 && debtors.length > 0) {
    // Sort descending by amount
    creditors.sort((a, b) => b.amount - a.amount);
    debtors.sort((a, b) => b.amount - a.amount);

    const creditor = creditors[0];
    const debtor = debtors[0];

    const settleAmount = Math.min(creditor.amount, debtor.amount);
    const roundedSettle = Math.round(settleAmount * 100) / 100;

    if (roundedSettle > 0.005) {
      transactions.push({
        from: debtor.id,
        fromName: userMap[debtor.id] || debtor.id,
        to: creditor.id,
        toName: userMap[creditor.id] || creditor.id,
        amount: roundedSettle,
      });
    }

    creditor.amount = Math.round((creditor.amount - settleAmount) * 100) / 100;
    debtor.amount = Math.round((debtor.amount - settleAmount) * 100) / 100;

    if (creditor.amount < 0.005) creditors.shift();
    if (debtor.amount < 0.005) debtors.shift();
  }

  return transactions;
}
