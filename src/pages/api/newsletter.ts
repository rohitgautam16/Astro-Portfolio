import type { APIRoute } from "astro";
import { z } from "zod";
import { getNewsletterProvider } from "@/lib/newsletter";

export const prerender = false;

const schema = z.object({
  email: z.string().trim().email("Please provide a valid email address"),
  source: z.string().optional(),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: parsed.error.issues[0]?.message || "Invalid email address",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const provider = getNewsletterProvider();
    const result = await provider.subscribe({
      email: parsed.data.email,
      source: parsed.data.source || "blog-bottom",
    });

    if (!result.success) {
      return new Response(
        JSON.stringify({ success: false, error: result.error || "Subscription failed" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ success: true, provider: provider.name, message: result.message }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (err: any) {
    console.error("[Newsletter API] Error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err?.message || "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
