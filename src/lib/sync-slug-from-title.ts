import { slugifyTitle } from '#/lib/slugify'

type SlugForm = {
  setFieldValue: (name: 'slug', value: string) => void
}

/** Keep slug in sync with title as the user types. */
export function syncSlugFromTitle(form: SlugForm, title: string) {
  const next = slugifyTitle(title)
  form.setFieldValue('slug', next)
}
