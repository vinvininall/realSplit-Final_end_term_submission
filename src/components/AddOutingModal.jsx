import CabModal from './CabModal';
import PizzaModal from './PizzaModal';
import { saveExpense } from "../services/supabase";

export default function AddOutingModal({ users, mode, onClose, onAddExpense, onAddRestaurant }) {
  if (mode === 'cab') {
    return (
      <CabModal
        users={users}
        onAdd={onAddExpense}
        onClose={onClose}

      />
    );
  }
  if (mode === 'pizza') {
    return (
      <PizzaModal
        users={users}
        onAdd={onAddRestaurant}
        onClose={onClose}
      />
    );
  }
  return null;
}
