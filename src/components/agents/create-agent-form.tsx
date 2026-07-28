"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { AgentTemplate } from "@/lib/agent-templates";
import {
  AgentSettingsForm,
  type AgentSettings,
} from "@/components/agents/agent-settings-form";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import type { Lang } from "@/lib/lang-shared";

export function CreateAgentForm({ template, lang = "de" }: { template: AgentTemplate; lang?: Lang }) {
  const en = lang === "en";
  const router = useRouter();
  const [saving, setSaving] = React.useState(false);
  const [settings, setSettings] = React.useState<AgentSettings>({
    name: en ? template.nameEn : template.name,
    description: en ? template.descriptionEn : template.description,
    systemPrompt: template.systemPrompt,
    tone: "professional",
    temperature: 0.7,
    knowledgeBase: "",
    model: "auto",
  });

  const save = async () => {
    if (!settings.name.trim() || !settings.systemPrompt.trim()) {
      toast.error(en ? "Your AI employee needs a name and a system prompt." : "Dein KI-Mitarbeiter braucht einen Namen und einen System-Prompt.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...settings, templateSlug: template.slug }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? (en ? "Creation failed" : "Anlegen fehlgeschlagen"));
      toast.success(en ? "AI employee created — try it right away!" : "KI-Mitarbeiter angelegt — probier ihn gleich aus!");
      router.push(`/dashboard/agents/${data.agent.id}`);
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message);
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <AgentSettingsForm value={settings} onChange={setSettings} lang={lang} />
      <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
        <Button variant="ghost" onClick={() => router.back()} disabled={saving}>
          {en ? "Cancel" : "Abbrechen"}
        </Button>
        <Button onClick={save} disabled={saving} className="min-w-36">
          {saving ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          {en ? "Create" : "Anlegen"}
        </Button>
      </div>
    </div>
  );
}
