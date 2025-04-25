export interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface User {
  id: string;
  name: string;
  country: string;
  problemsSolved: number;
  rank: number;
  badge: string;
  currentProblem?: Problem;
} 