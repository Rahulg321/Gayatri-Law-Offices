/** Known AI agent / crawler User-Agent tokens to allow in robots.txt and WAF policy. */
export const AI_CRAWLER_USER_AGENTS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'Google-Extended',
  'Googlebot',
  'PerplexityBot',
  'Perplexity-User',
  'Applebot-Extended',
  'Applebot',
  'DeepSeekBot',
  'Bytespider',
  'CCBot',
  'Amazonbot',
  'meta-externalagent',
  'DuckAssistBot',
  'ora-agent',
] as const

export type AiCrawlerUserAgent = (typeof AI_CRAWLER_USER_AGENTS)[number]

export function isListedAiCrawlerUserAgent(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false
  const haystack = userAgent.toLowerCase()
  return AI_CRAWLER_USER_AGENTS.some((token) => haystack.includes(token.toLowerCase()))
}
