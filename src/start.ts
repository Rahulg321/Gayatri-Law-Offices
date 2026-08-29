import { createStart } from '@tanstack/react-start'
import { agentContentMiddleware } from '#/lib/agent-request-middleware'

export const startInstance = createStart(() => ({
  requestMiddleware: [agentContentMiddleware],
}))
