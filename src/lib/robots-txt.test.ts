import { describe, expect, it } from 'vitest'
import { AI_CRAWLER_USER_AGENTS, isListedAiCrawlerUserAgent } from '#/lib/ai-crawlers'
import { buildRobotsTxt } from '#/lib/robots-txt'

describe('robots.txt for AI agents', () => {
  it('allowlists required agent User-Agents and does not Disallow them', () => {
    const robots = buildRobotsTxt('https://gayatrilegalsolutions.com')
    const required = ['ChatGPT-User', 'ClaudeBot', 'Google-Extended', 'DeepSeekBot', 'GPTBot', 'PerplexityBot']

    for (const ua of required) {
      expect(AI_CRAWLER_USER_AGENTS).toContain(ua)
      expect(robots).toContain(`User-agent: ${ua}\nAllow: /`)
      expect(robots).not.toMatch(new RegExp(`User-agent: ${ua}\\s+Disallow: /`))
    }

    expect(robots).toContain('Sitemap: https://gayatrilegalsolutions.com/sitemap.xml')
    expect(robots).toContain('ai-input=yes')
  })

  it('matches listed crawler tokens inside full User-Agent strings', () => {
    expect(
      isListedAiCrawlerUserAgent(
        'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)',
      ),
    ).toBe(true)
    expect(isListedAiCrawlerUserAgent('ChatGPT-User')).toBe(true)
    expect(isListedAiCrawlerUserAgent('Mozilla/5.0')).toBe(false)
  })
})
