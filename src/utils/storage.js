const STORAGE_KEY = 'realsplit_outing';

export const DEFAULT_OUTING = {
  name: '',
  users: [],
  expenses: [],
  restaurantBills: [],
  history: [],
};

export const loadOuting = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return { ...DEFAULT_OUTING };
  } catch (error) {
    console.error('Error loading outing:', error);
    return { ...DEFAULT_OUTING };
  }
};

export const saveOuting = (outing) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(outing));
  } catch (error) {
    console.error('Error saving outing:', error);
  }
};

export const clearOuting = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing outing:', error);
  }
};