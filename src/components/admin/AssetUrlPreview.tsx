import { useEffect, useState } from 'react'
import { ExternalLinkIcon, FileIcon } from 'lucide-react'
import { cn } from '#/lib/utils.ts'

export type ClassifiedAsset =
  | { kind: 'image' }
  | { kind: 'video' }
  | { kind: 'audio' }
  | { kind: 'pdf' }
  | { kind: 'embed'; src: string }
  | { kind: 'other'; label: string }

/** Classify a hosted asset URL for preview UX (paths and common hosts only). */
export function classifyAssetUrl(raw: string): ClassifiedAsset {
  const trimmed = raw.trim()
  if (!trimmed) return { kind: 'other', label: 'Attached file' }

  try {
    const u = new URL(trimmed)

    const yt = youtubeEmbedSrc(u)
    if (yt) return { kind: 'embed', src: yt }

    const vm = vimeoEmbedSrc(u)
    if (vm) return { kind: 'embed', src: vm }

    const path = u.pathname.replace(/\/$/, '')
    const lower = path.toLowerCase()

    if (/\.(jpe?g|png|gif|webp|avif|bmp|svg|ico)(\?|$)/i.test(lower)) {
      return { kind: 'image' }
    }
    if (/\.(mp4|webm|ogv|mov|m4v|mkv)(\?|$)/i.test(lower)) {
      return { kind: 'video' }
    }
    if (/\.(mp3|wav|aac|m4a|flac)(\?|$)/i.test(lower)) {
      return { kind: 'audio' }
    }
    if (/\.pdf(\?|$)/i.test(lower)) {
      return { kind: 'pdf' }
    }

    const name = basenameFromUrl(path, trimmed)
    return { kind: 'other', label: name }
  } catch {
    const stripped = (trimmed.split(/[?#]/)[0] ?? trimmed).trim()
    const lower = stripped.toLowerCase()

    if (/\.(jpe?g|png|gif|webp|avif|bmp|svg|ico)$/i.test(lower)) {
      return { kind: 'image' }
    }
    if (/\.(mp4|webm|ogv|mov|m4v|mkv)$/i.test(lower)) {
      return { kind: 'video' }
    }
    if (/\.(mp3|wav|aac|m4a|flac)$/i.test(lower)) {
      return { kind: 'audio' }
    }
    if (/\.pdf$/i.test(lower)) {
      return { kind: 'pdf' }
    }

    return { kind: 'other', label: stripped || trimmed }
  }
}

function basenameFromUrl(pathname: string, fallback: string): string {
  const seg = pathname.split('/').filter(Boolean).pop()
  if (!seg) return fallback
  try {
    return decodeURIComponent(seg)
  } catch {
    return seg
  }
}

function youtubeEmbedSrc(url: URL): string | null {
  const host = url.hostname.replace(/^www\./, '')
  if (host === 'youtu.be') {
    const id = url.pathname.replace(/^\//, '').split('/')[0]
    return id ? `https://www.youtube.com/embed/${id}` : null
  }
  if (host === 'youtube.com' || host === 'm.youtube.com') {
    const v = url.searchParams.get('v')
    if (v) return `https://www.youtube.com/embed/${v}`
    const embed = url.pathname.match(/\/embed\/([^/?]+)/)
    if (embed?.[1]) return `https://www.youtube.com/embed/${embed[1]}`
    const shorts = url.pathname.match(/\/shorts\/([^/?]+)/)
    if (shorts?.[1]) return `https://www.youtube.com/embed/${shorts[1]}`
  }
  return null
}

function vimeoEmbedSrc(url: URL): string | null {
  const host = url.hostname.replace(/^www\./, '')
  if (host !== 'vimeo.com' && host !== 'player.vimeo.com') return null

  const fromPlayer = url.pathname.match(/^\/video\/(\d+)/)
  if (fromPlayer?.[1]) return `https://player.vimeo.com/video/${fromPlayer[1]}`

  const id = url.pathname.match(/\/(\d+)/)?.[1]
  return id ? `https://player.vimeo.com/video/${id}` : null
}

type AssetUrlPreviewProps = {
  url: string
  className?: string
}

/** Rich preview after upload / when a URL points at image, video, audio, pdf, embed, or other assets. */
export function AssetUrlPreview({ url, className }: AssetUrlPreviewProps) {
  const trimmed = url.trim()
  const [mediaFallback, setMediaFallback] = useState(false)

  useEffect(() => {
    setMediaFallback(false)
  }, [trimmed])

  if (!trimmed) return null

  const classified = classifyAssetUrl(trimmed)

  if (mediaFallback && (classified.kind === 'image' || classified.kind === 'video')) {
    let fallbackLabel = trimmed
    try {
      fallbackLabel = basenameFromUrl(new URL(trimmed).pathname.replace(/\/$/, ''), trimmed)
    } catch {
      /* non-absolute URL pasted */
    }
    return (
      <GenericHostFilePreview
        url={trimmed}
        label={fallbackLabel}
        subtitle="Preview could not load; open the URL to verify the file."
        className={className}
      />
    )
  }

  switch (classified.kind) {
    case 'image':
      return (
        <div className={cn('border-border mb-3 overflow-hidden rounded-xl border bg-muted/20', className)}>
          <img
            src={trimmed}
            alt=""
            loading="lazy"
            decoding="async"
            className="max-h-56 w-full object-contain bg-background"
            onError={() => setMediaFallback(true)}
          />
        </div>
      )
    case 'video':
      return (
        <div className={cn('border-border mb-3 overflow-hidden rounded-xl border bg-muted/20', className)}>
          <video
            controls
            playsInline
            preload="metadata"
            src={trimmed}
            className="max-h-56 w-full bg-background object-contain"
            onError={() => setMediaFallback(true)}
          >
            Video preview is not supported.
          </video>
        </div>
      )
    case 'embed':
      return (
        <div className={cn('border-border mb-3 overflow-hidden rounded-xl border bg-muted/30', className)}>
          <div className="relative aspect-video w-full">
            <iframe
              src={classified.src}
              title="Embedded video preview"
              className="absolute inset-0 size-full"
              loading="lazy"
              allowFullScreen
            />
          </div>
          <div className="border-border border-t px-3 py-2">
            <OpenLinkRow href={trimmed} label="Original link" />
          </div>
        </div>
      )
    case 'pdf':
      return (
        <div className={cn('border-border mb-3 space-y-0 overflow-hidden rounded-xl border bg-muted/20', className)}>
          <iframe title="PDF preview" src={trimmed} className="block h-[14rem] w-full bg-background" />
          <div className="border-border flex items-center gap-3 border-t px-3 py-2">
            <div className="bg-muted rounded-md p-2">
              <FileIcon className="text-muted-foreground size-5" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-muted-foreground text-xs uppercase tracking-wide">PDF</p>
              <OpenLinkRow href={trimmed} />
            </div>
          </div>
        </div>
      )
    case 'audio':
      return (
        <div className={cn('border-border mb-3 space-y-2 rounded-xl border bg-muted/20 p-3', className)}>
          <p className="text-muted-foreground text-xs uppercase tracking-wide">Audio</p>
          <audio controls preload="metadata" src={trimmed} className="block w-full">
            Audio preview is not supported in this browser.
          </audio>
          <OpenLinkRow href={trimmed} />
        </div>
      )
    case 'other':
      return <GenericHostFilePreview url={trimmed} label={classified.label} className={className} />
  }
}

function OpenLinkRow({ href, label = 'Open in new tab' }: { href: string; label?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent hover:text-accent/90 mt-1 inline-flex items-center gap-1 text-sm font-medium hover:underline"
    >
      {label}
      <ExternalLinkIcon className="size-3.5 opacity-70" aria-hidden />
    </a>
  )
}

function GenericHostFilePreview({
  url,
  label,
  subtitle,
  className,
}: {
  url: string
  label: string
  subtitle?: string
  className?: string
}) {
  return (
    <div className={cn('border-border mb-3 flex items-start gap-3 rounded-xl border bg-muted/20 p-3', className)}>
      <div className="rounded-lg border border-border bg-background p-2.5">
        <FileIcon className="text-muted-foreground size-7" aria-hidden />
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="truncate text-sm font-medium leading-snug">{label}</p>
        {subtitle ? <p className="text-muted-foreground mt-1 text-xs">{subtitle}</p> : null}
        <p className="text-muted-foreground mt-1 break-all font-mono text-xs">{url}</p>
        <OpenLinkRow href={url} />
      </div>
    </div>
  )
}
