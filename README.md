# realSplit - Smart Bill Splitting Application

> Split expenses with friends. Settle up instantly.

A production-ready expense splitting web app built with **React + Vite + Supabase**. Stop chasing friends for money - realSplit calculates who owes whom and suggests the minimum number of transactions to settle everyone up.

## 🎯 Problem Statement

**Who is the user?** Friend groups, roommates, travelers, or anyone sharing expenses.

**What problem does it solve?** Tracking shared expenses is painful. Who paid for the cab? Who owes whom for dinner? How to settle up without making 10 transactions?

**Why does it matter?** realSplit eliminates awkward "who owes whom" conversations, reduces the number of transactions needed to settle debts, and provides a clear record of all expenses.

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Email/password login with Supabase Auth |
| 👥 **Group Management** | Create outings, add/remove participants |
| 🚕 **Cab/Transport Split** | Split expenses equally among selected people |
| 🍕 **Restaurant Bill Split** | Proportional split with tax/tip scaling |
| 💰 **Smart Settlements** | Debt minimization algorithm reduces transactions |
| ✏️ **Edit/Delete** | Full CRUD operations on expenses |
| ✅ **Settlement Tracking** | Mark payments as settled, track history |
| 📱 **Responsive Design** | Works on mobile, tablet, and desktop |
| 🕒 **Transaction History** | Complete audit log of all activities |

## 🧠 Algorithm Highlight

### Proportional Restaurant Split
When the final bill includes taxes or tip:


### Debt Minimization
The app uses a greedy matching algorithm that repeatedly pairs the largest creditor with the largest debtor, producing the minimum number of transactions to settle all debts.

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 18 + Vite |
| Backend | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| Styling | Custom CSS |
| Deployment | Vercel |

## 📁 Project Structure

src/
├── components/
│ ├── AddOutingModal.jsx # Router for expense modals
│ ├── CabModal.jsx # Equal split expense form
│ ├── PizzaModal.jsx # Proportional restaurant form
│ ├── ExpenseList.jsx # Display all expenses
│ ├── BalanceSummary.jsx # Net balances grid
│ ├── SettlementView.jsx # Optimized transaction list
│ ├── SettlementHistory.jsx # Completed payments
│ └── TransactionHistory.jsx # Audit log
├── utils/
│ ├── balanceCalculator.js # Net balance computation
│ ├── settlement.js # Debt minimization algorithm
│ └── storage.js # Local storage persistence
├── services/
│ └── supabase.js # Database operations
├── App.jsx # Main component
├── main.jsx # Entry point
└── index.css # Global styles


Usage guide:
Sign up with your email and password

Confirm your email (check inbox/spam folder)

Create an outing (e.g., "Goa Trip 2025")

Add participants (friends in the trip)

Add expenses:

Cab/Transport: Split equally among selected people

Restaurant: Enter each person's menu items, app scales to final bill

View balances - See who owes whom at a glance

Settle up - Mark payments as completed

Track history - View all past transactions

Row Level Security (RLS) on all tables

Users can only access their own data

Authentication required for all protected routes

Environment variables for API keys

Email confirmation for new accounts


VIDEO LINK:
https://www.loom.com/share/857b8523d38047779794fc671231694c

PHOTOS:
 //photo of my database requests. <img width="1777" height="495" alt="image" src="https://github.com/user-attachments/assets/036c8bcc-8e02-421f-ab63-cb243fe15845" />


## 🚀 Live Demo

**[Click here to try realSplit live!](https://real-split-final-end-term-submissio.vercel.app/)**

> ⚠️ Note: Email confirmation required. Check spam folder if you don't see the email.

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/vinvininall/realSplit-Final_end_term_submission.git
cd realSplit-Final_end_term_submission

# Install dependencies
npm install

# Create .env file
echo "VITE_SUPABASE_URL=your_supabase_url" > .env
echo "VITE_SUPABASE_ANON_KEY=your_supabase_anon_key" >> .env

# Start development server
npm run dev

