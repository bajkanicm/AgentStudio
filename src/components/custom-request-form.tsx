"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarCheck, CheckCircle2, Loader2, Send } from "lucide-react";

const AGENT_TYPES = [
  "Sales / lead qualification",
  "Customer support",
  "Content & marketing",
  "Data analysis / reporting",
  "Internal operations",
  "Something else",
];

const BUDGETS = ["< $2,000", "$2,000 – $5,000", "$5,000 – $15,000", "$15,000+", "Not sure yet"];

const TIMELINES = ["ASAP", "Within a month", "This quarter", "Just exploring"];

export function CustomRequestForm() {
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    company: "",
    agentType: "",
    budget: "",
    timeline: "",
    description: "",
  });

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/custom-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setDone(true);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-10 text-center">
        <CheckCircle2 className="mx-auto size-12 text-emerald-400" />
        <h3 className="mt-4 text-xl font-semibold">Request received!</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Thanks {form.name.split(" ")[0]} — our team will review your use case
          and get back to you at <span className="text-foreground">{form.email}</span>{" "}
          within one business day to schedule your discovery call.
        </p>
        <p className="mt-4 inline-flex items-center gap-2 text-xs text-muted-foreground">
          <CalendarCheck className="size-4 text-emerald-400" />
          Typical delivery: 2–4 weeks from kickoff
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="cr-name">Your name *</Label>
          <Input
            id="cr-name"
            required
            value={form.name}
            onChange={(e) => set("name")(e.target.value)}
            placeholder="Jane Smith"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cr-email">Work email *</Label>
          <Input
            id="cr-email"
            type="email"
            required
            value={form.email}
            onChange={(e) => set("email")(e.target.value)}
            placeholder="jane@company.com"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="cr-company">Company</Label>
          <Input
            id="cr-company"
            value={form.company}
            onChange={(e) => set("company")(e.target.value)}
            placeholder="Company Inc."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cr-type">What kind of agent?</Label>
          <Select value={form.agentType} onValueChange={set("agentType")}>
            <SelectTrigger id="cr-type" className="w-full">
              <SelectValue placeholder="Pick the closest fit" />
            </SelectTrigger>
            <SelectContent>
              {AGENT_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="cr-budget">Budget range</Label>
          <Select value={form.budget} onValueChange={set("budget")}>
            <SelectTrigger id="cr-budget" className="w-full">
              <SelectValue placeholder="Optional" />
            </SelectTrigger>
            <SelectContent>
              {BUDGETS.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cr-timeline">Timeline</Label>
          <Select value={form.timeline} onValueChange={set("timeline")}>
            <SelectTrigger id="cr-timeline" className="w-full">
              <SelectValue placeholder="Optional" />
            </SelectTrigger>
            <SelectContent>
              {TIMELINES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cr-description">What should this agent do? *</Label>
        <Textarea
          id="cr-description"
          required
          rows={5}
          value={form.description}
          onChange={(e) => set("description")(e.target.value)}
          placeholder="Describe the workflow, the tools it should connect to, and what success looks like…"
        />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={submitting}
        className="glow-primary w-full sm:w-auto"
      >
        {submitting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Send className="size-4" />
        )}
        Request my custom agent
      </Button>
      <p className="text-xs text-muted-foreground">
        No commitment — the discovery call is free, and you keep the roadmap we
        draft together either way.
      </p>
    </form>
  );
}
