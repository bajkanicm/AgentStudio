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
import type { Locale } from "@/lib/locale";
import { CalendarCheck, CheckCircle2, Loader2, Send } from "lucide-react";

const COPY = {
  de: {
    gewerke: [
      "SHK / Heizung / Sanitär",
      "Elektro",
      "Maler / Lackierer",
      "Tischler / Schreiner",
      "Dachdecker / Zimmerer",
      "Bau allgemein",
      "Anderes Gewerk",
    ],
    sizes: ["1–2 Personen", "3–9 Personen", "10–24 Personen", "25+ Personen"],
    starts: ["So schnell wie möglich", "In den nächsten 4 Wochen", "Dieses Quartal", "Erstmal nur informieren"],
    name: "Dein Name *",
    namePh: "Max Mustermann",
    email: "E-Mail *",
    emailPh: "max@betrieb.de",
    company: "Betrieb",
    companyPh: "Mustermann SHK GmbH",
    gewerk: "Gewerk",
    gewerkPh: "Was am ehesten passt",
    size: "Betriebsgröße",
    sizePh: "Optional",
    start: "Wann willst du starten?",
    startPh: "Optional",
    desc: "Deine größten Zeitfresser *",
    descPh: "Was frisst bei euch die meiste Zeit? Verpasste Anrufe, Papierkram, Buchhaltung am Abend …",
    submit: "Pilotanfrage senden",
    doneTitle: "Anfrage angekommen!",
    done1: "Danke",
    done2: "— wir melden uns innerhalb eines Werktags bei",
    done3: "und schlagen einen Termin für dein 30-Minuten-Gespräch vor.",
    doneNote: "Kostenlose Pilotphase · Einrichtung übernehmen wir",
    privacy: "Kein Risiko: Das Gespräch ist unverbindlich, die Pilotphase kostenlos.",
    error: "Etwas ist schiefgelaufen",
  },
  en: {
    gewerke: [
      "Plumbing / HVAC",
      "Electrical",
      "Painting",
      "Carpentry / Joinery",
      "Roofing / Timber",
      "General construction",
      "Other trade",
    ],
    sizes: ["1–2 people", "3–9 people", "10–24 people", "25+ people"],
    starts: ["As soon as possible", "Within 4 weeks", "This quarter", "Just exploring"],
    name: "Your name *",
    namePh: "Jane Smith",
    email: "Email *",
    emailPh: "jane@company.com",
    company: "Business",
    companyPh: "Smith Plumbing Ltd.",
    gewerk: "Trade",
    gewerkPh: "Closest match",
    size: "Team size",
    sizePh: "Optional",
    start: "When do you want to start?",
    startPh: "Optional",
    desc: "Your biggest time sinks *",
    descPh: "What eats the most time? Missed calls, paperwork, bookkeeping at night …",
    submit: "Send pilot request",
    doneTitle: "Request received!",
    done1: "Thanks",
    done2: "— we'll get back to",
    done3: "within one business day to schedule your 30-minute call.",
    doneNote: "Free pilot phase · We handle the setup",
    privacy: "No risk: the call is non-binding and the pilot phase is free.",
    error: "Something went wrong",
  },
} as const;

export function CustomRequestForm({ locale = "de" }: { locale?: Locale }) {
  const t = COPY[locale];
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
      if (!res.ok) throw new Error(data.error ?? t.error);
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
        <h3 className="mt-4 text-xl font-semibold">{t.doneTitle}</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          {t.done1} {form.name.split(" ")[0]} {t.done2}{" "}
          <span className="text-foreground">{form.email}</span> {t.done3}
        </p>
        <p className="mt-4 inline-flex items-center gap-2 text-xs text-muted-foreground">
          <CalendarCheck className="size-4 text-emerald-400" />
          {t.doneNote}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="cr-name">{t.name}</Label>
          <Input
            id="cr-name"
            required
            value={form.name}
            onChange={(e) => set("name")(e.target.value)}
            placeholder={t.namePh}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cr-email">{t.email}</Label>
          <Input
            id="cr-email"
            type="email"
            required
            value={form.email}
            onChange={(e) => set("email")(e.target.value)}
            placeholder={t.emailPh}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="cr-company">{t.company}</Label>
          <Input
            id="cr-company"
            value={form.company}
            onChange={(e) => set("company")(e.target.value)}
            placeholder={t.companyPh}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cr-type">{t.gewerk}</Label>
          <Select value={form.agentType} onValueChange={set("agentType")}>
            <SelectTrigger id="cr-type" className="w-full">
              <SelectValue placeholder={t.gewerkPh} />
            </SelectTrigger>
            <SelectContent>
              {t.gewerke.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="cr-size">{t.size}</Label>
          <Select value={form.budget} onValueChange={set("budget")}>
            <SelectTrigger id="cr-size" className="w-full">
              <SelectValue placeholder={t.sizePh} />
            </SelectTrigger>
            <SelectContent>
              {t.sizes.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cr-start">{t.start}</Label>
          <Select value={form.timeline} onValueChange={set("timeline")}>
            <SelectTrigger id="cr-start" className="w-full">
              <SelectValue placeholder={t.startPh} />
            </SelectTrigger>
            <SelectContent>
              {t.starts.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cr-description">{t.desc}</Label>
        <Textarea
          id="cr-description"
          required
          rows={5}
          value={form.description}
          onChange={(e) => set("description")(e.target.value)}
          placeholder={t.descPh}
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
        {t.submit}
      </Button>
      <p className="text-xs text-muted-foreground">{t.privacy}</p>
    </form>
  );
}
