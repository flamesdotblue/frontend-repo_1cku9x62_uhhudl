import { useState } from 'react';
import { Sparkles, Target, BookOpen } from 'lucide-react';

export default function Onboarding({ user, onComplete }) {
  const [focus, setFocus] = useState('work');
  const [goal, setGoal] = useState('Capture and organize ideas faster');
  const [style, setStyle] = useState('Concise with bullet points');

  const submit = (e) => {
    e.preventDefault();
    const prefs = { focus, goal, style };
    localStorage.setItem('ai-notes:prefs', JSON.stringify(prefs));
    onComplete(prefs);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-slate-900/60 border border-slate-800 rounded-2xl p-8 shadow-lg">
        <div className="flex items-center gap-2 text-indigo-300 mb-2">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm">Personalize your workspace</span>
        </div>
        <h2 className="text-2xl font-semibold mb-6">Welcome{user?.name ? `, ${user.name}` : ''}! Let’s tailor your AI notes.</h2>
        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="block text-sm text-slate-300 mb-2">Primary focus</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { key: 'work', label: 'Work projects' },
                { key: 'study', label: 'Studying' },
                { key: 'personal', label: 'Personal knowledge' },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setFocus(opt.key)}
                  className={`p-4 rounded-lg border transition text-left ${
                    focus === opt.key
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="font-medium">{opt.label}</div>
                  <div className="text-sm text-slate-400">{opt.key === 'work' ? 'Docs, meeting notes' : opt.key === 'study' ? 'Lecture notes, research' : 'Journaling, ideas'}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2 flex items-center gap-2"><Target className="w-4 h-4"/> Your goal</label>
            <input
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="E.g., Summarize meetings into action items"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2 flex items-center gap-2"><BookOpen className="w-4 h-4"/> Preferred writing style</label>
            <select
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
            >
              <option>Concise with bullet points</option>
              <option>Detailed and explanatory</option>
              <option>Casual and friendly</option>
              <option>Formal and professional</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-slate-400 text-sm">You can change these later in settings.</p>
            <button type="submit" className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 transition font-medium">Continue</button>
          </div>
        </form>
      </div>
    </div>
  );
}
