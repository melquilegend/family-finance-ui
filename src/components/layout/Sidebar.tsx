import React from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  PiggyBank, 
  Target, 
  CheckSquare,
  BarChart3,
  User,
  LogOut,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentPage, 
  onPageChange, 
  isOpen = false, 
  onClose,
  collapsed = false,
  onToggleCollapse 
}) => {
  const { logout, auth } = useAuth();
  const { t } = useLanguage();

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('dashboard') },
    { id: 'expenses', icon: Receipt, label: t('expenses') },
    { id: 'savings', icon: PiggyBank, label: t('savings') },
    { id: 'goals', icon: Target, label: t('goals') },
    { id: 'tasks', icon: CheckSquare, label: t('tasks') },
    { id: 'insights', icon: BarChart3, label: 'Insights' },
    { id: 'profile', icon: User, label: t('profile') },
  ];

  const handlePageChange = (page: string) => {
    onPageChange(page);
    if (onClose) onClose(); // Close sidebar on mobile after selection
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 bg-card border-r border-border flex flex-col
        transform transition-transform duration-300 ease-in-out lg:transform-none
        ${collapsed ? 'lg:w-16' : 'lg:w-64'} w-64
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile close button */}
        <div className="lg:hidden flex justify-between items-center p-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-muted transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Desktop collapse button */}
        <div className="hidden lg:flex justify-end p-2 border-b border-border">
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex items-center space-x-2"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <ChevronLeft className={`w-5 h-5 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
            <span className={`font-medium text-muted-foreground ${collapsed ? 'lg:hidden' : ''}`}>
              {collapsed ? 'Expand' : 'Collapse'}
            </span>
          </button>
        </div>
        
        {/* Header */}
        <div className={`border-b border-border transition-all duration-300 ${
          collapsed ? 'lg:p-2' : 'p-6'
        }`}>
          <div className={`flex items-center mb-3 ${collapsed ? 'lg:justify-center lg:space-x-0' : 'space-x-3'}`}>
            <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex items-center justify-center">
              {auth.user?.profilePicture ? (
                <img
                  src={auth.user.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <div className={`flex-1 min-w-0 ${collapsed ? 'lg:hidden' : ''}`}>
              <h1 className="text-lg font-bold text-foreground truncate">
                Family Finance
              </h1>
            </div>
          </div>
          <p className={`text-sm text-muted-foreground mt-1 ${collapsed ? 'lg:hidden' : ''}`}>
            {t('welcome')}, {auth.user?.name}
          </p>
          {auth.user?.description && (
            <p className={`text-xs text-muted-foreground mt-2 line-clamp-2 ${collapsed ? 'lg:hidden' : ''}`}>
              {auth.user.description}
            </p>
          )}
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handlePageChange(item.id)}
                title={collapsed ? item.label : undefined}
                className={`
                  w-full flex items-center rounded-lg text-left transition-all duration-200 px-3 py-2.5 
                  ${collapsed ? 'lg:justify-center lg:space-x-0' : 'space-x-3'}
                  ${isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className={`font-medium truncate ${collapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        {/* Logout */}
        <div className="border-t border-border p-4">
          <button
            onClick={logout}
            title={collapsed ? t('logout') : undefined}
            className={`
              w-full flex items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-200 px-3 py-2.5 
              ${collapsed ? 'lg:justify-center lg:space-x-0' : 'space-x-3'}
            `}
          >
            <LogOut className="w-5 h-5" />
            <span className={`font-medium ${collapsed ? 'lg:hidden' : ''}`}>{t('logout')}</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;