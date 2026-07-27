import { db } from "@/lib/db";
import { getPlan } from "@/lib/plans";

export interface UsageSummary {
  planId: string;
  planName: string;
  messagesUsed: number;
  messagesLimit: number; // -1 = unlimited
  tokensUsed: number;
  agentsUsed: number;
  agentsLimit: number; // -1 = unlimited
  conversations: number;
  periodStart: Date;
}

/** Usage for the current calendar month. */
export async function getUsage(userId: string, planId: string): Promise<UsageSummary> {
  const plan = getPlan(planId);
  const periodStart = new Date();
  periodStart.setDate(1);
  periodStart.setHours(0, 0, 0, 0);

  const [messagesUsed, tokenAgg, agentsUsed, conversations] = await Promise.all([
    db.message.count({
      where: {
        role: "assistant",
        createdAt: { gte: periodStart },
        conversation: { userId },
      },
    }),
    db.message.aggregate({
      _sum: { tokens: true },
      where: { createdAt: { gte: periodStart }, conversation: { userId } },
    }),
    db.agent.count({ where: { userId } }),
    db.conversation.count({ where: { userId, createdAt: { gte: periodStart } } }),
  ]);

  return {
    planId: plan.id,
    planName: plan.name,
    messagesUsed,
    messagesLimit: plan.limits.messagesPerMonth,
    tokensUsed: tokenAgg._sum.tokens ?? 0,
    agentsUsed,
    agentsLimit: plan.limits.agents,
    conversations,
    periodStart,
  };
}

export function overMessageLimit(usage: UsageSummary): boolean {
  return usage.messagesLimit !== -1 && usage.messagesUsed >= usage.messagesLimit;
}
