import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SavedLesson } from '../types';
import { ArrowLeft, Book, Pencil } from 'lucide-react';
import { LessonContent } from './LessonContent';

interface LessonViewProps {
  lessons: SavedLesson[];
}

export const LessonView: React.FC<LessonViewProps> = ({ lessons }) => {
  const { id } = useParams();
  const lessonRecord = lessons.find((l) => l.id === id);
  const [viewMode, setViewMode] = useState<'student' | 'teacher'>('student');

  if (!lessonRecord) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800">Lesson not found</h2>
        <Link to="/" className="text-indigo-600 hover:underline mt-4 inline-block">Go back home</Link>
      </div>
    );
  }

  const { data } = lessonRecord;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center text-gray-600 hover:text-indigo-600 transition">
          <ArrowLeft size={20} className="mr-2" /> Back to List
        </Link>
        <div className="flex gap-3">
           <Link 
            to={`/lesson/${lessonRecord.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition shadow-sm"
           >
             <Pencil size={16} /> Edit Content
           </Link>
          <div className="flex bg-gray-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode('student')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                viewMode === 'student' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Student Book
            </button>
            <button
              onClick={() => setViewMode('teacher')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                viewMode === 'teacher' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Teacher's Guide
            </button>
          </div>
        </div>
      </div>

      {/* Title Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              Lesson {data.lesson_metadata.lesson_number}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mt-3 mb-2">{data.lesson_metadata.lesson_title}</h1>
            <p className="text-indigo-100 opacity-90">Topic: {lessonRecord.topic} • Student: {lessonRecord.profileSnapshot}</p>
          </div>
          <div className="hidden md:block opacity-20">
            <Book size={64} />
          </div>
        </div>
      </div>

      {/* Reused Content Component */}
      <LessonContent data={data} viewMode={viewMode} />
    </div>
  );
};