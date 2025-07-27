  import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Theme, Language, Currency } from '../../types';
import {
  User as UserIcon, 
  Mail, 
  Palette, 
  Globe, 
  Save, 
  DollarSign,
  Camera,
  Upload
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useCurrency, currencyConfig } from '../../contexts/CurrencyContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Card, CardHeader, CardContent } from '../ui/Card';

const Profile: React.FC = () => {
  const { auth, updateUser } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { currency, setCurrency } = useCurrency();
  
  const [formData, setFormData] = useState({
    name: auth.user?.name || '',
    email: auth.user?.email || '',
    description: auth.user?.description || '',
  });
  const [profilePicture, setProfilePicture] = useState<string | null>(auth.user?.profilePicture || null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    await updateUser({
      name: formData.name,
      email: formData.email,
      description: formData.description,
      profilePicture: profilePicture || undefined,
    });
    
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    updateUser({ theme: newTheme });
  };

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    updateUser({ language: newLanguage });
  };

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    if (auth.user) {
      updateUser({ currency: newCurrency });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfilePicture(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfilePicture = () => {
    setProfilePicture(null);
  };

  const themeOptions = [
    { id: 'light', name: t('themes.light'), description: t('themeDescriptions.light'), color: 'bg-gradient-to-r from-white to-gray-100 border border-gray-300' },
    { id: 'dark', name: t('themes.dark'), description: t('themeDescriptions.dark'), color: 'bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600' },
    { id: 'couple', name: t('themes.couple'), description: t('themeDescriptions.couple'), color: 'bg-gradient-to-r from-pink-300 to-blue-300 border border-pink-400' },
    { id: 'ocean', name: t('themes.ocean'), description: t('themeDescriptions.ocean'), color: 'bg-gradient-to-r from-cyan-300 to-blue-400 border border-cyan-400' },
    { id: 'forest', name: t('themes.forest'), description: t('themeDescriptions.forest'), color: 'bg-gradient-to-r from-green-300 to-emerald-400 border border-green-400' },
    { id: 'sunset', name: t('themes.sunset'), description: t('themeDescriptions.sunset'), color: 'bg-gradient-to-r from-orange-300 to-red-400 border border-orange-400' },
    { id: 'purple', name: t('themes.purple'), description: t('themeDescriptions.purple'), color: 'bg-gradient-to-r from-purple-300 to-violet-400 border border-purple-400' },
    { id: 'rose', name: t('themes.rose'), description: t('themeDescriptions.rose'), color: 'bg-gradient-to-r from-rose-300 to-pink-400 border border-rose-400' },
    { id: 'midnight', name: t('themes.midnight'), description: t('themeDescriptions.midnight'), color: 'bg-gradient-to-r from-indigo-600 to-purple-700 border border-indigo-500' },
  ];

  const languageOptions = [
    { id: 'en', name: 'English', flag: '🇺🇸' },
    { id: 'pt', name: 'Português', flag: '🇧🇷' },
  ];

  const currencyOptions = [
    { id: 'USD', name: t('currencyNames.USD'), symbol: '$', flag: '🇺🇸' },
    { id: 'AOA', name: t('currencyNames.AOA'), symbol: 'Kz', flag: '🇦🇴' },
    { id: 'BRL', name: t('currencyNames.BRL'), symbol: 'R$', flag: '🇧🇷' },
    { id: 'EUR', name: t('currencyNames.EUR'), symbol: '€', flag: '🇪🇺' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          {t('profile')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <UserIcon className="w-5 h-5 mr-2" />
              {t('profileInformation')}
            </h2>
          </CardHeader>
          <CardContent>
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-4 border-white dark:border-gray-600 shadow-lg">
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-2 cursor-pointer shadow-lg transition-colors">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="mt-3 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <label className="cursor-pointer">
                  <Button variant="secondary" size="sm" className="flex items-center">
                    <Upload className="w-4 h-4 mr-2" />
                    {t('uploadPhoto')}
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {profilePicture && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeProfilePicture}
                    className="text-red-600 hover:text-red-700"
                  >
                    {t('remove')}
                  </Button>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label={t('name')}
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                icon={<UserIcon className="w-4 h-4 text-gray-400" />}
                required
              />
              
              <Input
                label={t('email')}
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                icon={<Mail className="w-4 h-4 text-gray-400" />}
                required
              />
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('description')}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder={t('descriptionPlaceholder')}
                />
              </div>
              
              <Button type="submit" loading={isLoading} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                {t('save')}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              {t('theme')}
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {themeOptions.map((option) => (
                <label
                  key={option.id}
                  className={`
                    flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                    ${theme === option.id
                      ? 'border-primary bg-primary/10 shadow-md'
                      : 'border-border hover:border-primary/50'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="theme"
                    value={option.id}
                    checked={theme === option.id}
                    onChange={(e) => handleThemeChange(e.target.value as Theme)}
                    className="sr-only"
                  />
                  <div className="flex items-center flex-1">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg mr-3 sm:mr-4 ${option.color} flex-shrink-0`} />
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm sm:text-base">
                        {option.name}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                  </div>
                  {theme === option.id && (
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                    </div>
                  )}
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Currency Settings */}
        <Card>
          <CardHeader>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              {t('currency')}
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currencyOptions.map((option) => (
                <label
                  key={option.id}
                  className={`
                    flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all
                    ${currency === option.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="currency"
                    value={option.id}
                    checked={currency === option.id}
                    onChange={(e) => handleCurrencyChange(e.target.value as Currency)}
                    className="sr-only"
                  />
                  <div className="flex items-center flex-1">
                    <span className="text-xl sm:text-2xl mr-2 sm:mr-3">{option.flag}</span>
                    <div>
                      <p className="font-medium text-foreground text-sm sm:text-base">
                        {option.name}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {option.symbol}
                      </p>
                    </div>
                  </div>
                  {currency === option.id && (
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                    </div>
                  )}
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card>
          <CardHeader>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              {t('language')}
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {languageOptions.map((option) => (
                <label
                  key={option.id}
                  className={`
                    flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all
                    ${language === option.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="language"
                    value={option.id}
                    checked={language === option.id}
                    onChange={(e) => handleLanguageChange(e.target.value as Language)}
                    className="sr-only"
                  />
                  <div className="flex items-center flex-1">
                    <span className="text-xl sm:text-2xl mr-2 sm:mr-3">{option.flag}</span>
                    <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                      {option.name}
                    </p>
                  </div>
                  {language === option.id && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Account Stats */}
        <Card>
          <CardHeader>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              {t('accountInformation')}
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between space-y-1 sm:space-y-0">
                <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{t('memberSince')}</span>
                <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                  {auth.user?.createdAt && new Date(auth.user.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between space-y-1 sm:space-y-0">
                <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{t('userId')}</span>
                <span className="font-mono text-xs sm:text-sm text-gray-900 dark:text-white break-all">
                  {auth.user?.id}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between space-y-1 sm:space-y-0">
                <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{t('currentTheme')}</span>
                <span className="font-medium text-gray-900 dark:text-white capitalize text-sm sm:text-base">
                  {theme}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between space-y-1 sm:space-y-0">
                <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{t('currency')}</span>
                <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                  {currencyOptions.find(c => c.id === currency)?.name} ({currencyOptions.find(c => c.id === currency)?.symbol})
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between space-y-1 sm:space-y-0">
                <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{t('language')}</span>
                <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                  {languageOptions.find(l => l.id === language)?.name}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;