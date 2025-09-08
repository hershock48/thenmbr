"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Bold, Italic, Underline, Link, List, ListOrdered, AlignLeft, AlignCenter, AlignRight } from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter your text...",
  className = "",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)

  const execCommand = useCallback(
    (command: string, value?: string) => {
      document.execCommand(command, false, value)
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML)
      }
    },
    [onChange],
  )

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }, [onChange])

  const insertLink = useCallback(() => {
    const url = prompt("Enter URL:")
    if (url) {
      execCommand("createLink", url)
    }
  }, [execCommand])

  const formatButtons = [
    { command: "bold", icon: Bold, title: "Bold" },
    { command: "italic", icon: Italic, title: "Italic" },
    { command: "underline", icon: Underline, title: "Underline" },
  ]

  const alignButtons = [
    { command: "justifyLeft", icon: AlignLeft, title: "Align Left" },
    { command: "justifyCenter", icon: AlignCenter, title: "Align Center" },
    { command: "justifyRight", icon: AlignRight, title: "Align Right" },
  ]

  const listButtons = [
    { command: "insertUnorderedList", icon: List, title: "Bullet List" },
    { command: "insertOrderedList", icon: ListOrdered, title: "Numbered List" },
  ]

  return (
    <div className={`border border-border rounded-lg ${className}`}>
      <div className="flex items-center gap-1 p-2 border-b border-border bg-muted/30">
        {formatButtons.map(({ command, icon: Icon, title }) => (
          <Button
            key={command}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => execCommand(command)}
            title={title}
          >
            <Icon className="w-4 h-4" />
          </Button>
        ))}

        <Separator orientation="vertical" className="h-6 mx-1" />

        {alignButtons.map(({ command, icon: Icon, title }) => (
          <Button
            key={command}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => execCommand(command)}
            title={title}
          >
            <Icon className="w-4 h-4" />
          </Button>
        ))}

        <Separator orientation="vertical" className="h-6 mx-1" />

        {listButtons.map(({ command, icon: Icon, title }) => (
          <Button
            key={command}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => execCommand(command)}
            title={title}
          >
            <Icon className="w-4 h-4" />
          </Button>
        ))}

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={insertLink} title="Insert Link">
          <Link className="w-4 h-4" />
        </Button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        className="min-h-32 p-4 focus:outline-none prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={handleInput}
        data-placeholder={placeholder}
        style={{
          minHeight: "120px",
        }}
      />

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}
