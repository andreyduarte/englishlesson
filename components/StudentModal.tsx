import React from 'react';
import { Student } from '../types';
import { X, User, Star, ThumbsUp, ThumbsDown, BrainCircuit, Calendar } from 'lucide-react';

interface StudentModalProps {
  student: Student;
  onClose: () => void;
}

export const StudentModal: React.FC<StudentModalProps> = ({ student, onClose }) => {
  const renderStars = (count: number) => (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={16} className={i < count ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} />
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in-up">
        <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <User size={20} /> Student Profile
          </h3>
          <button onClick={onClose} className="text-white/80 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
             <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl">
                {student.name.charAt(0).toUpperCase()}
             </div>
             <div>
                <h2 className="text-2xl font-bold text-gray-900">{student.name}</h2>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <Calendar size={12} /> Joined: {new Date(student.createdAt).toLocaleDateString()}
                </div>
             </div>
          </div>

          <div className="space-y-6">
             <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Skills Assessment</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Speaking</span>
                    {renderStars(student.skills.speaking)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Listening</span>
                    {renderStars(student.skills.listening)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Reading</span>
                    {renderStars(student.skills.reading)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Writing</span>
                    {renderStars(student.skills.writing)}
                  </div>
                </div>
             </div>

             <div className="space-y-3">
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-1">
                    <BrainCircuit size={16} className="text-indigo-500" /> Interests
                  </h4>
                  <p className="text-sm text-gray-600 bg-white p-2 rounded border border-gray-100">
                    {student.interests || "No specific interests listed."}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                     <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-1">
                        <ThumbsUp size={16} className="text-green-500" /> Likes
                      </h4>
                      <p className="text-sm text-gray-600 bg-white p-2 rounded border border-gray-100">
                        {student.likes || "N/A"}
                      </p>
                  </div>
                  <div>
                     <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-1">
                        <ThumbsDown size={16} className="text-red-400" /> Dislikes
                      </h4>
                      <p className="text-sm text-gray-600 bg-white p-2 rounded border border-gray-100">
                        {student.dislikes || "N/A"}
                      </p>
                  </div>
                </div>
             </div>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-right">
           <button 
             onClick={onClose}
             className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
           >
             Close
           </button>
        </div>
      </div>
    </div>
  );
};
