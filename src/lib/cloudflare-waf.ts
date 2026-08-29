import { AI_CRAWLER_USER_AGENTS } from '#/lib/ai-crawlers'

/** Cloudflare Rules language skip-rule expression for known AI agent User-Agents. */
export function buildAiCrawlerSkipExpression(): string {
  const ua = AI_CRAWLER_USER_AGENTS.map((token) => `http.user_agent contains "${token}"`).join(
    ' or ',
  )
  return `(${ua})`
}

export const AI_BOT_ZONE_SETTINGS = {
  /** Legacy "Block AI bots" zone setting — must be disabled for agent crawlers. */
  ai_bots_protection: 'disabled',
  bot_fight_mode: 'off',
} as const
