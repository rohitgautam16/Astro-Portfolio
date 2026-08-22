import type { APIRoute } from "astro";
import { z } from "zod";

export const prerender = false;

// In-memory rate limiting map for client IP protection
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15-minute window
  const maxRequests = 5; // Max 5 submissions per 15 minutes per IP

  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }

  if (record.count >= maxRequests) {
    return true;
  }

  record.count += 1;
  return false;
}

const contactSchema = z.object({
  name: z.string().trim().min(2, "Tell me your name").max(100),
  email: z.string().trim().email("Use a valid email address").max(255),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  subject: z.string().trim().min(3, "Add a short subject").max(140),
  projectType: z.string().min(1, "Pick a project type"),
  budget: z.string().optional().or(z.literal("")),
  message: z.string().trim().min(20, "A little more detail helps").max(2000),
  turnstileToken: z.string().optional(),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    // 1. IP Rate Limiting Check
    const clientIP =
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "127.0.0.1";

    if (isRateLimited(clientIP)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Too many submission attempts. Please try again in 15 minutes.",
        }),
        { status: 429, headers: { "Content-Type": "application/json" } },
      );
    }

    const json = await request.json();
    const parsed = contactSchema.safeParse(json);

    if (!parsed.success) {
      return new Response(
        JSON.stringify({
          success: false,
          errors: parsed.error.format(),
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const { name, email, company, subject, projectType, budget, message, turnstileToken } = parsed.data;

    // 2. Cloudflare Turnstile Bot Verification Check
    const turnstileSecret =
      import.meta.env.TURNSTILE_SECRET_KEY ||
      process.env.TURNSTILE_SECRET_KEY ||
      "1x0000000000000000000000000000000AA"; // Cloudflare official test secret

    if (turnstileToken) {
      try {
        const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            secret: turnstileSecret,
            response: turnstileToken,
            remoteip: clientIP,
          }),
        });

        const verifyData = await verifyRes.json();
        if (!verifyData.success) {
          console.warn("[Contact API] Turnstile bot check failed:", verifyData);
          return new Response(
            JSON.stringify({
              success: false,
              error: "Bot verification failed. Please try submitting again.",
            }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }
      } catch (err) {
        console.warn("[Contact API] Turnstile verification request error:", err);
      }
    }

    // 3. Send Email via Resend
    const apiKey = import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY;
    const configuredRecipient = import.meta.env.CONTACT_EMAIL || process.env.CONTACT_EMAIL || "connect@rohitgautam.site";
    const fromAddress = import.meta.env.FROM_EMAIL || process.env.FROM_EMAIL || "Rohit Gautam <connect@rohitgautam.site>";

    if (!apiKey) {
      console.warn("[Contact API] RESEND_API_KEY is not set. Logging message in dev mode:", parsed.data);
      return new Response(
        JSON.stringify({ success: true, mode: "development", message: "Form received in dev mode" }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }

    const html = `
      <h2>New Project Inquiry from ${name}</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${company || "N/A"}</p>
      <p><strong>Project Type:</strong> ${projectType}</p>
      <p><strong>Budget:</strong> ${budget || "N/A"}</p>
      <hr/>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br/>")}</p>
    `;

    const sendEmail = async (from: string) => {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [configuredRecipient],
          subject: `New Lead: ${subject}`,
          html,
          reply_to: email,
        }),
      });
      const data = await res.json();
      return { ok: res.ok, data };
    };

    let result = await sendEmail(fromAddress);

    if (!result.ok) {
      console.warn("[Contact API] Primary from address failed, trying onboarding sender...", result.data);
      result = await sendEmail("Portfolio Contact <onboarding@resend.dev>");
    }

    if (!result.ok) {
      console.error("[Contact API] Resend API Error:", result.data);
      return new Response(
        JSON.stringify({ success: false, error: (result.data as any)?.message || "Failed to send message" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ success: true, id: (result.data as any)?.id }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    console.error("[Contact API] Server error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error?.message || "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
