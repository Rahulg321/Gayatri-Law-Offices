import { AwsClient } from 'aws4fetch'
import { env as cloudflareEnv } from 'cloudflare:workers'
import crypto from 'node:crypto'

declare global {
  // eslint-disable-next-line no-var
  var __env__: Env | undefined
}

function r2Env(name: string): string | undefined {
  return process.env[name]
}

type R2WorkerStringVars = {
  R2_PUBLIC_BASE_URL?: string
  R2_BUCKET_NAME?: string
  R2_ACCOUNT_ID?: string
}

/** Wrangler `vars` are on Worker `env`, not reliably on `process.env` during Vite dev — read both. */
function readR2PublicBaseUrl(): string | undefined {
  const fromProcess = r2Env('R2_PUBLIC_BASE_URL')?.trim()
  if (fromProcess) return fromProcess
  const fromWorker = (cloudflareEnv as Env & R2WorkerStringVars).R2_PUBLIC_BASE_URL
  return typeof fromWorker === 'string' && fromWorker.trim() ? fromWorker.trim() : undefined
}

function readR2BucketName(): string {
  const fromProcess = r2Env('R2_BUCKET_NAME')?.trim()
  if (fromProcess) return fromProcess
  const fromWorker = (cloudflareEnv as Env & R2WorkerStringVars).R2_BUCKET_NAME
  return typeof fromWorker === 'string' && fromWorker.trim()
    ? fromWorker.trim()
    : 'gayatri-law-offices-assets'
}

function readR2AccountId(): string | undefined {
  const fromProcess = r2Env('R2_ACCOUNT_ID')?.trim()
  if (fromProcess) return fromProcess
  const fromWorker = (cloudflareEnv as Env & R2WorkerStringVars).R2_ACCOUNT_ID
  return typeof fromWorker === 'string' && fromWorker.trim() ? fromWorker.trim() : undefined
}

const R2_ACCESS_KEY_ID = r2Env('R2_ACCESS_KEY_ID')
const R2_SECRET_ACCESS_KEY = r2Env('R2_SECRET_ACCESS_KEY')

type EnvWithOptionalUploads = Env & { UPLOADS?: R2Bucket }

/** Worker R2 binding (`ASSETS` in wrangler.jsonc; `UPLOADS` supported as alias). */
export function getR2Bucket(): R2Bucket | null {
  const env = cloudflareEnv as EnvWithOptionalUploads
  const fallback = globalThis.__env__ as EnvWithOptionalUploads | undefined
  return env.ASSETS ?? env.UPLOADS ?? fallback?.ASSETS ?? fallback?.UPLOADS ?? null
}

/** @deprecated Use `getR2Bucket` */
export const getAssetsBucket = getR2Bucket

let r2Aws: AwsClient | null | undefined

function getS3ApiClient(): AwsClient | null {
  const accountId = readR2AccountId()
  if (!accountId || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    return null
  }
  if (r2Aws === undefined) {
    r2Aws = new AwsClient({
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
      service: 's3',
      region: 'auto',
    })
  }
  return r2Aws
}

function r2CloudStorageBaseUrl(): string | null {
  const accountId = readR2AccountId()
  const bucket = readR2BucketName()
  if (!accountId || !bucket) return null
  return `https://${accountId}.r2.cloudflarestorage.com`
}

function encodeS3KeySegments(key: string): string {
  return key.split('/').map(encodeURIComponent).join('/')
}

function objectUrl(key: string): string | null {
  const r2BaseUrl = r2CloudStorageBaseUrl()
  const bucket = readR2BucketName()
  if (!r2BaseUrl || !bucket) return null
  return `${r2BaseUrl}/${encodeURIComponent(bucket)}/${encodeS3KeySegments(key)}`
}

function sanitizeUserId(userId: string): string {
  const s = userId.replace(/[/\\..]/g, '').replace(/[^a-zA-Z0-9_.-]/g, '')
  if (!s) throw new Error('Invalid user ID format')
  return s
}

export function buildObjectKey(userId: string, fileName: string): string {
  const sanitizedUserId = sanitizeUserId(userId)
  const timestamp = Date.now()
  const randomString = crypto.randomBytes(8).toString('hex')
  const ext = fileName.split('.').pop() || ''
  const safeExt = ext ? `.${ext}` : ''
  return `uploads/${sanitizedUserId}/${timestamp}-${randomString}${safeExt}`
}

function sanitizeCmsSegment(segment: string): string {
  const s = segment
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
  if (!s) throw new Error('Invalid CMS segment')
  return s
}

/** CMS asset key under `cms/{kind}/{segment}/…`. */
export function buildCmsKey(kind: string, segment: string, fileName: string): string {
  const safeKind = sanitizeCmsSegment(kind)
  const safeSegment = sanitizeCmsSegment(segment)
  const timestamp = Date.now()
  const randomString = crypto.randomBytes(8).toString('hex')
  const ext = fileName.split('.').pop() || ''
  const safeExt = ext ? `.${ext.replace(/[^a-zA-Z0-9]/g, '')}` : ''
  return `cms/${safeKind}/${safeSegment}/${timestamp}-${randomString}${safeExt}`
}

export async function uploadCmsFileBuffer(
  buffer: Buffer | Uint8Array,
  kind: string,
  segment: string,
  fileName: string,
  mimetype: string,
): Promise<string | null> {
  try {
    if (!buffer?.byteLength || !fileName?.trim()) {
      throw new Error('Invalid input parameters')
    }
    const key = buildCmsKey(kind, segment, fileName)
    await putObject(key, bodyBytes(buffer), mimetype)
    const out = publicUrlForKey(key)
    if (!out) {
      console.error(
        '[storage] Object stored but no public URL: set R2_PUBLIC_BASE_URL or R2_ACCOUNT_ID + R2_BUCKET_NAME',
      )
      return null
    }
    return out
  } catch (error) {
    console.error('[storage] CMS upload failed:', error)
    return null
  }
}

function bodyBytes(
  buffer: Buffer | Uint8Array,
): Uint8Array | ArrayBuffer {
  if (buffer instanceof Uint8Array && buffer.byteOffset === 0) {
    return buffer
  }
  if (buffer instanceof Uint8Array) {
    return buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength,
    )
  }
  return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength)
}

export function publicUrlForKey(key: string): string | null {
  const publicBase = readR2PublicBaseUrl()
  if (publicBase) {
    const base = publicBase.replace(/\/+$/, '')
    return `${base}/${key}`
  }
  const accountId = readR2AccountId()
  const bucketName = readR2BucketName()
  if (accountId && bucketName) {
    return `https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${encodeS3KeySegments(key)}`
  }
  return null
}

async function putObject(
  key: string,
  body: Uint8Array | ArrayBuffer,
  mimetype: string,
): Promise<void> {
  const bucket = getR2Bucket()
  const s3 = getS3ApiClient()


  if (!bucket && !s3) {
    throw new Error(
      'No ASSETS binding and no R2 S3 API env (R2_ACCOUNT_ID + keys + R2_BUCKET_NAME)',
    )
  }

  const contentType = mimetype || 'application/octet-stream'

  if (bucket) {
    await bucket.put(key, body, {
      httpMetadata: { contentType },
    })
    return
  }

  const url = objectUrl(key)
  if (!url || !s3) {
    throw new Error('S3 URL build failed (missing account/bucket)')
  }

  const res = await s3.fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`R2 PUT ${res.status}: ${text || res.statusText}`)
  }
}

async function deleteObject(key: string): Promise<void> {
  const bucket = getR2Bucket()
  const s3 = getS3ApiClient()

  if (bucket) {
    await bucket.delete(key)
    return
  }

  if (!s3) {
    throw new Error('No ASSETS binding and no S3 API credentials')
  }



  const url = objectUrl(key)
  if (!url) return

  const res = await s3.fetch(url, { method: 'DELETE' })
  if (!res.ok && res.status !== 404) {
    const text = await res.text().catch(() => '')
    throw new Error(`R2 DELETE ${res.status}: ${text || res.statusText}`)
  }
}

/** Upload a file; returns public URL or null on failure. */
export async function uploadFileBuffer(
  buffer: Buffer | Uint8Array,
  fileName: string,
  mimetype: string,
  userId: string,
): Promise<string | null> {
  try {
    if (!buffer?.byteLength || !fileName?.trim() || !userId?.trim()) {
      throw new Error('Invalid input parameters')
    }

    const key = buildObjectKey(userId, fileName)
    await putObject(key, bodyBytes(buffer), mimetype)

    const out = publicUrlForKey(key)
    if (!out) {
      console.error(
        '[storage] Object stored but no public URL: set R2_PUBLIC_BASE_URL or R2_ACCOUNT_ID + R2_BUCKET_NAME',
      )
      return null
    }
    return out
  } catch (error) {
    console.error('[storage] upload failed:', error)
    return null
  }
}

/** Delete by public URL; returns true if deleted or already gone. */
export async function deleteFile(fileUrl: string): Promise<boolean> {
  try {
    if (!fileUrl) return false

    let key: string | null = null

    const publicBase = readR2PublicBaseUrl()
    if (publicBase && fileUrl.startsWith(publicBase)) {
      const base = publicBase.replace(/\/+$/, '')
      key = fileUrl.replace(`${base}/`, '')
    } else if (fileUrl.startsWith('https://')) {
      const bucketName = readR2BucketName()
      const url = new URL(fileUrl)
      const parts = url.pathname.split('/').filter(Boolean)
      if (parts.length >= 2 && parts[0] === bucketName) {
        key = parts.slice(1).join('/')
      }
    }

    if (!key) return false

    await deleteObject(key)
    return true
  } catch (error) {
    console.error('[storage] delete failed:', error)
    return false
  }
}

export async function putAsset(
  key: string,
  body: ReadableStream | ArrayBuffer | string | Blob | Uint8Array,
  options?: R2PutOptions,
) {
  const bucket = getR2Bucket()
  if (!bucket) {
    throw new Error('ASSETS R2 binding is not available')
  }
  return bucket.put(key, body, options)
}

export async function getAsset(key: string) {
  const bucket = getR2Bucket()
  if (!bucket) {
    throw new Error('ASSETS R2 binding is not available')
  }
  return bucket.get(key)
}

export async function deleteAsset(key: string) {
  const bucket = getR2Bucket()
  if (!bucket) {
    throw new Error('ASSETS R2 binding is not available')
  }
  return bucket.delete(key)
}

export async function listAssets(options?: R2ListOptions) {
  const bucket = getR2Bucket()
  if (!bucket) {
    throw new Error('ASSETS R2 binding is not available')
  }
  return bucket.list(options)
}
