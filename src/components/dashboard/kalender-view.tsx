"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Lang } from "@/lib/lang-shared";
import { CalendarDays, ChevronLeft, ChevronRight, Loader2, Plus, Sparkles, Trash2 } from "lucide-react";

interface Termin {
  id: string;
  title: string;
  location: string;
  start: string;
  durationMin: number;
  kind: string;
}

const KIND_STYLES: Record<string, string> = {
  termin: "border-l-[3px] border-[#0e3b33] bg-secondary",
  wartung: "border-l-[3px] border-[#1e7d46] bg-[#e1f1e7]",
  notfall: "border-l-[3px] border-[#c0392b] bg-[#f8e3e0]",
  intern: "border-l-[3px] border-[#b7791f] bg-[#f8eedc]",
};

const KINDS = [
  { value: "termin", label: "Kundentermin", labelEn: "Customer appointment" },
  { value: "wartung", label: "Wartung", labelEn: "Maintenance" },
  { value: "notfall", label: "Notfall", labelEn: "Emergency" },
  { value: "intern", label: "Intern", labelEn: "Internal" },
];

function mondayOf(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
}

function isoWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
}

const EMPTY_FORM = { title: "", location: "", day: "", time: "08:00", durationMin: "60", kind: "termin" };

export function KalenderView({ lang = "de" }: { lang?: Lang }) {
  const en = lang === "en";
  const [monday, setMonday] = React.useState(() => mondayOf(new Date()));
  const [termine, setTermine] = React.useState<Termin[] | null>(null);
  const [busy, setBusy] = React.useState<string | null>(null);
  const [addOpen, setAddOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState(EMPTY_FORM);

  const days = React.useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => {
        const d = new Date(monday);
        d.setDate(d.getDate() + i);
        return d;
      }),
    [monday]
  );

  const load = React.useCallback(async (mon: Date) => {
    const to = new Date(mon);
    to.setDate(to.getDate() + 7);
    const res = await fetch(`/api/termine?from=${mon.toISOString()}&to=${to.toISOString()}`);
    const data = await res.json();
    if (res.ok) setTermine(data.termine);
    else toast.error(data.error ?? (en ? "Loading failed" : "Laden fehlgeschlagen"));
  }, []);

  React.useEffect(() => {
    setTermine(null);
    void load(monday);
  }, [monday, load]);

  const loadSamples = async () => {
    setBusy("samples");
    try {
      const res = await fetch("/api/termine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loadSamples: true }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      await load(monday);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const create = async () => {
    if (!form.title.trim() || !form.day) {
      toast.error(en ? "Title and day are required." : "Titel und Tag sind Pflicht.");
      return;
    }
    setSaving(true);
    try {
      const start = new Date(`${form.day}T${form.time}:00`);
      const res = await fetch("/api/termine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          location: form.location,
          start: start.toISOString(),
          durationMin: Number(form.durationMin),
          kind: form.kind,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setAddOpen(false);
      setForm(EMPTY_FORM);
      toast.success(en ? "Appointment added" : "Termin eingetragen");
      await load(monday);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    setBusy(id);
    try {
      const res = await fetch(`/api/termine/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error);
      setTermine((t) => t?.filter((x) => x.id !== id) ?? null);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const shiftWeek = (delta: number) => {
    const next = new Date(monday);
    next.setDate(next.getDate() + delta * 7);
    setMonday(next);
  };

  const fr = days[4];
  const weekLabel = `KW ${isoWeek(monday)} · ${monday.toLocaleDateString("de-DE", { day: "numeric", month: monday.getMonth() === fr.getMonth() ? undefined : "short" })}–${fr.toLocaleDateString("de-DE", { day: "numeric", month: "long" })}`;

  return (
    <div className="space-y-5">
      {/* Week nav */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 rounded-full bg-card p-1 shadow-sm">
          <button
            onClick={() => shiftWeek(-1)}
            className="rounded-full p-2 hover:bg-secondary"
            aria-label={en ? "Previous week" : "Vorherige Woche"}
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="px-2 font-mono text-sm">{weekLabel}</span>
          <button
            onClick={() => shiftWeek(1)}
            className="rounded-full p-2 hover:bg-secondary"
            aria-label={en ? "Next week" : "Nächste Woche"}
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
        <Button variant="outline" className="rounded-full" onClick={() => setMonday(mondayOf(new Date()))}>
          {en ? "Today" : "Heute"}
        </Button>
        <span className="flex-1" />
        <Button onClick={() => setAddOpen(true)} className="rounded-full">
          <Plus className="size-4" />
          {en ? "Add appointment" : "Termin eintragen"}
        </Button>
      </div>

      {termine === null ? (
        <div className="flex justify-center rounded-2xl bg-card p-16 shadow-sm">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : termine.length === 0 ? (
        <div className="rounded-2xl bg-card p-12 text-center shadow-sm">
          <CalendarDays className="mx-auto size-12 text-muted-foreground/40" />
          <p className="mt-4 text-lg font-semibold">{en ? "No appointments this week" : "Keine Termine in dieser Woche"}</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            {en ? "Add appointments manually — syncing your existing calendars (Google/Outlook/CalDAV) arrives with Wave 2." : "Trag Termine manuell ein — die Anbindung deiner bestehenden Kalender (Google/Outlook/CalDAV) kommt mit Welle 2."}
          </p>
          <Button className="mt-6" onClick={loadSamples} disabled={busy === "samples"}>
            {busy === "samples" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {en ? "Load sample week" : "Beispielwoche laden"}
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {days.map((day) => {
            const dayItems = termine
              .filter((t) => {
                const s = new Date(t.start);
                return s.toDateString() === day.toDateString();
              })
              .sort((a, b) => +new Date(a.start) - +new Date(b.start));
            const isToday = day.toDateString() === new Date().toDateString();
            return (
              <div
                key={day.toISOString()}
                className={cn("rounded-2xl bg-card p-3 shadow-sm", isToday && "ring-2 ring-primary/60")}
              >
                <p className="px-1 pb-2 text-xs font-semibold text-muted-foreground">
                  {day.toLocaleDateString(en ? "en-GB" : "de-DE", { weekday: "short" })}{" "}
                  <span className="font-mono">{day.getDate()}.</span>
                  {isToday && <span className="ml-1.5 text-primary">{en ? "today" : "heute"}</span>}
                </p>
                <div className="space-y-2">
                  {dayItems.map((t) => (
                    <div
                      key={t.id}
                      className={cn("group rounded-lg px-2.5 py-2", KIND_STYLES[t.kind] ?? KIND_STYLES.termin)}
                    >
                      <p className="flex items-start justify-between gap-1 text-xs font-semibold leading-snug">
                        {t.title}
                        <button
                          onClick={() => remove(t.id)}
                          disabled={busy === t.id}
                          className="opacity-0 transition-opacity group-hover:opacity-100"
                          aria-label={en ? "Delete appointment" : "Termin löschen"}
                        >
                          <Trash2 className="size-3 text-muted-foreground hover:text-destructive" />
                        </button>
                      </p>
                      <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                        {new Date(t.start).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
                        {" · "}
                        {t.durationMin} {en ? "min" : "Min"}
                      </p>
                      {t.location && (
                        <p className="mt-0.5 truncate text-[10px] text-muted-foreground">{t.location}</p>
                      )}
                    </div>
                  ))}
                  {dayItems.length === 0 && (
                    <p className="px-1 py-3 text-center text-[11px] text-muted-foreground/50">{en ? "free" : "frei"}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="theme-paper sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{en ? "Add appointment" : "Termin eintragen"}</DialogTitle>
            <DialogDescription>{en ? "Local appointment — calendar sync follows with Wave 2." : "Lokaler Termin — Kalender-Sync folgt mit Welle 2."}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="t-title">{en ? "Title *" : "Titel *"}</Label>
              <Input
                id="t-title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="z. B. Aufmaß Badsanierung"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="t-location">{en ? "Location / customer" : "Ort / Kunde"}</Label>
              <Input
                id="t-location"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="Familie Krause · Birkenstr. 4"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="t-day">{en ? "Day *" : "Tag *"}</Label>
                <Input
                  id="t-day"
                  type="date"
                  value={form.day}
                  onChange={(e) => setForm((f) => ({ ...f, day: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="t-time">{en ? "Time" : "Uhrzeit"}</Label>
                <Input
                  id="t-time"
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="t-dur">{en ? "Duration (min)" : "Dauer (Min)"}</Label>
                <Input
                  id="t-dur"
                  inputMode="numeric"
                  value={form.durationMin}
                  onChange={(e) => setForm((f) => ({ ...f, durationMin: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{en ? "Kind" : "Art"}</Label>
              <Select value={form.kind} onValueChange={(v) => setForm((f) => ({ ...f, kind: v }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {KINDS.map((k) => (
                    <SelectItem key={k.value} value={k.value}>
                      {en ? k.labelEn : k.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setAddOpen(false)} disabled={saving}>
              {en ? "Cancel" : "Abbrechen"}
            </Button>
            <Button onClick={create} disabled={saving}>
              {saving && <Loader2 className="size-4 animate-spin" />}
              {en ? "Add" : "Eintragen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
