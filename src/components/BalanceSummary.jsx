export default function BalanceSummary({ balances, users }) {
  const getUserName = (id) => users.find((u) => u.id === id)?.name || id;

  const sorted = Object.entries(balances).sort(([, a], [, b]) => b - a);

  return (
    <div className="section">
      <h3 className="section-title">Net Balances</h3>
      {sorted.length === 0 && (
        <p className="empty-state">Add participants and expenses to see balances.</p>
      )}
      <div className="balance-grid">
        {sorted.map(([id, bal]) => (
          <div
            key={id}
            className={`balance-card ${
              bal > 0.005
                ? 'balance-card--positive'
                : bal < -0.005
                ? 'balance-card--negative'
                : 'balance-card--zero'
            }`}
          >
            <span className="balance-name">{getUserName(id)}</span>
            <span className="balance-amount mono">
              {bal > 0.005 ? '+' : ''}₹{bal.toFixed(2)}
            </span>
            <span className="balance-label">
              {bal > 0.005 ? 'gets back' : bal < -0.005 ? 'owes' : 'settled'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
