import { useState, useEffect } from 'react';
import { User, Lock } from 'lucide-react';

export default function AuthPanel({ onAuthenticated }) {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
  }, [mode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || (mode === 'signup' && !name)) {
      setError('Please fill in all fields.');
      return;
    }
    // Simulate auth success for now
    const user = {
      id: `user_${Date.now()}`,
      name: name || email.split('@')[0],
      email,
    };
    localStorage.setItem('ai-notes:user', JSON.stringify(user));
    onAuthenticated(user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 text-slate-100 px-4">
      <div className="w-full max-w-md bg-slate-800/40 backdrop-blur rounded-2xl border border-slate-700 p-8 shadow-xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold">AI Notes</h1>
          <p className="text-slate-400 mt-1">Notion-style, AI-powered note taking</p>
        </div>
        <div className="flex gap-2 mb-6 bg-slate-900/50 p-1 rounded-lg">
          <button
            onClick={() => setMode('signin')}
            className={`flex-1 py-2 rounded-md transition ${
              mode === 'signin' ? 'bg-slate-700 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Sign in
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 rounded-md transition ${
              mode === 'signup' ? 'bg-slate-700 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Create account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm text-slate-300 mb-1">Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-md py-2 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm text-slate-300 mb-1">Email</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                className="w-full bg-slate-900/60 border border-slate-700 rounded-md py-2 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                className="w-full bg-slate-900/60 border border-slate-700 rounded-md py-2 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 transition font-medium"
          >
            {mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="text-xs text-slate-400 text-center mt-4">Demo auth only. Real auth will be connected later.</p>
      </div>
    </div>
  );
}
