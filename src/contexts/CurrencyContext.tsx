import React, { createContext, useContext, useState, useEffect } from 'react';
import { Currency } from '../types';
import { storage } from '../utils/storage';
import { useAuth } from './AuthContext';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatAmount: (amount: number) => string;
  getCurrencySymbol: (curr?: Currency) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

interface CurrencyProviderProps {
  children: React.ReactNode;
}

const currencyConfig = {
  USD: { symbol: '$', name: 'US Dollar', code: 'USD', flag: '🇺🇸' },
  AOA: { symbol: 'Kz', name: 'Angolan Kwanza', code: 'AOA', flag: '🇦🇴' },
  BRL: { symbol: 'R$', name: 'Brazilian Real', code: 'BRL', flag: '🇧🇷' },
  EUR: { symbol: '€', name: 'Euro', code: 'EUR', flag: '🇪🇺' },
};

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const { auth, updateUser } = useAuth();
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const savedCurrency = storage.get<Currency>('currency');
    return savedCurrency || 'USD';
  });

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    storage.set('currency', newCurrency);
    
    // Update user profile if authenticated
    if (auth.user) {
      updateUser({ currency: newCurrency });
    }
  };

  const getCurrencySymbol = (curr?: Currency): string => {
    const targetCurrency = curr || currency;
    return currencyConfig[targetCurrency]?.symbol || '$';
  };

  const formatAmount = (amount: number): string => {
    // Ensure amount is a valid number
    const numericAmount = typeof amount === 'number' && !isNaN(amount) ? amount : parseFloat(String(amount)) || 0;
    
    const symbol = getCurrencySymbol();
    const formattedAmount = numericAmount.toFixed(2);
    
    // Different formatting based on currency
    switch (currency) {
      case 'EUR':
        return `${formattedAmount}${symbol}`;
      case 'BRL':
        return `${symbol} ${formattedAmount.replace('.', ',')}`;
      case 'AOA':
        return `${formattedAmount} ${symbol}`;
      default: // USD
        return `${symbol}${formattedAmount}`;
    }
  };

  // Update currency when user changes
  useEffect(() => {
    if (auth.user?.currency && auth.user.currency !== currency && auth.isAuthenticated) {
      setCurrencyState(auth.user.currency);
    }
  }, [auth.user, auth.isAuthenticated, currency]);

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      formatAmount,
      getCurrencySymbol,
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export { currencyConfig };