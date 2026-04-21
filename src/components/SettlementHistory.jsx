export default function SettlementHistory({ settlements, users }) {
  const getUserName = (id) => users.find((u) => u.id === id)?.name || id;
  
  if (!settlements || settlements.length === 0) {
    return null;
  }

  return (
    <div className="section settlement-history">
      <h3 className="section-title">✓ Settlement History</h3>
      <div className="settlement-history-list">
        {settlements.map((settlement, index) => (
          <div key={index} className="settlement-history-item">
            <div className="settlement-history-icon">✓</div>
            <div className="settlement-history-details">
              <strong>{getUserName(settlement.fromId)}</strong> paid{' '}
              <strong>{getUserName(settlement.toId)}</strong>
              <div className="settlement-history-time">
                {new Date(settlement.completedAt).toLocaleDateString()}
              </div>
            </div>
            <div className="settlement-history-amount">
              ₹{settlement.amount.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}