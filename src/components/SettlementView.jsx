export default function SettlementView({ transactions }) {
  return (
    <div className="section">
      <h3 className="section-title">Settlement Plan</h3>
      <p className="section-sub">
        Minimum {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} to clear all debts
      </p>
      {transactions.length === 0 ? (
        <div className="settled-badge">✓ Everyone is settled up!</div>
      ) : (
        <div className="settlements">
          {transactions.map((t, i) => (
            <div key={i} className="settlement-row">
              <span className="settlement-index">#{i + 1}</span>
              <div className="settlement-body">
                <span className="settlement-from">{t.fromName}</span>
                <span className="settlement-arrow">pays</span>
                <span className="settlement-to">{t.toName}</span>
              </div>
              <span className="settlement-amount mono">₹{t.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
