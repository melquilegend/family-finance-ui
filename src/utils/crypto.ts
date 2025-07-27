// Simple encryption for demo purposes - in production, use proper encryption
const ENCRYPTION_KEY = 'family_finance_key_2024';

export const encrypt = (text: string): string => {
  try {
    return btoa(text + ENCRYPTION_KEY);
  } catch {
    return text;
  }
};

export const decrypt = (encryptedText: string): string => {
  try {
    const decoded = atob(encryptedText);
    return decoded.replace(ENCRYPTION_KEY, '');
  } catch {
    return encryptedText;
  }
};

export const hashPassword = (password: string): string => {
  // Simple hash for demo - use bcrypt or similar in production
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
};