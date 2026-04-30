"use client";

import { FormEvent, useState } from "react";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export function InquiryForm() {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorText, setErrorText] = useState("");

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
        <h3 className="text-xl font-semibold text-slate-900">Quick Inquiry</h3>
        <p className="mt-1 text-sm text-slate-600">Tell us your demand and get a factory quote in 12 hours.</p>
      </div>
      <input
        name="name"
        required
        placeholder="Your Name*"
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
          placeholder="Contact ID / Number*"
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-amber-400 placeholder:text-slate-400 focus:ring-2"
        />
      </div>
      <input
        name="email"
        type="email"
        required
        placeholder="Email*"
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-amber-400 placeholder:text-slate-400 focus:ring-2"
      />
      <textarea
        name="message"
        required
        rows={4}
        placeholder="Your demand (model, quantity, destination)..."
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-amber-400 placeholder:text-slate-400 focus:ring-2"
      />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-amber-300"
      >
        {status === "submitting" ? "Submitting..." : "Send Inquiry"}
      </button>
      {status === "success" && (
        <p className="text-sm text-emerald-700">Thank you. We will get back to you within 12 hours.</p>
      )}
      {status === "error" && <p className="text-sm text-red-600">{errorText}</p>}
    </form>
  );
}
