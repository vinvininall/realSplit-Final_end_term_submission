import { useState } from 'react';

export default function SettlementView({ transactions, users, onSettleUp, completedSettlements = [] }) {
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Filter out transactions that have already been settled
  const pendingTransactions = transactions.filter(transaction => {
    // Check if this exact transaction is already in completed settlements
    const isAlreadySettled = completedSettlements.some(settled => 
      settled.fromId === transaction.fromId && 
      settled.toId === transaction.toId && 
      Math.abs(settled.amount - transaction.amount) < 0.01
    );
    return !isAlreadySettled;
  });

  if (!pendingTransactions || pendingTransactions.length === 0) {
    return (
      <div className="section">
        <h3 className="section-title">Settlement Plan</h3>
        <div className="settled-badge">✓ Everyone is settled up!</div>
      </div>
    );
  }

  return (
    <div className="section">
      <h3 className="section-title">Settlement Plan</h3>
      <p className="section-sub">
        {pendingTransactions.length} transaction{pendingTransactions.length !== 1 ? 's' : ''} to clear all debts
      </p>
      
      <div className="settlements">
        {pendingTransactions.map((t, i) => (
          <div key={i} className="settlement-row">
            <span className="settlement-index">#{i + 1}</span>
            <div className="settlement-body">
              <span className="settlement-from">{t.fromName}</span>
              <span className="settlement-arrow">pays</span>
              <span className="settlement-to">{t.toName}</span>
            </div>
            <div className="settlement-right">
              <span className="settlement-amount mono">₹{t.amount.toFixed(2)}</span>
              <button
                className="settle-btn"
                onClick={() => setSelectedTransaction(t)}
              >
                ✓ Settle Up
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Settlement Confirmation Modal */}
      {selectedTransaction && (
        <div className="modal-overlay" onClick={() => setSelectedTransaction(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-icon">💰</span>
              <h2>Settle Up</h2>
            </div>
            <div className="settle-details">
              <p className="settle-question">
                Has <strong>{selectedTransaction.fromName}</strong> paid{' '}
                <strong>{selectedTransaction.toName}</strong>?
              </p>
              <div className="settle-amount-badge">
                Amount: ₹{selectedTransaction.amount.toFixed(2)}
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn--ghost" onClick={() => setSelectedTransaction(null)}>
                Cancel
              </button>
              <button 
                className="btn btn--primary" 
                onClick={() => {
                  onSettleUp(selectedTransaction);
                  setSelectedTransaction(null);
                }}
              >
                ✓ Yes, Mark as Settled
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}