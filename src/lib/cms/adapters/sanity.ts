import type { CMSAdapter, Article, Project, AuthorProfile } from "../types";
import { profile } from "@/data/site";

export interface SanityConfig {
  projectId: string;
  dataset?: string;
  apiVersion?: string;
  token?: string;
}

export class SanityCMSAdapter implements CMSAdapter {
  name = "sanity";
  private projectId: string;
  private dataset: string;
  private apiVersion: string;
  private token?: string;

  // In-memory cache to prevent redundant network waterfalls during static build
  private cachedArticles: Article[] | null = null;
  private cachedProjects: Project[] | null = null;
  private lastFetchTime = 0;
  private readonly CACHE_TTL_MS = 60 * 1000; // 1 minute in-memory cache

  constructor(config: SanityConfig) {
    this.projectId = config.projectId;
    this.dataset = config.dataset || "production";
    this.apiVersion = config.apiVersion || "2024-01-01";
    this.token = config.token;
  }

  private async query<T>(groq: string, params: Record<string, any> = {}): Promise<T | null> {
    try {
      const url = new URL(`https://${this.projectId}.api.sanity.io/v${this.apiVersion}/data/query/${this.dataset}`);
      url.searchParams.set("query", groq);
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(`$${key}`, JSON.stringify(value));
      }

      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (this.token) {
        headers["Authorization"] = `Bearer ${this.token}`;
      }

      const res = await fetch(url.toString(), { headers });
      if (!res.ok) {
        console.error(`[Sanity API Error] Query failed with HTTP ${res.status}:`, await res.text());
        return null;
      }

      const json = await res.json();
      return json.result as T;
    } catch (err) {
      console.error("[Sanity API Error] Fetch failed:", err);
      return null;
    }
  }

  async getArticles(): Promise<Article[]> {
    const now = Date.now();
    if (this.cachedArticles && now - this.lastFetchTime < this.CACHE_TTL_MS) {
      return this.cachedArticles;
    }

    const articles = await this.query<Article[]>(
      `*[_type == "article"] | order(published desc) {
        "slug": slug.current,
        title,
        description,
        quickAnswer,
        kind,
        category,
        tags,
        difficulty,
        readingTime,
        published,
        updated,
        featured,
        views,
        body,
        checklist,
        mistakes,
        faq,
        summary,
        related,
        projects
      }`
    );

    this.cachedArticles = articles || [];
    this.lastFetchTime = now;
    console.log(`[Sanity CMS] Loaded ${this.cachedArticles.length} articles from Sanity (Cached for build).`);
    return this.cachedArticles;
  }

  async getArticleBySlug(slug: string): Promise<Article | null> {
    const all = await this.getArticles();
    const article = all.find((a) => a.slug === slug);
    return article || null;
  }

  async getProjects(): Promise<Project[]> {
    if (this.cachedProjects) {
      return this.cachedProjects;
    }

    const projects = await this.query<Project[]>(
      `*[_type == "project"] | order(year desc) {
        "slug": slug.current,
        title,
        tagline,
        summary,
        description,
        role,
        year,
        status,
        kind,
        metrics,
        stack,
        architecture,
        highlights,
        impact,
        featured,
        githubUrl,
        liveUrl,
        accent
      }`
    );

    this.cachedProjects = projects || [];
    console.log(`[Sanity CMS] Loaded ${this.cachedProjects.length} projects from Sanity (Cached for build).`);
    return this.cachedProjects;
  }

  async getProjectBySlug(slug: string): Promise<Project | null> {
    const all = await this.getProjects();
    const project = all.find((p) => p.slug === slug);
    return project || null;
  }

  async getProfile(): Promise<AuthorProfile> {
    return profile;
  }
}
