export interface EmployeeInfo {
  evaluationRound: string;
  periodStart: string;
  periodEnd: string;
  prefix: string;
  name: string;
  position: string;
  group: string;
  department: string;
  evaluatorName: string;
  evaluatorPosition: string;
}

export interface KPIItem {
  id: string;
  category: string;
  name: string;
  weight: number;
  score: number; // 0-5
}

export interface CompetencyItem {
  id: string;
  text: string;
  score: number; // 0-5 (0 = N/A)
}

export interface CompetencySection {
  id: string;
  name: string;
  definition: string;
  weight: number;
  items: CompetencyItem[];
}

export interface EvaluationData {
  info: EmployeeInfo;
  part1: KPIItem[];
  part2: CompetencySection[];
}

export enum EvaluationLevel {
  OUTSTANDING = "ดีเด่น",
  VERY_GOOD = "ดีมาก",
  GOOD = "ดี",
  FAIR = "พอใช้",
  IMPROVE = "ต้องปรับปรุง"
}

export interface ScoreSummary {
  part1Raw: number;
  part1Weighted: number; // Max 80
  part1FullScore: number; // The denominator for Part 1 (usually 100 based on prompt logic)
  part2Raw: number;
  part2Weighted: number; // Max 20
  totalScore: number; // Max 100
  level: EvaluationLevel;
}