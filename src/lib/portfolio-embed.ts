/** Derive sanctioned embed iframe src for YouTube / Vimeo URLs only (no arbitrary HTML embeds). */

export function youtubeEmbedSrc(videoUrl: string): string | null {
  try {
    const url = new URL(videoUrl.trim())
    const host = url.hostname.replace(/^www\./, '')
    if (host === 'youtu.be') {
      const id = url.pathname.replace(/^\//, '').split('/')[0]
      return id && /^[\w-]{6,64}$/.test(id) ? `https://www.youtube.com/embed/${id}` : null
    }
    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
      let id = url.searchParams.get('v') ?? ''
      if (!id && url.pathname.startsWith('/embed/')) {
        id = url.pathname.replace(/^\/embed\//, '').split('/')[0] ?? ''
      }
      if (!id && url.pathname.startsWith('/shorts/')) {
        id = url.pathname.replace(/^\/shorts\//, '').split('/')[0] ?? ''
      }
      return id && /^[\w-]{6,64}$/.test(id) ? `https://www.youtube.com/embed/${id}` : null
    }
  } catch {
    return null
  }
  return null
}

export function vimeoEmbedSrc(videoUrl: string): string | null {
  try {
    const url = new URL(videoUrl.trim())
    const host = url.hostname.replace(/^www\./, '')
    if (host !== 'vimeo.com' && host !== 'player.vimeo.com') return null
    const parts = url.pathname.split('/').filter(Boolean)
    const id =
      host === 'player.vimeo.com' ? parts[0] : parts[0] === 'video' ? parts[1] : parts[0]
    if (!id || !/^\d+$/.test(id)) return null
    return `https://player.vimeo.com/video/${id}`
  } catch {
    return null
  }
}
