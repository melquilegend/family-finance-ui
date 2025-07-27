import React from 'react';
import { Receipt, PiggyBank, Target, CheckSquare, TrendingUp, Calendar } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { Card, CardHeader, CardContent } from '../ui/Card';

const Dashboard: React.FC = () => {
  const { expenses, savings, goals, tasks } = useData();
  const { auth } = useAuth();
  const { t } = useLanguage();
  const { formatAmount } = useCurrency();

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });

  const totalMonthlyExpenses = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalSavings = savings.reduce((sum, saving) => sum + saving.amount, 0);
  const activeGoals = goals.filter(goal => goal.currentAmount < goal.targetAmount);
  const pendingTasks = tasks.filter(task => !task.completed);

  const stats = [
    {
      title: t('totalExpenses'),
      value: formatAmount(totalMonthlyExpenses),
      subtitle: t('thisMonth'),
      icon: Receipt,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900',
    },
    {
      title: t('totalSavings'),
      value: formatAmount(totalSavings),
      subtitle: t('allTime'),
      icon: PiggyBank,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      title: t('activeGoals'),
      value: activeGoals.length.toString(),
      subtitle: t('inProgress'),
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      title: t('pendingTasks'),
      value: pendingTasks.length.toString(),
      subtitle: t('toComplete'),
      icon: CheckSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
  ];

  const recentExpenses = expenses
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const expensesByCategory = monthlyExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('dashboard')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t('welcome')}, {auth.user?.name}! {t('financialOverview')}.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {stat.subtitle}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('recentActivity')}
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentExpenses.length > 0 ? recentExpenses.map((expense) => (
                <div key={expense.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-2 sm:space-y-0">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {expense.description}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {expense.category} • {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="font-semibold text-red-600 dark:text-red-400 text-right sm:ml-4">
                    -{formatAmount(expense.amount)}
                  </span>
                </div>
              )) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No recent expenses
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Expense Categories */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Monthly Expenses by Category
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(expensesByCategory).map(([category, amount]) => {
                const percentage = totalMonthlyExpenses > 0 ? (amount / totalMonthlyExpenses) * 100 : 0;
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between text-sm space-y-1 sm:space-y-0">
                      <span className="font-medium text-gray-900 dark:text-white capitalize">
                        {category}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {formatAmount(amount)} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {Object.keys(expensesByCategory).length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No expenses this month
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals Progress */}
      {activeGoals.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Goal Progress
            </h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeGoals.slice(0, 4).map((goal) => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100;
                return (
                  <div key={goal.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {goal.title}
                      </h4>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatAmount(goal.currentAmount)} of {formatAmount(goal.targetAmount)}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;