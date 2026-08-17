import type { NewsletterProvider, NewsletterSubscribeOptions, NewsletterSubscribeResult } from "../types";

export class ResendNewsletterAdapter implements NewsletterProvider {
  name = "resend";
  private apiKey: string;
  private audienceId?: string;

  constructor(apiKey: string, audienceId?: string) {
    this.apiKey = apiKey;
    this.audienceId = audienceId;
  }

  private async getOrCreateAudienceId(): Promise<string | null> {
    if (this.audienceId) return this.audienceId;

    try {
      const res = await fetch("https://api.resend.com/audiences", {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      });
      const data = await res.json();
      if (res.ok && (data as any)?.data?.length > 0) {
        this.audienceId = (data as any).data[0].id;
        return this.audienceId!;
      }

      // Create an audience if none exists
      const createRes = await fetch("https://api.resend.com/audiences", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: "General" }),
      });
      const createData = await createRes.json();
      if (createRes.ok && (createData as any)?.id) {
        this.audienceId = (createData as any).id;
        return this.audienceId!;
      }
    } catch (err) {
      console.warn("[Resend Newsletter] Could not auto-resolve audience ID:", err);
    }
    return null;
  }

  async subscribe({ email }: NewsletterSubscribeOptions): Promise<NewsletterSubscribeResult> {
    try {
      const audienceId = await this.getOrCreateAudienceId();

      let contactCreated = false;
      if (audienceId) {
        const contactRes = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, unsubscribed: false }),
        });

        const contactData = await contactRes.json();
        if (contactRes.ok || (contactData as any)?.name === "already_exists") {
          contactCreated = true;
          console.log(`[Resend Newsletter] Contact added to audience ${audienceId}: ${email}`);
        } else {
          console.warn("[Resend Newsletter] Failed to add contact to audience:", contactData);
        }
      }

      // Also send an admin notification email
      const fromEmail = process.env.FROM_EMAIL || "Rohit Gautam <connect@rohitgautam.site>";
      const recipient = process.env.CONTACT_EMAIL || "connect@rohitgautam.site";

      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fromEmail.includes("<") ? fromEmail : `Newsletter <${fromEmail}>`,
            to: [recipient],
            subject: `New Newsletter Subscriber: ${email}`,
            html: `<p>New subscriber joined your engineering newsletter: <strong>${email}</strong></p><p>Status in Resend Audiences: <strong>${contactCreated ? "Created in Audience" : "Received"}</strong></p>`,
            reply_to: email,
          }),
        });
      } catch (emailErr) {
        console.warn("[Resend Newsletter] Notification email error:", emailErr);
      }

      return {
        success: true,
        message: contactCreated ? "Subscribed and added to Resend Audiences" : "Subscription request received",
      };
    } catch (err: any) {
      console.error("[Resend Newsletter Error]:", err);
      return { success: false, error: err?.message || "Failed to subscribe with Resend" };
    }
  }
}
