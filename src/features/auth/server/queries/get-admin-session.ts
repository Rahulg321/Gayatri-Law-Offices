import { createServerFn } from '@tanstack/react-start'
import { fetchAdminSession } from '#/features/auth/server/get-session-user'

export const getAdminSession = createServerFn({ method: 'GET' }).handler(async () => {
  return fetchAdminSession()
})
