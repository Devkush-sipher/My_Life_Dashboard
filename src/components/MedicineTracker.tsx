import React, { useState } from 'react';
import { Plus, Trash2, Pill, Clock, Calendar } from 'lucide-react';
import { Medicine } from '../types';

interface MedicineTrackerProps {
  medicines: Medicine[];
  onMedicinesChange: (medicines: Medicine[]) => void;
}

export default function MedicineTracker({ medicines, onMedicinesChange }: MedicineTrackerProps) {
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    dosage: '',
    timing: 'before-meal' as const,
    frequency: '',
    notes: ''
  });

  const addMedicine = () => {
    if (!newMedicine.name || !newMedicine.dosage || !newMedicine.frequency) return;

    const medicine: Medicine = {
      id: Date.now().toString(),
      name: newMedicine.name,
      dosage: newMedicine.dosage,
      timing: newMedicine.timing,
      frequency: newMedicine.frequency,
      notes: newMedicine.notes || undefined,
      isActive: true
    };

    onMedicinesChange([...medicines, medicine]);
    setNewMedicine({
      name: '',
      dosage: '',
      timing: 'before-meal',
      frequency: '',
      notes: ''
    });
  };

  const toggleMedicineStatus = (id: string) => {
    onMedicinesChange(medicines.map(medicine => 
      medicine.id === id ? { ...medicine, isActive: !medicine.isActive } : medicine
    ));
  };

  const deleteMedicine = (id: string) => {
    onMedicinesChange(medicines.filter(medicine => medicine.id !== id));
  };

  const getTimingColor = (timing: string) => {
    switch (timing) {
      case 'before-meal': return 'bg-blue-100 text-blue-800';
      case 'after-meal': return 'bg-green-100 text-green-800';
      case 'with-meal': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimingText = (timing: string) => {
    switch (timing) {
      case 'before-meal': return 'Before Meal';
      case 'after-meal': return 'After Meal';
      case 'with-meal': return 'With Meal';
      default: return timing;
    }
  };

  const activeMedicines = medicines.filter(medicine => medicine.isActive);
  const inactiveMedicines = medicines.filter(medicine => !medicine.isActive);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Pill className="text-blue-600" size={32} />
        <h1 className="text-3xl font-bold text-gray-800">Medicine Tracker</h1>
      </div>

      {/* Add New Medicine */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Medicine</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            placeholder="Medicine name"
            value={newMedicine.name}
            onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Dosage (e.g., 500mg)"
            value={newMedicine.dosage}
            onChange={(e) => setNewMedicine({ ...newMedicine, dosage: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={newMedicine.timing}
            onChange={(e) => setNewMedicine({ ...newMedicine, timing: e.target.value as any })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="before-meal">Before Meal</option>
            <option value="after-meal">After Meal</option>
            <option value="with-meal">With Meal</option>
          </select>
          <input
            type="text"
            placeholder="Frequency (e.g., 2x daily)"
            value={newMedicine.frequency}
            onChange={(e) => setNewMedicine({ ...newMedicine, frequency: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Additional notes (optional)"
            value={newMedicine.notes}
            onChange={(e) => setNewMedicine({ ...newMedicine, notes: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
          />
        </div>
        <button
          onClick={addMedicine}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add Medicine</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Active Medicines</h3>
              <p className="text-3xl font-bold">{activeMedicines.length}</p>
            </div>
            <Pill size={32} className="opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Inactive</h3>
              <p className="text-3xl font-bold">{inactiveMedicines.length}</p>
            </div>
            <Clock size={32} className="opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Total</h3>
              <p className="text-3xl font-bold">{medicines.length}</p>
            </div>
            <Calendar size={32} className="opacity-80" />
          </div>
        </div>
      </div>

      {/* Active Medicines */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Active Medicines</h3>
        {activeMedicines.length === 0 ? (
          <div className="text-center py-8">
            <Pill className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No active medicines</h3>
            <p className="text-gray-500">Add medicines to track your medication schedule.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeMedicines.map((medicine) => (
              <div key={medicine.id} className="border border-green-200 bg-green-50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 text-lg">{medicine.name}</h4>
                    <p className="text-gray-600">{medicine.dosage}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleMedicineStatus(medicine.id)}
                      className="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                    >
                      Deactivate
                    </button>
                    <button
                      onClick={() => deleteMedicine(medicine.id)}
                      className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTimingColor(medicine.timing)}`}>
                    {getTimingText(medicine.timing)}
                  </span>
                  <span className="text-sm text-gray-600 flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{medicine.frequency}</span>
                  </span>
                </div>
                {medicine.notes && (
                  <p className="text-sm text-gray-600 mt-2">{medicine.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inactive Medicines */}
      {inactiveMedicines.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Inactive Medicines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inactiveMedicines.map((medicine) => (
              <div key={medicine.id} className="border border-gray-200 bg-gray-50 rounded-lg p-4 opacity-75">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-600 text-lg">{medicine.name}</h4>
                    <p className="text-gray-500">{medicine.dosage}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleMedicineStatus(medicine.id)}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm hover:bg-green-200 transition-colors"
                    >
                      Activate
                    </button>
                    <button
                      onClick={() => deleteMedicine(medicine.id)}
                      className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTimingColor(medicine.timing)}`}>
                    {getTimingText(medicine.timing)}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{medicine.frequency}</span>
                  </span>
                </div>
                {medicine.notes && (
                  <p className="text-sm text-gray-500 mt-2">{medicine.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}