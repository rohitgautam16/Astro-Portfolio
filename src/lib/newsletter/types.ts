export interface NewsletterSubscribeOptions {
  email: string;
  source?: string;
  metadata?: Record<string, string>;
}

export interface NewsletterSubscribeResult {
  success: boolean;
  message?: string;
  error?: string;
}

export interface NewsletterProvider {
  name: string;
  subscribe(options: NewsletterSubscribeOptions): Promise<NewsletterSubscribeResult>;
}
