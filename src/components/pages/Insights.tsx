import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  BarChart3, 
  Brain, 
  DollarSign,
  Calendar,
  Target,
  AlertTriangle,
  Lightbulb,
  RefreshCw
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { generateFinancialAdvice, getAISpendingInsights, getBudgetOptimization } from '../../utils/openai';
import Button from '../ui/Button';
import { Card, CardHeader, CardContent } from '../ui/Card';

interface AIAdvice {
  category: string;
  advice: string;
  priority: 'high' | 'medium' | 'low';
  savings_potential: number;
}

const Insights: React.FC = () => {
  const { expenses, savings, goals, categories } = useData();
  const { auth } = useAuth();
  const { t } = useLanguage();
  const { formatAmount } = useCurrency();
  
  const [aiAdvice, setAiAdvice] = useState<AIAdvice[]>([]);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [spendingInsights, setSpendingInsights] = useState<string>('');
  const [budgetOptimization, setBudgetOptimization] = useState<string>('');

  // Calculate date ranges
  const now = new Date();
  const getDateRange = (period: string) => {
    const end = new Date(now);
    const start = new Date(now);
    
    switch (period) {
      case 'week':
        start.setDate(start.getDate() - 7);
        break;
      case 'month':
        start.setMonth(start.getMonth() - 1);
        break;
      case 'quarter':
        start.setMonth(start.getMonth() - 3);
        break;
      case 'year':
        start.setFullYear(start.getFullYear() - 1);
        break;
    }
    
    return { start, end };
  };

  const { start: periodStart, end: periodEnd } = getDateRange(selectedPeriod);

  // Filter data by selected period
  const periodExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= periodStart && expenseDate <= periodEnd;
  });

  const periodSavings = savings.filter(saving => {
    const savingDate = new Date(saving.date);
    return savingDate >= periodStart && savingDate <= periodEnd;
  });

  // Calculate insights
  const totalExpenses = periodExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalSavings = periodSavings.reduce((sum, saving) => sum + saving.amount, 0);
  const averageExpense = periodExpenses.length > 0 ? totalExpenses / periodExpenses.length : 0;
  const savingsRate = totalExpenses > 0 ? (totalSavings / (totalExpenses + totalSavings)) * 100 : 0;

  // Expense by category
  const expensesByCategory = periodExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(expensesByCategory)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Monthly trend (last 6 months)
  const monthlyTrend = [];
  for (let i = 5; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    
    const monthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= monthStart && expenseDate <= monthEnd;
    });
    
    const monthSavings = savings.filter(saving => {
      const savingDate = new Date(saving.date);
      return savingDate >= monthStart && savingDate <= monthEnd;
    });
    
    monthlyTrend.push({
      month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
      expenses: monthExpenses.reduce((sum, expense) => sum + expense.amount, 0),
      savings: monthSavings.reduce((sum, saving) => sum + saving.amount, 0),
    });
  }

  // Generate AI advice
  const generateAIAdvice = async () => {
    setLoadingAdvice(true);
    
    try {
      const financialData = {
        totalExpenses,
        totalSavings,
        savingsRate,
        topCategories: topCategories.slice(0, 3),
        period: selectedPeriod,
        goalsCount: goals.length,
        activeGoals: goals.filter(g => g.currentAmount < g.targetAmount).length
      };

      // Get real AI advice from OpenAI
      const advice = await generateFinancialAdvice(financialData);
      setAiAdvice(advice);
      
      // Get additional AI insights
      if (periodExpenses.length > 0) {
        const insights = await getAISpendingInsights(periodExpenses, selectedPeriod);
        setSpendingInsights(insights);
        
        const optimization = await getBudgetOptimization(financialData);
        setBudgetOptimization(optimization);
      }
    } catch (error) {
      console.error('Error generating AI advice:', error);
    } finally {
      setLoadingAdvice(false);
    }
  };

  useEffect(() => {
    if (periodExpenses.length > 0 || periodSavings.length > 0) {
      generateAIAdvice();
    }
  }, [selectedPeriod, expenses, savings, goals]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Lightbulb className="w-4 h-4" />;
      case 'low': return <TrendingUp className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Financial Insights
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered analysis of your financial patterns and personalized advice
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="rounded-md border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <Button onClick={generateAIAdvice} loading={loadingAdvice}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Analysis
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {formatAmount(totalExpenses)}
            </p>
            <p className="text-muted-foreground">Total Expenses</p>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {formatAmount(totalSavings)}
            </p>
            <p className="text-muted-foreground">Total Savings</p>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {savingsRate.toFixed(1)}%
            </p>
            <p className="text-muted-foreground">Savings Rate</p>
            <p className="text-sm text-muted-foreground mt-1">
              Target: 20%
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {formatAmount(averageExpense)}
            </p>
            <p className="text-muted-foreground">Avg. Transaction</p>
            <p className="text-sm text-muted-foreground mt-1">
              Per expense
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending by Category */}
        <Card>
          <CardHeader>
            <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              Top Spending Categories
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCategories.map(([categoryId, amount]) => {
                const category = categories.find(c => c.id === categoryId);
                const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                
                return (
                  <div key={categoryId} className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-1 sm:space-y-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{category?.icon || '📦'}</span>
                        <span className="font-medium text-foreground text-sm sm:text-base">
                          {category?.name || categoryId}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-foreground text-sm sm:text-base">
                          {formatAmount(amount)}
                        </span>
                        <p className="text-sm text-muted-foreground">
                          {percentage.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {topCategories.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No expenses in this period
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              6-Month Trend
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyTrend.map((month, index) => {
                const maxAmount = Math.max(...monthlyTrend.map(m => Math.max(m.expenses, m.savings)));
                const expenseWidth = maxAmount > 0 ? (month.expenses / maxAmount) * 100 : 0;
                const savingsWidth = maxAmount > 0 ? (month.savings / maxAmount) * 100 : 0;
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-1 sm:space-y-0">
                      <span className="font-medium text-foreground">{month.month}</span>
                      <div className="text-right text-sm">
                        <div className="text-red-600">-{formatAmount(month.expenses)}</div>
                        <div className="text-green-600">+{formatAmount(month.savings)}</div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${expenseWidth}%` }}
                        />
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${savingsWidth}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI-Powered Advice */}
      <Card>
        <CardHeader>
          <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            AI Financial Advisor
          </h3>
          <p className="text-muted-foreground mt-1">
            Personalized recommendations based on your spending patterns
          </p>
        </CardHeader>
        <CardContent>
          {loadingAdvice ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin text-primary mr-2" />
              <span className="text-muted-foreground">Analyzing your financial data...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {aiAdvice.map((advice, index) => (
                <div
                  key={index}
                  className="p-3 sm:p-4 rounded-lg border border-border bg-card"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-2 flex-1">
                      <div className={`p-2 rounded-full ${getPriorityColor(advice.priority)}`}>
                        {getPriorityIcon(advice.priority)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground text-sm sm:text-base">
                          {advice.category}
                        </h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(advice.priority)}`}>
                          {advice.priority.toUpperCase()} PRIORITY
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs sm:text-sm text-muted-foreground">Potential Savings</p>
                      <p className="font-semibold text-green-600 text-sm sm:text-base">
                        {formatAmount(advice.savings_potential)}
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    {advice.advice}
                  </p>
                </div>
              ))}
              {aiAdvice.length === 0 && !loadingAdvice && (
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Add some expenses and savings to get personalized AI advice!
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional AI Insights */}
      {(spendingInsights || budgetOptimization) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {spendingInsights && (
            <Card>
              <CardHeader>
                <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  AI Spending Insights
                </h3>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none text-muted-foreground text-sm sm:text-base">
                  {spendingInsights.split('\n').map((line, index) => (
                    <p key={index} className="mb-2">{line}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {budgetOptimization && (
            <Card>
              <CardHeader>
                <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Budget Optimization
                </h3>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none text-muted-foreground text-sm sm:text-base">
                  {budgetOptimization.split('\n').map((line, index) => (
                    <p key={index} className="mb-2">{line}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default Insights;