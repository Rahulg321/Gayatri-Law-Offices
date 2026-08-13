import { createServerFn } from '@tanstack/react-start'
import { requireAdminMiddleware } from '#/features/auth/server/middleware'
import {
  CMS_IMAGE_MIME,
  CMS_PORTFOLIO_DOC_MIME,
  CMS_PORTFOLIO_UPLOAD_MAX_BYTES,
  CMS_UPLOAD_MAX_BYTES,
} from '#/lib/cms-uploads'
import { cmsPortfolioUploadSchema } from '#/lib/cms-schemas'
import { uploadCmsFileBuffer } from '#/lib/storage'

export const adminUploadCmsPortfolioAsset = createServerFn({ method: 'POST' })
  .middleware([requireAdminMiddleware])
  .inputValidator((input: unknown) => cmsPortfolioUploadSchema.parse(input))
  .handler(async ({ data }) => {
    const isImage = CMS_IMAGE_MIME.has(data.mimeType)
    const isDoc = CMS_PORTFOLIO_DOC_MIME.has(data.mimeType)
    if (!isImage && !isDoc) {
      throw new Error('Allowed types: JPEG, PNG, WebP, GIF, PDF, MP4, WebM.')
    }
    const buffer = Buffer.from(data.dataBase64, 'base64')
    const maxBytes = isImage ? CMS_UPLOAD_MAX_BYTES : CMS_PORTFOLIO_UPLOAD_MAX_BYTES
    if (buffer.byteLength > maxBytes) {
      throw new Error(
        isImage
          ? 'Image must be 10 MB or smaller.'
          : 'File must be 50 MB or smaller.',
      )
    }
    const segment = data.projectSlug.trim() || 'draft'
    const url = await uploadCmsFileBuffer(
      buffer,
      'portfolio',
      segment,
      data.fileName,
      data.mimeType,
    )
    if (!url) {
      throw new Error('Upload failed. Check R2 binding and R2_PUBLIC_BASE_URL.')
    }
    return { url }
  })
