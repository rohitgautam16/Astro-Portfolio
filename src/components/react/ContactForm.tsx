import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState, useEffect, type FormEvent } from "react";
import { ArrowRight, Check, Loader2, RotateCcw } from "lucide-react";
import { z } from "zod";
import { profile } from "@/data/site";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().trim().min(2, "Tell me your name").max(100, "That name is too long"),
  email: z.string().trim().email("Use a valid email address").max(255),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  subject: z.string().trim().min(3, "Add a short subject").max(140),
  projectType: z.string().min(1, "Pick a project type"),
  budget: z.string().optional().or(z.literal("")),
  message: z.string().trim().min(20, "A little more detail helps").max(2000),
});

type Values = z.infer<typeof schema>;
type Errors = Partial<Record<keyof Values, string>>;

const projectTypes = [
  "Full stack application",
  "E-commerce & Web app",
  "Business website / WordPress",
  "AI automation",
  "Performance Optimization",
  "Something else",
];

const inrBudgets = [
  "Prefer not to say",
  "₹25,000 – ₹50,000",
  "₹50,000 – ₹1,00,000",
  "₹1,00,000 – ₹2,50,000",
  "₹2,50,000+",
];

const usdBudgets = [
  "Prefer not to say",
  "< $1,000",
  "$1,000 – $3,000",
  "$3,000 – $7,500",
  "$7,500+",
];

const empty: Values = {
  name: "",
  email: "",
  company: "",
  subject: "",
  projectType: "",
  budget: "",
  message: "",
};

function Field({
  label,
  htmlFor,
  error,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string | undefined;
  optional?: boolean | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={htmlFor}
        className="flex items-baseline justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
      >
        {label}
        {optional ? <span className="normal-case tracking-normal text-muted-foreground">optional</span> : null}
      </label>
      <div className="mt-2">{children}</div>
      <AnimatePresence initial={false}>
        {error ? (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1.5 font-mono text-[11px] text-destructive"
          >
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

const control =
  "w-full rounded-xl border-[3px] border-hairline bg-card px-3.5 py-3 text-sm font-medium shadow-hard-sm outline-none transition-all duration-200 placeholder:text-muted-foreground focus:-translate-y-0.5 focus:shadow-hard";

export function ContactForm() {
  const reduced = useReducedMotion();
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  // Auto-detect whether visitor is in India (INR) or International (USD)
  useEffect(() => {
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      const languages = navigator.languages || [navigator.language || ""];
      const isIndiaTimeZone =
        timeZone.includes("Kolkata") ||
        timeZone.includes("Calcutta") ||
        timeZone.startsWith("Asia/Kolkata") ||
        timeZone.startsWith("Asia/Calcutta");
      const isIndiaLocale = languages.some((l) => l.endsWith("-IN") || l === "hi");

      if (isIndiaTimeZone || isIndiaLocale) {
        setCurrency("INR");
      } else {
        setCurrency("USD");
      }
    } catch {
      setCurrency("USD");
    }
  }, []);

  const set = (key: keyof Values) => (event: { target: { value: string } }) => {
    setValues((prev) => ({ ...prev, [key]: event.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const currentBudgets = currency === "INR" ? inrBudgets : usdBudgets;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Values;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      setStatus("error");
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to send message");
      }

      setStatus("sent");
    } catch (err) {
      console.error("Contact form submission failed:", err);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <motion.div
        initial={reduced ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-[26px] border-[3px] border-hairline bg-mint p-8 text-center shadow-hard-lg sm:p-12"
      >
        <motion.span
          initial={reduced ? false : { scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 14 }}
          className="mx-auto grid size-16 place-items-center rounded-full border-[3px] border-hairline bg-card shadow-hard"
        >
          <Check className="size-7" aria-hidden />
        </motion.span>
        <h3 className="mt-6 font-display text-2xl font-extrabold">Message sent successfully</h3>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-foreground/75">
          Thanks for reaching out! I've received your inquiry and will get back to you within 24 hours.
        </p>
        <button
          type="button"
          onClick={() => {
            setValues(empty);
            setStatus("idle");
          }}
          className="mt-8 inline-flex items-center gap-2 rounded-full border-[3px] border-hairline bg-card px-5 py-2.5 font-display text-sm font-extrabold shadow-hard-sm transition-transform hover:-translate-y-0.5"
        >
          <RotateCcw className="size-4" aria-hidden /> Write another
        </button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="relative rounded-[26px] border-[3px] border-hairline bg-surface p-6 shadow-hard-lg sm:p-8"
    >
      <span aria-hidden className="tape-strip absolute -top-3 left-10 h-5 w-24 -rotate-6 rounded-[2px]" />
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          project brief
        </p>
        <span className="rounded-full border border-hairline/30 bg-card px-2.5 py-0.5 font-mono text-[10px] font-bold text-muted-foreground">
          {currency === "INR" ? "🇮🇳 INR (₹)" : "🌍 USD ($)"}
        </span>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field label="Name" htmlFor="name" error={errors.name}>
          <input id="name" name="name" className={control} value={values.name} onChange={set("name")} placeholder="Your Name" maxLength={100} />
        </Field>
        <Field label="Email" htmlFor="email" error={errors.email}>
          <input id="email" name="email" type="email" className={control} value={values.email} onChange={set("email")} placeholder="your.email@domain.com" maxLength={255} />
        </Field>
        <Field label="Company" htmlFor="company" optional error={errors.company}>
          <input id="company" name="company" className={control} value={values.company} onChange={set("company")} placeholder="Where you work" maxLength={120} />
        </Field>
        <Field label="Subject" htmlFor="subject" error={errors.subject}>
          <input id="subject" name="subject" className={control} value={values.subject} onChange={set("subject")} placeholder="I need a website" maxLength={140} />
        </Field>
        <Field label="Project type" htmlFor="projectType" error={errors.projectType}>
          <select id="projectType" name="projectType" className={cn(control, "appearance-none")} value={values.projectType} onChange={set("projectType")}>
            <option value="">Choose one…</option>
            {projectTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label={`Budget (${currency === "INR" ? "INR ₹" : "USD $"})`}
          htmlFor="budget"
          optional
          error={errors.budget}
        >
          <select id="budget" name="budget" className={cn(control, "appearance-none")} value={values.budget} onChange={set("budget")}>
            <option value="">Prefer not to say</option>
            {currentBudgets.slice(1).map((band) => (
              <option key={band} value={band}>
                {band}
              </option>
            ))}
          </select>
        </Field>
        <div className="sm:col-span-2">
          <Field label="Message" htmlFor="message" error={errors.message}>
            <textarea
              id="message"
              name="message"
              rows={6}
              maxLength={2000}
              className={cn(control, "resize-y")}
              value={values.message}
              onChange={set("message")}
              placeholder="What are you building, what's stuck, and when does it need to be live?"
            />
          </Field>
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <motion.button
          type="submit"
          disabled={status === "sending"}
          whileTap={reduced ? {} : { scale: 0.97 }}
          className="inline-flex items-center gap-2 rounded-full border-[3px] border-hairline bg-lavender px-6 py-3 font-display text-sm font-extrabold shadow-hard transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-70"
        >
          {status === "sending" ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden /> Sending…
            </>
          ) : (
            <>
              Send message <ArrowRight className="size-4" aria-hidden />
            </>
          )}
        </motion.button>
        <a
          href={profile.scheduleUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border-[3px] border-hairline bg-card px-6 py-3 font-display text-sm font-extrabold shadow-hard-sm transition-transform duration-200 hover:-translate-y-0.5"
        >
          Schedule a call
        </a>
      </div>

      <AnimatePresence>
        {status === "error" ? (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="alert"
            className="mt-4 rounded-xl border-2 border-destructive bg-destructive/10 px-3.5 py-2.5 font-mono text-[11px] text-destructive"
          >
            A few fields need attention before this can go out.
          </motion.p>
        ) : null}
      </AnimatePresence>
    </form>
  );
}
