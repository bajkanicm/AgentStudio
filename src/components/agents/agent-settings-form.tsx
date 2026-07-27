"use client";

import * as React from "react";
import { TONES } from "@/lib/agent-templates";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileUp } from "lucide-react";

export interface AgentSettings {
  name: string;
  description: string;
  systemPrompt: string;
  tone: string;
  temperature: number;
  knowledgeBase: string;
  model: string;
}

const MODELS = [
  { value: "auto", label: "Auto (best available)" },
  { value: "claude", label: "Claude (Anthropic)" },
  { value: "gpt", label: "GPT (OpenAI)" },
];

export function AgentSettingsForm({
  value,
  onChange,
  compact,
}: {
  value: AgentSettings;
  onChange: (next: AgentSettings) => void;
  /** Tighter spacing for the side-panel layout. */
  compact?: boolean;
}) {
  const set = <K extends keyof AgentSettings>(key: K, v: AgentSettings[K]) =>
    onChange({ ...value, [key]: v });

  return (
    <div className={compact ? "space-y-5" : "space-y-6"}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="agent-name">Agent name</Label>
          <Input
            id="agent-name"
            value={value.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Acme Sales Bot"
            maxLength={120}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="agent-model">Model</Label>
          <Select value={value.model} onValueChange={(v) => set("model", v)}>
            <SelectTrigger id="agent-model" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MODELS.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="agent-description">Description</Label>
        <Input
          id="agent-description"
          value={value.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="What does this agent do for you?"
          maxLength={500}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <Label htmlFor="agent-prompt">System prompt</Label>
          <span className="text-xs text-muted-foreground">
            {value.systemPrompt.length.toLocaleString()} chars
          </span>
        </div>
        <Textarea
          id="agent-prompt"
          value={value.systemPrompt}
          onChange={(e) => set("systemPrompt", e.target.value)}
          rows={compact ? 8 : 10}
          className="font-mono text-xs leading-relaxed"
          placeholder="Define who this agent is, its job, and its guardrails…"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="agent-tone">Tone / personality</Label>
          <Select value={value.tone} onValueChange={(v) => set("tone", v)}>
            <SelectTrigger id="agent-tone" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TONES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <Label>Temperature</Label>
            <span className="text-xs tabular-nums text-muted-foreground">
              {value.temperature.toFixed(2)}
            </span>
          </div>
          <Slider
            value={[value.temperature]}
            onValueChange={([v]) => set("temperature", v)}
            min={0}
            max={1}
            step={0.05}
            className="py-2"
          />
          <p className="flex justify-between text-[10px] text-muted-foreground">
            <span>Precise</span>
            <span>Creative</span>
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <Label htmlFor="agent-kb">Knowledge base</Label>
          <span className="text-xs text-muted-foreground">
            {value.knowledgeBase.length.toLocaleString()} chars
          </span>
        </div>
        <Textarea
          id="agent-kb"
          value={value.knowledgeBase}
          onChange={(e) => set("knowledgeBase", e.target.value)}
          rows={compact ? 6 : 8}
          placeholder={
            "Paste your docs, FAQs, pricing, policies…\nThe agent grounds its answers in this content."
          }
        />
        <Button type="button" variant="outline" size="sm" disabled className="gap-1.5">
          <FileUp className="size-3.5" />
          Upload files — coming soon
        </Button>
      </div>
    </div>
  );
}
