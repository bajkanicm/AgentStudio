"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Agent } from "@prisma/client";
import { getTemplate } from "@/lib/agent-templates";
import { AgentChat } from "@/components/chat/agent-chat";
import {
  AgentSettingsForm,
  type AgentSettings,
} from "@/components/agents/agent-settings-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Lang } from "@/lib/lang-shared";
import {
  ArrowLeft,
  Loader2,
  MessageSquare,
  Save,
  Settings2,
  Trash2,
} from "lucide-react";

type SerializedAgent = Pick<
  Agent,
  | "id"
  | "templateSlug"
  | "name"
  | "description"
  | "systemPrompt"
  | "tone"
  | "temperature"
  | "knowledgeBase"
  | "model"
>;

export function AgentWorkspace({ agent, lang = "de" }: { agent: SerializedAgent; lang?: Lang }) {
  const en = lang === "en";
  const router = useRouter();
  const template = getTemplate(agent.templateSlug);
  const [tab, setTab] = React.useState<"chat" | "settings">("chat");
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [settings, setSettings] = React.useState<AgentSettings>({
    name: agent.name,
    description: agent.description,
    systemPrompt: agent.systemPrompt,
    tone: agent.tone,
    temperature: agent.temperature,
    knowledgeBase: agent.knowledgeBase,
    model: agent.model,
  });
  const [saved, setSaved] = React.useState<AgentSettings>(settings);
  const dirty = React.useMemo(
    () => JSON.stringify(settings) !== JSON.stringify(saved),
    [settings, saved]
  );

  const save = async () => {
    if (!settings.name.trim() || !settings.systemPrompt.trim()) {
      toast.error(en ? "Your AI employee needs a name and a system prompt." : "Dein KI-Mitarbeiter braucht einen Namen und einen System-Prompt.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/agents/${agent.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? (en ? "Save failed" : "Speichern fehlgeschlagen"));
      setSaved(settings);
      toast.success(en ? "Saved" : "Gespeichert");
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/agents/${agent.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? (en ? "Delete failed" : "Löschen fehlgeschlagen"));
      }
      toast.success(en ? "AI employee deleted" : "KI-Mitarbeiter gelöscht");
      router.push("/dashboard/agents");
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message);
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div className="flex h-[calc(100dvh-230px)] min-h-[540px] flex-col overflow-hidden rounded-2xl bg-card">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3 sm:px-6">
        <Button variant="ghost" size="icon" className="shrink-0" asChild>
          <Link href="/dashboard/agents" aria-label={en ? "Back to overview" : "Zurück zur Übersicht"}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <span className="hidden size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-lg sm:flex">
          {template?.emoji ?? "🤖"}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-medium leading-tight">{settings.name}</h1>
          <p className="hidden truncate text-xs text-muted-foreground sm:block">
            {(en ? template?.nameEn : template?.name) ?? agent.templateSlug}
            {dirty && (en ? " · unsaved changes" : " · ungespeicherte Änderungen")}
          </p>
        </div>
        <Badge
          variant="outline"
          className="hidden shrink-0 text-[10px] uppercase md:inline-flex"
        >
          {settings.model === "auto" ? (en ? "Auto model" : "Auto-Modell") : settings.model}
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 text-muted-foreground hover:text-destructive"
          onClick={() => setConfirmDelete(true)}
          aria-label={en ? "Delete AI employee" : "KI-Mitarbeiter löschen"}
        >
          <Trash2 className="size-4" />
        </Button>
        <Button
          onClick={save}
          disabled={saving || !dirty}
          size="sm"
          className={cn("shrink-0", dirty && "glow-primary")}
        >
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          <span className="hidden sm:inline">{dirty ? (en ? "Save" : "Speichern") : en ? "Saved" : "Gespeichert"}</span>
        </Button>
      </div>

      {/* Mobile tab switch */}
      <div className="grid grid-cols-2 border-b border-border lg:hidden">
        {(
          [
            { key: "chat", label: "Playground", icon: MessageSquare },
            { key: "settings", label: en ? "Customize" : "Anpassen", icon: Settings2 },
          ] as const
        ).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex items-center justify-center gap-2 py-2.5 text-sm transition-colors",
              tab === t.key
                ? "border-b-2 border-primary font-medium text-foreground"
                : "text-muted-foreground"
            )}
          >
            <t.icon className="size-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="flex min-h-0 flex-1">
        {/* Chat */}
        <div
          className={cn(
            "min-w-0 flex-1 flex-col",
            tab === "chat" ? "flex" : "hidden lg:flex"
          )}
        >
          <AgentChat
            endpoint="/api/chat"
            config={{
              templateSlug: agent.templateSlug,
              agentId: agent.id,
              name: settings.name,
              systemPrompt: settings.systemPrompt,
              tone: settings.tone,
              temperature: settings.temperature,
              knowledgeBase: settings.knowledgeBase,
              model: settings.model,
            }}
            greeting={en ? template?.demoGreetingEn : template?.demoGreeting}
            suggestions={en ? template?.suggestedQuestionsEn && [...template.suggestedQuestionsEn] : template?.suggestedQuestions && [...template.suggestedQuestions]}
            placeholder={en ? "Type a message…" : "Nachricht schreiben…"}
            onAssistantDone={() => router.refresh()}
          />
        </div>

        {/* Settings panel */}
        <aside
          className={cn(
            "min-w-0 flex-1 overflow-y-auto border-border p-4 sm:p-6 lg:block lg:max-w-md lg:flex-none lg:border-l",
            tab === "settings" ? "block" : "hidden"
          )}
        >
          <div className="mb-5 hidden lg:block">
            <h2 className="flex items-center gap-2 font-medium">
              <Settings2 className="size-4 text-primary" />
              {en ? "Customize" : "Anpassen"}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {en ? "Changes apply instantly in the playground — Save makes them permanent." : "Änderungen gelten sofort im Playground — Speichern macht sie dauerhaft."}
            </p>
          </div>
          <AgentSettingsForm value={settings} onChange={setSettings} compact lang={lang} />
        </aside>
      </div>

      {/* Delete confirmation */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{en ? `Delete "${settings.name}"?` : `„${settings.name}“ löschen?`}</DialogTitle>
            <DialogDescription>
              {en ? "This permanently removes the AI employee and its conversation history. This cannot be undone." : "Das entfernt den KI-Mitarbeiter und seine Gesprächshistorie dauerhaft. Das lässt sich nicht rückgängig machen."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmDelete(false)} disabled={deleting}>
              {en ? "Cancel" : "Abbrechen"}
            </Button>
            <Button variant="destructive" onClick={remove} disabled={deleting}>
              {deleting && <Loader2 className="size-4 animate-spin" />}
              {en ? "Delete permanently" : "Endgültig löschen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
