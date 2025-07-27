import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Calendar, Receipt } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { Expense } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import { Card } from '../ui/Card';

const Expenses: React.FC = () => {
  const { expenses, addExpense, updateExpense, deleteExpense, categories } = useData();
  const { auth } = useAuth();
  const { t } = useLanguage();
  const { formatAmount } = useCurrency();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || expense.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!auth.user) return;
    
    const expenseData = {
      userId: auth.user.id,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      date: new Date(formData.date),
    };

    if (editingExpense) {
      updateExpense(editingExpense.id, expenseData);
    } else {
      addExpense(expenseData);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
    setEditingExpense(null);
    setIsModalOpen(false);
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
      amount: expense.amount.toString(),
      category: expense.category,
      description: expense.description,
      date: new Date(expense.date).toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const handleDelete = (expenseId: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(expenseId);
    }
  };

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('expenses')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your expenses and track spending patterns
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          {t('addExpense')}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatAmount(totalExpenses)}
            </p>
            <p className="text-gray-600 dark:text-gray-400">Total Filtered</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {filteredExpenses.length}
            </p>
            <p className="text-gray-600 dark:text-gray-400">Transactions</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatAmount(filteredExpenses.length > 0 ? (totalExpenses / filteredExpenses.length) : 0)}
            </p>
            <p className="text-gray-600 dark:text-gray-400">Average</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end">
          <div className="flex-1">
            <Input
              placeholder={t('search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">{t('all')} Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Expenses List */}
      <div className="space-y-4">
        {filteredExpenses.length > 0 ? (
          filteredExpenses
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((expense) => {
              const category = categories.find(c => c.id === expense.category);
              return (
                <Card key={expense.id}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                      <div 
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-white font-semibold flex-shrink-0"
                        style={{ backgroundColor: category?.color || '#6B7280' }}
                      >
                        {category?.icon || '📦'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {expense.description}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {category?.name} • {new Date(expense.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end space-x-4 sm:ml-4">
                      <span className="text-lg font-bold text-red-600 dark:text-red-400 sm:mr-4">
                        -{formatAmount(expense.amount)}
                      </span>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(expense)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(expense.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
        ) : (
          <Card>
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Receipt className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No expenses found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Start tracking your expenses by adding your first transaction.
              </p>
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                {t('addExpense')}
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={resetForm}
        title={editingExpense ? t('editExpense') : t('addExpense')}
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

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('category')}
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              required
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            type="text"
            label={t('description')}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            required
            placeholder="What did you spend on?"
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
              {editingExpense ? t('save') : t('add')}
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

export default Expenses;