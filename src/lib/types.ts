// ─── Domain Schema: IIT Madras BS Student Dashboard ───

export interface Student {
  name: string;
  rollNumber: string;
  email: string;
  program: string;
  currentTerm: string;
  enrollmentYear: number;
  cgpa: number;
  avatarUrl?: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  term: string;
  category: "foundation" | "diploma" | "degree" | "project" | "training";
  credits: number;
  status: "NEW COURSE" | "ongoing" | "completed" | "upcoming";
  program: string;
  coursePageUrl?: string;
  thumbnailColor?: string;
  allowedEndTerm?: boolean | null;
  scores: CourseScores;
  weeks: WeekScore[];
}

export interface CourseScores {
  oppyEligible?: number;
  moduleGpaAverages?: ModuleGpa[];
  quizScores?: QuizScore[];
  activities?: ActivityScore[];
}

export interface ModuleGpa {
  label: string;
  value: number;
}

export interface QuizScore {
  label: string;
  value: number;
}

export interface ActivityScore {
  label: string;
  value: number;
}

export interface WeekScore {
  week: number;
  assignment?: number;
  quiz?: number;
  activity?: number;
}

export interface Week {
  id: string;
  courseId: string;
  weekNumber: number;
  title: string;
  status: "locked" | "open" | "completed";
  lectures: Lecture[];
  assignments: Assignment[];
  deadline?: string;
}

export interface Lecture {
  id: string;
  weekId: string;
  title: string;
  type: "video" | "reading" | "live";
  duration?: string;
  completed: boolean;
  url?: string;
}

export interface Assignment {
  id: string;
  weekId: string;
  courseId: string;
  title: string;
  type: "graded" | "practice" | "bonus";
  category: "quiz" | "programming" | "subjective";
  totalMarks: number;
  scoredMarks?: number;
  dueDate?: string;
  submittedAt?: string;
  status: "not_started" | "in_progress" | "submitted" | "graded" | "missed";
  questions: Question[];
}

export interface Question {
  id: string;
  assignmentId: string;
  questionNumber: number;
  text: string;
  type: "mcq" | "msq" | "numerical" | "programming" | "subjective";
  options?: Option[];
  correctAnswer?: string | string[];
  studentAnswer?: string | string[];
  marks: number;
  scoredMarks?: number;
  explanation?: string;
}

export interface Option {
  id: string;
  label: string;
  text: string;
  isCorrect?: boolean;
}

export interface Grade {
  courseId: string;
  courseCode: string;
  courseTitle: string;
  term: number;
  credits: number;
  grade: string;
  gradePoints: number;
  category: "quiz_avg" | "final" | "assignment_avg" | "overall";
}

export interface GradeSummary {
  termId: string;
  term: number;
  sgpa: number;
  cgpa: number;
  creditsEarned: number;
  totalCredits: number;
  grades: Grade[];
}

export interface Notice {
  id: string;
  title: string;
  body: string;
  date: string;
  courseId?: string;
  type: "announcement" | "deadline" | "result" | "general";
  isRead: boolean;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
  children?: NavItem[];
}
