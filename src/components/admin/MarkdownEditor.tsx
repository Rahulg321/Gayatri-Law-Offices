import '@uiw/react-md-editor/markdown-editor.css'
import MDEditor from '@uiw/react-md-editor'
import { useEffect, useState } from 'react'

type MarkdownEditorProps = {
  value: string
  onChange: (value: string) => void
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <textarea
        className="min-h-[320px] w-full rounded-lg border border-[var(--line)] bg-white p-3 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    )
  }

  return (
    <div data-color-mode="light">
      <MDEditor value={value} onChange={(v) => onChange(v ?? '')} height={400} />
    </div>
  )
}
