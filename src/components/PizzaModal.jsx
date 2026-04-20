import { useState } from 'react';

export default function PizzaModal({ users, onAdd, onClose }) {
  const [billName, setBillName] = useState('');
  const [paidBy, setPaidBy] = useState(users[0]?.id || '');
  // items: { id, userId, menuPrice }
  const [items, setItems] = useState(
    users.map((u) => ({ id: u.id + '_item', userId: u.id, menuPrice: '' }))
  );
  const [finalAmount, setFinalAmount] = useState('');

  const updatePrice = (userId, val) => {
    setItems((prev) =>
      prev.map((item) =>
        item.userId === userId ? { ...item, menuPrice: val } : item
      )
    );
  };

  const totalMenuPrice = items.reduce(
    (sum, i) => sum + (parseFloat(i.menuPrice) || 0),
    0
  );
  const finalNum = parseFloat(finalAmount) || 0;
  const scaleFactor = totalMenuPrice > 0 ? finalNum / totalMenuPrice : 0;

  const handleSubmit = () => {
    if (!billName.trim() || finalNum <= 0) return;

    const validItems = items
      .filter((i) => parseFloat(i.menuPrice) > 0)
      .map((i) => ({
        id: `${i.userId}_${Date.now()}`,
        name: users.find((u) => u.id === i.userId)?.name || i.userId,
        menuPrice: parseFloat(i.menuPrice),
        eatenBy: [i.userId],
      }));

    if (validItems.length === 0) return;

    onAdd({
      billName: billName.trim(),
      paidBy,
      items: validItems,
      finalAmount: finalNum,
    });
    onClose();
  };

  const getScaledAmount = (menuPrice) => {
    if (!menuPrice || scaleFactor === 0) return null;
    return (parseFloat(menuPrice) * scaleFactor).toFixed(2);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box modal-box--wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-icon">🍕</span>
          <h2>Restaurant Bill</h2>
        </div>

        <div className="field-row">
          <div className="field-group" style={{ flex: 2 }}>
            <label>Restaurant / Bill Name</label>
            <input
              className="input"
              placeholder="e.g. Dinner at Smoke House"
              value={billName}
              onChange={(e) => setBillName(e.target.value)}
            />
          </div>
          <div className="field-group" style={{ flex: 1 }}>
            <label>Paid By</label>
            <select
              className="input"
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="field-group">
          <label className="label--section">Menu Prices (per person)</label>
          <div className="pizza-items">
            {users.map((u) => {
              const item = items.find((i) => i.userId === u.id);
              const scaled = getScaledAmount(item?.menuPrice);
              return (
                <div key={u.id} className="pizza-item-row">
                  <span className="pizza-item-name">{u.name}</span>
                  <div className="pizza-item-input-wrap">
                    <span className="currency-prefix">₹</span>
                    <input
                      className="input input--inline"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={item?.menuPrice || ''}
                      onChange={(e) => updatePrice(u.id, e.target.value)}
                    />
                  </div>
                  {scaled && (
                    <span className="pizza-scaled">→ ₹{scaled}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="pizza-totals">
          <div className="pizza-total-row">
            <span>Menu Total</span>
            <span className="mono">₹{totalMenuPrice.toFixed(2)}</span>
          </div>
          <div className="field-group" style={{ margin: 0 }}>
            <label>Final Billed Amount (₹)</label>
            <input
              className="input"
              type="number"
              min="0"
              step="0.01"
              placeholder="Actual bill amount"
              value={finalAmount}
              onChange={(e) => setFinalAmount(e.target.value)}
            />
          </div>
          {finalNum > 0 && totalMenuPrice > 0 && (
            <div className="scale-badge">
              Scale factor: ×{scaleFactor.toFixed(4)}{' '}
              {finalNum > totalMenuPrice
                ? '(taxes & service included)'
                : finalNum < totalMenuPrice
                ? '(discount applied)'
                : '(exact match)'}
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="btn btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn--primary"
            onClick={handleSubmit}
            disabled={!billName || finalNum <= 0}
          >
            Add Restaurant Bill
          </button>
        </div>
      </div>
    </div>
  );
}
