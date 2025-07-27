import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { hashPassword } from '../utils/crypto';

// API Configuration - Will be updated when backend is deployed
const API_BASE_URL = 'http://localhost:5000'; // Local development
// const API_BASE_URL = 'https://your-render-app.onrender.com'; // Production - update this later

// API Helper functions
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

interface LoginResult {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

interface AuthContextType {
  auth: AuthState;
  login: (email: string, password: string) => Promise<LoginResult>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  getAllUsers: () => User[];
  loading: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    users: [],
    isAuthenticated: false,
  });
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = () => {
      console.log('🔄 Initializing auth...');
      
      const currentUser = storage.get<User>(STORAGE_KEYS.CURRENT_USER);
      const savedToken = storage.get<string>('auth_token');
      const allUsers = storage.get<User[]>(STORAGE_KEYS.USERS) || [];
      
      if (currentUser && savedToken) {
        console.log('👤 Found existing user:', currentUser.email);
        setToken(savedToken);
        setAuth({
          user: currentUser,
          users: allUsers,
          isAuthenticated: true,
        });
      } else {
        console.log('📝 No existing user found');
        setAuth({
          user: null,
          users: allUsers,
          isAuthenticated: false,
        });
      }
      
      console.log('✅ Auth initialization complete');
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
      console.log('🔐 Attempting login for:', email);
      
      // Try API login first (when backend is ready)
      try {
        const response = await apiCall('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });

        const { user, token: authToken } = response;
        
        // Update auth state
        setAuth({
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            theme: user.theme || 'light',
            language: user.language || 'en',
            currency: user.currency || 'USD',
            profilePicture: user.profilePicture,
            description: user.description,
            createdAt: new Date(user.createdAt)
          },
          users: [],
          isAuthenticated: true,
        });
        
        // Store token and user
        setToken(authToken);
        storage.set('auth_token', authToken);
        storage.set(STORAGE_KEYS.CURRENT_USER, user);
        
        console.log('✅ API Login successful');
        return { success: true, user, token: authToken };
        
      } catch (apiError) {
        console.log('API not available, using localStorage fallback');
        
        // Fallback to localStorage authentication
        let users = storage.get<User[]>(STORAGE_KEYS.USERS) || [];
        
        // Find user by email
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (!user) {
          return { success: false, error: 'User not found' };
        }
        
        // Check password (in production, this should be done on the server)
        const storedPasswordHash = storage.get<string>(`password_${user.id}`);
        const inputPasswordHash = hashPassword(password);
        
        if (storedPasswordHash !== inputPasswordHash) {
          return { success: false, error: 'Invalid password' };
        }
        
        // Update auth state
        setAuth({
          user,
          users,
          isAuthenticated: true,
        });
        
        // Store current user
        storage.set(STORAGE_KEYS.CURRENT_USER, user);
        
        console.log('✅ LocalStorage Login successful');
        return { success: true, user };
      }
      
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      console.log('📝 Attempting registration for:', email);
      
      // Try API registration first (when backend is ready)
      try {
        const response = await apiCall('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify({ name, email, password }),
        });

        console.log('✅ API Registration successful');
        return true;
        
      } catch (apiError) {
        console.log('API not available, using localStorage fallback');
        
        // Fallback to localStorage registration
        let users = storage.get<User[]>(STORAGE_KEYS.USERS) || [];
        
        // Check if user already exists
        const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (existingUser) {
          console.log('❌ User already exists');
          return false;
        }
        
        // Create new user
        const newUser: User = {
          id: Date.now().toString(),
          name: name.trim(),
          email: email.toLowerCase().trim(),
          theme: 'light',
          language: 'en',
          currency: 'USD',
          createdAt: new Date(),
        };
        
        // Store password hash
        const passwordHash = hashPassword(password);
        storage.set(`password_${newUser.id}`, passwordHash);
        
        // Add to users array
        const updatedUsers = [...users, newUser];
        storage.set(STORAGE_KEYS.USERS, updatedUsers);
        
        // Update auth state
        setAuth(prev => ({
          ...prev,
          users: updatedUsers,
        }));
        
        console.log('✅ LocalStorage Registration successful');
        return true;
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    console.log('🚪 Logging out...');
    
    setAuth({
      user: null,
      users: auth.users,
      isAuthenticated: false,
    });
    
    setToken(null);
    storage.remove(STORAGE_KEYS.CURRENT_USER);
    storage.remove('auth_token');
    console.log('✅ Logout complete');
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!auth.user) return;

    const updatedUser = { ...auth.user, ...updates };
    
    try {
      // Try to update user via API (when backend is ready)
      if (token) {
        await apiCall(`/api/users/${auth.user.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updatedUser),
        });
      }
    } catch (error) {
      console.log('API not available, updating locally');
    }
    
    // Update locally
    const updatedUsers = auth.users.map(u => 
      u.id === auth.user!.id ? updatedUser : u
    );

    setAuth(prev => ({
      ...prev,
      user: updatedUser,
      users: updatedUsers,
    }));

    // Update storage
    storage.set(STORAGE_KEYS.CURRENT_USER, updatedUser);
    storage.set(STORAGE_KEYS.USERS, updatedUsers);

    // Trigger theme update if theme was changed
    if (updates.theme) {
      window.dispatchEvent(new CustomEvent('themeChange', { detail: updates.theme }));
    }
  };

  const getAllUsers = () => auth.users;

  return (
    <AuthContext.Provider value={{
      auth,
      login,
      register,
      logout,
      updateUser,
      getAllUsers,
      loading,
      token,
    }}>
      {children}
    </AuthContext.Provider>
  );
};