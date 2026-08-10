import { createServerFn } from '@tanstack/react-start'
import { fetchAdminSession } from '#/lib/admin-auth.server'

export const getAdminSession = createServerFn({ method: 'GET' }).handler(async () => {
  return fetchAdminSession()
})
