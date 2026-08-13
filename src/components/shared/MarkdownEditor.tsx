import '@uiw/react-md-editor/markdown-editor.css'
import MDEditor from '@uiw/react-md-editor'
import { useEffect, useState } from 'react'

type MarkdownEditorProps = {
  value: string
  onChange: (value: string) => void
}

function useResolvedEditorColorMode(): 'light' | 'dark' {
  const [mode, setMode] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const read = () =>
      setMode(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
    read()
    const obs = new MutationObserver(read)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  return mode
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [mounted, setMounted] = useState(false)
  const colorMode = useResolvedEditorColorMode()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <textarea
        className="border-border bg-background text-foreground min-h-[320px] w-full rounded-lg border p-3 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    )
  }

  return (
    <div data-color-mode={colorMode}>
      <MDEditor value={value} onChange={(v) => onChange(v ?? '')} height={400} />
    </div>
  )
}
