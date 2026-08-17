import type { Block, Category, Difficulty, InsightKind } from "@/data/insights";

export type { Block, Category, Difficulty, InsightKind };

export interface Article {
  slug: string;
  title: string;
  description: string;
  quickAnswer: string;
  kind: InsightKind;
  category: Category;
  tags: string[];
  difficulty: Difficulty;
  readingTime: number;
  published: string;
  updated: string;
  featured?: boolean;
  views: number;
  body: Block[];
  checklist: string[];
  mistakes: string[];
  faq: { q: string; a: string }[];
  summary: string;
  related: string[];
  caseStudies?: string[];
  projects?: string[];
  resources?: string[];
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  description: string;
  role: string;
  year: string;
  status: string;
  kind: string;
  metrics: { label: string; value: string }[];
  stack: string[];
  architecture: string[];
  highlights: string[];
  impact: string[];
  featured?: boolean;
  githubUrl?: string;
  liveUrl?: string;
  accent?: string;
}

export interface AuthorProfile {
  name: string;
  role: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  scheduleUrl: string;
  resumeUrl: string;
  photo: string;
  tagline: string;
  focus: string[];
  summary: string[];
}

export interface CMSAdapter {
  name: string;
  getArticles(): Promise<Article[]>;
  getArticleBySlug(slug: string): Promise<Article | null>;
  getProjects(): Promise<Project[]>;
  getProjectBySlug(slug: string): Promise<Project | null>;
  getProfile(): Promise<AuthorProfile>;
}
