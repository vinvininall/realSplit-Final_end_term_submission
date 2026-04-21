import { useState, useEffect } from 'react';
import { loadOuting, saveOuting, clearOuting, DEFAULT_OUTING } from './utils/storage';
import { calculateBalances } from './utils/balanceCalculator';
import { minimizeSettlements } from './utils/settlement';
import ExpenseList from './components/ExpenseList';
import BalanceSummary from './components/BalanceSummary';
import SettlementView from './components/SettlementView';
import TransactionHistory from './components/TransactionHistory';
import AddOutingModal from './components/AddOutingModal';
import { saveExpense, getExpenses, supabase } from './services/supabase';
import SettlementHistory from './components/SettlementHistory';

// ─── helpers ─────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 10);
const now = () => new Date().toISOString();

// ─── Auth Component ─────────────────────────────────────────────────────────
function Auth({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else onLogin();
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setMessage('Check your email for confirmation!');
    }
  };

  return (
    <div className="setup-screen">
      <div className="setup-card">
        <div className="logo">
          <span className="logo-real">real</span>
          <span className="logo-split">Split</span>
        </div>
        <p className="setup-tagline">Split smart. Settle fast.</p>

        {message && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>}
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            className="input input--large"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="input input--large"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="btn btn--primary btn--full" type="submit">
            {isLogin ? 'Login →' : 'Sign Up →'}
          </button>
        </form>

        <button
          className="btn btn--ghost btn--full"
          onClick={() => setIsLogin(!isLogin)}
          style={{ marginTop: '10px' }}
        >
          {isLogin ? 'Need an account? Sign Up' : 'Have an account? Login'}
        </button>
      </div>
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  // Authentication state
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // App state
  const [outing, setOuting] = useState(() => loadOuting());
  const [activeTab, setActiveTab] = useState('expenses');
  const [modalMode, setModalMode] = useState(null);
  const [newUserName, setNewUserName] = useState('');
  const [outingNameInput, setOutingNameInput] = useState('');
  const [setupDone, setSetupDone] = useState(() => !!loadOuting().name);
  const [completedSettlements, setCompletedSettlements] = useState([]);

  // Check authentication on app load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  // Persist on every state change
  useEffect(() => {
    saveOuting(outing);
  }, [outing]);

  // ── derived ────────────────────────────────────────────────────────────────
  const balances = calculateBalances(
    outing.expenses,
    outing.restaurantBills,
    outing.users
  );
  const settlements = minimizeSettlements(balances, outing.users);

  // ── helpers ────────────────────────────────────────────────────────────────
  const addHistory = (type, details) => ({
    id: uid(),
    type,
    timestamp: now(),
    details,
  });

  const update = (patch) =>
    setOuting((prev) => ({ ...prev, ...patch }));

  // ── actions ────────────────────────────────────────────────────────────────
  const handleCreateOuting = () => {
    if (!outingNameInput.trim()) return;
    const entry = addHistory('outing_created', `Outing "${outingNameInput.trim()}" created`);
    update({
      name: outingNameInput.trim(),
      history: [entry],
    });
    setCompletedSettlements([]);
    setSetupDone(true);
  };

  const handleAddUser = () => {
    const name = newUserName.trim();
    if (!name) return;
    if (outing.users.some((u) => u.name.toLowerCase() === name.toLowerCase())) {
      alert('A participant with that name already exists.');
      return;
    }
    const user = { id: uid(), name };
    const entry = addHistory('user_added', `${name} joined the outing`);
    update({
      users: [...outing.users, user],
      history: [...outing.history, entry],
    });
    setNewUserName('');
  };

  const handleRemoveUser = (id) => {
    const user = outing.users.find((u) => u.id === id);
    update({
      users: outing.users.filter((u) => u.id !== id),
      history: [
        ...outing.history,
        addHistory('user_removed', `${user?.name} removed`),
      ],
    });
  };

  const handleAddExpense = async (expData) => {
    try {
      const exp = { id: uid(), type: 'normal', ...expData };

      await saveExpense({
        title: exp.title,
        amount: exp.totalAmount,
        paidBy: exp.paidBy,
        participants: exp.participants,
      });

      const payerName =
        outing.users.find((u) => u.id === exp.paidBy)?.name ||
        exp.paidBy;

      const entry = addHistory(
        'expense_added',
        `Cab expense "${exp.title}" — ₹${exp.totalAmount.toFixed(
          2
        )} paid by ${payerName}, split among ${exp.participants.length
        } people`
      );

      update({
        expenses: [...outing.expenses, exp],
        history: [...outing.history, entry],
      });

      setModalMode(null);
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('Failed to save expense to database.');
    }
  };

  const handleAddRestaurant = async (billData) => {
    try {
      const bill = { id: uid(), ...billData };

      await saveExpense({
        title: bill.billName,
        amount: bill.finalAmount,
        paidBy: bill.paidBy,
        participants: outing.users.map((u) => u.id),
      });

      const payerName =
        outing.users.find((u) => u.id === bill.paidBy)?.name ||
        bill.paidBy;

      const entry = addHistory(
        'restaurant_added',
        `Restaurant "${bill.billName}" — ₹${bill.finalAmount.toFixed(
          2
        )} final bill paid by ${payerName} (${bill.items.length
        } items)`
      );

      update({
        restaurantBills: [...outing.restaurantBills, bill],
        history: [...outing.history, entry],
      });

      setModalMode(null);
    } catch (error) {
      console.error('Error saving restaurant:', error);
      alert('Failed to save restaurant bill.');
    }
  };

  const handleSettleUp = (transaction) => {
    const alreadySettled = completedSettlements.some(settled =>
      settled.fromId === transaction.fromId &&
      settled.toId === transaction.toId &&
      Math.abs(settled.amount - transaction.amount) < 0.01
    );

    if (alreadySettled) {
      alert("This payment has already been marked as settled!");
      return;
    }

    const newSettlement = {
      id: Date.now(),
      fromId: transaction.fromId,
      toId: transaction.toId,
      fromName: transaction.fromName,
      toName: transaction.toName,
      amount: transaction.amount,
      completedAt: new Date().toISOString(),
    };

    setCompletedSettlements(prev => [...prev, newSettlement]);

    const entry = addHistory(
      'settlement_made',
      `${transaction.fromName} paid ₹${transaction.amount.toFixed(2)} to ${transaction.toName}`
    );

    update({ history: [...outing.history, entry] });

    alert(`✓ Payment recorded: ${transaction.fromName} paid ${transaction.toName} ₹${transaction.amount.toFixed(2)}`);
  };

  const handleReset = () => {
    if (!confirm('Clear all data and start fresh?')) return;
    clearOuting();
    setOuting({ ...DEFAULT_OUTING });
    setCompletedSettlements([]);
    setSetupDone(false);
    setOutingNameInput('');
  };

  useEffect(() => {
    const fetchExpenses = async () => {
      const data = await getExpenses();
      if (data && data.length > 0) {
        console.log("Loaded from database:", data);
      }
    };
    fetchExpenses();
  }, []);

  // Show loading screen
  if (authLoading) {
    return (
      <div className="setup-screen">
        <div className="setup-card">
          <div className="logo">
            <span className="logo-real">real</span>
            <span className="logo-split">Split</span>
          </div>
          <p className="setup-tagline">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!user) {
    return <Auth onLogin={() => {}} />;
  }

  // ── Setup Screen ────────────────────────────────────────────────────────────
  if (!setupDone) {
    return (
      <div className="setup-screen">
        <div className="setup-card">
          <div className="logo">
            <span className="logo-real">real</span>
            <span className="logo-split">Split</span>
          </div>
          <p className="setup-tagline">Split smart. Settle fast.</p>
          <input
            className="input input--large"
            placeholder="Name this outing…"
            value={outingNameInput}
            onChange={(e) => setOutingNameInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateOuting()}
            autoFocus
          />
          <button className="btn btn--primary btn--full" onClick={handleCreateOuting}>
            Create Outing →
          </button>
          <button
            className="btn btn--ghost btn--full"
            onClick={() => supabase.auth.signOut()}
            style={{ marginTop: '10px' }}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  // ── Main App Return ────────────────────────────────────────────────────────────────
  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-real">real</span>
            <span className="logo-split">Split</span>
          </div>
          <div className="outing-name">{outing.name}</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn--ghost btn--sm" onClick={handleReset}>
              Reset
            </button>
            <button
              className="btn btn--ghost btn--sm"
              onClick={() => supabase.auth.signOut()}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        {/* ── Participants ── */}
        <section className="participants-bar">
          <div className="participants-list">
            {outing.users.map((u) => (
              <div key={u.id} className="participant-pill">
                <span>{u.name}</span>
                <button
                  className="pill-remove"
                  onClick={() => handleRemoveUser(u.id)}
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="add-participant">
            <input
              className="input input--sm"
              placeholder="Add person…"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddUser()}
            />
            <button className="btn btn--primary btn--sm" onClick={handleAddUser}>
              + Add
            </button>
          </div>
        </section>

        {/* ── ADD OUTING Button ── */}
        <div className="add-outing-row">
          <button
            className="btn btn--accent btn--add-outing"
            onClick={() => setModalMode('choose')}
            disabled={outing.users.length === 0}
          >
            + ADD OUTING
          </button>
          {outing.users.length === 0 && (
            <span className="hint">Add participants first</span>
          )}
        </div>

        {/* ── Tabs ── */}
        <div className="tabs">
          {['expenses', 'settle', 'history'].map((tab) => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? 'tab--active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'expenses' && '📋 Expenses'}
              {tab === 'settle' && '💸 Settle Up'}
              {tab === 'history' && '🕓 History'}
            </button>
          ))}
        </div>

        {/* ── Tab Content ── */}
        {activeTab === 'expenses' && (
          <>
            <ExpenseList
              expenses={outing.expenses}
              restaurantBills={outing.restaurantBills}
              users={outing.users}
            />
            {outing.users.length > 0 && (
              <BalanceSummary balances={balances} users={outing.users} />
            )}
          </>
        )}

        {activeTab === 'settle' && (
          <>
            <BalanceSummary balances={balances} users={outing.users} />
            <SettlementView
              transactions={settlements}
              users={outing.users}
              onSettleUp={handleSettleUp}
              completedSettlements={completedSettlements}
            />
            <SettlementHistory settlements={completedSettlements} users={outing.users} />
          </>
        )}

        {activeTab === 'history' && (
          <TransactionHistory history={outing.history} />
        )}
      </main>

      {/* ── Choose Modal ── */}
      {modalMode === 'choose' && (
        <div className="modal-overlay" onClick={() => setModalMode(null)}>
          <div className="choose-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="choose-title">What are you adding?</h2>
            <div className="choose-buttons">
              <button
                className="choose-btn"
                onClick={() => setModalMode('cab')}
              >
                <span className="choose-btn__icon">🚕</span>
                <span className="choose-btn__label">Cab / Transport</span>
                <span className="choose-btn__sub">Split evenly</span>
              </button>
              <button
                className="choose-btn"
                onClick={() => setModalMode('pizza')}
              >
                <span className="choose-btn__icon">🍕</span>
                <span className="choose-btn__label">Restaurant</span>
                <span className="choose-btn__sub">Proportional split</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Cab / Pizza Modals ── */}
      {(modalMode === 'cab' || modalMode === 'pizza') && (
        <AddOutingModal
          users={outing.users}
          mode={modalMode}
          onClose={() => setModalMode(null)}
          onAddExpense={handleAddExpense}
          onAddRestaurant={handleAddRestaurant}
        />
      )}
    </div>
  );
}