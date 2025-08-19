import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const insertMarkdown = (before: string, after: string = "") => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const newText = before + selectedText + after;
    
    const newValue = value.substring(0, start) + newText + value.substring(end);
    onChange(newValue);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const toolbarButtons = [
    { icon: "fas fa-bold", title: "Bold", action: () => insertMarkdown("**", "**") },
    { icon: "fas fa-italic", title: "Italic", action: () => insertMarkdown("*", "*") },
    { icon: "fas fa-heading", title: "Heading", action: () => insertMarkdown("## ") },
    { icon: "fas fa-link", title: "Link", action: () => insertMarkdown("[", "](url)") },
    { icon: "fas fa-image", title: "Image", action: () => insertMarkdown("![alt](", ")") },
    { icon: "fas fa-code", title: "Code", action: () => insertMarkdown("`", "`") },
    { icon: "fas fa-list-ul", title: "Bullet List", action: () => insertMarkdown("- ") },
    { icon: "fas fa-list-ol", title: "Numbered List", action: () => insertMarkdown("1. ") },
    { icon: "fas fa-quote-left", title: "Quote", action: () => insertMarkdown("> ") },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center space-x-2 flex-wrap gap-2">
          {toolbarButtons.map((button, index) => (
            <Button
              key={index}
              type="button"
              variant="ghost"
              size="sm"
              onClick={button.action}
              title={button.title}
              className="p-2 hover:bg-gray-100"
            >
              <i className={button.icon}></i>
            </Button>
          ))}
        </div>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Write your content using Markdown..."}
        className="min-h-[400px] border-none resize-none focus:outline-none font-mono text-sm rounded-none"
      />
    </div>
  );
}
