import { getCMSClient } from "./client";
import type { Article, Project, AuthorProfile } from "./types";

export async function getArticles(): Promise<Article[]> {
  const client = getCMSClient();
  return client.getArticles();
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const client = getCMSClient();
  return client.getArticleBySlug(slug);
}

export async function getProjects(): Promise<Project[]> {
  const client = getCMSClient();
  return client.getProjects();
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const client = getCMSClient();
  return client.getProjectBySlug(slug);
}

export async function getAuthorProfile(): Promise<AuthorProfile> {
  const client = getCMSClient();
  return client.getProfile();
}

export * from "./types";
