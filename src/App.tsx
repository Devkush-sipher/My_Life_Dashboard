import React, { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TodoList from './components/TodoList';
import PomodoroTimer from './components/PomodoroTimer';
import SleepTracker from './components/SleepTracker';
import ExpenseTracker from './components/ExpenseTracker';
import MedicineTracker from './components/MedicineTracker';
import { Task, PomodoroSession, SleepRecord, Expense, Medicine } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data state using localStorage
  const [tasks, setTasks] = useLocalStorage<Task[]>('life-dashboard-tasks', []);
  const [pomodoroSessions, setPomodoroSessions] = useLocalStorage<PomodoroSession[]>('life-dashboard-pomodoro', []);
  const [sleepRecords, setSleepRecords] = useLocalStorage<SleepRecord[]>('life-dashboard-sleep', []);
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('life-dashboard-expenses', []);
  const [medicines, setMedicines] = useLocalStorage<Medicine[]>('life-dashboard-medicines', []);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            tasks={tasks}
            pomodoroSessions={pomodoroSessions}
            sleepRecords={sleepRecords}
            expenses={expenses}
            medicines={medicines}
          />
        );
      case 'todo':
        return <TodoList tasks={tasks} onTasksChange={setTasks} />;
      case 'pomodoro':
        return <PomodoroTimer sessions={pomodoroSessions} onSessionsChange={setPomodoroSessions} />;
      case 'sleep':
        return <SleepTracker sleepRecords={sleepRecords} onSleepRecordsChange={setSleepRecords} />;
      case 'expenses':
        return <ExpenseTracker expenses={expenses} onExpensesChange={setExpenses} />;
      case 'medicine':
        return <MedicineTracker medicines={medicines} onMedicinesChange={setMedicines} />;
      default:
        return <Dashboard tasks={tasks} pomodoroSessions={pomodoroSessions} sleepRecords={sleepRecords} expenses={expenses} medicines={medicines} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex">
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <main className="flex-1 lg:ml-0 min-h-screen">
        <div className="p-4 lg:p-8 pt-20 lg:pt-8">
          {renderCurrentPage()}
        </div>
      </main>
    </div>
  );
}

export default App;