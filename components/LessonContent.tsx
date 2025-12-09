import React, { useState, useEffect, useRef } from 'react';
import { Lesson, BilingualItem } from '../types';
import {
  Book, GraduationCap, MessageCircle,
  Languages, Briefcase, Clock, CheckCircle, HelpCircle
} from 'lucide-react';

interface LessonContentProps {
  data: Lesson;
  viewMode: 'student' | 'teacher';
  onLessonChange?: (lesson: Lesson) => void;
}

// --- Editable Helper Component ---
interface EditableTextProps {
  text: string;
  onSave: (newText: string) => void;
  className?: string;
  tagName?: 'div' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'li';
}

const EditableText: React.FC<EditableTextProps> = ({ text, onSave, className, tagName: Tag = 'div' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(text);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    setValue(text);
  }, [text]);

  const handleBlur = () => {
    setIsEditing(false);
    if (value !== text) {
      onSave(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      ref.current?.blur();
    }
  };

  return (
    <Tag
      ref={ref as any}
      contentEditable
      suppressContentEditableWarning
      onInput={(e: React.FormEvent<HTMLElement>) => setValue(e.currentTarget.innerText)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`outline-none transition-colors duration-200 cursor-text hover:bg-black/5 rounded px-1 -mx-1 border border-transparent focus:border-indigo-300 focus:bg-white ${className}`}
    >
      {text}
    </Tag>
  );
};


export const LessonContent: React.FC<LessonContentProps> = ({ data, viewMode, onLessonChange }) => {
  const student = data.student_book_content;
  const teacher = data.teachers_guide_content;

  // Helper to update nested state safely
  const updateLesson = (updater: (draft: Lesson) => void) => {
    if (!onLessonChange) return;
    const newLesson = JSON.parse(JSON.stringify(data)); // Deep clone for simplicity
    updater(newLesson);
    onLessonChange(newLesson);
  };

  return (
    <div className="space-y-6">
      {viewMode === 'student' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Verbs (Full Width) */}
          <div className="lg:col-span-12 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Languages className="text-emerald-500" /> Verbs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {student.verbs_header.map((verb, idx) => (
                <BilingualCard
                  key={idx}
                  item={verb}
                  bg="bg-emerald-50"
                  border="border-emerald-100"
                  onUpdate={(newItem) => updateLesson(l => l.student_book_content.verbs_header[idx] = newItem)}
                />
              ))}
            </div>
          </div>

          {/* New Words (Main Column) */}
          <div className="lg:col-span-7 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Book className="text-blue-500" /> New Words
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {student.new_words.map((word, idx) => (
                <div key={idx} className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition">
                  <EditableText
                    tagName="div"
                    text={word.english}
                    onSave={(val) => updateLesson(l => l.student_book_content.new_words[idx].english = val)}
                    className="font-semibold text-gray-900"
                  />
                  <EditableText
                    tagName="div"
                    text={word.portuguese}
                    onSave={(val) => updateLesson(l => l.student_book_content.new_words[idx].portuguese = val)}
                    className="text-gray-500 text-sm italic"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Check it out (Sidebar) */}
          <div className="lg:col-span-5 space-y-6">
            {student.check_it_out.boxes.map((box, boxIdx) => (
              <div key={boxIdx} className="bg-amber-50 rounded-xl p-6 border border-amber-100 shadow-sm">
                <h4 className="font-bold text-amber-800 mb-3 text-lg flex items-center gap-2">
                  <SparkleIcon />
                  <EditableText
                    tagName="span"
                    text={box.title}
                    onSave={(val) => updateLesson(l => l.student_book_content.check_it_out.boxes[boxIdx].title = val)}
                  />
                </h4>
                <ul className="space-y-2">
                  {box.content.map((line, lineIdx) => (
                    <li key={lineIdx} className="text-amber-900 text-sm flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                      <EditableText
                        tagName="span"
                        text={line}
                        onSave={(val) => updateLesson(l => l.student_book_content.check_it_out.boxes[boxIdx].content[lineIdx] = val)}
                        className="flex-1"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Useful Phrases */}
          <div className="lg:col-span-12 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MessageCircle className="text-pink-500" /> Useful Phrases
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {student.useful_phrases.map((phrase, idx) => (
                <BilingualCard
                  key={idx}
                  item={phrase}
                  bg="bg-pink-50"
                  border="border-pink-100"
                  onUpdate={(newItem) => updateLesson(l => l.student_book_content.useful_phrases[idx] = newItem)}
                />
              ))}
            </div>
          </div>

          {/* Grammar */}
          <div className="lg:col-span-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-indigo-100 w-24 h-24 rounded-bl-full -mr-10 -mt-10"></div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 relative z-10">
              <GraduationCap className="text-indigo-600" /> Grammar Focus
            </h3>
            <div className="mb-4">
              {student.grammar.topics.map((topic, idx) => (
                <span key={idx} className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full mr-2 font-medium">
                  <EditableText
                    tagName="span"
                    text={topic}
                    onSave={(val) => updateLesson(l => l.student_book_content.grammar.topics[idx] = val)}
                  />
                </span>
              ))}
            </div>
            <div className="space-y-3 relative z-10">
              {student.grammar.examples.map((ex, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg border-l-4 border-indigo-500">
                  <EditableText
                    tagName="div"
                    text={ex.english}
                    onSave={(val) => updateLesson(l => l.student_book_content.grammar.examples[idx].english = val)}
                    className="font-medium text-gray-900"
                  />
                  <EditableText
                    tagName="div"
                    text={ex.portuguese}
                    onSave={(val) => updateLesson(l => l.student_book_content.grammar.examples[idx].portuguese = val)}
                    className="text-gray-500 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Real Life Application */}
          <div className="lg:col-span-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Briefcase className="text-teal-600" /> Real Life Context
            </h3>
            <div className="space-y-3">
              {student.real_life.map((ex, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
                  <div className="mt-1 bg-teal-100 text-teal-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <EditableText
                      tagName="div"
                      text={ex.english}
                      onSave={(val) => updateLesson(l => l.student_book_content.real_life[idx].english = val)}
                      className="font-medium text-gray-900"
                    />
                    <EditableText
                      tagName="div"
                      text={ex.portuguese}
                      onSave={(val) => updateLesson(l => l.student_book_content.real_life[idx].portuguese = val)}
                      className="text-gray-500 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Teacher View
        <div className="grid grid-cols-1 gap-6">
          {/* Header Info */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
            <h3 className="text-lg font-bold text-indigo-900 mb-3">Lesson Objectives</h3>
            <ul className="list-disc list-inside space-y-1 text-indigo-800">
              {teacher.header_info.learning_objectives.map((obj, i) => (
                <li key={i}>
                  <EditableText
                    tagName="span"
                    text={obj}
                    onSave={(val) => updateLesson(l => l.teachers_guide_content.header_info.learning_objectives[i] = val)}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Drills Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Clock className="text-gray-600" /> Oral Drills Plan
              </h3>
            </div>

            <div className="p-6 space-y-8">
              <DrillBlock
                title="Verbs Drill"
                duration={teacher.drills.verbs_drill.duration_minutes}
                sentences={teacher.drills.verbs_drill.sentences}
                onUpdateSentences={(newSentences) => updateLesson(l => l.teachers_guide_content.drills.verbs_drill.sentences = newSentences)}
                color="emerald"
              />
              <DrillBlock
                title="Vocabulary Drill"
                duration={teacher.drills.new_words_drill.duration_minutes}
                sentences={teacher.drills.new_words_drill.sentences}
                onUpdateSentences={(newSentences) => updateLesson(l => l.teachers_guide_content.drills.new_words_drill.sentences = newSentences)}
                color="blue"
              />
              <DrillBlock
                title="Phrases Drill"
                duration={teacher.drills.useful_phrases_drill.duration_minutes}
                sentences={teacher.drills.useful_phrases_drill.sentences}
                onUpdateSentences={(newSentences) => updateLesson(l => l.teachers_guide_content.drills.useful_phrases_drill.sentences = newSentences)}
                color="pink"
              />
              <DrillBlock
                title="Grammar Drill"
                duration={teacher.drills.grammar_drill.duration_minutes}
                sentences={teacher.drills.grammar_drill.sentences}
                onUpdateSentences={(newSentences) => updateLesson(l => l.teachers_guide_content.drills.grammar_drill.sentences = newSentences)}
                color="indigo"
              />
            </div>
          </div>

          {/* Assessment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <HelpCircle className="text-orange-500" /> Assessment ({teacher.assessment.duration_minutes} min)
              </h3>
              <div className="space-y-4">
                {teacher.assessment.questions.map((q, i) => (
                  <div key={i} className="bg-orange-50 p-4 rounded-lg">
                    <div className="font-semibold text-gray-800 mb-1 flex gap-1">
                      Q:
                      <EditableText
                        tagName="span"
                        text={q.question}
                        onSave={(val) => updateLesson(l => l.teachers_guide_content.assessment.questions[i].question = val)}
                      />
                    </div>
                    <div className="text-gray-600 italic flex gap-1">
                      A:
                      <EditableText
                        tagName="span"
                        text={q.answer}
                        onSave={(val) => updateLesson(l => l.teachers_guide_content.assessment.questions[i].answer = val)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Procedures */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle className="text-green-600" /> Wrap-Up & Homework
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-2">Homework</h4>
                  <ul className="list-disc list-inside text-gray-600 text-sm">
                    {teacher.procedures.homework_instructions.map((hw, i) => (
                      <li key={i}>
                        <EditableText
                          tagName="span"
                          text={hw}
                          onSave={(val) => updateLesson(l => l.teachers_guide_content.procedures.homework_instructions[i] = val)}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-2">Skills Check</h4>
                  <div className="flex flex-wrap gap-2">
                    {teacher.procedures.skills_check.skills.map((skill, i) => (
                      <span key={i} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        <EditableText
                          tagName="span"
                          text={skill}
                          onSave={(val) => updateLesson(l => l.teachers_guide_content.procedures.skills_check.skills[i] = val)}
                        />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components for LessonContent
const BilingualCard: React.FC<{
  item: BilingualItem;
  bg: string;
  border: string;
  onUpdate?: (newItem: BilingualItem) => void;
}> = ({ item, bg, border, onUpdate }) => (
  <div className={`${bg} ${border} border p-4 rounded-lg flex flex-col justify-between h-full`}>
    <EditableText
      tagName="div"
      text={item.english}
      onSave={(val) => onUpdate?.({ ...item, english: val })}
      className="text-lg font-semibold text-gray-900 mb-1"
    />
    <EditableText
      tagName="div"
      text={item.portuguese}
      onSave={(val) => onUpdate?.({ ...item, portuguese: val })}
      className="text-gray-600"
    />
  </div>
);

const DrillBlock: React.FC<{
  title: string;
  duration: number;
  sentences: string[];
  color: string;
  onUpdateSentences?: (sentences: string[]) => void;
}> = ({ title, duration, sentences, color, onUpdateSentences }) => {
  const colorClasses: Record<string, string> = {
    emerald: 'text-emerald-700 border-emerald-200 bg-emerald-50',
    blue: 'text-blue-700 border-blue-200 bg-blue-50',
    pink: 'text-pink-700 border-pink-200 bg-pink-50',
    indigo: 'text-indigo-700 border-indigo-200 bg-indigo-50'
  };

  return (
    <div className={`border-l-4 pl-4 ${colorClasses[color].split(' ')[1].replace('border', 'border-l')}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className={`font-bold text-lg ${colorClasses[color].split(' ')[0]}`}>{title}</h4>
        <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{duration} mins</span>
      </div>
      <ul className="space-y-2">
        {sentences.map((sent, i) => (
          <li key={i} className="text-gray-700 text-sm font-mono bg-white p-2 rounded border border-gray-100 shadow-sm">
            <EditableText
              tagName="span"
              text={sent}
              onSave={(val) => {
                if (!onUpdateSentences) return;
                const newSentences = [...sentences];
                newSentences[i] = val;
                onUpdateSentences(newSentences);
              }}
              className="block w-full"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

const SparkleIcon = () => (
  <svg className="w-4 h-4 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  </svg>
);
