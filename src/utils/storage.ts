const STORAGE_KEYS = {
  USERS: 'family_finance_users',
  CURRENT_USER: 'family_finance_current_user',
  EXPENSES: 'family_finance_expenses',
  SAVINGS: 'family_finance_savings',
  GOALS: 'family_finance_goals',
  TASKS: 'family_finance_tasks',
};

export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage error:', error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Storage error:', error);
    }
  },

  clear: (): void => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Storage error:', error);
    }
  }
};

export { STORAGE_KEYS };