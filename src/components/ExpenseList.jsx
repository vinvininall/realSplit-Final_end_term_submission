export default function ExpenseList({ expenses, restaurantBills, users }) {
  const getUserName = (id) => users.find((u) => u.id === id)?.name || id;

  return (
    <div className="section">
      <h3 className="section-title">Expenses</h3>

      {expenses.length === 0 && restaurantBills.length === 0 && (
        <p className="empty-state">No expenses yet. Hit ADD OUTING to get started.</p>
      )}

      {expenses.map((exp) => (
        <div key={exp.id} className="expense-card">
          <div className="expense-card__left">
            <span className="expense-icon">🚕</span>
            <div>
              <div className="expense-title">{exp.title}</div>
              <div className="expense-meta">
                Paid by <strong>{getUserName(exp.paidBy)}</strong> ·{' '}
                {exp.participants.length} people
              </div>
            </div>
          </div>
          <div className="expense-card__right">
            <span className="expense-amount">₹{exp.totalAmount.toFixed(2)}</span>
            <span className="expense-per">
              ₹{(exp.totalAmount / exp.participants.length).toFixed(2)} each
            </span>
          </div>
        </div>
      ))}

      {restaurantBills.map((bill) => (
        <div key={bill.id} className="expense-card expense-card--restaurant">
          <div className="expense-card__left">
            <span className="expense-icon">🍕</span>
            <div>
              <div className="expense-title">{bill.billName}</div>
              <div className="expense-meta">
                Paid by <strong>{getUserName(bill.paidBy)}</strong> ·{' '}
                {bill.items.length} items
              </div>
              <div className="restaurant-items-preview">
                {bill.items.map((item) => (
                  <span key={item.id} className="restaurant-item-tag">
                    {item.name}: ₹{item.menuPrice.toFixed(2)}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="expense-card__right">
            <span className="expense-amount">₹{bill.finalAmount.toFixed(2)}</span>
            <span className="expense-per">final billed</span>
          </div>
        </div>
      ))}
    </div>
  );
}
