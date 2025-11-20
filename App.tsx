import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CreateLesson } from './components/CreateLesson';
import { LessonView } from './components/LessonView';
import { LessonList } from './components/LessonList';
import { StudentList } from './components/StudentList';
import { CreateStudent } from './components/CreateStudent';
import { SavedLesson, Student } from './types';
import { GraduationCap, Users, BookOpen } from 'lucide-react';

const App: React.FC = () => {
  const [lessons, setLessons] = useState<SavedLesson[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load data from local storage
  useEffect(() => {
    const savedLessons = localStorage.getItem('linguaGenLessons');
    const savedStudents = localStorage.getItem('linguaGenStudents');
    
    if (savedLessons) {
      try {
        setLessons(JSON.parse(savedLessons));
      } catch (e) {
        console.error("Failed to parse lessons", e);
      }
    }

    if (savedStudents) {
       try {
        setStudents(JSON.parse(savedStudents));
       } catch (e) {
         console.error("Failed to parse students", e);
       }
    }

    setLoaded(true);
  }, []);

  // Save data to local storage
  useEffect(() => {
    if (loaded) {
      localStorage.setItem('linguaGenLessons', JSON.stringify(lessons));
    }
  }, [lessons, loaded]);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem('linguaGenStudents', JSON.stringify(students));
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
    // Update profile snapshots in lessons for data consistency (optional but nice)
    setLessons(prev => prev.map(l => l.studentId === updatedStudent.id ? { ...l, profileSnapshot: updatedStudent.name } : l));
  };

  const handleDeleteStudent = (id: string) => {
    if (window.confirm("Are you sure you want to delete this student? Associated lessons will maintain their history but be unlinked.")) {
      setStudents(prev => prev.filter(s => s.id !== id));
    }
  };

  if (!loaded) return null;

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50">
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
            <nav className="flex gap-6">
               <Link to="/students" className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-indigo-600 transition">
                <Users size={16} /> Students
              </Link>
              <Link to="/" className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-indigo-600 transition">
                <BookOpen size={16} /> All Lessons
              </Link>
              <Link to="/create" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition">
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
              element={<CreateLesson students={students} lessons={lessons} onSave={handleSaveLesson} />} 
            />
            <Route 
              path="/lesson/:id" 
              element={<LessonView lessons={lessons} />} 
            />
            <Route 
              path="/lesson/:id/edit" 
              element={<CreateLesson students={students} lessons={lessons} onSave={handleSaveLesson} onUpdate={handleUpdateLesson} />} 
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