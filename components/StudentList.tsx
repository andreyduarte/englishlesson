import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Student } from '../types';
import { Plus, User, Star, ThumbsUp, ThumbsDown, BrainCircuit, Pencil, Trash2, Eye } from 'lucide-react';
import { StudentModal } from './StudentModal';

interface StudentListProps {
  students: Student[];
  onDelete?: (id: string) => void;
}

export const StudentList: React.FC<StudentListProps> = ({ students, onDelete }) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const renderSmallStars = (count: number) => (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={12} className={i < count ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} />
      ))}
    </div>
  );

  return (
    <div className="space-y-8 relative">
      {selectedStudent && (
        <StudentModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Students</h2>
          <p className="text-gray-500 mt-1">Manage profiles to personalize your curriculum.</p>
        </div>
        <Link
          to="/students/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-lg font-medium flex items-center gap-2 transition shadow-md hover:shadow-lg"
        >
          <Plus size={20} /> Add Student
        </Link>
      </div>

      {students.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300">
          <div className="mx-auto w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-4">
            <User size={32} />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No students yet</h3>
          <p className="text-gray-500 mb-6">Create a student profile to start generating lessons.</p>
          <Link
            to="/students/new"
            className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-800"
          >
            Create Student Profile
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <div key={student.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-50 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl shrink-0 cursor-pointer" onClick={() => setSelectedStudent(student)}>
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 text-lg truncate cursor-pointer hover:text-indigo-600" onClick={() => setSelectedStudent(student)}>
                      {student.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 truncate">
                      <BrainCircuit size={12} /> {student.interests.split(',')[0] || 'General'}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                   <button onClick={() => setSelectedStudent(student)} className="text-gray-400 hover:text-indigo-600 p-1">
                      <Eye size={18} />
                   </button>
                </div>
              </div>

              <div className="p-6 space-y-4 flex-grow">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400 text-xs uppercase tracking-wide">Speaking</span>
                    {renderSmallStars(student.skills.speaking)}
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs uppercase tracking-wide">Listening</span>
                    {renderSmallStars(student.skills.listening)}
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs uppercase tracking-wide">Reading</span>
                    {renderSmallStars(student.skills.reading)}
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs uppercase tracking-wide">Writing</span>
                    {renderSmallStars(student.skills.writing)}
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                   {student.likes && (
                     <div className="flex items-center gap-2">
                       <ThumbsUp size={14} className="text-green-500" />
                       <span className="truncate">{student.likes}</span>
                     </div>
                   )}
                   {student.dislikes && (
                     <div className="flex items-center gap-2">
                       <ThumbsDown size={14} className="text-red-400" />
                       <span className="truncate">{student.dislikes}</span>
                     </div>
                   )}
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-2">
                 <Link 
                   to={`/students/edit/${student.id}`}
                   className="flex-1 py-2 flex justify-center items-center gap-1 text-gray-600 text-sm hover:bg-white hover:text-indigo-600 rounded border border-transparent hover:border-gray-200 transition"
                 >
                   <Pencil size={14} /> Edit
                 </Link>
                 <button
                   onClick={() => onDelete && onDelete(student.id)}
                   className="flex-1 py-2 flex justify-center items-center gap-1 text-gray-600 text-sm hover:bg-white hover:text-red-600 rounded border border-transparent hover:border-gray-200 transition"
                 >
                   <Trash2 size={14} /> Delete
                 </button>
              </div>
              <div className="px-4 pb-4 bg-gray-50">
                 <Link 
                   to={`/create?studentId=${student.id}`}
                   className="block w-full py-2 text-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition"
                 >
                   Generate Lesson
                 </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
