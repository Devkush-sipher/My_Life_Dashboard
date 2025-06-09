import React from 'react';
import { 
  Home, 
  CheckSquare, 
  Timer, 
  Moon, 
  DollarSign, 
  Pill,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'todo', label: 'To-Do List', icon: CheckSquare },
  { id: 'pomodoro', label: 'Pomodoro', icon: Timer },
  { id: 'sleep', label: 'Sleep Tracker', icon: Moon },
  { id: 'expenses', label: 'Expenses', icon: DollarSign },
  { id: 'medicine', label: 'Medicine', icon: Pill },
];

export default function Sidebar({ currentPage, onPageChange, isOpen, onToggle }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-purple-900 to-indigo-900 
        text-white transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:relative lg:z-0
      `}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-bold">Life Dashboard</h1>
            <button
              onClick={onToggle}
              className="lg:hidden p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onPageChange(item.id);
                    if (window.innerWidth < 1024) onToggle();
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg
                    transition-all duration-200 text-left
                    ${isActive 
                      ? 'bg-white bg-opacity-20 text-white shadow-lg' 
                      : 'text-gray-300 hover:bg-white hover:bg-opacity-10 hover:text-white'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
      
      {/* Mobile menu button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-30 lg:hidden bg-purple-600 text-white p-3 rounded-lg shadow-lg hover:bg-purple-700 transition-colors"
      >
        <Menu size={20} />
      </button>
    </>
  );
}