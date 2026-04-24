export type Role = "ADMIN" | "STUDENT";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  duration: number;
  attempt_limit: number;
  creator_id: string;
  created_at: string;
  questions?: Question[];
}

export interface Question {
  id: string;
  quiz_id: string;
  type: "MCQ" | "SHORT_ANSWER" | "CODING";
  content: string;
  options?: string[]; // Parsed from JSON
  correct_answer?: string;
  test_cases?: TestCase[];
}

export interface TestCase {
  input: string;
  output: string;
}

export interface Attempt {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  started_at: string;
  completed_at: string;
  status: "STARTED" | "COMPLETED";
  quiz_title?: string;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  completed_at: string;
}
