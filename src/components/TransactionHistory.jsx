export default function TransactionHistory({ history }) {
  const sorted = [...history].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const iconMap = {
    expense_added: '🚕',
    restaurant_added: '🍕',
    user_added: '👤',
    outing_created: '🎉',
    reset: '🔄',
  };

  return (
    <div className="section">
      <h3 className="section-title">Transaction History</h3>
      {sorted.length === 0 && (
        <p className="empty-state">No history yet.</p>
      )}
      <div className="history-list">
        {sorted.map((entry) => (
          <div key={entry.id} className="history-entry">
            <div className="history-icon">{iconMap[entry.type] || '📝'}</div>
            <div className="history-body">
              <div className="history-detail">{entry.details}</div>
              <div className="history-time mono">{formatTime(entry.timestamp)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
