import { cache } from 'cloudflare:workers'
import { PUBLIC_CMS_CACHE_TAG } from '#/lib/cms-route-cache'

/** Invalidate cached public HTML after a CMS save/delete. */
export async function purgePublicCmsWorkersCache(): Promise<void> {
  try {
    await cache.purge({ tags: [PUBLIC_CMS_CACHE_TAG] })
  } catch {
    // Local dev / plans without purge must not block saves.
  }
}
