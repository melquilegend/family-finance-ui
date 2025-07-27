import React, { useState } from 'react';
import { Plus, PiggyBank, TrendingUp, Target, Calendar, Edit, Trash2 } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { Savings as SavingsType } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import { Card, CardHeader, CardContent } from '../ui/Card';

const Savings: React.FC = () => {
  const { savings, addSavings, updateSavings, deleteSavings, expenses } = useData();
  const { auth } = useAuth();
  const { t } = useLanguage();
  const { formatAmount } = useCurrency();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSaving, setEditingSaving] = useState<SavingsType | null>(null);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const totalSavings = savings.reduce((sum, saving) => sum + saving.amount, 0);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });
  
  const totalMonthlyExpenses = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const recommendedSaving = totalMonthlyExpenses * 0.2; // 20% of expenses

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!auth.user) return;
    
    const savingData = {
      userId: auth.user.id,
      amount: parseFloat(formData.amount),
      description: formData.description,
      date: new Date(formData.date),
    };

    if (editingSaving) {
      updateSavings(editingSaving.id, savingData);
    } else {
      addSavings(savingData);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
    setEditingSaving(null);
    setIsModalOpen(false);
  };

  const handleEdit = (saving: SavingsType) => {
    setEditingSaving(saving);
    setFormData({
      amount: saving.amount.toString(),
      description: saving.description,
      date: new Date(saving.date).toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const handleDelete = (savingId: string) => {
    if (window.confirm('Are you sure you want to delete this saving?')) {
      deleteSavings(savingId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('savings')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your savings and build your financial future
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          {t('addSavings')}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <PiggyBank className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatAmount(totalSavings)}
            </p>
            <p className="text-gray-600 dark:text-gray-400">{t('totalSavings')}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatAmount(recommendedSaving)}
            </p>
            <p className="text-gray-600 dark:text-gray-400">{t('recommendedSaving')}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{t('basedOnExpenses')}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {savings.length}
            </p>
            <p className="text-gray-600 dark:text-gray-400">Total Deposits</p>
          </div>
        </Card>
      </div>

      {/* Savings List */}
      <div className="space-y-4">
        {savings.length > 0 ? (
          savings
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((saving) => (
              <Card key={saving.id}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <PiggyBank className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {saving.description}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(saving.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end space-x-4 sm:ml-4">
                    <span className="text-lg font-bold text-green-600 dark:text-green-400 sm:mr-4">
                      +{formatAmount(saving.amount)}
                    </span>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(saving)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(saving.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
        ) : (
          <Card>
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <PiggyBank className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No savings yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Start building your financial future by adding your first saving.
              </p>
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                {t('addSavings')}
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={resetForm}
        title={editingSaving ? 'Edit Saving' : t('addSavings')}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="number"
            step="0.01"
            label={t('amount')}
            value={formData.amount}
            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            required
            placeholder="0.00"
          />

          <Input
            type="text"
            label={t('description')}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            required
            placeholder="What are you saving for?"
          />

          <Input
            type="date"
            label={t('date')}
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            required
            icon={<Calendar className="w-4 h-4 text-gray-400" />}
          />

          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingSaving ? t('save') : t('add')}
            </Button>
            <Button type="button" variant="secondary" onClick={resetForm}>
              {t('cancel')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Savings;