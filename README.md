# realSplit 🚕🍕

> Split smart. Settle fast.

A production-quality group expense settlement web app built with React + Vite.
All data persisted in browser `localStorage`. No backend required.

---

## ⚡ Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`

---

## 🏗️ Build for Production

```bash
npm run build
```

Output goes to `/dist` — ready for static hosting.

---

## 🚀 Deploy to Vercel

### Option 1 — Vercel CLI
```bash
npm i -g vercel
vercel
```
Follow prompts. Framework auto-detected as Vite.

### Option 2 — GitHub + Vercel Dashboard
1. Push this repo to GitHub
2. Import at vercel.com/new
3. Framework: Vite (auto-detected)
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Deploy ✓

---

## 📁 Project Structure

```
/src
  /components
    AddOutingModal.jsx   — Router for cab/pizza modals
    CabModal.jsx         — Even split expense form
    PizzaModal.jsx       — Proportional restaurant bill form
    ExpenseList.jsx      — All expenses display
    BalanceSummary.jsx   — Net balances grid
    SettlementView.jsx   — Minimum transactions list
    TransactionHistory.jsx — Chronological audit log
  /utils
    proportionalSplit.js — Restaurant bill proportional math
    balanceCalculator.js — Net balance computation
    settlement.js        — Greedy settlement minimizer
    storage.js           — localStorage persistence
  App.jsx                — Root component + state
  main.jsx               — React entry point
  index.css              — Global styles + design tokens
```

---

## 🧮 Algorithms

### Proportional Restaurant Split
```
scaleFactor = finalBillAmount / totalMenuPrices
eachPersonFinalShare = theirMenuTotal × scaleFactor
```

### Balance Calculation
- Each expense: payer gets +totalAmount, each participant gets −(total/n)
- Restaurant bills: payer gets +finalAmount, each user gets −proportionalShare

### Settlement Minimization
Greedy matching: repeatedly pair largest creditor with largest debtor until all debts cleared. Produces the minimum number of transactions.

---

## 💾 Data Model

All data lives in `localStorage` under key `realsplit_outing`.

```json
{
  "name": "Goa Trip",
  "users": [{ "id": "abc", "name": "Raj" }],
  "expenses": [{ "id": "...", "title": "...", "totalAmount": 0, "paidBy": "abc", "participants": [], "type": "normal" }],
  "restaurantBills": [{ "id": "...", "billName": "...", "paidBy": "abc", "items": [], "finalAmount": 0 }],
  "history": [{ "id": "...", "type": "expense_added", "timestamp": "...", "details": "..." }]
}
```

---

## 🔮 Future Extension Points

- Replace `storage.js` with an API client for backend integration
- `balanceCalculator.js` and `settlement.js` are pure functions — drop-in ready for server-side use
- Add `userId` auth layer around the outing object for multi-session support
- OCR integration: parse items array from a bill photo
