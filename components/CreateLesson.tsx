import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link, useParams } from 'react-router-dom';
import { generateLesson, refineLesson } from '../services/geminiService';
import { SavedLesson, Student, Lesson } from '../types';
import { Loader2, Sparkles, BookOpen, User, AlertCircle, Send, Check, XCircle } from 'lucide-react';
import { LessonContent } from './LessonContent';

interface CreateLessonProps {
  students: Student[];
  lessons: SavedLesson[];
  onSave: (lesson: SavedLesson) => void;
  onUpdate?: (lesson: SavedLesson) => void;
}

export const CreateLesson: React.FC<CreateLessonProps> = ({ students, lessons, onSave, onUpdate }) => {
  const [searchParams] = useSearchParams();
  const { id: editLessonId } = useParams();
  const initialStudentId = searchParams.get('studentId') || '';
  const navigate = useNavigate();

  // --- State ---
  const [step, setStep] = useState<'input' | 'review'>('input');
  const [topic, setTopic] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState(initialStudentId);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Review State
  const [draftLesson, setDraftLesson] = useState<Lesson | null>(null);
  const [refinementInstruction, setRefinementInstruction] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [viewMode, setViewMode] = useState<'student' | 'teacher'>('student');

  // --- Effects ---
  useEffect(() => {
    if (editLessonId) {
      const existingLesson = lessons.find(l => l.id === editLessonId);
      if (existingLesson) {
        setTopic(existingLesson.topic);
        setSelectedStudentId(existingLesson.studentId);
        setDraftLesson(existingLesson.data);
        setStep('review');
      } else {
        navigate('/'); // Redirect if not found
      }
    }
  }, [editLessonId, lessons, navigate]);

  // --- Handlers ---

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const student = students.find(s => s.id === selectedStudentId);

    if (!student) {
      setError("Please select a valid student.");
      setLoading(false);
      return;
    }

    try {
      // Get last 10 lessons for this student to provide context
      const previousLessons = lessons
        .filter(l => l.studentId === student.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 9)
        .map(l => l.topic);

      const lessonData = await generateLesson(topic, student, previousLessons);
      setDraftLesson(lessonData);
      setStep('review');
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while generating the lesson.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefine = async () => {
    if (!draftLesson || !refinementInstruction.trim()) return;

    setIsRefining(true);
    setError(null);
    try {
      const updatedLesson = await refineLesson(draftLesson, refinementInstruction);
      setDraftLesson(updatedLesson);
      setRefinementInstruction(''); // Clear input after success
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refine lesson.");
    } finally {
      setIsRefining(false);
    }
  };

  const handleApprove = () => {
    if (!draftLesson) return;

    const student = students.find(s => s.id === selectedStudentId);

    if (editLessonId && onUpdate) {
      // Update existing
      const existingLesson = lessons.find(l => l.id === editLessonId);
      if (existingLesson) {
        const updatedRecord: SavedLesson = {
          ...existingLesson,
          topic, // In case topic was changed during edit context
          data: draftLesson,
          // Keep original ID and createdAt
        };
        onUpdate(updatedRecord);
        navigate(`/lesson/${existingLesson.id}`);
      }
    } else {
      // Create new
      const newLesson: SavedLesson = {
        id: crypto.randomUUID(),
        topic,
        studentId: selectedStudentId,
        profileSnapshot: student?.name || 'Unknown',
        createdAt: new Date().toISOString(),
        data: draftLesson,
      };

      onSave(newLesson);
      navigate(`/lesson/${newLesson.id}`);
    }
  };

  const handleCancel = () => {
    if (editLessonId) {
      navigate(`/lesson/${editLessonId}`);
    } else {
      setStep('input');
      setDraftLesson(null);
    }
  }

  // --- Renders ---

  if (students.length === 0) {
    return (
      <div className="max-w-lg mx-auto mt-12 text-center bg-white p-8 rounded-2xl shadow-lg border border-yellow-100">
        <div className="w-16 h-16 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Students Found</h3>
        <p className="text-gray-600 mb-6">You need to create a student profile before generating a lesson.</p>
        <Link
          to="/students/new"
          className="inline-flex items-center justify-center bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Create Student Profile
        </Link>
      </div>
    );
  }

  if (step === 'input') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-50">
          <div className="bg-indigo-600 p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Create New Lesson</h2>
            <p className="text-indigo-100">
              Select a student and a topic to generate a tailored curriculum.
            </p>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <AlertCircle size={20} />
                  <span className="font-semibold">Error:</span> {error}
                </div>
                {error.includes("API Key") && (
                  <Link to="/settings" className="text-sm underline text-red-800 hover:text-red-900 font-medium ml-7">
                    Go to Settings to configure API Key &rarr;
                  </Link>
                )}
              </div>
            )}

            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <User size={18} className="text-indigo-600" />
                  Select Student
                </label>
                <select
                  required
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white"
                >
                  <option value="" disabled>-- Choose a student --</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <BookOpen size={18} className="text-indigo-600" />
                  Topic / Theme
                </label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Business Meetings, Travel to New York, Medical Ethics"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !selectedStudentId}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-xl transition-all shadow-lg hover:shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" /> Generating Content...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} /> Generate Preview
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          Powered by Gemini 2.5 Flash
        </div>
      </div>
    );
  }

  // --- REVIEW STEP ---
  return (
    <div className="relative pb-32">
      {/* Review Header */}
      <div className="bg-gray-800 text-white p-4 rounded-t-xl flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">Reviewing Mode</span>
          <h2 className="text-lg font-bold flex items-center gap-2">
            {draftLesson?.lesson_metadata.lesson_title}
            {editLessonId && <span className="text-xs bg-white/20 px-2 py-0.5 rounded">EDITING</span>}
          </h2>
        </div>
        <div className="flex bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setViewMode('student')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition ${viewMode === 'student' ? 'bg-gray-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
          >
            Student View
          </button>
          <button
            onClick={() => setViewMode('teacher')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition ${viewMode === 'teacher' ? 'bg-gray-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
          >
            Teacher View
          </button>
        </div>
      </div>

      {/* Review Content */}
      <div className="bg-white p-6 border-x border-b border-gray-200 min-h-screen">
        {draftLesson && (
          <LessonContent
            data={draftLesson}
            viewMode={viewMode}
            onLessonChange={setDraftLesson}
          />
        )}
      </div>

      {/* Fixed Footer Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl p-4 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">

          {/* Refine Input */}
          <div className="flex-grow w-full md:w-auto flex gap-2">
            <div className="flex-grow relative">
              <textarea
                value={refinementInstruction}
                onChange={(e) => setRefinementInstruction(e.target.value)}
                placeholder="Request changes (e.g., 'Make the verbs simpler', 'Focus on software words')..."
                className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none h-12"
              />
            </div>
            <button
              onClick={handleRefine}
              disabled={isRefining || !refinementInstruction.trim()}
              className="bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 px-4 rounded-lg font-medium text-sm flex items-center gap-2 border border-gray-200 disabled:opacity-50 transition"
            >
              {isRefining ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
              Refine
            </button>
          </div>

          {/* Final Actions */}
          <div className="flex gap-3 w-full md:w-auto justify-end">
            <button
              onClick={handleCancel}
              className="text-gray-500 hover:text-red-600 px-4 py-2 font-medium text-sm flex items-center gap-1"
            >
              <XCircle size={18} /> Cancel
            </button>
            <button
              onClick={handleApprove}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg hover:shadow-green-200 flex items-center gap-2 transition transform active:scale-95"
            >
              <Check size={18} /> Approved!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};