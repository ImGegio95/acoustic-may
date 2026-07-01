"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, 
  Heading1, Heading2, List, ListOrdered, Link as LinkIcon, Unlink, Eraser, Code
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function TiptapEditor({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'tiptap-editor-content',
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return <div style={{ height: '200px', background: 'var(--paper2)', borderRadius: '12px' }}></div>;
  }

  const toggleLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    if (previousUrl) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    const url = window.prompt('Inserisci il link:');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div style={{ 
      border: '1px solid var(--line)', 
      borderRadius: '12px', 
      overflow: 'hidden',
      background: 'var(--paper)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Toolbar */}
      <div style={{ 
        display: 'flex', 
        gap: '4px', 
        padding: '8px', 
        background: 'var(--paper2)',
        borderBottom: '1px solid var(--line)',
        flexWrap: 'wrap'
      }}>
        <ToolbarButton 
          active={editor.isActive('heading', { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          icon={<Heading1 size={16} />}
          title="Titolo 1"
        />
        <ToolbarButton 
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          icon={<Heading2 size={16} />}
          title="Titolo 2"
        />
        <div style={{ width: '1px', background: 'var(--line)', margin: '0 4px' }} />
        <ToolbarButton 
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
          icon={<Bold size={16} />}
          title="Grassetto"
        />
        <ToolbarButton 
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          icon={<Italic size={16} />}
          title="Corsivo"
        />
        <ToolbarButton 
          active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          icon={<UnderlineIcon size={16} />}
          title="Sottolineato"
        />
        <ToolbarButton 
          active={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          icon={<Strikethrough size={16} />}
          title="Barrato"
        />
        <div style={{ width: '1px', background: 'var(--line)', margin: '0 4px' }} />
        <ToolbarButton 
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          icon={<List size={16} />}
          title="Elenco Puntato"
        />
        <ToolbarButton 
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          icon={<ListOrdered size={16} />}
          title="Elenco Numerato"
        />
        <div style={{ width: '1px', background: 'var(--line)', margin: '0 4px' }} />
        <ToolbarButton 
          active={editor.isActive('link')}
          onClick={toggleLink}
          icon={editor.isActive('link') ? <Unlink size={16} /> : <LinkIcon size={16} />}
          title="Inserisci/Rimuovi Link"
        />
        <div style={{ flex: 1 }} />
        <ToolbarButton 
          active={isHtmlMode}
          onClick={() => setIsHtmlMode(!isHtmlMode)}
          icon={<Code size={16} />}
          title="Modalità Codice HTML"
        />
        <ToolbarButton 
          active={false}
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          icon={<Eraser size={16} />}
          title="Pulisci Formattazione"
        />
      </div>
      
      {/* Editor Content Area */}
      <div 
        style={{ 
          padding: isHtmlMode ? '0' : '20px', 
          minHeight: '200px', 
          cursor: 'text',
          fontSize: '14px',
          lineHeight: '1.6',
          display: 'flex',
          flexDirection: 'column',
          flex: 1
        }} 
        onClick={() => !isHtmlMode && editor.commands.focus()}
      >
        {isHtmlMode ? (
          <textarea 
            value={value} 
            onChange={(e) => {
              onChange(e.target.value);
            }}
            spellCheck="false"
            style={{
              width: '100%',
              minHeight: '250px',
              padding: '20px',
              border: 'none',
              outline: 'none',
              background: '#121212',
              color: '#4ade80',
              fontFamily: 'monospace',
              fontSize: '13px',
              resize: 'vertical',
              lineHeight: '1.5'
            }}
          />
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>
    </div>
  );
}

function ToolbarButton({ active, onClick, icon, title }: { active: boolean, onClick: () => void, icon: React.ReactNode, title: string }) {
  return (
    <button
      type="button"
      title={title}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      style={{
        padding: '8px',
        borderRadius: '8px',
        background: active ? 'var(--ink)' : 'transparent',
        color: active ? 'var(--paper)' : 'var(--stone-dark)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
      }}
      onMouseOver={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'rgba(18,18,18,0.06)';
          e.currentTarget.style.color = 'var(--ink)';
        }
      }}
      onMouseOut={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = 'var(--stone-dark)';
        }
      }}
    >
      {icon}
    </button>
  );
}
