# 📊 Tracklytic - Personal Productivity Tracker

<div align="center">

![Tracklytic Logo](https://github.com/user-attachments/assets/729718fb-f7a0-4a67-89ae-3dbc34549537)

**A comprehensive productivity tracking application that helps you build better habits, manage finances, and track your progress**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

[✨ Live Demo](https://tracklytic.vercel.app/)  • [🐛 Report Bug](https://github.com/iaadi4/Tracklytic/issues) • [💡 Request Feature](https://github.com/iaadi4/Tracklytic/issues)

</div>

---

## 🌟 Features

<table>
<tr>
<td width="50%">

### 🎯 **Habit Tracking**
- Create and monitor personal habits
- Set goals and track progress
- Visual progress indicators
- Monthly/yearly insights

### 📊 **Budget Management**
- Set financial goals
- Monitor savings progress
- Track spending patterns
- Goal completion status

</td>
<td width="50%">

### 📅 **Attendance Management**
- Track class/event attendance
- Completion status monitoring
- Progress visualization
- Historical data tracking

### 💰 **Expense Management**
- Record monthly expenses
- Categorize spending
- Monthly insights
- Expense analytics

</td>
</tr>
</table>

### 🔐 **Additional Features**
- **Secure Authentication** with Better Auth
- **Responsive Design** built with Tailwind CSS and shadcn/ui
- **Modern UI/UX** with clean, intuitive interface
- **Real-time Updates** with TanStack Query
- **Email Notifications** via SendGrid

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have:
- ![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js) Node.js 18 or higher
- ![npm](https://img.shields.io/badge/npm-yarn-red?style=flat-square&logo=npm) npm, yarn, or pnpm
- ![Database](https://img.shields.io/badge/Database-PostgreSQL%2FMySQL%2FSQLite-blue?style=flat-square) Database (PostgreSQL recommended)

### 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/iaadi4/Tracklytic.git
   cd tracklytic
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   
   Create `.env` file in the root directory:
   ```env
   # 🔐 Authentication
   BETTER_AUTH_SECRET=BsFFyNBDv9YyJy12hXGFzJMRfL9C2uAQ
   BETTER_AUTH_URL=http://localhost:3000
   
   # 🗄️ Database
   DATABASE_URL="postgresql://username:password@localhost:5432/tracklytic"
   
   # 📧 Email Service
   SENDGRID_API_KEY="your-sendgrid-api-key"
   ```

4. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   🎉 **That's it!** Open [http://localhost:3000](http://localhost:3000) to see Tracklytic in action.

---

## 🛠️ Tech Stack

<div align="center">

| Category | Technology |
|----------|------------|
| **Frontend** | ![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=flat-square&logo=typescript) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css) |
| **Backend** | ![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma) ![Better Auth](https://img.shields.io/badge/Better-Auth-orange?style=flat-square) |
| **Database** | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat-square&logo=postgresql) ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql) ![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite) |
| **State Management** | ![TanStack Query](https://img.shields.io/badge/TanStack-Query-FF4154?style=flat-square) |
| **Email Service** | ![SendGrid](https://img.shields.io/badge/SendGrid-1A82E2?style=flat-square&logo=sendgrid) |
| **UI Components** | ![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-black?style=flat-square) |

</div>

---

## 📁 Project Structure

```
tracklytic/
├── 📱 app/
│   ├── 🔌 api/                  # REST API endpoints
│   │   ├── attendance/          # Attendance tracking
│   │   ├── auth/               # Authentication routes
│   │   ├── budget/             # Budget management
│   │   ├── expense/            # Expense tracking
│   │   ├── habits/             # Habit tracking
│   │   └── settings/           # User settings
│   ├── 🔐 (auth)/              # Authentication pages
│   └── 🛠️ (tools)/             # Main application pages
├── 🧩 components/              # Reusable UI components
├── 📚 lib/                     # Utilities and configurations
├── 🗄️ prisma/                  # Database schema
└── 📦 node_modules/            # Dependencies
```

---

## 🔗 API Reference

### 🔐 Authentication
All protected endpoints require a valid user session.

<details>
<summary><strong>👤 User Management</strong></summary>

- `GET /api/settings` - Get user profile information

</details>

<details>
<summary><strong>🎯 Habit Tracking</strong></summary>

- `POST /api/habits` - Create or update habits
- `GET /api/habits` - Retrieve all user habits
- `DELETE /api/habits` - Delete a specific habit

</details>

<details>
<summary><strong>📅 Attendance Tracking</strong></summary>

- `POST /api/attendance` - Create or update attendance records
- `GET /api/attendance` - Get all attendance records
- `DELETE /api/attendance` - Delete an attendance record

</details>

<details>
<summary><strong>💰 Budget Management</strong></summary>

- `POST /api/budget` - Create or update budget trackers
- `GET /api/budget` - Get all budget trackers
- `DELETE /api/budget` - Delete a budget tracker

</details>

<details>
<summary><strong>💸 Expense Management</strong></summary>

- `POST /api/expense` - Create or update expenses
- `GET /api/expense` - Get monthly expenses
- `DELETE /api/expense` - Delete an expense record

</details>

---

## 🗄️ Database Schema

Our database is designed with performance and data integrity in mind:

### 🔑 Key Features
- **UUID Primary Keys** for enhanced security
- **Foreign Key Constraints** with cascading deletes
- **Indexed Fields** for optimal query performance
- **Unique Constraints** to prevent data duplication

### 📊 Core Models
- **User** - Primary user entity with authentication
- **Session & Account** - Better Auth session management
- **Habit & HabitTracker** - Habit definitions and progress
- **Attendance** - Class/event attendance tracking
- **Budget** - Financial goal setting and monitoring
- **Expenses** - Monthly expense categorization
- **Verification** - Email verification and password reset

---

## 🤝 Contributing

We love contributions! Here's how you can help make Tracklytic better:

### 🚀 Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/Tracklytic.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Write clean, documented code
   - Follow the existing code style
   - Add tests if applicable

4. **Commit your changes**
   ```bash
   git commit -m 'feat: add amazing feature'
   ```

5. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**

### 📝 Contribution Guidelines

- **Code Style**: We use TypeScript and follow consistent patterns
- **API Design**: Maintain consistent response formats and error handling
- **UI/UX**: Follow the existing design system using Tailwind CSS
- **Testing**: Add tests for new features when applicable
- **Documentation**: Update README and add comments for complex logic

### 🐛 Found a Bug?
[Create an issue](https://github.com/iaadi4/Tracklytic/issues/new?assignees=&labels=bug&template=bug_report.md) with detailed steps to reproduce.

### 💡 Have an Idea?
[Request a feature](https://github.com/iaadi4/Tracklytic/issues/new?assignees=&labels=enhancement&template=feature_request.md) and let's discuss it!

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | 🚀 Start development server |
| `npm run build` | 🏗️ Build for production |
| `npm run start` | ▶️ Start production server |
| `npm run lint` | 🔍 Run ESLint |
| `npm run type-check` | ✅ Run TypeScript compiler |


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/iaadi4/Tracklytic/blob/main/LICENSE) file for details.

<div align="center">

**Made with ❤️**

⭐ **Star this repo if you find it helpful!** ⭐

</div>
