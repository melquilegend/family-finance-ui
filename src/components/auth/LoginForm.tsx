import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface LoginFormProps {
  onToggleMode: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.error || t('invalidCredentials'));
    }
    
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('login')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back to Family Finance
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="email"
          label={t('email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          icon={<Mail className="w-5 h-5 text-gray-400" />}
        />

        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            label={t('password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            icon={<Lock className="w-5 h-5 text-gray-400" />}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {error && (
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        )}

        <Button
          type="submit"
          loading={loading}
          className="w-full"
        >
          {t('login')}
        </Button>

        <div className="text-center">
          <div className="text-gray-600 dark:text-gray-400">
            {t('dontHaveAccount')}{' '}
            <button
              type="button"
              onClick={onToggleMode}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {t('register')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;