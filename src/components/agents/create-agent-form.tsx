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

export function CreateAgentForm({ template }: { template: AgentTemplate }) {
  const router = useRouter();
  const [saving, setSaving] = React.useState(false);
  const [settings, setSettings] = React.useState<AgentSettings>({
    name: template.name,
    description: template.description,
    systemPrompt: template.systemPrompt,
    tone: "professional",
    temperature: 0.7,
    knowledgeBase: "",
    model: "auto",
  });

  const save = async () => {
    if (!settings.name.trim() || !settings.systemPrompt.trim()) {
      toast.error("Give your agent a name and a system prompt.");
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
      if (!res.ok) throw new Error(data.error ?? "Failed to create agent");
      toast.success("Agent created — take it for a spin!");
      router.push(`/dashboard/agents/${data.agent.id}`);
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message);
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <AgentSettingsForm value={settings} onChange={setSettings} />
      <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
        <Button variant="ghost" onClick={() => router.back()} disabled={saving}>
          Cancel
        </Button>
        <Button onClick={save} disabled={saving} className="min-w-36">
          {saving ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          Create agent
        </Button>
      </div>
    </div>
  );
}
