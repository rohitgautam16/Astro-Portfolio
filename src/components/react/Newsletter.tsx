import { useState } from "react";
import { Send, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "blog-newsletter-card" }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to subscribe. Please try again.");
      }

      setStatus("success");
      setEmail("");
    } catch (err: any) {
      console.error("Newsletter subscription error:", err);
      setStatus("error");
      setErrorMsg(err?.message || "Failed to subscribe. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-3xl border-[3px] border-hairline bg-mint/30 p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-hard min-h-[260px]">
        <CheckCircle2 className="size-12 text-foreground" />
        <h3 className="font-display font-extrabold text-2xl">You're on the list.</h3>
        <p className="text-foreground/75">Keep an eye on your inbox for the next engineering note.</p>
        <button
          type="button"
          className="mt-4 rounded-full border-[3px] border-hairline bg-card px-5 py-2.5 font-display text-sm font-extrabold shadow-hard-sm hover:-translate-y-0.5"
          onClick={() => setStatus("idle")}
        >
          Subscribe another email
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border-[3px] border-hairline bg-card p-8 relative overflow-hidden shadow-hard min-h-[260px] flex flex-col justify-center">
      <div className="absolute top-0 right-0 -mr-8 -mt-8 size-32 bg-yellow/30 rounded-full blur-3xl pointer-events-none" />

      <h3 className="font-display font-extrabold text-3xl mb-3">Engineering Notes</h3>
      <p className="text-foreground/75 mb-6 max-w-md text-sm md:text-base leading-relaxed">
        Get occasional articles about React, Node.js, Shopify, AI, Performance, and System Design. No spam, just technical deep dives.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === "loading"}
          className="rounded-2xl border-[3px] border-hairline bg-surface px-4 py-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring flex-1 shadow-hard-sm"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center justify-center gap-2 rounded-full border-[3px] border-hairline bg-yellow px-6 py-3 font-display text-sm font-extrabold uppercase tracking-wider shadow-hard transition-transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Subscribing…
            </>
          ) : (
            <>
              Subscribe <Send className="size-4" />
            </>
          )}
        </button>
      </form>

      {status === "error" ? (
        <div className="mt-3 flex items-center gap-2 font-mono text-xs text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      ) : null}
    </div>
  );
}
