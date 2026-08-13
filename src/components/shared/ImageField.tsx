import { useRef, useState } from 'react'
import { AssetUrlPreview } from '#/components/admin/AssetUrlPreview'
import { Button } from '#/components/ui/button'
import { Field, FieldLabel } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { adminUploadCmsBlogAsset, adminUploadCmsPortfolioAsset } from '#/lib/cms-admin'

export type ImageFieldUploadTarget =
  | { kind: 'blog'; postSlug: string }
  | { kind: 'portfolio'; projectSlug: string }

type ImageFieldProps = {
  label: string
  hint?: string
  value: string
  onChange: (url: string) => void
  uploadTarget: ImageFieldUploadTarget
  /** Comma-separated file input accept attribute. Preview type is inferred from the returned URL after upload. */
  accept?: string
}

export function ImageField({
  label,
  hint,
  value,
  onChange,
  uploadTarget,
  accept = 'image/jpeg,image/png,image/webp,image/gif',
}: ImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File) {
    setUploading(true)
    setError(null)
    try {
      const dataBase64 = await fileToBase64(file)
      if (uploadTarget.kind === 'blog') {
        const { url } = await adminUploadCmsBlogAsset({
          data: {
            postSlug: uploadTarget.postSlug || 'draft',
            fileName: file.name,
            mimeType: file.type,
            dataBase64,
          },
        })
        onChange(url)
      } else {
        const { url } = await adminUploadCmsPortfolioAsset({
          data: {
            projectSlug: uploadTarget.projectSlug || 'draft',
            fileName: file.name,
            mimeType: file.type,
            dataBase64,
          },
        })
        onChange(url)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      {hint ? <p className="text-muted-foreground mb-2 text-xs">{hint}</p> : null}
      <div className="flex flex-col gap-2">
        <Input type="url" value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://… or upload" />
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) void handleFile(file)
            e.target.value = ''
          }}
        />
        <Button type="button" variant="outline" size="sm" className="w-fit" disabled={uploading} onClick={() => inputRef.current?.click()}>
          {uploading ? 'Uploading…' : 'Upload'}
        </Button>
      </div>
      <AssetUrlPreview url={value} />
      {error ? <p className="text-destructive mt-1 text-xs">{error}</p> : null}
    </Field>
  )
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result !== 'string') {
        reject(new Error('Failed to read file'))
        return
      }
      const base64 = result.split(',')[1]
      if (!base64) {
        reject(new Error('Failed to read file'))
        return
      }
      resolve(base64)
    }
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}
