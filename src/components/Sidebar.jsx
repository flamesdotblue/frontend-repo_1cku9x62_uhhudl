import { Plus, Search, Trash2, NotebookPen } from 'lucide-react';
import { useMemo } from 'react';

export default function Sidebar({ notes, selectedId, onSelect, onCreate, onDelete, onSearch }) {
  const sorted = useMemo(() => {
    return [...notes].sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes]);

  return (
    <aside className="w-72 shrink-0 bg-slate-900/80 border-r border-slate-800 flex flex-col">
      <div className="p-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <NotebookPen className="w-5 h-5 text-indigo-400" />
          <span className="font-semibold">My Notes</span>
        </div>
        <div className="mt-3 relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search..."
            className="w-full bg-slate-950 border border-slate-800 rounded-md py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button onClick={onCreate} className="mt-3 w-full py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 transition flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> New note
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sorted.length === 0 ? (
          <div className="p-4 text-sm text-slate-400">No notes yet. Create your first note.</div>
        ) : (
          <ul className="py-2">
            {sorted.map((n) => (
              <li key={n.id} className={`group px-3 py-2 flex items-center gap-2 cursor-pointer ${
                selectedId === n.id ? 'bg-slate-800/60' : 'hover:bg-slate-800/40'
              }`}>
                <button onClick={() => onSelect(n.id)} className="flex-1 text-left min-w-0">
                  <div className="font-medium truncate">{n.title || 'Untitled'}</div>
                  <div className="text-xs text-slate-400 truncate">{new Date(n.updatedAt).toLocaleString()}</div>
                </button>
                <button
                  onClick={() => onDelete(n.id)}
                  className="opacity-0 group-hover:opacity-100 transition p-1 rounded hover:bg-slate-700 text-slate-300"
                  aria-label="Delete note"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
