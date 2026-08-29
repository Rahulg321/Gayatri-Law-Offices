import { describe, expect, it } from 'vitest'
import { AI_CRAWLER_USER_AGENTS } from '#/lib/ai-crawlers'
import { AI_BOT_ZONE_SETTINGS, buildAiCrawlerSkipExpression } from '#/lib/cloudflare-waf'

describe('Cloudflare AI crawler allow policy', () => {
  it('builds a skip expression covering required agent User-Agents', () => {
    const expr = buildAiCrawlerSkipExpression()
    for (const ua of ['ChatGPT-User', 'ClaudeBot', 'Google-Extended', 'DeepSeekBot', 'GPTBot', 'ora-agent']) {
      expect(AI_CRAWLER_USER_AGENTS).toContain(ua)
      expect(expr).toContain(`http.user_agent contains "${ua}"`)
    }
    expect(AI_BOT_ZONE_SETTINGS.ai_bots_protection).toBe('disabled')
    expect(AI_BOT_ZONE_SETTINGS.bot_fight_mode).toBe('off')
  })
})
