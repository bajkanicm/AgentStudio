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
import type { Lang } from "@/lib/lang-shared";

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
  { value: "auto", label: "Auto (bestes verfügbares Modell)", labelEn: "Auto (best available model)" },
  { value: "claude", label: "Claude (Anthropic)", labelEn: "Claude (Anthropic)" },
  { value: "gpt", label: "GPT (OpenAI)", labelEn: "GPT (OpenAI)" },
];

export function AgentSettingsForm({
  value,
  onChange,
  compact,
  lang = "de",
}: {
  value: AgentSettings;
  onChange: (next: AgentSettings) => void;
  /** Tighter spacing for the side-panel layout. */
  compact?: boolean;
  lang?: Lang;
}) {
  const en = lang === "en";
  const set = <K extends keyof AgentSettings>(key: K, v: AgentSettings[K]) =>
    onChange({ ...value, [key]: v });

  return (
    <div className={compact ? "space-y-5" : "space-y-6"}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="agent-name">Name</Label>
          <Input
            id="agent-name"
            value={value.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder={en ? "e.g. Phone assistant Smith Plumbing" : "z. B. Telefonassistent Mustermann SHK"}
            maxLength={120}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="agent-model">{en ? "Model" : "Modell"}</Label>
          <Select value={value.model} onValueChange={(v) => set("model", v)}>
            <SelectTrigger id="agent-model" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MODELS.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {en ? m.labelEn : m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="agent-description">{en ? "Description" : "Beschreibung"}</Label>
        <Input
          id="agent-description"
          value={value.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder={en ? "What does this AI employee handle for you?" : "Was übernimmt dieser KI-Mitarbeiter für dich?"}
          maxLength={500}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <Label htmlFor="agent-prompt">{en ? "System prompt" : "System-Prompt"}</Label>
          <span className="text-xs text-muted-foreground">
            {value.systemPrompt.length.toLocaleString()} {en ? "chars" : "Zeichen"}
          </span>
        </div>
        <Textarea
          id="agent-prompt"
          value={value.systemPrompt}
          onChange={(e) => set("systemPrompt", e.target.value)}
          rows={compact ? 8 : 10}
          className="font-mono text-xs leading-relaxed"
          placeholder={en ? "Who is this AI employee, what is its job, where are its limits …" : "Wer ist dieser KI-Mitarbeiter, was ist sein Job, wo sind seine Grenzen …"}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="agent-tone">{en ? "Tone / personality" : "Ton / Persönlichkeit"}</Label>
          <Select value={value.tone} onValueChange={(v) => set("tone", v)}>
            <SelectTrigger id="agent-tone" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TONES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {en ? t.labelEn : t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <Label>{en ? "Temperature" : "Temperatur"}</Label>
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
            <span>{en ? "Precise" : "Präzise"}</span>
            <span>{en ? "Creative" : "Kreativ"}</span>
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <Label htmlFor="agent-kb">{en ? "Knowledge base" : "Wissensbasis"}</Label>
          <span className="text-xs text-muted-foreground">
            {value.knowledgeBase.length.toLocaleString()} {en ? "chars" : "Zeichen"}
          </span>
        </div>
        <Textarea
          id="agent-kb"
          value={value.knowledgeBase}
          onChange={(e) => set("knowledgeBase", e.target.value)}
          rows={compact ? 6 : 8}
          placeholder={
            en
              ? "Prices, services, opening hours, emergency numbers …\nThe AI employee grounds its answers in this knowledge."
              : "Preise, Leistungen, Öffnungszeiten, Notfallnummern …\nDer KI-Mitarbeiter stützt seine Antworten auf dieses Wissen."
          }
        />
        <Button type="button" variant="outline" size="sm" disabled className="gap-1.5">
          <FileUp className="size-3.5" />
          {en ? "Upload files — coming soon" : "Dateien hochladen — bald verfügbar"}
        </Button>
      </div>
    </div>
  );
}
