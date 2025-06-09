import React from 'react';
import { CheckSquare, Timer, Moon, DollarSign, Pill, TrendingUp } from 'lucide-react';
import { Task, PomodoroSession, SleepRecord, Expense, Medicine } from '../types';

interface DashboardProps {
  tasks: Task[];
  pomodoroSessions: PomodoroSession[];
  sleepRecords: SleepRecord[];
  expenses: Expense[];
  medicines: Medicine[];
}

export default function Dashboard({ tasks, pomodoroSessions, sleepRecords, expenses, medicines }: DashboardProps) {
  const completedTasks = tasks.filter(task => task.completed).length;
  const todaySessions = pomodoroSessions.filter(session => 
    new Date(session.completedAt).toDateString() === new Date().toDateString()
  ).length;
  
  const lastSleep = sleepRecords[sleepRecords.length - 1];
  const unpaidExpenses = expenses.filter(expense => !expense.isPaid);
  const totalUnpaid = unpaidExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const activeMedicines = medicines.filter(medicine => medicine.isActive).length;

  const stats = [
    {
      title: 'Tasks Completed',
      value: `${completedTasks}/${tasks.length}`,
      icon: CheckSquare,
      color: 'from-green-500 to-emerald-600',
      textColor: 'text-green-600'
    },
    {
      title: 'Pomodoro Sessions Today',
      value: todaySessions.toString(),
      icon: Timer,
      color: 'from-red-500 to-pink-600',
      textColor: 'text-red-600'
    },
    {
      title: 'Last Night Sleep',
      value: lastSleep ? `${(lastSleep.duration / 60).toFixed(1)}h` : 'No data',
      icon: Moon,
      color: 'from-indigo-500 to-purple-600',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Unpaid Expenses',
      value: `$${totalUnpaid.toFixed(2)}`,
      icon: DollarSign,
      color: 'from-yellow-500 to-orange-600',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Active Medicines',
      value: activeMedicines.toString(),
      icon: Pill,
      color: 'from-blue-500 to-cyan-600',
      textColor: 'text-blue-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-8">
        <TrendingUp className="text-purple-600" size={32} />
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className={`h-2 bg-gradient-to-r ${stat.color}`} />
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`${stat.textColor} group-hover:scale-110 transition-transform duration-200`} size={24} />
                </div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Recent Tasks */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Tasks</h3>
          <div className="space-y-3">
            {tasks.slice(0, 5).map((task) => (
              <div key={task.id} className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${task.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                  {task.title}
                </span>
              </div>
            ))}
            {tasks.length === 0 && (
              <p className="text-gray-500 text-sm">No tasks yet. Create your first task!</p>
            )}
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Expenses</h3>
          <div className="space-y-3">
            {expenses.slice(-5).reverse().map((expense) => (
              <div key={expense.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${expense.isPaid ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm text-gray-700">{expense.title}</span>
                </div>
                <span className="text-sm font-medium text-gray-800">${expense.amount}</span>
              </div>
            ))}
            {expenses.length === 0 && (
              <p className="text-gray-500 text-sm">No expenses tracked yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Sleep Quality Trend */}
      {sleepRecords.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Sleep Quality Trend</h3>
          <div className="flex items-center space-x-4">
            {sleepRecords.slice(-7).map((record, index) => (
              <div key={record.id} className="text-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium ${
                  record.quality >= 4 ? 'bg-green-500' : 
                  record.quality >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                }`}>
                  {record.quality}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}