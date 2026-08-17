import type { NewsletterProvider, NewsletterSubscribeOptions, NewsletterSubscribeResult } from "./types";
import { ResendNewsletterAdapter } from "./adapters/resend";

export class StubNewsletterAdapter implements NewsletterProvider {
  name = "stub";
  async subscribe({ email }: NewsletterSubscribeOptions): Promise<NewsletterSubscribeResult> {
    console.log(`[Newsletter:Dev] Subscriber captured in development mode: ${email}`);
    return { success: true, message: "Subscription simulated in development" };
  }
}

export function getNewsletterProvider(): NewsletterProvider {
  const resendKey = process.env.RESEND_API_KEY || import.meta.env.RESEND_API_KEY;
  const resendAudienceId = process.env.RESEND_AUDIENCE_ID || import.meta.env.RESEND_AUDIENCE_ID;

  if (resendKey) {
    return new ResendNewsletterAdapter(resendKey, resendAudienceId);
  }

  return new StubNewsletterAdapter();
}

export * from "./types";
