import { cache } from 'cloudflare:workers'
import { PUBLIC_CMS_CACHE_TAG } from '#/lib/cms-route-cache'

/** Invalidate Workers Cache entries tagged for public CMS HTML. */
export async function purgePublicCmsWorkersCache(): Promise<void> {
  await cache.purge({ tags: [PUBLIC_CMS_CACHE_TAG] })
}
