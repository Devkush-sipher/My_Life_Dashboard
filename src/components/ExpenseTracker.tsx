import React, { useState } from 'react';
import { Plus, Trash2, Edit2, PieChart, DollarSign } from 'lucide-react';
import { PieChart as Chart, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Expense, ExpenseCategory } from '../types';

interface ExpenseTrackerProps {
  expenses: Expense[];
  onExpensesChange: (expenses: Expense[]) => void;
}

const defaultCategories: ExpenseCategory[] = [
  { id: '1', name: 'Food', color: '#FF6384' },
  { id: '2', name: 'Transportation', color: '#36A2EB' },
  { id: '3', name: 'Entertainment', color: '#FFCE56' },
  { id: '4', name: 'Utilities', color: '#4BC0C0' },
  { id: '5', name: 'Healthcare', color: '#9966FF' },
  { id: '6', name: 'Shopping', color: '#FF9F40' },
];

export default function ExpenseTracker({ expenses, onExpensesChange }: ExpenseTrackerProps) {
  const [categories, setCategories] = useState<ExpenseCategory[]>(defaultCategories);
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    category: '',
    description: '',
    isPaid: false
  });
  const [newCategory, setNewCategory] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);

  const addExpense = () => {
    if (!newExpense.title || !newExpense.amount || !newExpense.category) return;

    const expense: Expense = {
      id: Date.now().toString(),
      title: newExpense.title,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      isPaid: newExpense.isPaid,
      date: new Date().toISOString(),
      description: newExpense.description || undefined
    };

    onExpensesChange([...expenses, expense]);
    setNewExpense({ title: '', amount: '', category: '', description: '', isPaid: false });
  };

  const toggleExpenseStatus = (id: string) => {
    onExpensesChange(expenses.map(expense => 
      expense.id === id ? { ...expense, isPaid: !expense.isPaid } : expense
    ));
  };

  const deleteExpense = (id: string) => {
    onExpensesChange(expenses.filter(expense => expense.id !== id));
  };

  const addCategory = () => {
    if (!newCategory.trim()) return;

    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6B6B', '#4ECDC4'];
    const category: ExpenseCategory = {
      id: Date.now().toString(),
      name: newCategory,
      color: colors[categories.length % colors.length]
    };

    setCategories([...categories, category]);
    setNewCategory('');
    setShowAddCategory(false);
  };

  const paidExpenses = expenses.filter(expense => expense.isPaid);
  const unpaidExpenses = expenses.filter(expense => !expense.isPaid);
  
  const totalPaid = paidExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalUnpaid = unpaidExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const getPieChartData = (expenseList: Expense[]) => {
    const categoryTotals: { [key: string]: number } = {};
    
    expenseList.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      name: category,
      value: amount,
      color: categories.find(cat => cat.name === category)?.color || '#8884d8'
    }));
  };

  const paidChartData = getPieChartData(paidExpenses);
  const unpaidChartData = getPieChartData(unpaidExpenses);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <DollarSign className="text-green-600" size={32} />
        <h1 className="text-3xl font-bold text-gray-800">Expense Tracker</h1>
      </div>

      {/* Add New Expense */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Expense</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            placeholder="Expense title"
            value={newExpense.title}
            onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <input
            type="number"
            placeholder="Amount"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <select
            value={newExpense.category}
            onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>{category.name}</option>
            ))}
          </select>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPaid"
              checked={newExpense.isPaid}
              onChange={(e) => setNewExpense({ ...newExpense, isPaid: e.target.checked })}
              className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
            />
            <label htmlFor="isPaid" className="text-sm text-gray-700">Paid</label>
          </div>
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Description (optional)"
            value={newExpense.description}
            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            rows={2}
          />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={addExpense}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus size={20} />
            <span>Add Expense</span>
          </button>
          <button
            onClick={() => setShowAddCategory(!showAddCategory)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>Add Category</span>
          </button>
        </div>

        {/* Add Category Form */}
        {showAddCategory && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={addCategory}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-2">Total Paid</h3>
          <p className="text-3xl font-bold">${totalPaid.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-2">Total Unpaid</h3>
          <p className="text-3xl font-bold">${totalUnpaid.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-2">Total Expenses</h3>
          <p className="text-3xl font-bold">{expenses.length}</p>
        </div>
      </div>

      {/* Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Paid Expenses Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <PieChart className="text-green-600" size={24} />
            <span>Paid Expenses by Category</span>
          </h3>
          {paidChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <Chart data={paidChartData}>
                <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                <Legend />
                {paidChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Chart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-12">No paid expenses to display</p>
          )}
        </div>

        {/* Unpaid Expenses Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <PieChart className="text-red-600" size={24} />
            <span>Unpaid Expenses by Category</span>
          </h3>
          {unpaidChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <Chart data={unpaidChartData}>
                <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                <Legend />
                {unpaidChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Chart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-12">No unpaid expenses to display</p>
          )}
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">All Expenses</h3>
        {expenses.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No expenses tracked yet</h3>
            <p className="text-gray-500">Start adding expenses to track your spending.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {expenses.slice().reverse().map((expense) => (
              <div key={expense.id} className={`border rounded-lg p-4 ${expense.isPaid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-800">{expense.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        expense.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {expense.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {expense.category}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="font-bold text-lg text-gray-800">${expense.amount.toFixed(2)}</span>
                      <span>{new Date(expense.date).toLocaleDateString()}</span>
                    </div>
                    {expense.description && (
                      <p className="text-sm text-gray-600 mt-2">{expense.description}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => toggleExpenseStatus(expense.id)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        expense.isPaid 
                          ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      Mark as {expense.isPaid ? 'Unpaid' : 'Paid'}
                    </button>
                    <button
                      onClick={() => deleteExpense(expense.id)}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}