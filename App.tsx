import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CreateLesson } from './components/CreateLesson';
import { LessonView } from './components/LessonView';
import { LessonList } from './components/LessonList';
import { StudentList } from './components/StudentList';
import { CreateStudent } from './components/CreateStudent';
import { Settings } from './components/Settings';
import { SavedLesson, Student } from './types';
import { storageService } from './services/storageService';
import { GraduationCap, Users, BookOpen, Settings as SettingsIcon } from 'lucide-react';
import UpdateNotification from './components/UpdateNotification';

const App: React.FC = () => {
  const [lessons, setLessons] = useState<SavedLesson[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Initial Load via Service
  useEffect(() => {
    const loadedLessons = storageService.loadLessons();
    const loadedStudents = storageService.loadStudents();
    setLessons(loadedLessons);
    setStudents(loadedStudents);
    setLoaded(true);
  }, []);

  // Persistence Effects using Service
  useEffect(() => {
    if (loaded) {
      storageService.saveLessons(lessons);
    }
  }, [lessons, loaded]);

  useEffect(() => {
    if (loaded) {
      storageService.saveStudents(students);
    }
  }, [students, loaded]);

  const handleSaveLesson = (lesson: SavedLesson) => {
    setLessons(prev => [...prev, lesson]);
  };

  const handleUpdateLesson = (updatedLesson: SavedLesson) => {
    setLessons(prev => prev.map(l => l.id === updatedLesson.id ? updatedLesson : l));
  };

  const handleDeleteLesson = (id: string) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      setLessons(prev => prev.filter(l => l.id !== id));
    }
  };

  const handleSaveStudent = (student: Student) => {
    setStudents(prev => [...prev, student]);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    // Update profile snapshots in lessons for data consistency
    setLessons(prev => prev.map(l => l.studentId === updatedStudent.id ? { ...l, profileSnapshot: updatedStudent.name } : l));
  };

  const handleDeleteStudent = (id: string) => {
    if (window.confirm("Are you sure you want to delete this student? Associated lessons will maintain their history but be unlinked.")) {
      setStudents(prev => prev.filter(s => s.id !== id));
    }
  };

  // Settings Handlers
  const handleImportData = (newStudents: Student[], newLessons: SavedLesson[]) => {
    setStudents(newStudents);
    setLessons(newLessons);
  };

  const handleClearData = () => {
    setStudents([]);
    setLessons([]);
  };

  if (!loaded) return null;

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <UpdateNotification />
        {/* Navigation */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link to="/students" className="flex items-center gap-2 group">
              <div className="bg-indigo-600 p-1.5 rounded-lg text-white group-hover:bg-indigo-700 transition">
                <GraduationCap size={24} />
              </div>
              <span className="font-bold text-xl text-slate-800 tracking-tight">
                Lingua<span className="text-indigo-600">Gen</span> AI
              </span>
            </Link>
            <nav className="flex gap-6 items-center">
              <Link to="/students" className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-indigo-600 transition">
                <Users size={16} /> <span className="hidden sm:inline">Students</span>
              </Link>
              <Link to="/" className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-indigo-600 transition">
                <BookOpen size={16} /> <span className="hidden sm:inline">Lessons</span>
              </Link>
              <Link to="/settings" className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-indigo-600 transition" title="Data Settings">
                <SettingsIcon size={18} />
              </Link>
              <Link to="/create" className="text-sm font-medium bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-md hover:bg-indigo-100 transition">
                + New Lesson
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <Routes>
            <Route
              path="/"
              element={<LessonList lessons={lessons} onDelete={handleDeleteLesson} />}
            />
            <Route
              path="/students"
              element={<StudentList students={students} onDelete={handleDeleteStudent} />}
            />
            <Route
              path="/students/new"
              element={<CreateStudent students={students} onSave={handleSaveStudent} onUpdate={handleUpdateStudent} />}
            />
            <Route
              path="/students/edit/:id"
              element={<CreateStudent students={students} onSave={handleSaveStudent} onUpdate={handleUpdateStudent} />}
            />
            <Route
              path="/create"
              element={<CreateLesson students={students} lessons={lessons} onSave={handleSaveLesson} onUpdate={handleUpdateLesson} />}
            />
            <Route
              path="/lesson/:id"
              element={<LessonView lessons={lessons} />}
            />
            <Route
              path="/lesson/:id/edit"
              element={<CreateLesson students={students} lessons={lessons} onSave={handleSaveLesson} onUpdate={handleUpdateLesson} />}
            />
            <Route
              path="/settings"
              element={<Settings students={students} lessons={lessons} onImport={handleImportData} onClear={handleClearData} />}
            />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} LinguaGen AI. Personalized ESL Curriculum Generator.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;