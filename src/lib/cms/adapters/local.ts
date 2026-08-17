import type { CMSAdapter, Article, Project, AuthorProfile } from "../types";
import { insights, getInsight } from "@/data/insights";
import { projects, profile } from "@/data/site";

export class LocalCMSAdapter implements CMSAdapter {
  name = "local";

  async getArticles(): Promise<Article[]> {
    return insights;
  }

  async getArticleBySlug(slug: string): Promise<Article | null> {
    const article = getInsight(slug);
    return article || null;
  }

  async getProjects(): Promise<Project[]> {
    return projects;
  }

  async getProjectBySlug(slug: string): Promise<Project | null> {
    const project = projects.find((p) => p.slug === slug);
    return project || null;
  }

  async getProfile(): Promise<AuthorProfile> {
    return profile;
  }
}
