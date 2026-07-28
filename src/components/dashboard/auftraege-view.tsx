"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { ArrowRight, Inbox, Loader2, Plus, Sparkles, Trash2 } from "lucide-react";
import type { Lang } from "@/lib/lang-shared";

interface Auftrag {
  id: string;
  title: string;
  customer: string;
  note: string;
  status: string;
  priority: string;
  source: string;
  createdAt: string;
}

const COLUMNS = [
  { value: "neu", label: "Neu", labelEn: "New" },
  { value: "in_arbeit", label: "In Arbeit", labelEn: "In progress" },
  { value: "wartet_kunde", label: "Wartet auf Kunde", labelEn: "Waiting on customer" },
  { value: "erledigt", label: "Erledigt", labelEn: "Done" },
] as const;

const SOURCE_LABEL: Record<string, string> = {
  telefon: "Telefon",
  mail: "Mail",
  webformular: "Webformular",
  manuell: "Manuell",
};

const EMPTY_FORM = { title: "", customer: "", note: "", priority: "normal" };

export function AuftraegeView({ lang = "de" }: { lang?: Lang }) {
  const en = lang === "en";
  const [items, setItems] = React.useState<Auftrag[] | null>(null);
  const [busy, setBusy] = React.useState<string | null>(null);
  const [addOpen, setAddOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState(EMPTY_FORM);

  const load = React.useCallback(async () => {
    const res = await fetch("/api/auftraege");
    const data = await res.json();
    if (res.ok) setItems(data.auftraege);
    else toast.error(data.error ?? "Laden fehlgeschlagen");
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const loadSamples = async () => {
    setBusy("samples");
    try {
      const res = await fetch("/api/auftraege", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loadSamples: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setItems(data.auftraege);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const create = async () => {
    if (!form.title.trim()) {
      toast.error(en ? "Give the case a title." : "Gib dem Vorgang einen Titel.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/auftraege", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, status: "neu", source: "manuell" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setItems((it) => [data.auftrag, ...(it ?? [])]);
      setAddOpen(false);
      setForm(EMPTY_FORM);
      toast.success(en ? "Case created" : "Vorgang angelegt");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const move = async (id: string, status: string) => {
    setBusy(id);
    try {
      const res = await fetch(`/api/auftraege/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setItems((it) => it?.map((x) => (x.id === id ? { ...x, status } : x)) ?? null);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const remove = async (id: string) => {
    setBusy(id);
    try {
      const res = await fetch(`/api/auftraege/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error);
      setItems((it) => it?.filter((x) => x.id !== id) ?? null);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(null);
    }
  };

  if (items === null) {
    return (
      <div className="flex justify-center rounded-2xl bg-card p-16 shadow-sm">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {en ? "Every customer request becomes a case — from phone, mail and web form. Nothing gets lost." : "Jede Kundenanfrage wird ein Vorgang — aus Telefon, Mail und Webformular. Nichts geht unter."}
        </p>
        <Button onClick={() => setAddOpen(true)} className="rounded-full">
          <Plus className="size-4" />
          {en ? "Create case" : "Vorgang anlegen"}
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl bg-card p-12 text-center shadow-sm">
          <Inbox className="mx-auto size-12 text-muted-foreground/40" />
          <p className="mt-4 text-lg font-semibold">{en ? "No cases yet" : "Noch keine Vorgänge"}</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            {en ? "Create requests and jobs as cases and move them across the columns to Done." : "Lege Anfragen und Aufträge als Vorgänge an und zieh sie durch die Spalten bis „Erledigt“."}
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
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {COLUMNS.map((col) => {
            const colItems = items.filter((x) => x.status === col.value);
            return (
              <div key={col.value} className="rounded-2xl bg-card/60 p-3">
                <p className="flex items-center justify-between px-2 py-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {en ? col.labelEn : col.label}
                  <span className="rounded-full bg-card px-2 py-0.5 font-mono">
                    {colItems.length}
                  </span>
                </p>
                <div className="mt-1 space-y-2.5">
                  {colItems.map((item) => (
                    <div key={item.id} className="group rounded-xl bg-card p-3.5 shadow-sm">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold leading-snug">{item.title}</p>
                        {item.priority === "dringend" && item.status !== "erledigt" && (
                          <span className="shrink-0 rounded-full bg-[#f8e3e0] px-2 py-0.5 text-[10px] font-semibold text-[#96291d]">
                            {en ? "Urgent" : "Dringend"}
                          </span>
                        )}
                      </div>
                      {item.customer && (
                        <p className="mt-1 text-xs text-muted-foreground">{item.customer}</p>
                      )}
                      {item.note && (
                        <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">
                          {item.note}
                        </p>
                      )}
                      <div className="mt-3 flex items-center gap-1.5">
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                          {SOURCE_LABEL[item.source] ?? item.source}
                        </span>
                        <span className="flex-1" />
                        <Select
                          value={item.status}
                          onValueChange={(v) => move(item.id, v)}
                          disabled={busy === item.id}
                        >
                          <SelectTrigger className="h-7 w-auto gap-1 rounded-full border-0 bg-secondary px-2.5 text-[11px] shadow-none">
                            <ArrowRight className="size-3" />
                          </SelectTrigger>
                          <SelectContent>
                            {COLUMNS.map((c) => (
                              <SelectItem key={c.value} value={c.value}>
                                {en ? c.labelEn : c.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <button
                          onClick={() => remove(item.id)}
                          disabled={busy === item.id}
                          className="rounded-full p-1.5 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                          aria-label={en ? "Delete case" : "Vorgang löschen"}
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {colItems.length === 0 && (
                    <p className="px-2 py-4 text-center text-xs text-muted-foreground/60">
                      {en ? "No cases" : "Keine Vorgänge"}
                    </p>
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
            <DialogTitle>{en ? "Create case" : "Vorgang anlegen"}</DialogTitle>
            <DialogDescription>
              {en ? "Request, job or to-do — lands in the New column." : "Anfrage, Auftrag oder To-do — landet in der Spalte „Neu“."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="a-title">{en ? "Title *" : "Titel *"}</Label>
              <Input
                id="a-title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="z. B. Anfrage Badsanierung – Fotos anbei"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="a-customer">{en ? "Customer" : "Kunde"}</Label>
                <Input
                  id="a-customer"
                  value={form.customer}
                  onChange={(e) => setForm((f) => ({ ...f, customer: e.target.value }))}
                  placeholder="Familie Krause"
                />
              </div>
              <div className="space-y-2">
                <Label>{en ? "Priority" : "Priorität"}</Label>
                <Select
                  value={form.priority}
                  onValueChange={(v) => setForm((f) => ({ ...f, priority: v }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="dringend">{en ? "Urgent" : "Dringend"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="a-note">{en ? "Note" : "Notiz"}</Label>
              <Textarea
                id="a-note"
                rows={3}
                value={form.note}
                onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                placeholder={en ? "Details, next steps …" : "Details, nächste Schritte …"}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setAddOpen(false)} disabled={saving}>
              {en ? "Cancel" : "Abbrechen"}
            </Button>
            <Button onClick={create} disabled={saving}>
              {saving && <Loader2 className="size-4 animate-spin" />}
              {en ? "Create" : "Anlegen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
