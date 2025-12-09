export interface BilingualItem {
  english: string;
  portuguese: string;
}

export interface GrammarExample {
  english: string;
  portuguese: string;
}

export interface GrammarSection {
  topics: string[];
  examples: GrammarExample[];
}

export interface CheckItOutBox {
  title: string;
  content: string[];
}

export interface StudentBookContent {
  verbs_header: BilingualItem[];
  new_words: BilingualItem[];
  useful_phrases: BilingualItem[];
  grammar: GrammarSection;
  real_life: BilingualItem[];
  check_it_out: {
    boxes: CheckItOutBox[];
  };
}

export interface AssessmentQuestion {
  question: string;
  answer: string;
}

export interface DrillSection {
  duration_minutes: number;
  sentences: string[];
}

export interface Drills {
  verbs_drill: DrillSection;
  new_words_drill: DrillSection;
  useful_phrases_drill: DrillSection;
  grammar_drill: DrillSection;
}

export interface TeachersGuideContent {
  header_info: {
    learning_objectives: string[];
    grammar_focus: string[];
  };
  assessment: {
    duration_minutes: number;
    questions: AssessmentQuestion[];
  };
  drills: Drills;
  procedures: {
    homework_instructions: string[];
    skills_check: {
      skills: string[];
    };
  };
}

export interface LessonMetadata {
  lesson_number: number;
  lesson_title: string;
  category?: string;
}

export interface Lesson {
  lesson_metadata: LessonMetadata;
  student_book_content: StudentBookContent;
  teachers_guide_content: TeachersGuideContent;
}

export interface StudentSkills {
  speaking: number;
  listening: number;
  reading: number;
  writing: number;
}

export interface Student {
  id: string;
  name: string;
  interests: string;
  likes: string;
  dislikes: string;
  skills: StudentSkills;
  createdAt: string;
}

export interface SavedLesson {
  id: string;
  topic: string;
  studentId: string; // Link to Student
  profileSnapshot: string; // Keep a snapshot of the profile name for display if student is deleted
  createdAt: string;
  data: Lesson;
}

declare global {
  interface Window {
    electronAPI: {
      onUpdateStatus: (callback: (status: any) => void) => void;
      restartApp: () => Promise<void>;
    };
  }
}
