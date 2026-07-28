"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Lang } from "@/lib/lang-shared";
import {
  CalendarPlus,
  Check,
  Loader2,
  PhoneCall,
  PhoneIncoming,
  Sparkles,
  Trash2,
} from "lucide-react";

interface Call {
  id: string;
  callerName: string;
  callerPhone: string;
  summary: string;
  noteItems: string;
  durationSec: number;
  urgency: string;
  status: string;
  createdAt: string;
}

export function AnrufeView({ lang = "de" }: { lang?: Lang }) {
  const en = lang === "en";
  const router = useRouter();
  const [calls, setCalls] = React.useState<Call[] | null>(null);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    const res = await fetch("/api/anrufe");
    const data = await res.json();
    if (res.ok) {
      setCalls(data.calls);
      setSelectedId((cur) => cur ?? data.calls[0]?.id ?? null);
    } else toast.error(data.error ?? (en ? "Loading failed" : "Laden fehlgeschlagen"));
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const loadSamples = async () => {
    setBusy("samples");
    try {
      const res = await fetch("/api/anrufe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loadSamples: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCalls(data.calls);
      setSelectedId(data.calls[0]?.id ?? null);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const setStatus = async (id: string, status: string) => {
    setBusy(id);
    try {
      const res = await fetch(`/api/anrufe/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setCalls((c) => c?.map((x) => (x.id === id ? { ...x, status } : x)) ?? null);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const remove = async (id: string) => {
    setBusy(id);
    try {
      const res = await fetch(`/api/anrufe/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error);
      setCalls((c) => {
        const next = c?.filter((x) => x.id !== id) ?? null;
        setSelectedId(next?.[0]?.id ?? null);
        return next;
      });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const planCallback = async (call: Call) => {
    setBusy("plan" + call.id);
    try {
      const start = new Date();
      start.setDate(start.getDate() + 1);
      start.setHours(16, 0, 0, 0);
      const res = await fetch("/api/termine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `Rückruf: ${call.callerName}`,
          location: call.callerPhone || call.callerName,
          start: start.toISOString(),
          durationMin: 15,
          kind: "intern",
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success(en ? "Callback scheduled for tomorrow 16:00 in your calendar" : "Rückruf für morgen 16:00 im Kalender eingeplant");
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const selected = calls?.find((c) => c.id === selectedId) ?? null;

  if (calls === null) {
    return (
      <div className="flex justify-center rounded-2xl bg-card p-16 shadow-sm">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (calls.length === 0) {
    return (
      <div className="rounded-2xl bg-card p-12 text-center shadow-sm">
        <PhoneIncoming className="mx-auto size-12 text-muted-foreground/40" />
        <p className="mt-4 text-lg font-semibold">{en ? "No calls yet" : "Noch keine Anrufe"}</p>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
          {en ? "This is where your phone assistant's structured notes land — one per call: name, request, callback number. The real phone line arrives with Wave 2; until then you can work with samples." : "Hier landen die strukturierten Notizen deines Telefonassistenten — eine pro Anruf: Name, Anliegen, Rückrufnummer. Die echte Telefonanbindung kommt mit Welle 2; bis dahin kannst du mit Beispielen arbeiten."}
        </p>
        <Button className="mt-6" onClick={loadSamples} disabled={busy === "samples"}>
          {busy === "samples" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}
          {en ? "Load samples" : "Beispiele laden"}
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
      {/* Letzte Anrufe */}
      <aside className="rounded-3xl bg-card p-4 shadow-sm">
        <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {en ? "Recent calls" : "Letzte Anrufe"}
        </p>
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto lg:max-h-[calc(100dvh-330px)] lg:flex-col lg:overflow-y-auto lg:overflow-x-visible">
          {calls.map((call) => (
            <button
              key={call.id}
              onClick={() => setSelectedId(call.id)}
              className={cn(
                "shrink-0 rounded-xl px-3.5 py-3 text-left transition-colors lg:shrink",
                call.id === selectedId ? "bg-background" : "hover:bg-secondary"
              )}
            >
              <span className="flex items-center gap-2">
                <span className="max-w-40 truncate text-sm font-semibold">{call.callerName}</span>
                <StatusPill call={call} lang={lang} />
              </span>
              <span className="mt-0.5 block font-mono text-[11px] text-muted-foreground">
                {formatWhen(call.createdAt, en)} · {formatDuration(call.durationSec)}
              </span>
            </button>
          ))}
        </div>
      </aside>

      {/* Detail */}
      {selected && (
        <section className="rounded-3xl bg-card p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2.5 font-logo text-xl font-semibold tracking-tight">
                <span className="flex size-9 items-center justify-center rounded-full bg-[#fdeadf] text-[#e8590c]">
                  <PhoneCall className="size-4" />
                </span>
                {selected.callerName}
              </h2>
              <p className="mt-1.5 font-mono text-xs text-muted-foreground">
                {formatWhen(selected.createdAt, en)} · {formatDuration(selected.durationSec)}
                {selected.callerPhone && ` · ${selected.callerPhone}`}
              </p>
            </div>
            <StatusPill call={selected} lang={lang} large />
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {en ? "Summary" : "Zusammenfassung"}
          </p>
          <p className="mt-2 max-w-2xl rounded-2xl rounded-tl-md bg-secondary px-5 py-4 text-sm leading-relaxed">
            {selected.summary}
          </p>

          {selected.noteItems && (
            <>
              <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {en ? "Noted for you" : "Notiert für dich"}
              </p>
              <ul className="mt-2 space-y-2">
                {selected.noteItems.split("\n").filter(Boolean).map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-[#1e7d46]" />
                    {item}
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="mt-8 flex flex-wrap gap-2.5">
            <Button
              onClick={() => planCallback(selected)}
              disabled={busy === "plan" + selected.id}
              className="rounded-full"
            >
              {busy === "plan" + selected.id ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <CalendarPlus className="size-4" />
              )}
              {en ? "Schedule callback" : "Rückruf planen"}
            </Button>
            {selected.status === "neu" ? (
              <Button
                variant="outline"
                className="rounded-full"
                disabled={busy === selected.id}
                onClick={() => setStatus(selected.id, "erledigt")}
              >
                <Check className="size-4" />
                {en ? "Mark as done" : "Als erledigt markieren"}
              </Button>
            ) : (
              <Button
                variant="outline"
                className="rounded-full"
                disabled={busy === selected.id}
                onClick={() => setStatus(selected.id, "neu")}
              >
                {en ? "Reopen" : "Wieder öffnen"}
              </Button>
            )}
            <Button
              variant="ghost"
              className="rounded-full text-muted-foreground hover:text-destructive"
              disabled={busy === selected.id}
              onClick={() => remove(selected.id)}
            >
              <Trash2 className="size-4" />
              {en ? "Delete" : "Löschen"}
            </Button>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            {en ? "Recordings & the real phone line follow with Wave 2 — this view already shows the phone assistant's data model." : "Aufzeichnungen & echte Telefonanbindung folgen mit Welle 2 — diese Ansicht zeigt schon das Datenmodell des Telefonassistenten."}
          </p>
        </section>
      )}
    </div>
  );
}

function StatusPill({ call, lang = "de", large }: { call: Call; lang?: Lang; large?: boolean }) {
  const en = lang === "en";
  const cls = large ? "px-3 py-1 text-xs" : "px-2 py-0.5 text-[10px]";
  if (call.urgency === "dringend" && call.status === "neu") {
    return (
      <span className={cn("rounded-full bg-[#f8e3e0] font-semibold text-[#96291d]", cls)}>
        {en ? "Urgent" : "Dringend"}
      </span>
    );
  }
  return call.status === "neu" ? (
    <span className={cn("rounded-full bg-[#fdeadf] font-semibold text-[#a93e06]", cls)}>{en ? "New" : "Neu"}</span>
  ) : (
    <span className={cn("rounded-full bg-[#e1f1e7] font-semibold text-[#17603a]", cls)}>
      {en ? "Done" : "Erledigt"}
    </span>
  );
}

function formatWhen(iso: string, en = false): string {
  const d = new Date(iso);
  const today = new Date();
  const diffDays = Math.floor((today.setHours(0, 0, 0, 0) - new Date(d).setHours(0, 0, 0, 0)) / 86_400_000);
  const time = d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 0) return `${en ? "Today" : "Heute"} ${time}`;
  if (diffDays === 1) return `${en ? "Yesterday" : "Gestern"} ${time}`;
  return `${d.toLocaleDateString(en ? "en-GB" : "de-DE", { weekday: "short" })} ${time}`;
}

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
