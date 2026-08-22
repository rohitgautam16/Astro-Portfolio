import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { insights } from "@/data/insights";

export async function GET(context: APIContext) {
  return rss({
    title: "Rohit Gautam - Engineering Notes & Insights",
    description:
      "Evergreen technical articles, engineering case studies and notes on React, Node.js, Shopify, Cloudflare, AI and performance.",
    site: context.site ?? "https://rohitgautam.site",
    items: insights.map((post) => ({
      title: post.title,
      pubDate: new Date(post.published),
      description: post.description,
      link: `/blog/${post.slug}/`,
      categories: [post.category, ...post.tags],
    })),
    customData: `<language>en-us</language>`,
  });
}
