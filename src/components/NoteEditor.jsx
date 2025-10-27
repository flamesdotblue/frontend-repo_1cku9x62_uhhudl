import { useEffect, useRef, useState } from 'react';
import { Sparkles, Save } from 'lucide-react';

function generateAIText(prompt, prefs) {
  const style = prefs?.style || 'Concise with bullet points';
  const base = prompt?.trim() ? `Topic: ${prompt.trim()}` : 'Fresh ideas';
  return [
    `Summary (${style}):`,
    `- ${base} — key points captured clearly`,
    `- Action items with checkboxes`,
    `- References and next steps`,
    '',
    'Action Items:',
    '- [ ] Define scope and success criteria',
    '- [ ] Draft outline and assign owners',
    '- [ ] Collect resources and schedule review',
  ].join('\n');
}

export default function NoteEditor({ note, onUpdate, prefs }) {
  const [title, setTitle] = useState(note?.title || 'Untitled');
  const [content, setContent] = useState(note?.content || '');
  const editorRef = useRef(null);

  useEffect(() => {
    setTitle(note?.title || 'Untitled');
    setContent(note?.content || '');
    if (editorRef.current) {
      editorRef.current.innerHTML = (note?.content || '').replace(/\n/g, '<br/>');
    }
  }, [note?.id]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (note) onUpdate({ ...note, title, content });
    }, 400);
    return () => clearTimeout(handler);
  }, [title, content]);

  const handleInput = () => {
    const html = editorRef.current?.innerHTML || '';
    const text = html
      .replace(/<div><br><\/div>/g, '\n')
      .replace(/<br>/g, '\n')
      .replace(/<div>/g, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ');
    setContent(text);
  };

  const handleAICompose = () => {
    const prompt = title || 'New Note';
    const aiText = generateAIText(prompt, prefs);
    const newContent = content ? content + '\n\n' + aiText : aiText;
    setContent(newContent);
    if (editorRef.current) editorRef.current.innerHTML = newContent.replace(/\n/g, '<br/>');
  };

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400">
        Select a note or create a new one.
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="px-6 pt-6 border-b border-slate-800">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-transparent text-2xl font-semibold outline-none placeholder:text-slate-500"
          placeholder="Untitled"
        />
        <div className="flex items-center gap-2 py-4">
          <button
            onClick={handleAICompose}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-sm"
          >
            <Sparkles className="w-4 h-4" />
            AI Compose
          </button>
          <div className="text-xs text-slate-400">Autosaves as you type</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div
          ref={editorRef}
          onInput={handleInput}
          contentEditable
          suppressContentEditableWarning
          className="min-h-[60vh] leading-7 outline-none prose prose-invert max-w-none"
          style={{ whiteSpace: 'pre-wrap' }}
          placeholder="Start writing..."
        />
      </div>

      <div className="px-6 py-3 border-t border-slate-800 text-xs text-slate-500 flex items-center gap-2">
        <Save className="w-3.5 h-3.5" /> Changes saved
      </div>
    </div>
  );
}
