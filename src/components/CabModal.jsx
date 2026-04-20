import { useState } from 'react';

export default function CabModal({ users, onAdd, onClose }) {
  const [title, setTitle] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [paidBy, setPaidBy] = useState(users[0]?.id || '');
  const [selected, setSelected] = useState(users.map((u) => u.id));

  const toggleUser = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (!title.trim() || !totalAmount || selected.length === 0 || !paidBy) return;
    onAdd({
      title: title.trim(),
      totalAmount: parseFloat(totalAmount),
      paidBy,
      participants: selected,
      type: 'normal',
    });
    onClose();
  };

  const perPerson =
    selected.length > 0 && totalAmount
      ? (parseFloat(totalAmount) / selected.length).toFixed(2)
      : null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-icon">🚕</span>
          <h2>Cab / Transport</h2>
        </div>

        <div className="field-group">
          <label>Expense Title</label>
          <input
            className="input"
            placeholder="e.g. Uber to venue"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="field-group">
          <label>Total Amount (₹)</label>
          <input
            className="input"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
          />
        </div>

        <div className="field-group">
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

        <div className="field-group">
          <label>Split Among</label>
          <div className="user-chips">
            {users.map((u) => (
              <button
                key={u.id}
                className={`chip ${selected.includes(u.id) ? 'chip--active' : ''}`}
                onClick={() => toggleUser(u.id)}
                type="button"
              >
                {u.name}
              </button>
            ))}
          </div>
          {perPerson && (
            <div className="split-preview">
              ÷ {selected.length} people = <strong>₹{perPerson} each</strong>
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
            disabled={!title || !totalAmount || selected.length === 0}
          >
            Add Expense
          </button>
        </div>
      </div>
    </div>
  );
}
