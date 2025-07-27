import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { DataProvider } from './contexts/DataContext';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './components/pages/Dashboard';
import Expenses from './components/pages/Expenses';
import Savings from './components/pages/Savings';
import Goals from './components/pages/Goals';
import Tasks from './components/pages/Tasks';
import Profile from './components/pages/Profile';
import Insights from './components/pages/Insights';
// ⛳️ Add this debug line here
console.log('Loaded env variables:', import.meta.env);
const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">
              Family Finance
            </h1>
            <p className="text-blue-100">
              Manage your family finances together
            </p>
          </div>
        </div>
        
        <div className="p-6">
          {isLogin ? (
            <LoginForm onToggleMode={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onToggleMode={() => setIsLogin(true)} />
          )}
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Secured with PHP Backend • Family Finance App
          </p>
        </div>
      </div>
    </div>
  );
};

const MainApp: React.FC = () => {
  const { auth, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'expenses':
        return <Expenses />;
      case 'savings':
        return <Savings />;
      case 'goals':
        return <Goals />;
      case 'tasks':
        return <Tasks />;
      case 'profile':
        return <Profile />;
      case 'insights':
        return <Insights />;
      default:
        return <Dashboard />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground mb-4">Loading Family Finance...</p>
        </div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <DataProvider>
      <div className="flex h-screen bg-background">
        <Sidebar 
          currentPage={currentPage} 
          onPageChange={setCurrentPage}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className={`flex-1 overflow-auto transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        }`}>
          <div className="p-4 sm:p-6">
            {/* Mobile header */}
            <div className="flex items-center justify-between mb-4 lg:hidden">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-md bg-card border border-border hover:bg-muted transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h1 className="text-lg font-semibold text-foreground">Family Finance</h1>
              </div>
            </div>
            
            {renderPage()}
          </div>
        </main>
      </div>
    </DataProvider>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <CurrencyProvider>
            <MainApp />
          </CurrencyProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;