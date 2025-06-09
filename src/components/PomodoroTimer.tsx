import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Timer as TimerIcon, BarChart3 } from 'lucide-react';
import { PomodoroSession } from '../types';

interface PomodoroTimerProps {
  sessions: PomodoroSession[];
  onSessionsChange: (sessions: PomodoroSession[]) => void;
}

export default function PomodoroTimer({ sessions, onSessionsChange }: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState<'work' | 'short-break' | 'long-break'>('work');
  const [completedSessions, setCompletedSessions] = useState(0);

  const sessionTimes = {
    work: 25 * 60,
    'short-break': 5 * 60,
    'long-break': 15 * 60
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Session completed
      const session: PomodoroSession = {
        id: Date.now().toString(),
        type: sessionType,
        duration: sessionTimes[sessionType],
        completedAt: new Date().toISOString()
      };
      
      onSessionsChange([...sessions, session]);
      setIsActive(false);
      
      if (sessionType === 'work') {
        setCompletedSessions(prev => prev + 1);
        // Auto switch to break
        const nextType = completedSessions > 0 && (completedSessions + 1) % 4 === 0 ? 'long-break' : 'short-break';
        setSessionType(nextType);
        setTimeLeft(sessionTimes[nextType]);
      } else {
        // Switch back to work
        setSessionType('work');
        setTimeLeft(sessionTimes.work);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, sessionType, sessions, onSessionsChange, completedSessions]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(sessionTimes[sessionType]);
  };

  const switchSession = (type: 'work' | 'short-break' | 'long-break') => {
    setSessionType(type);
    setTimeLeft(sessionTimes[type]);
    setIsActive(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const todaySessions = sessions.filter(session => 
    new Date(session.completedAt).toDateString() === new Date().toDateString()
  );

  const workSessions = todaySessions.filter(session => session.type === 'work').length;
  const breakSessions = todaySessions.filter(session => session.type !== 'work').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <TimerIcon className="text-red-600" size={32} />
        <h1 className="text-3xl font-bold text-gray-800">Pomodoro Timer</h1>
      </div>

      {/* Timer Display */}
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className={`inline-flex rounded-lg p-1 ${
            sessionType === 'work' ? 'bg-red-100' : 'bg-green-100'
          }`}>
            <button
              onClick={() => switchSession('work')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                sessionType === 'work' ? 'bg-red-500 text-white' : 'text-red-600 hover:bg-red-50'
              }`}
            >
              Work
            </button>
            <button
              onClick={() => switchSession('short-break')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                sessionType === 'short-break' ? 'bg-green-500 text-white' : 'text-green-600 hover:bg-green-50'
              }`}
            >
              Short Break
            </button>
            <button
              onClick={() => switchSession('long-break')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                sessionType === 'long-break' ? 'bg-blue-500 text-white' : 'text-blue-600 hover:bg-blue-50'
              }`}
            >
              Long Break
            </button>
          </div>
        </div>

        <div className={`text-8xl font-bold mb-8 ${
          sessionType === 'work' ? 'text-red-500' : 'text-green-500'
        }`}>
          {formatTime(timeLeft)}
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={toggleTimer}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-white font-medium transition-colors ${
              isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isActive ? <Pause size={20} /> : <Play size={20} />}
            <span>{isActive ? 'Pause' : 'Start'}</span>
          </button>
          <button
            onClick={resetTimer}
            className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-gray-500 text-white font-medium hover:bg-gray-600 transition-colors"
          >
            <RotateCcw size={20} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Today's Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Work Sessions</h3>
              <p className="text-3xl font-bold">{workSessions}</p>
            </div>
            <BarChart3 size={32} className="opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Break Sessions</h3>
              <p className="text-3xl font-bold">{breakSessions}</p>
            </div>
            <BarChart3 size={32} className="opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Total Focus</h3>
              <p className="text-3xl font-bold">{Math.round(workSessions * 25)}m</p>
            </div>
            <TimerIcon size={32} className="opacity-80" />
          </div>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Sessions</h3>
        <div className="space-y-3">
          {todaySessions.slice(-5).reverse().map((session) => (
            <div key={session.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  session.type === 'work' ? 'bg-red-500' : 'bg-green-500'
                }`} />
                <span className="text-sm text-gray-700 capitalize">
                  {session.type.replace('-', ' ')} Session
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(session.completedAt).toLocaleTimeString()}
              </span>
            </div>
          ))}
          {todaySessions.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">No sessions completed today yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}