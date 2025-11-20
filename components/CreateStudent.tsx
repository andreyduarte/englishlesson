import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Student, StudentSkills } from '../types';
import { User, Save, Star, ArrowLeft } from 'lucide-react';

interface CreateStudentProps {
  students?: Student[]; // Optional if only used for create, but useful for edit
  onSave: (student: Student) => void;
  onUpdate?: (student: Student) => void;
}

export const CreateStudent: React.FC<CreateStudentProps> = ({ students = [], onSave, onUpdate }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [name, setName] = useState('');
  const [interests, setInterests] = useState('');
  const [likes, setLikes] = useState('');
  const [dislikes, setDislikes] = useState('');
  
  const [skills, setSkills] = useState<StudentSkills>({
    speaking: 3,
    listening: 3,
    reading: 3,
    writing: 3
  });

  useEffect(() => {
    if (isEditMode && id) {
      const studentToEdit = students.find(s => s.id === id);
      if (studentToEdit) {
        setName(studentToEdit.name);
        setInterests(studentToEdit.interests);
        setLikes(studentToEdit.likes);
        setDislikes(studentToEdit.dislikes);
        setSkills(studentToEdit.skills);
      } else {
        navigate('/students'); // Student not found
      }
    }
  }, [id, isEditMode, students, navigate]);

  const handleSkillChange = (skill: keyof StudentSkills, value: number) => {
    setSkills(prev => ({ ...prev, [skill]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const studentData: Student = {
      id: isEditMode && id ? id : crypto.randomUUID(),
      name,
      interests,
      likes,
      dislikes,
      skills,
      createdAt: isEditMode && id 
        ? (students.find(s => s.id === id)?.createdAt || new Date().toISOString()) 
        : new Date().toISOString()
    };

    if (isEditMode && onUpdate) {
      onUpdate(studentData);
    } else {
      onSave(studentData);
    }
    navigate('/students');
  };

  const renderStars = (skill: keyof StudentSkills, value: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleSkillChange(skill, star)}
            className={`p-1 rounded-full transition-colors ${star <= value ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            <Star size={20} fill={star <= value ? "currentColor" : "none"} />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button 
        onClick={() => navigate('/students')}
        className="flex items-center text-gray-500 hover:text-gray-800 mb-4 transition"
      >
        <ArrowLeft size={18} className="mr-1" /> Back to Students
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-indigo-600 p-6 flex items-center gap-3">
          <User className="text-white" size={28} />
          <div>
            <h2 className="text-2xl font-bold text-white">
              {isEditMode ? 'Edit Student Profile' : 'New Student Profile'}
            </h2>
            <p className="text-indigo-100 text-sm">
              {isEditMode ? 'Update personalized details.' : 'Create a profile to personalize lessons.'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Student Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="e.g. John Doe"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
              <textarea
                rows={3}
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g. Technology, Travel, Cooking"
              />
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Likes</label>
                <input
                  type="text"
                  value={likes}
                  onChange={(e) => setLikes(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none"
                  placeholder="e.g. Visual learning, Games"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dislikes</label>
                <input
                  type="text"
                  value={dislikes}
                  onChange={(e) => setDislikes(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none"
                  placeholder="e.g. Long texts, Homework"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Skill Levels</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <span className="font-medium text-gray-700">Speaking</span>
                {renderStars('speaking', skills.speaking)}
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <span className="font-medium text-gray-700">Listening</span>
                {renderStars('listening', skills.listening)}
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <span className="font-medium text-gray-700">Reading</span>
                {renderStars('reading', skills.reading)}
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <span className="font-medium text-gray-700">Writing</span>
                {renderStars('writing', skills.writing)}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md hover:shadow-indigo-200"
            >
              <Save size={20} /> {isEditMode ? 'Update Profile' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
