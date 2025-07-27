import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface RegisterFormProps {
  onToggleMode: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { register } = useAuth();
  const { t } = useLanguage();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('requiredField');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('requiredField');
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('passwordMismatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    const success = await register(formData.name, formData.email, formData.password);
    
    if (success) {
      alert('Registration successful! You can now log in with your credentials.');
      onToggleMode(); // Switch to login form  
    } else {
      setErrors({ email: t('emailExists') });
    }
    
    setLoading(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('createAccount')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Join Family Finance today
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="text"
          label={t('name')}
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          required
          icon={<User className="w-5 h-5 text-gray-400" />}
        />

        <Input
          type="email"
          label={t('email')}
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
          required
          icon={<Mail className="w-5 h-5 text-gray-400" />}
        />

        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            label={t('password')}
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            error={errors.password}
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

        <Input
          type={showPassword ? 'text' : 'password'}
          label={t('confirmPassword')}
          value={formData.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
          error={errors.confirmPassword}
          required
          icon={<Lock className="w-5 h-5 text-gray-400" />}
        />

        <Button
          type="submit"
          loading={loading}
          className="w-full"
        >
          {t('createAccount')}
        </Button>

        <div className="text-center text-gray-600 dark:text-gray-400">
          {t('alreadyHaveAccount')}{' '}
          <button
            type="button"
            onClick={onToggleMode}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {t('login')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;