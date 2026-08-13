import { createServerFn } from '@tanstack/react-start'
import {
  ensurePracticeAreasSeeded,
  getPublishedPracticeAreaBySlug,
  listPublishedPracticeAreas,
} from '#/features/practice-areas/server/practice-areas-service'

/** POST so Workers Cache cannot store these (GET 200s with no Cache-Control are cached for 2h). */
export const loadPracticeAreas = createServerFn({ method: 'POST' }).handler(async () => {
  await ensurePracticeAreasSeeded()
  return listPublishedPracticeAreas()
})

export const loadPracticeArea = createServerFn({ method: 'POST' })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    await ensurePracticeAreasSeeded()
    return getPublishedPracticeAreaBySlug(slug)
  })
