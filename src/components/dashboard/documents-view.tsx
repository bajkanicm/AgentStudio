"use client";

import * as React from "react";
import { toast } from "sonner";
import { DOC_STATUS, DOC_TYPES, docStatusMeta, docTypeLabel } from "@/lib/documents";
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
import { cn } from "@/lib/utils";
import { FileText, Loader2, Plus, Search, Sparkles, Trash2 } from "lucide-react";

interface Doc {
  id: string;
  title: string;
  type: string;
  status: string;
  amount: number | null;
  content: string;
  source: string;
  docDate: string;
}

const TONE_CLASSES: Record<string, string> = {
  warning: "bg-[#f8eedc] text-[#8a5a14]",
  success: "bg-[#e1f1e7] text-[#17603a]",
  neutral: "bg-[#efece4] text-[#6b7370]",
  danger: "bg-[#f8e3e0] text-[#96291d]",
};

const EMPTY_FORM = {
  title: "",
  type: "eingangsrechnung",
  status: "abgelegt",
  amount: "",
  content: "",
};

export function DocumentsView() {
  const [docs, setDocs] = React.useState<Doc[] | null>(null);
  const [q, setQ] = React.useState("");
  const [type, setType] = React.useState("alle");
  const [busy, setBusy] = React.useState<string | null>(null);
  const [addOpen, setAddOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState(EMPTY_FORM);

  const load = React.useCallback(async (query: string, t: string) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (t !== "alle") params.set("type", t);
    const res = await fetch(`/api/documents?${params}`);
    const data = await res.json();
    if (res.ok) setDocs(data.documents);
    else toast.error(data.error ?? "Laden fehlgeschlagen");
  }, []);

  React.useEffect(() => {
    const handle = setTimeout(() => void load(q, type), q ? 250 : 0);
    return () => clearTimeout(handle);
  }, [q, type, load]);

  const loadSamples = async () => {
    setBusy("samples");
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loadSamples: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDocs(data.documents);
      toast.success("Beispiel-Dokumente geladen — frag den KI-Chat danach!");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const create = async () => {
    if (!form.title.trim()) {
      toast.error("Gib dem Dokument einen Titel.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          type: form.type,
          status: form.status,
          amount: form.amount ? Number(form.amount.replace(",", ".")) : null,
          content: form.content,
          source: "manuell",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAddOpen(false);
      setForm(EMPTY_FORM);
      toast.success("Dokument abgelegt");
      void load(q, type);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const setStatus = async (id: string, status: string) => {
    setBusy(id);
    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setDocs((d) => d?.map((doc) => (doc.id === id ? { ...doc, status } : doc)) ?? null);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const remove = async (id: string) => {
    setBusy(id);
    try {
      const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error);
      setDocs((d) => d?.filter((doc) => doc.id !== id) ?? null);
      toast.success("Dokument gelöscht");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-52 flex-1">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Dokumente durchsuchen"
            className="h-11 rounded-full bg-card pl-11 shadow-sm"
          />
        </div>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="h-11 w-44 rounded-full bg-card shadow-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alle">Alle Typen</SelectItem>
            {DOC_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={() => setAddOpen(true)} className="h-11 rounded-full">
          <Plus className="size-4" />
          Dokument anlegen
        </Button>
      </div>

      {/* List */}
      {docs === null ? (
        <div className="flex justify-center rounded-2xl bg-card p-16 shadow-sm">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : docs.length === 0 && !q && type === "alle" ? (
        <div className="rounded-2xl bg-card p-12 text-center shadow-sm">
          <FileText className="mx-auto size-12 text-muted-foreground/40" />
          <p className="mt-4 text-lg font-semibold">Deine Ablage ist noch leer</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            Lege Rechnungen, Angebote und Lieferscheine als Text an — Foto- und
            Datei-Upload mit Texterkennung folgt. Oder starte mit Beispielen und
            probier den KI-Chat darauf aus.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button onClick={loadSamples} disabled={busy === "samples"}>
              {busy === "samples" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              Beispiele laden
            </Button>
            <Button variant="outline" onClick={() => setAddOpen(true)}>
              <Plus className="size-4" />
              Eigenes Dokument
            </Button>
          </div>
        </div>
      ) : docs.length === 0 ? (
        <p className="rounded-2xl bg-card p-10 text-center text-sm text-muted-foreground shadow-sm">
          Nichts gefunden — andere Suche oder anderen Typ probieren.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-card shadow-sm">
          {/* Desktop table */}
          <div className="hidden md:block">
            <div className="grid grid-cols-[minmax(0,3fr)_160px_120px_180px_110px] gap-3 border-b border-border px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <span>Dokument</span>
              <span>Typ</span>
              <span className="text-right">Betrag</span>
              <span>Status</span>
              <span />
            </div>
            {docs.map((doc) => (
              <DocRow
                key={doc.id}
                doc={doc}
                busy={busy === doc.id}
                onApprove={() => setStatus(doc.id, "angenommen")}
                onDelete={() => remove(doc.id)}
              />
            ))}
          </div>
          {/* Mobile cards */}
          <div className="divide-y divide-border md:hidden">
            {docs.map((doc) => (
              <div key={doc.id} className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold leading-tight">{doc.title}</p>
                  {doc.amount != null && (
                    <p className="font-mono text-sm">{formatEur(doc.amount)}</p>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-muted-foreground">{docTypeLabel(doc.type)}</span>
                  <StatusBadge status={doc.status} />
                  {doc.status === "wartet_freigabe" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 rounded-full text-xs"
                      disabled={busy === doc.id}
                      onClick={() => setStatus(doc.id, "angenommen")}
                    >
                      Freigeben
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="theme-paper max-h-[90dvh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Dokument anlegen</DialogTitle>
            <DialogDescription>
              Text einfügen genügt — der KI-Chat kann das Dokument sofort finden
              und zitieren. Datei-Upload mit Texterkennung folgt.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="doc-title">Titel *</Label>
              <Input
                id="doc-title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="z. B. RE-2026-0350 · Baustoffe Meyer"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Typ</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DOC_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DOC_STATUS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="doc-amount">Betrag (€, optional)</Label>
              <Input
                id="doc-amount"
                inputMode="decimal"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                placeholder="1240,50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="doc-content">Inhalt / Text</Label>
              <Textarea
                id="doc-content"
                rows={5}
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                placeholder="Rechnungstext, Angebotsinhalt, Notizen …"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setAddOpen(false)} disabled={saving}>
              Abbrechen
            </Button>
            <Button onClick={create} disabled={saving}>
              {saving && <Loader2 className="size-4 animate-spin" />}
              Ablegen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DocRow({
  doc,
  busy,
  onApprove,
  onDelete,
}: {
  doc: Doc;
  busy: boolean;
  onApprove: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group grid grid-cols-[minmax(0,3fr)_160px_120px_180px_110px] items-center gap-3 border-b border-border px-6 py-3.5 last:border-0 hover:bg-secondary/60">
      <div className="min-w-0">
        <p className="truncate font-semibold">{doc.title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {new Date(doc.docDate).toLocaleDateString("de-DE")} · {doc.source}
        </p>
      </div>
      <span className="text-sm text-muted-foreground">{docTypeLabel(doc.type)}</span>
      <span className="text-right font-mono text-sm">
        {doc.amount != null ? formatEur(doc.amount) : "—"}
      </span>
      <span>
        <StatusBadge status={doc.status} />
      </span>
      <span className="flex items-center justify-end gap-1">
        {doc.status === "wartet_freigabe" && (
          <Button
            size="sm"
            variant="outline"
            className="h-8 rounded-full text-xs"
            disabled={busy}
            onClick={onApprove}
          >
            Freigeben
          </Button>
        )}
        <Button
          size="icon"
          variant="ghost"
          className="size-8 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
          disabled={busy}
          onClick={onDelete}
          aria-label="Dokument löschen"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const meta = docStatusMeta(status);
  return (
    <span
      className={cn(
        "inline-block rounded-full px-3 py-1 text-xs font-medium",
        TONE_CLASSES[meta.tone]
      )}
    >
      {meta.label}
    </span>
  );
}

function formatEur(n: number): string {
  return n.toLocaleString("de-DE", { minimumFractionDigits: 2 }) + " €";
}
