# Third-Party Integrations & Environment Variables

This document describes the external services integrated with the portfolio and the required environment configurations.

---

## 1. Resend (Email Delivery & Audiences)

- **Purpose**:
  1. Handles contact form submissions from `/contact` via the `/api/contact` serverless endpoint.
  2. Handles newsletter subscriptions on `/blog` via `/api/newsletter`, automatically creating contacts in **Resend Audiences**.
- **Environment Variables**:
  - `RESEND_API_KEY`: Secret API key from the Resend dashboard.
  - `CONTACT_EMAIL`: Recipient address for lead notifications (`connect@rohitgautam.site`).
  - `FROM_EMAIL`: Verified sender address (`Rohit Gautam <connect@rohitgautam.site>`).
  - `RESEND_AUDIENCE_ID`: ID of the target Resend Audience (`f5d01da2-bd82-4096-9349-65e38112da3d`).

---

## 2. Cal.com (Scheduling)

- **Purpose**: Allows prospective clients and collaborators to book 30-minute discovery calls directly.
- **Link**: `https://cal.com/rohit-gautam/30min`
- **Placements**:
  - Contact page secondary card
  - Footer status card
  - ⌘K Command Palette quick actions

---

## 3. Sanity Headless CMS

- **Purpose**: Provides real-time headless CMS content querying for all technical articles and case studies.
- **Environment Variables**:
  - `SANITY_PROJECT_ID`: `j0pcmxw1`
  - `SANITY_DATASET`: `production`
  - `SANITY_API_TOKEN`: Sanity developer API token for write/seed mutations and private dataset reads.

---

## 4. Complete `.env` Reference

```ini
# Resend — Contact Form Email & Resend Audiences Newsletter
RESEND_API_KEY=re_your_api_key
CONTACT_EMAIL=connect@rohitgautam.site
FROM_EMAIL=Rohit Gautam <connect@rohitgautam.site>
RESEND_AUDIENCE_ID=f5d01da2-bd82-4096-9349-65e38112da3d
NEWSLETTER_PROVIDER=resend

# Sanity Headless CMS
SANITY_PROJECT_ID=j0pcmxw1
SANITY_DATASET=production
SANITY_API_TOKEN=sk_your_sanity_token
```
