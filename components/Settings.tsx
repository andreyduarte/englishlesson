import React, { useRef, useState } from 'react';
import { SavedLesson, Student } from '../types';
import { storageService } from '../services/storageService';
import { Download, Upload, Trash2, Database, Check, AlertTriangle, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SettingsProps {
  students: Student[];
  lessons: SavedLesson[];
  onImport: (students: Student[], lessons: SavedLesson[]) => void;
  onClear: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ students, lessons, onImport, onClear }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleExport = () => {
    storageService.exportData(lessons, students);
    setMessage({ type: 'success', text: 'Backup file downloaded successfully.' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { students: newStudents, lessons: newLessons } = await storageService.importData(file);
      
      if (window.confirm(`Found ${newStudents.length} students and ${newLessons.length} lessons in backup. This will OVERWRITE your current data. Continue?`)) {
        onImport(newStudents, newLessons);
        setMessage({ type: 'success', text: 'Data restored successfully.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to import data. Invalid file format.' });
    }
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
    setTimeout(() => setMessage(null), 4000);
  };

  const handleClear = () => {
    if (window.confirm("DANGER: This will permanently delete ALL students and lessons. This cannot be undone. Are you sure?")) {
      storageService.clearAllData();
      onClear();
      setMessage({ type: 'success', text: 'All data has been wiped.' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Database className="text-indigo-600" /> Data Management
        </h2>
        <p className="text-gray-500 mt-1">Manage your local data, create backups, or restore from a file.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? <Check size={20} /> : <AlertTriangle size={20} />}
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-1">Backup & Restore</h3>
          <p className="text-sm text-gray-500">Save your progress to a file to use on another device or keep safe.</p>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Export */}
          <div className="bg-indigo-50 rounded-lg p-5 border border-indigo-100 flex flex-col items-center text-center gap-3">
            <div className="bg-white p-3 rounded-full shadow-sm text-indigo-600">
              <Download size={24} />
            </div>
            <div>
              <h4 className="font-bold text-indigo-900">Export Backup</h4>
              <p className="text-xs text-indigo-700 mt-1">Download JSON file</p>
            </div>
            <button 
              onClick={handleExport}
              className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium w-full transition"
            >
              Download Data
            </button>
          </div>

          {/* Import */}
          <div className="bg-emerald-50 rounded-lg p-5 border border-emerald-100 flex flex-col items-center text-center gap-3">
            <div className="bg-white p-3 rounded-full shadow-sm text-emerald-600">
              <Upload size={24} />
            </div>
            <div>
              <h4 className="font-bold text-emerald-900">Restore Backup</h4>
              <p className="text-xs text-emerald-700 mt-1">Upload JSON file</p>
            </div>
            <button 
              onClick={handleImportClick}
              className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium w-full transition"
            >
              Restore Data
            </button>
            <input 
              type="file" 
              accept=".json" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
           <div>
             <h3 className="text-lg font-bold text-red-700 flex items-center gap-2">
               <AlertTriangle size={20} /> Danger Zone
             </h3>
             <p className="text-sm text-red-600/80 mt-1">
               Permanently delete all local data. This action cannot be undone.
             </p>
           </div>
           <button 
             onClick={handleClear}
             className="bg-white border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition whitespace-nowrap"
           >
             <Trash2 size={16} /> Clear All Data
           </button>
        </div>
      </div>
      
       <div className="text-center">
          <Link to="/" className="text-gray-500 hover:text-gray-800 text-sm flex items-center justify-center gap-1">
             <RotateCcw size={14} /> Return to Dashboard
          </Link>
       </div>
    </div>
  );
};