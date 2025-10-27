import { useEffect, useMemo, useState } from 'react';
import AuthPanel from './components/AuthPanel.jsx';
import Onboarding from './components/Onboarding.jsx';
import Sidebar from './components/Sidebar.jsx';
import NoteEditor from './components/NoteEditor.jsx';
import { LogOut, User } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [prefs, setPrefs] = useState(null);
  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState('');

  // Load session
  useEffect(() => {
    const storedUser = localStorage.getItem('ai-notes:user');
    const storedPrefs = localStorage.getItem('ai-notes:prefs');
    const storedNotes = localStorage.getItem('ai-notes:notes');
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedPrefs) setPrefs(JSON.parse(storedPrefs));
    if (storedNotes) setNotes(JSON.parse(storedNotes));
  }, []);

  // Persist notes
  useEffect(() => {
    localStorage.setItem('ai-notes:notes', JSON.stringify(notes));
  }, [notes]);

  const filteredNotes = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter((n) =>
      (n.title || '').toLowerCase().includes(q) || (n.content || '').toLowerCase().includes(q)
    );
  }, [notes, query]);

  const selectedNote = useMemo(
    () => filteredNotes.find((n) => n.id === selectedId) || filteredNotes[0],
    [filteredNotes, selectedId]
  );

  const handleAuthenticated = (u) => {
    setUser(u);
  };

  const handleOnboarding = (p) => {
    setPrefs(p);
  };

  const createNote = () => {
    const id = `note_${Date.now()}`;
    const newNote = {
      id,
      title: 'Untitled',
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      userId: user?.id,
    };
    setNotes((prev) => [newNote, ...prev]);
    setSelectedId(id);
  };

  const deleteNote = (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const updateNote = (updated) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === updated.id ? { ...updated, updatedAt: Date.now() } : n))
    );
  };

  const signOut = () => {
    localStorage.removeItem('ai-notes:user');
    localStorage.removeItem('ai-notes:prefs');
    setUser(null);
    setPrefs(null);
  };

  if (!user) {
    return <AuthPanel onAuthenticated={handleAuthenticated} />;
  }

  if (!prefs) {
    return <Onboarding user={user} onComplete={handleOnboarding} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar */}
      <Sidebar
        notes={filteredNotes}
        selectedId={selectedNote?.id || null}
        onSelect={setSelectedId}
        onCreate={createNote}
        onDelete={deleteNote}
        onSearch={setQuery}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b border-slate-800 flex items-center justify-between px-4">
          <div className="font-medium">AI Notes</div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-300">
              <User className="w-4 h-4" /> {user?.name || user?.email}
            </div>
            <button onClick={signOut} className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-sm flex items-center gap-2">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </header>
        <NoteEditor note={selectedNote} onUpdate={updateNote} prefs={prefs} />
      </div>
    </div>
  );
}
