import { SavedLesson, Student } from "../types";

const STORAGE_KEYS = {
  LESSONS: 'linguaGenLessons',
  STUDENTS: 'linguaGenStudents'
};

export const storageService = {
  saveLessons: (lessons: SavedLesson[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(lessons));
    } catch (error) {
      console.error("Failed to save lessons to local storage", error);
      alert("Storage quota exceeded. Please delete old lessons.");
    }
  },

  loadLessons: (): SavedLesson[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LESSONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Failed to load lessons", error);
      return [];
    }
  },

  saveStudents: (students: Student[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    } catch (error) {
      console.error("Failed to save students", error);
      alert("Storage quota exceeded.");
    }
  },

  loadStudents: (): Student[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Failed to load students", error);
      return [];
    }
  },

  // Create a JSON blob for the user to download
  exportData: (lessons: SavedLesson[], students: Student[]) => {
    const data = {
      version: 1,
      timestamp: new Date().toISOString(),
      students,
      lessons
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `linguagen-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // Parse and validate imported JSON
  importData: async (file: File): Promise<{ lessons: SavedLesson[], students: Student[] }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const data = JSON.parse(text);
          
          // Basic validation
          if (!Array.isArray(data.students) || !Array.isArray(data.lessons)) {
            throw new Error("Invalid backup file format.");
          }

          resolve({
            lessons: data.lessons,
            students: data.students
          });
        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  },

  clearAllData: () => {
    localStorage.removeItem(STORAGE_KEYS.LESSONS);
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
  }
};