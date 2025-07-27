import React, { useState } from 'react';
import { Plus, Target, Calendar, Users, Edit, Trash2, CheckCircle } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { Goal } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import { Card, CardHeader, CardContent } from '../ui/Card';

const Goals: React.FC = () => {
  const { goals, addGoal, updateGoal, deleteGoal } = useData();
  const { auth, getAllUsers } = useAuth();
  const { t } = useLanguage();
  const { formatAmount } = useCurrency();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    currentAmount: '',
    dueDate: '',
    assignedTo: [] as string[],
  });

  const users = getAllUsers();
  const activeGoals = goals.filter(goal => goal.currentAmount < goal.targetAmount);
  const completedGoals = goals.filter(goal => goal.currentAmount >= goal.targetAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!auth.user) return;
    
    const goalData = {
      title: formData.title,
      description: formData.description,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount) || 0,
      dueDate: new Date(formData.dueDate),
      assignedTo: formData.assignedTo,
      createdBy: auth.user.id,
    };

    if (editingGoal) {
      updateGoal(editingGoal.id, goalData);
    } else {
      addGoal(goalData);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      targetAmount: '',
      currentAmount: '',
      dueDate: '',
      assignedTo: [],
    });
    setEditingGoal(null);
    setIsModalOpen(false);
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      dueDate: new Date(goal.dueDate).toISOString().split('T')[0],
      assignedTo: goal.assignedTo,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (goalId: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      deleteGoal(goalId);
    }
  };

  const handleAssignedToChange = (userId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      assignedTo: checked
        ? [...prev.assignedTo, userId]
        : prev.assignedTo.filter(id => id !== userId)
    }));
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('goals')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Set and track your financial goals together
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          {t('addGoal')}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {activeGoals.length}
            </p>
            <p className="text-gray-600 dark:text-gray-400">{t('activeGoals')}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {completedGoals.length}
            </p>
            <p className="text-gray-600 dark:text-gray-400">{t('completed')}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {goals.length}
            </p>
            <p className="text-gray-600 dark:text-gray-400">Total Goals</p>
          </div>
        </Card>
      </div>

      {/* Goals List */}
      <div className="space-y-6">
        {/* Active Goals */}
        {activeGoals.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Active Goals
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {activeGoals.map((goal) => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100;
                const daysLeft = Math.ceil((new Date(goal.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                
                return (
                  <Card key={goal.id}>
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-2 sm:space-y-0">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {goal.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {goal.description}
                          </p>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(goal)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(goal.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">{t('progress')}</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {progress.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                          <span>{formatAmount(goal.currentAmount)}</span>
                          <span>{formatAmount(goal.targetAmount)}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm space-y-2 sm:space-y-0">
                        <div className="flex items-center space-x-2 flex-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {goal.assignedTo.length} assigned
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Completed Goals
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {completedGoals.map((goal) => (
                <Card key={goal.id} className="opacity-75">
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-2 sm:space-y-0">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {goal.title}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {goal.description}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(goal.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {formatAmount(goal.currentAmount)}
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        Goal Achieved!
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {goals.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Target className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No goals yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Start planning your financial future by setting your first goal.
              </p>
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                {t('addGoal')}
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={resetForm}
        title={editingGoal ? 'Edit Goal' : t('addGoal')}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            label={t('goalTitle')}
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
            placeholder="e.g., Emergency Fund, Vacation, New Car"
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('description')}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Describe your goal..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="number"
              step="0.01"
              label={t('targetAmount')}
              value={formData.targetAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
              required
              placeholder="0.00"
            />

            <Input
              type="number"
              step="0.01"
              label="Current Amount"
              value={formData.currentAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, currentAmount: e.target.value }))}
              placeholder="0.00"
            />
          </div>

          <Input
            type="date"
            label={t('dueDate')}
            value={formData.dueDate}
            onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
            required
            icon={<Calendar className="w-4 h-4 text-gray-400" />}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('assignTo')}
            </label>
            <div className="space-y-2">
              {users.map((user) => (
                <label key={user.id} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.assignedTo.includes(user.id)}
                    onChange={(e) => handleAssignedToChange(user.id, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-900 dark:text-white">
                    {user.name} ({user.email})
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingGoal ? t('save') : t('add')}
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

export default Goals;