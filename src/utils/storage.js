/**
 * storage.js
 * LocalStorage persistence helpers with graceful error handling.
 */

const STORAGE_KEY = 'realsplit_outing';

export const DEFAULT_OUTING = {
  name: '',
  users: [],
  expenses: [],
  restaurantBills: [],
  history: [],
};

export function loadOuting() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_OUTING };
    const parsed = JSON.parse(raw);
    // Ensure all required keys exist
    return {
      ...DEFAULT_OUTING,
      ...parsed,
    };
  } catch {
    console.warn('realSplit: corrupted localStorage data, resetting.');
    return { ...DEFAULT_OUTING };
  }
}

export function saveOuting(outing) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(outing));
  } catch (e) {
    console.error('realSplit: failed to save to localStorage', e);
  }
}

export function clearOuting() {
  localStorage.removeItem(STORAGE_KEY);
}
