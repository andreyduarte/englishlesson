import React from 'react';
import { Link } from 'react-router-dom';
import { SavedLesson } from '../types';
import { Plus, Clock, User, FileText, ChevronRight, Trash2, Pencil } from 'lucide-react';

interface LessonListProps {
  lessons: SavedLesson[];
  onDelete?: (id: string) => void;
}

export const LessonList: React.FC<LessonListProps> = ({ lessons, onDelete }) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-bold text-gray-900">All Lessons</h2>
            <p className="text-gray-500 mt-1">A history of all generated curriculums</p>
        </div>
        <Link
          to="/create"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-lg font-medium flex items-center gap-2 transition shadow-md hover:shadow-lg"
        >
          <Plus size={20} /> Create New
        </Link>
      </div>

      {lessons.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300">
          <div className="mx-auto w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-4">
            <FileText size={32} />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No lessons yet</h3>
          <p className="text-gray-500 mb-6">Start by creating your first personalized English lesson.</p>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-800"
          >
            Create Lesson <ChevronRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.slice().reverse().map((lesson) => (
            <div
              key={lesson.id}
              className="group bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 transition-all duration-200 flex flex-col"
            >
              <Link to={`/lesson/${lesson.id}`} className="p-6 pb-2 flex-grow">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-indigo-50 text-indigo-600 font-bold text-xs px-2 py-1 rounded uppercase tracking-wider">
                     Lesson {lesson.data.lesson_metadata.lesson_number}
                  </div>
                  <span className="text-gray-400 text-xs flex items-center gap-1">
                      <Clock size={12} /> {new Date(lesson.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {lesson.data.lesson_metadata.lesson_title}
                </h3>
                
                <div className="mt-auto space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                     <FileText size={14} className="text-gray-400" />
                     <span className="truncate">{lesson.topic}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                     <User size={14} className="text-gray-400" />
                     <span className="truncate">{lesson.profileSnapshot || 'Unknown Student'}</span>
                  </div>
                </div>
              </Link>
              
              <div className="p-4 border-t border-gray-50 flex justify-end gap-2">
                  <Link 
                    to={`/lesson/${lesson.id}/edit`}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition"
                    title="Edit Lesson"
                  >
                    <Pencil size={16} />
                  </Link>
                  <button 
                    onClick={() => onDelete && onDelete(lesson.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                    title="Delete Lesson"
                  >
                    <Trash2 size={16} />
                  </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};