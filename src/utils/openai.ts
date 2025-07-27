import OpenAI from 'openai';

interface FinancialData {
  totalExpenses: number;
  totalSavings: number;
  savingsRate: number;
  topCategories: [string, number][];
  period: string;
  goalsCount: number;
  activeGoals: number;
}

interface AIAdvice {
  category: string;
  advice: string;
  priority: 'high' | 'medium' | 'low';
  savings_potential: number;
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, use a backend service
});

// Real OpenAI service for financial advice
export const generateFinancialAdvice = async (data: FinancialData): Promise<AIAdvice[]> => {
  try {
    // Prepare financial data summary for OpenAI
    const topCategoriesText = data.topCategories
      .map(([category, amount]) => `${category}: $${amount.toFixed(2)} (${((amount/data.totalExpenses)*100).toFixed(1)}%)`)
      .join(', ');

    const prompt = `
As a professional financial advisor, analyze this user's financial data and provide 3-5 specific, actionable pieces of advice:

Financial Summary:
- Total Expenses (${data.period}): $${data.totalExpenses.toFixed(2)}
- Total Savings (${data.period}): $${data.totalSavings.toFixed(2)}
- Savings Rate: ${data.savingsRate.toFixed(1)}%
- Top Spending Categories: ${topCategoriesText}
- Total Goals: ${data.goalsCount}
- Active Goals: ${data.activeGoals}

Please provide advice in this exact JSON format:
[
  {
    "category": "Category Name",
    "advice": "Specific actionable advice with concrete steps",
    "priority": "high|medium|low",
    "savings_potential": estimated_dollar_amount
  }
]

Focus on:
1. Savings rate optimization (ideal is 20%)
2. Category-specific spending reduction tips
3. Emergency fund building (3-6 months expenses)
4. Goal setting and achievement strategies
5. Practical money-saving techniques

Make advice specific, actionable, and include dollar amounts where possible.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional financial advisor specializing in personal finance, budgeting, and savings strategies. Provide practical, actionable advice based on spending data."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    const response = completion.choices[0]?.message?.content;
    
    if (response) {
      try {
        // Clean the response by removing markdown code block delimiters
        const cleanedResponse = response
          .replace(/^```json\s*/, '')  // Remove opening ```json
          .replace(/\s*```$/, '')      // Remove closing ```
          .trim();
        
        // Parse the cleaned JSON response from OpenAI
        const aiAdvice = JSON.parse(cleanedResponse);
        return Array.isArray(aiAdvice) ? aiAdvice : [];
      } catch (parseError) {
        console.error('Error parsing OpenAI response:', parseError);
        // Fall back to extracting advice from text response
        return parseTextResponse(response, data);
      }
    }
    
    return getFallbackAdvice(data);
    
  } catch (error) {
    console.error('OpenAI API Error:', error);
    // Return fallback advice if OpenAI fails
    return getFallbackAdvice(data);
  }
};

// Fallback advice when OpenAI is unavailable
const getFallbackAdvice = (data: FinancialData): AIAdvice[] => {
  const advice: AIAdvice[] = [];

  if (data.savingsRate < 10) {
    advice.push({
      category: 'Savings Rate',
      advice: `Your savings rate of ${data.savingsRate.toFixed(1)}% is below the recommended 20%. Start by automating $50-100 weekly transfers to savings. Even small amounts compound over time.`,
      priority: 'high',
      savings_potential: data.totalExpenses * 0.15
    });
  }

  if (data.topCategories.length > 0) {
    const [topCategory, topAmount] = data.topCategories[0];
    const percentage = (topAmount / data.totalExpenses) * 100;
    
    if (percentage > 30) {
      advice.push({
        category: topCategory.charAt(0).toUpperCase() + topCategory.slice(1),
        advice: `${topCategory} represents ${percentage.toFixed(1)}% of your spending. Consider setting a monthly budget limit and look for cost-saving alternatives.`,
        priority: percentage > 50 ? 'high' : 'medium',
        savings_potential: topAmount * 0.2
      });
    }
  }

  if (data.goalsCount === 0) {
    advice.push({
      category: 'Financial Goals',
      advice: 'Setting clear financial goals increases saving success by 42%. Start with an emergency fund goal of $1,000, then work toward 3-6 months of expenses.',
      priority: 'medium',
      savings_potential: data.totalExpenses * 0.25
    });
  }

  advice.push({
    category: 'Emergency Fund',
    advice: `Build an emergency fund covering 3-6 months of expenses ($${(data.totalExpenses * 3).toFixed(0)} - $${(data.totalExpenses * 6).toFixed(0)}). This protects you from unexpected costs and reduces financial stress.`,
    priority: 'high',
    savings_potential: data.totalExpenses * 2
  });

  // Seasonal and behavioral advice
  const currentMonth = new Date().getMonth();
  if (currentMonth === 11 || currentMonth === 0) { // December or January
    advice.push({
      category: 'Holiday Spending',
      advice: 'Holiday season can strain budgets. Set a gift budget, consider homemade gifts, and start saving for next year\'s holidays now. Even $20/month saves $240 for next year.',
      priority: 'medium',
      savings_potential: data.totalExpenses * 0.1
    });
  }

  return advice.slice(0, 5); // Return top 5 pieces of advice
};

// Parse text response when JSON parsing fails
const parseTextResponse = (response: string, data: FinancialData): AIAdvice[] => {
  // Simple text parsing fallback
  const advice: AIAdvice[] = [];
  
  // Split response into sections and try to extract advice
  const sections = response.split('\n').filter(line => line.trim().length > 0);
  
  sections.forEach((section, index) => {
    if (section.length > 50 && index < 4) { // Reasonable advice length
      advice.push({
        category: `Financial Tip ${index + 1}`,
        advice: section.trim(),
        priority: index === 0 ? 'high' : index === 1 ? 'medium' : 'low',
        savings_potential: data.totalExpenses * (0.1 - index * 0.02)
      });
    }
  });

  return advice.length > 0 ? advice : getFallbackAdvice(data);
};

// Enhanced spending insights with AI analysis
export const getAISpendingInsights = async (expenses: any[], period: string) => {
  try {
    const expensesByDay = expenses.reduce((acc, expense) => {
      const day = new Date(expense.date).toLocaleDateString('en-US', { weekday: 'long' });
      acc[day] = (acc[day] || 0) + expense.amount;
      return acc;
    }, {});

    const expensesByCategory = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    const prompt = `
Analyze these spending patterns and provide 2-3 key insights:

Spending by Day: ${JSON.stringify(expensesByDay)}
Spending by Category: ${JSON.stringify(expensesByCategory)}
Period: ${period}
Total Expenses: $${expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}

Provide insights about spending patterns, trends, and recommendations in a brief, actionable format.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system", 
          content: "You are a financial analyst. Provide brief, actionable insights about spending patterns."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.6,
      max_tokens: 300
    });

    return completion.choices[0]?.message?.content || "Unable to generate insights at this time.";
    
  } catch (error) {
    console.error('Error generating spending insights:', error);
    return "Add more expense data to get personalized spending insights.";
  }
};

// Budget optimization suggestions
export const getBudgetOptimization = async (data: FinancialData) => {
  try {
    const prompt = `
As a budget optimization expert, suggest a realistic monthly budget based on this data:

Current Monthly Expenses: $${data.totalExpenses.toFixed(2)}
Current Savings Rate: ${data.savingsRate.toFixed(1)}%
Top Categories: ${data.topCategories.map(([cat, amt]) => `${cat}: $${amt.toFixed(2)}`).join(', ')}

Suggest:
1. Optimized budget allocation by category
2. Specific dollar amounts to cut from each category
3. Realistic savings target
4. One major change that would have the biggest impact

Keep suggestions practical and achievable.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a budget optimization specialist. Provide practical, specific budget recommendations."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 500
    });

    return completion.choices[0]?.message?.content || "Unable to generate budget optimization at this time.";
    
  } catch (error) {
    console.error('Error generating budget optimization:', error);
    return "Add more financial data to get personalized budget optimization suggestions.";
  }
};

// Function to get spending insights
export const getSpendingInsights = (expenses: any[], period: string) => {
  const insights = {
    trends: [],
    patterns: [],
    recommendations: []
  };
  
  // Add trend analysis
  if (expenses.length > 0) {
    const avgAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0) / expenses.length;
    const highSpendingDays = expenses.filter(exp => exp.amount > avgAmount * 1.5);
    
    if (highSpendingDays.length > 0) {
      insights.patterns.push(`You tend to spend more on ${highSpendingDays.map(d => new Date(d.date).toLocaleDateString('en-US', { weekday: 'long' })).join(', ')}`);
    }
  }
  
  return insights;
};