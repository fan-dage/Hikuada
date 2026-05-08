"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useSiteCopy } from "@/components/site-copy-context";
import { INQUIRY_PREFILL_EVENT, INQUIRY_PREFILL_SESSION_KEY } from "@/lib/inquiry-list";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export function InquiryForm() {
  const inquiryForm = useSiteCopy().inquiryForm;
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorText, setErrorText] = useState("");
  const [message, setMessage] = useState("");

  const consumePrefill = useCallback(() => {
    try {
      const raw = sessionStorage.getItem(INQUIRY_PREFILL_SESSION_KEY);
      if (!raw) return;
      sessionStorage.removeItem(INQUIRY_PREFILL_SESSION_KEY);
      setMessage(raw);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    consumePrefill();
    window.addEventListener(INQUIRY_PREFILL_EVENT, consumePrefill);
    return () => window.removeEventListener(INQUIRY_PREFILL_EVENT, consumePrefill);
  }, [consumePrefill]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus("submitting");
    setErrorText("");

    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error || "Submission failed.");
      }

      form.reset();
      setMessage("");
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorText(error instanceof Error ? error.message : "Submission failed.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.35)]"
    >
      <div>
        <h3 className="text-xl font-semibold text-slate-900">{inquiryForm.title}</h3>
        <p className="mt-1 text-sm text-slate-600">{inquiryForm.subtitle}</p>
      </div>
      <input
        name="name"
        required
        placeholder={inquiryForm.namePlaceholder}
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-amber-400 placeholder:text-slate-400 focus:ring-2"
      />
      <div className="grid gap-3 md:grid-cols-[1fr_1.6fr]">
        <div className="flex items-center gap-4 rounded-lg border border-slate-300 bg-white px-4 py-3">
          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            <input type="radio" name="contactType" value="whatsapp" required className="accent-amber-500" />
            WhatsApp
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            <input type="radio" name="contactType" value="zalo" required className="accent-amber-500" />
            Zalo
          </label>
        </div>
        <input
          name="phone"
          required
          placeholder={inquiryForm.phonePlaceholder}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-amber-400 placeholder:text-slate-400 focus:ring-2"
        />
      </div>
      <input
        name="email"
        type="email"
        required
        placeholder={inquiryForm.emailPlaceholder}
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-amber-400 placeholder:text-slate-400 focus:ring-2"
      />
      <textarea
        name="message"
        required
        rows={4}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder={inquiryForm.messagePlaceholder}
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-amber-400 placeholder:text-slate-400 focus:ring-2"
      />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-amber-300"
      >
        {status === "submitting" ? inquiryForm.submitting : inquiryForm.submit}
      </button>
      {status === "success" && (
        <p className="text-sm text-emerald-700">{inquiryForm.success}</p>
      )}
      {status === "error" && <p className="text-sm text-red-600">{errorText}</p>}
    </form>
  );
}
