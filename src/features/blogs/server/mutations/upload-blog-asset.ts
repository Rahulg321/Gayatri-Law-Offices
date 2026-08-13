import { createServerFn } from '@tanstack/react-start'
import { requireAdminMiddleware } from '#/features/auth/server/middleware'
import { CMS_IMAGE_MIME, CMS_UPLOAD_MAX_BYTES } from '#/lib/cms-uploads'
import { cmsBlogUploadSchema } from '#/lib/cms-schemas'
import { uploadCmsFileBuffer } from '#/lib/storage'

export const adminUploadCmsBlogAsset = createServerFn({ method: 'POST' })
  .middleware([requireAdminMiddleware])
  .inputValidator((input: unknown) => cmsBlogUploadSchema.parse(input))
  .handler(async ({ data }) => {
    if (!CMS_IMAGE_MIME.has(data.mimeType)) {
      throw new Error('Only JPEG, PNG, WebP, and GIF images are allowed.')
    }
    const buffer = Buffer.from(data.dataBase64, 'base64')
    if (buffer.byteLength > CMS_UPLOAD_MAX_BYTES) {
      throw new Error('Image must be 10 MB or smaller.')
    }
    const segment = data.postSlug.trim() || 'draft'
    const url = await uploadCmsFileBuffer(
      buffer,
      'blog',
      segment,
      data.fileName,
      data.mimeType,
    )
    if (!url) {
      throw new Error('Upload failed. Check R2 binding and R2_PUBLIC_BASE_URL.')
    }
    return { url }
  })
