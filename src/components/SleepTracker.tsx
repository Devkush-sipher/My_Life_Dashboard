import React, { useState } from 'react';
import { Moon, Plus, Star, Calendar, Clock } from 'lucide-react';
import { SleepRecord } from '../types';

interface SleepTrackerProps {
  sleepRecords: SleepRecord[];
  onSleepRecordsChange: (records: SleepRecord[]) => void;
}

export default function SleepTracker({ sleepRecords, onSleepRecordsChange }: SleepTrackerProps) {
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    bedtime: '',
    wakeTime: '',
    quality: 3 as const,
    notes: ''
  });

  const addSleepRecord = () => {
    if (!newRecord.bedtime || !newRecord.wakeTime) return;

    // Calculate duration
    const bedtimeDate = new Date(`${newRecord.date}T${newRecord.bedtime}`);
    const wakeTimeDate = new Date(`${newRecord.date}T${newRecord.wakeTime}`);
    
    // If wake time is earlier than bedtime, it means next day
    if (wakeTimeDate < bedtimeDate) {
      wakeTimeDate.setDate(wakeTimeDate.getDate() + 1);
    }
    
    const duration = Math.round((wakeTimeDate.getTime() - bedtimeDate.getTime()) / (1000 * 60)); // in minutes

    const record: SleepRecord = {
      id: Date.now().toString(),
      date: newRecord.date,
      bedtime: newRecord.bedtime,
      wakeTime: newRecord.wakeTime,
      duration,
      quality: newRecord.quality,
      notes: newRecord.notes || undefined
    };

    onSleepRecordsChange([...sleepRecords, record]);
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      bedtime: '',
      wakeTime: '',
      quality: 3,
      notes: ''
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 4) return 'text-green-600 bg-green-100';
    if (quality >= 3) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const averageQuality = sleepRecords.length > 0 
    ? (sleepRecords.reduce((sum, record) => sum + record.quality, 0) / sleepRecords.length).toFixed(1)
    : '0';

  const averageDuration = sleepRecords.length > 0
    ? Math.round(sleepRecords.reduce((sum, record) => sum + record.duration, 0) / sleepRecords.length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Moon className="text-indigo-600" size={32} />
        <h1 className="text-3xl font-bold text-gray-800">Sleep Tracker</h1>
      </div>

      {/* Add New Record */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Log Sleep</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={newRecord.date}
              onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bedtime</label>
            <input
              type="time"
              value={newRecord.bedtime}
              onChange={(e) => setNewRecord({ ...newRecord, bedtime: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Wake Time</label>
            <input
              type="time"
              value={newRecord.wakeTime}
              onChange={(e) => setNewRecord({ ...newRecord, wakeTime: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quality (1-5)</label>
            <select
              value={newRecord.quality}
              onChange={(e) => setNewRecord({ ...newRecord, quality: parseInt(e.target.value) as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value={1}>1 - Very Poor</option>
              <option value={2}>2 - Poor</option>
              <option value={3}>3 - Average</option>
              <option value={4}>4 - Good</option>
              <option value={5}>5 - Excellent</option>
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
          <textarea
            value={newRecord.notes}
            onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
            placeholder="How did you sleep? Any notes..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            rows={2}
          />
        </div>
        <button
          onClick={addSleepRecord}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          <span>Log Sleep</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Average Duration</h3>
              <p className="text-3xl font-bold">{formatDuration(averageDuration)}</p>
            </div>
            <Clock size={32} className="opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Average Quality</h3>
              <p className="text-3xl font-bold">{averageQuality}/5</p>
            </div>
            <Star size={32} className="opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Total Records</h3>
              <p className="text-3xl font-bold">{sleepRecords.length}</p>
            </div>
            <Calendar size={32} className="opacity-80" />
          </div>
        </div>
      </div>

      {/* Sleep Records */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Sleep History</h3>
        {sleepRecords.length === 0 ? (
          <div className="text-center py-12">
            <Moon className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No sleep records yet</h3>
            <p className="text-gray-500">Start tracking your sleep to see patterns and improve your rest.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sleepRecords.slice().reverse().map((record) => (
              <div key={record.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h4 className="font-semibold text-gray-800">
                        {new Date(record.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getQualityColor(record.quality)}`}>
                        Quality: {record.quality}/5
                      </span>
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-gray-600 mb-2">
                      <span className="flex items-center space-x-1">
                        <Moon size={16} />
                        <span>Bedtime: {record.bedtime}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock size={16} />
                        <span>Wake: {record.wakeTime}</span>
                      </span>
                      <span className="font-medium text-indigo-600">
                        Duration: {formatDuration(record.duration)}
                      </span>
                    </div>
                    {record.notes && (
                      <p className="text-sm text-gray-700 mt-2">{record.notes}</p>
                    )}
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