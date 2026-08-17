/**
 * Helper script to seed current articles and projects into your Sanity dataset.
 * Run with: node src/scripts/seed-sanity.mjs
 */
import { insights } from "../data/insights.ts";
import { projects, profile } from "../data/site.ts";

const projectId = process.env.SANITY_PROJECT_ID || "j0pcmxw1";
const dataset = process.env.SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN || "skXuxz2033cG44KHeAu7GPD6JDcoIfx06ORBntWxctt0PSjIM3VlcQqP6GtO15ImxHmeBPPfjiSWXWRxI7bbLavENaYw2VcuhGLj75fTbAWJW92HRqp6nXWf4wKrgKMg0ylufl77Lf3T7LbKwDFHqZpwIRNppYJdnrAJ8qjGsK7XR0U3Yxbd";

async function seed() {
  console.log(`Starting Sanity seed for project: ${projectId} (${dataset})...`);
  const url = `https://${projectId}.api.sanity.io/v2024-01-01/data/mutate/${dataset}`;

  const mutations = [];

  // Seed articles
  for (const item of insights) {
    mutations.push({
      createOrReplace: {
        _id: `article-${item.slug}`,
        _type: "article",
        slug: { _type: "slug", current: item.slug },
        title: item.title,
        description: item.description,
        quickAnswer: item.quickAnswer,
        kind: item.kind,
        category: item.category,
        tags: item.tags,
        difficulty: item.difficulty,
        readingTime: item.readingTime,
        published: item.published,
        updated: item.updated,
        featured: item.featured ?? false,
        views: item.views,
        body: item.body,
        checklist: item.checklist,
        mistakes: item.mistakes,
        faq: item.faq,
        summary: item.summary,
        related: item.related,
        projects: item.projects || [],
      },
    });
  }

  // Seed projects
  for (const proj of projects) {
    mutations.push({
      createOrReplace: {
        _id: `project-${proj.slug}`,
        _type: "project",
        slug: { _type: "slug", current: proj.slug },
        title: proj.title,
        tagline: proj.tagline,
        summary: proj.summary,
        description: proj.description,
        role: proj.role,
        year: proj.year,
        status: proj.status,
        kind: proj.kind,
        metrics: proj.metrics,
        stack: proj.stack,
        architecture: proj.architecture,
        highlights: proj.highlights,
        impact: proj.impact,
        featured: proj.featured ?? false,
        githubUrl: proj.githubUrl || "",
        liveUrl: proj.liveUrl || "",
        accent: proj.accent || "",
      },
    });
  }

  console.log(`Sending ${mutations.length} mutations to Sanity...`);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mutations }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Mutation failed:", data);
    } else {
      console.log("Successfully seeded Sanity with articles and projects!", data);
    }
  } catch (err) {
    console.error("Error during seed:", err);
  }
}

seed();
