import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Lesson, Student } from "../types";
import { storageService } from "./storageService";

// Define the schema using the Type enum strictly as requested
const lessonSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    lesson_metadata: {
      type: Type.OBJECT,
      properties: {
        lesson_number: { type: Type.INTEGER },
        lesson_title: { type: Type.STRING },
        category: { type: Type.STRING, description: "e.g., Input Lesson, Output Lesson" },
      },
      required: ["lesson_number", "lesson_title"],
    },
    student_book_content: {
      type: Type.OBJECT,
      properties: {
        verbs_header: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              english: { type: Type.STRING },
              portuguese: { type: Type.STRING },
            },
            required: ["english", "portuguese"],
          },
        },
        new_words: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              english: { type: Type.STRING },
              portuguese: { type: Type.STRING },
            },
            required: ["english", "portuguese"],
          },
        },
        useful_phrases: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              english: { type: Type.STRING },
              portuguese: { type: Type.STRING },
            },
            required: ["english", "portuguese"],
          },
        },
        grammar: {
          type: Type.OBJECT,
          properties: {
            topics: { type: Type.ARRAY, items: { type: Type.STRING } },
            examples: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  english: { type: Type.STRING },
                  portuguese: { type: Type.STRING },
                },
                required: ["english", "portuguese"],
              },
            },
          },
          required: ["topics", "examples"],
        },
        real_life: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              english: { type: Type.STRING },
              portuguese: { type: Type.STRING },
            },
            required: ["english", "portuguese"],
          },
        },
        check_it_out: {
          type: Type.OBJECT,
          properties: {
            boxes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  content: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["title", "content"],
              },
            },
          },
          required: ["boxes"],
        },
      },
      required: ["verbs_header", "new_words", "useful_phrases", "grammar", "real_life", "check_it_out"],
    },
    teachers_guide_content: {
      type: Type.OBJECT,
      properties: {
        header_info: {
          type: Type.OBJECT,
          properties: {
            learning_objectives: { type: Type.ARRAY, items: { type: Type.STRING } },
            grammar_focus: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["learning_objectives", "grammar_focus"],
        },
        assessment: {
          type: Type.OBJECT,
          properties: {
            duration_minutes: { type: Type.INTEGER },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING },
                },
                required: ["question", "answer"],
              },
            },
          },
          required: ["duration_minutes", "questions"],
        },
        drills: {
          type: Type.OBJECT,
          properties: {
            verbs_drill: {
              type: Type.OBJECT,
              properties: {
                duration_minutes: { type: Type.INTEGER },
                sentences: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["duration_minutes", "sentences"],
            },
            new_words_drill: {
              type: Type.OBJECT,
              properties: {
                duration_minutes: { type: Type.INTEGER },
                sentences: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["duration_minutes", "sentences"],
            },
            useful_phrases_drill: {
              type: Type.OBJECT,
              properties: {
                duration_minutes: { type: Type.INTEGER },
                sentences: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["duration_minutes", "sentences"],
            },
            grammar_drill: {
              type: Type.OBJECT,
              properties: {
                duration_minutes: { type: Type.INTEGER },
                sentences: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["duration_minutes", "sentences"],
            },
          },
          required: ["verbs_drill", "new_words_drill", "useful_phrases_drill", "grammar_drill"],
        },
        procedures: {
          type: Type.OBJECT,
          properties: {
            homework_instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
            skills_check: {
              type: Type.OBJECT,
              properties: {
                skills: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["skills"],
            },
          },
          required: ["homework_instructions", "skills_check"],
        },
      },
      required: ["header_info", "assessment", "drills", "procedures"],
    },
  },
  required: ["lesson_metadata", "student_book_content", "teachers_guide_content"],
};

const SYSTEM_INSTRUCTION = `
**Role:**
You are an expert ESL Curriculum Developer specializing in the Audio-Lingual methodology (similar to Wizard). Your task is to generate a complete JSON object for a personalized English lesson based on a specific **Topic**, **Student Profile**, and **Previous Context**.

**Pedagogical Guidelines:**
1.  **Bilingual Content:** All "Student Book" content (Verbs, Words, Phrases, Grammar Examples) must provide the **English** text and its **Portuguese** translation.
2.  **Drilling Methodology (Teacher's Guide):**
    *   In the drills section, sentences must follow a substitution format.
    *   Format: Base sentence in English. / Portuguese translation. / Substitution cue 1 / Substitution cue 2.
    *   Example: "I like to eat pizza. / Eu gosto de comer pizza. / pasta / salad"
3.  **Progression:**
    *   **Verbs:** Start with 2 high-frequency verbs related to the topic.
    *   **New Words:** Introduce 10-14 nouns/adjectives related to the topic.
    *   **Useful Phrases:** 3-4 idiomatic or common phrases useful for the specific student profile.
    *   **Grammar:** specific grammar rule suitable for the student's proficiency level, applied to the topic.
    *   **Real Life:** Contextual sentences that mix the new grammar and vocabulary.

**Content Personalization:**
*   **Topic:** Adapt all vocabulary and sentences to the requested theme.
*   **Student Profile:** You MUST tailor the complexity, tone, and "Real Life" scenarios to fit the student's skills (1-5 stars), interests, and likes/dislikes. For example, if they like "Tech", use tech-related examples even in a general topic if possible. If they are a beginner (1 star), use simple sentences.
*   **Context:** You will be provided with a list of recently studied topics. Ensure the new lesson flows logically from these but DOES NOT repeat the exact same vocabulary or grammar points.

**JSON Field Specifics:**
*   lesson_metadata: Assign a logical lesson number and title based on the topic.
*   check_it_out: Create 2-3 small boxes with quick tips or categorized vocabulary lists.
*   assessment: Create 2 quick translation questions and 1-2 situational questions.
*   drills: Ensure the duration_minutes adds up to a standard 50-60 minute class (approx 8' verbs, 12' words, 6' phrases, 12' grammar).
`;

export const generateLesson = async (topic: string, student: Student, previousTopics: string[]): Promise<Lesson> => {
  const apiKey = storageService.loadApiKey();
  if (!apiKey) {
    throw new Error("API Key not found. Please configure it in Settings.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const profileDescription = `
    **STUDENT PROFILE**:
    - Name: ${student.name}
    - Interests: ${student.interests}
    - Likes: ${student.likes}
    - Dislikes: ${student.dislikes}
    - Proficiency Levels (1-5 Stars):
      * Speaking: ${student.skills.speaking}/5
      * Listening: ${student.skills.listening}/5
      * Reading: ${student.skills.reading}/5
      * Writing: ${student.skills.writing}/5
  `;

  const contextDescription = previousTopics.length > 0
    ? `**HISTORY (Last ${previousTopics.length} lessons)**: The student has already studied: [${previousTopics.join(', ')}]. DO NOT repeat these specific lessons, but build upon them.`
    : `**HISTORY**: This is the very first lesson for this student. Start fresh.`;

  const prompt = `
    Create a personalized English Lesson.
    
    **Target Topic**: "${topic}"
    
    ${profileDescription}
    
    ${contextDescription}
    
    **Instruction**: Generate the lesson content in valid JSON format adhering to the schema. Ensure the "Real Life" and "Useful Phrases" sections are specifically relevant to the student's interests and job/role if mentioned.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: lessonSchema,
      temperature: 0.7,
    },
  });

  if (!response.text) {
    throw new Error("No content generated");
  }

  return JSON.parse(response.text) as Lesson;
};

const refineSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    lesson: lessonSchema,
    explanation: { type: Type.STRING, description: "A brief explanation of the changes made to the lesson based on the user's request." },
  },
  required: ["lesson", "explanation"],
};

export interface RefineResponse {
  lesson: Lesson;
  explanation: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export const refineLesson = async (currentLesson: Lesson, instruction: string, history: ChatMessage[] = []): Promise<RefineResponse> => {
  const apiKey = storageService.loadApiKey();
  if (!apiKey) {
    throw new Error("API Key not found. Please configure it in Settings.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const historyText = history.map(msg => `${msg.role === 'user' ? 'USER' : 'ASSISTANT'}: ${msg.text}`).join('\n');

  const prompt = `
    **TASK**: Edit and Refine an existing English Lesson based on user feedback.

    **CURRENT LESSON JSON**:
    ${JSON.stringify(currentLesson)}

    **CONVERSATION HISTORY**:
    ${historyText}

    **USER FEEDBACK / REQUESTED CHANGES**:
    "${instruction}"

    **INSTRUCTION**: 
    1. Analyze the user's request, considering the conversation history for context (e.g., "undo that", "make it harder").
    2. Modify the JSON content to strictly satisfy the request while maintaining the original format and pedagogical quality.
    3. Provide a brief explanation of what you changed.
    4. Return a JSON object with "lesson" (the full modified lesson) and "explanation" (your explanation).
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction: "You are a rigid JSON editor. You only modify the specific parts requested by the user, or adjust the difficulty/tone as requested. Maintain the schema perfectly.",
      responseMimeType: "application/json",
      responseSchema: refineSchema,
      temperature: 0.4,
    },
  });

  if (!response.text) {
    throw new Error("No content generated during refinement");
  }

  return JSON.parse(response.text) as RefineResponse;
};