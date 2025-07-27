# 💰 Family Finance Management App

A beautiful, modern family finance management application built with React, TypeScript, and Tailwind CSS. Perfect for couples and families to track expenses, manage savings, set financial goals, and stay organized together.

![Family Finance App](https://images.pexels.com/photos/6289065/pexels-photo-6289065.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

## ✨ Features

### 🔐 **Authentication & Security**
- **User Registration & Login** - Secure account creation and authentication
- **Two-Factor Authentication (2FA)** - Enhanced security with TOTP support
- **Password Reset** - Forgot password functionality with email verification
- **Profile Management** - Customizable user profiles with photo upload
- **Secure Password Hashing** - All passwords are properly hashed and stored

### 💸 **Expense Tracking**
- **Add/Edit/Delete Expenses** - Full CRUD operations for expense management
- **Category Organization** - Pre-defined categories (Groceries, Bills, Entertainment, etc.)
- **Search & Filter** - Find expenses by description, category, or date
- **Visual Analytics** - Expense breakdown by category with progress bars
- **Monthly Summaries** - Track spending patterns over time

### 🏦 **Savings Management**
- **Savings Tracking** - Record and monitor all savings deposits
- **Savings Rate Calculation** - Automatic calculation of savings percentage
- **Recommendations** - AI-powered savings suggestions based on spending
- **Goal Integration** - Link savings to specific financial goals

### 🎯 **Goal Setting**
- **Financial Goals** - Set and track progress toward financial objectives
- **Multi-User Assignment** - Assign goals to family members
- **Progress Visualization** - Beautiful progress bars and completion tracking
- **Due Date Management** - Set target dates and track deadlines
- **Goal Categories** - Emergency funds, vacations, major purchases, etc.

### ✅ **Task Management**
- **Family Tasks** - Organize financial and household tasks
- **Assignment System** - Assign tasks to specific family members
- **Due Date Tracking** - Never miss important financial deadlines
- **Completion Status** - Mark tasks as complete with visual feedback
- **Priority Management** - Organize tasks by importance

### 🧠 **AI-Powered Insights**
- **Financial Advisor** - Personalized recommendations using OpenAI
- **Spending Analysis** - AI-driven insights into spending patterns
- **Budget Optimization** - Smart suggestions for budget improvements
- **Savings Potential** - Identify areas where you can save money
- **Trend Analysis** - 6-month spending and savings trends

### 🎨 **Themes & Customization**
- **9 Beautiful Themes** - Light, Dark, Couple, Ocean, Forest, Sunset, Purple, Rose, Midnight
- **Responsive Design** - Perfect on desktop, tablet, and mobile
- **Multi-Language Support** - English and Portuguese
- **Currency Support** - USD, EUR, BRL, AOA with proper formatting
- **Profile Customization** - Upload photos, add descriptions, set preferences

### 📱 **User Experience**
- **Mobile-First Design** - Optimized for all screen sizes
- **Intuitive Navigation** - Clean, modern interface with collapsible sidebar
- **Real-Time Updates** - Instant data synchronization across the app
- **Smooth Animations** - Polished micro-interactions and transitions
- **Accessibility** - WCAG compliant with proper contrast ratios

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Modern web browser

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/family-finance-app.git
cd family-finance-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 🏗️ Tech Stack

### **Frontend**
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development with excellent IDE support
- **Vite** - Lightning-fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for rapid styling

### **UI Components**
- **Lucide React** - Beautiful, customizable icons
- **Custom Components** - Reusable Button, Input, Modal, Card components
- **Responsive Grid** - CSS Grid and Flexbox for layouts

### **State Management**
- **React Context** - Global state management for auth, theme, language
- **Custom Hooks** - Reusable logic for data fetching and state
- **Local Storage** - Persistent data storage in browser

### **AI Integration**
- **OpenAI API** - GPT-3.5-turbo for financial advice and insights
- **Smart Analytics** - AI-powered spending pattern analysis
- **Personalized Recommendations** - Context-aware financial suggestions

### **Security**
- **Password Hashing** - Secure password storage
- **TOTP 2FA** - Time-based one-time passwords
- **Input Validation** - Client-side form validation
- **XSS Protection** - Sanitized user inputs

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── layout/          # Layout components (Sidebar, etc.)
│   ├── pages/           # Main application pages
│   └── ui/              # Base UI components (Button, Input, etc.)
├── contexts/            # React Context providers
│   ├── AuthContext.tsx  # Authentication state
│   ├── DataContext.tsx  # Application data
│   ├── ThemeContext.tsx # Theme management
│   ├── LanguageContext.tsx # Internationalization
│   └── CurrencyContext.tsx # Currency formatting
├── i18n/               # Internationalization
│   └── translations.ts # Language translations
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
│   ├── storage.ts      # LocalStorage wrapper
│   ├── crypto.ts       # Encryption utilities
│   └── openai.ts       # AI integration
└── App.tsx             # Main application component
```

## 🎨 Themes

The app includes 9 carefully crafted themes:

| Theme | Description | Colors |
|-------|-------------|---------|
| **Light** | Clean, bright interface | White, grays |
| **Dark** | Easy on the eyes | Dark grays, blues |
| **Couple** | Pink & blue gradient for couples | Pink, blue gradients |
| **Ocean** | Calm blues and teals | Cyan, blue tones |
| **Forest** | Natural greens and earth tones | Greens, browns |
| **Sunset** | Warm oranges and reds | Orange, red gradients |
| **Purple** | Rich purples and violets | Purple, violet tones |
| **Rose** | Elegant pinks and roses | Rose, pink tones |
| **Midnight** | Deep blues and purples | Indigo, purple |

## 🌍 Internationalization

Currently supported languages:
- **English** (en) 🇺🇸
- **Portuguese** (pt) 🇧🇷

### Adding New Languages

1. Add translations to `src/i18n/translations.ts`
2. Update the language selector in Profile page
3. Add language option to the context

## 💱 Currency Support

Supported currencies with proper formatting:
- **USD** ($) - US Dollar 🇺🇸
- **EUR** (€) - Euro 🇪🇺
- **BRL** (R$) - Brazilian Real 🇧🇷
- **AOA** (Kz) - Angolan Kwanza 🇦🇴

## 🤖 AI Features

### OpenAI Integration
The app uses OpenAI's GPT-3.5-turbo for:
- **Financial Advice** - Personalized recommendations
- **Spending Insights** - Pattern analysis
- **Budget Optimization** - Smart suggestions
- **Savings Strategies** - Goal-oriented advice

### Setup AI Features
1. Get an OpenAI API key from [OpenAI Platform](https://platform.openai.com)
2. Add it to your `.env` file as `VITE_OPENAI_API_KEY`
3. The app will automatically provide AI insights

## 💾 Data Storage

### Current Implementation
- **LocalStorage** - Browser-based storage
- **Client-Side Only** - No server required
- **Device-Specific** - Data stays on the device

### Data Structure
```typescript
// Users
interface User {
  id: string;
  name: string;
  email: string;
  theme: Theme;
  language: Language;
  currency: Currency;
  profilePicture?: string;
  description?: string;
  createdAt: Date;
}

// Expenses
interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
  createdAt: Date;
}

// Goals
interface Goal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  dueDate: Date;
  assignedTo: string[];
  createdBy: string;
  createdAt: Date;
}
```

### Upgrading to Real Database
For production use, consider upgrading to:
- **Supabase** (PostgreSQL) - Recommended
- **Firebase** (NoSQL)
- **MongoDB Atlas**
- **PlanetScale** (MySQL)

## 🚀 Deployment

### HostGator Deployment

1. **Build the project**
```bash
npm run build
```

2. **Upload files to HostGator**
- Upload all files from `dist/` folder to `public_html/`
- Ensure `index.html` is in the root directory

3. **Configure SPA routing**
Create `.htaccess` file in `public_html/`:
```apache
RewriteEngine On
RewriteBase /

# Handle client-side routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### Other Deployment Options
- **Netlify** - Drag and drop deployment
- **Vercel** - Git-based deployment
- **GitHub Pages** - Free static hosting
- **AWS S3** - Scalable cloud hosting

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

### Code Style
- **ESLint** - Code linting and formatting
- **TypeScript** - Type checking
- **Prettier** - Code formatting (recommended)

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🐛 Troubleshooting

### Common Issues

**Build Errors**
- Ensure Node.js 18+ is installed
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`

**AI Features Not Working**
- Check OpenAI API key in `.env` file
- Verify API key has sufficient credits
- Check browser console for errors

**Theme Not Applying**
- Clear browser cache and localStorage
- Check if theme is properly selected in Profile

**Mobile Issues**
- Ensure viewport meta tag is present
- Test on actual devices, not just browser dev tools

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the troubleshooting section

## 🎯 Roadmap

### Upcoming Features
- [ ] **Real Database Integration** (Supabase/Firebase)
- [ ] **Data Export/Import** (CSV, JSON)
- [ ] **Recurring Transactions** 
- [ ] **Budget Categories & Limits**
- [ ] **Receipt Photo Upload**
- [ ] **Bank Account Integration**
- [ ] **Investment Tracking**
- [ ] **Bill Reminders**
- [ ] **Family Sharing & Permissions**
- [ ] **Advanced Reporting**
- [ ] **Mobile App** (React Native)
- [ ] **Offline Support** (PWA)

### Completed Features ✅
- [x] User Authentication & 2FA
- [x] Expense & Savings Tracking
- [x] Goal Management
- [x] Task Organization
- [x] AI-Powered Insights
- [x] Multi-Theme Support
- [x] Internationalization
- [x] Mobile Responsive Design
- [x] Profile Customization

---

## 🌟 Screenshots

### Dashboard
![Dashboard](https://images.pexels.com/photos/6289025/pexels-photo-6289025.jpeg?auto=compress&cs=tinysrgb&w=800)

### Expense Tracking
![Expenses](https://images.pexels.com/photos/6289028/pexels-photo-6289028.jpeg?auto=compress&cs=tinysrgb&w=800)

### AI Insights
![AI Insights](https://images.pexels.com/photos/8358029/pexels-photo-8358029.jpeg?auto=compress&cs=tinysrgb&w=800)

---

**Built with ❤️ for families who want to take control of their finances together.**

*Happy budgeting! 💰✨*