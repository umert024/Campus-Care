import React, { useState } from 'react';
import { useFacility } from '../context/FacilityContext';
import { IconClose } from './Icons';

const roles = ['Student', 'Faculty', 'Technician', 'Admin'];

export const LoginModal = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, currentUser, login, signup } = useFacility();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', username: '', password: '', role: 'Student', department: '' });
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  if (!isLoginModalOpen) return null;

  const update = (event) => setForm(previous => ({ ...previous, [event.target.name]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    const result = mode === 'login'
      ? await login({ username: form.username, password: form.password })
      : await signup(form);
    setBusy(false);
    if (result.success) {
      setIsLoginModalOpen(false);
      setForm({ name: '', username: '', password: '', role: 'Student', department: '' });
    } else setMessage(result.message);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-300 bg-white shadow-2xl shadow-black/20">
        <div className="relative overflow-hidden bg-slate-950 p-7 text-white">
          <div className="absolute -right-8 -top-12 h-40 w-40 rounded-full bg-white/10" />
          <div className="relative flex items-start justify-between">
            <div>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-2xl ring-1 ring-white/30">▦</div>
              <h2 className="text-2xl font-extrabold">Welcome to CampusFix</h2>
              <p className="mt-1 text-sm text-slate-300">Your facility workspace, your own account.</p>
            </div>
            {currentUser && <button onClick={() => setIsLoginModalOpen(false)} className="rounded-xl p-2 text-slate-300 hover:bg-white/10 hover:text-white"><IconClose className="h-5 w-5" /></button>}
          </div>
        </div>

        <div className="p-6 sm:p-7">
          <div className="mb-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1 text-sm font-bold">
            <button onClick={() => { setMode('login'); setMessage(''); }} className={`rounded-lg py-2 transition ${mode === 'login' ? 'bg-white text-black shadow-sm' : 'text-slate-500'}`}>Sign in</button>
            <button onClick={() => { setMode('signup'); setMessage(''); }} className={`rounded-lg py-2 transition ${mode === 'signup' ? 'bg-white text-black shadow-sm' : 'text-slate-500'}`}>Create account</button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === 'signup' && <>
              <label className="block text-sm font-semibold text-slate-700">Full name<input required name="name" value={form.name} onChange={update} placeholder="Your name" className="auth-input" /></label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block text-sm font-semibold text-slate-700">Role<select name="role" value={form.role} onChange={update} className="auth-input">{roles.map(role => <option key={role}>{role}</option>)}</select></label>
                <label className="block text-sm font-semibold text-slate-700">Department<input name="department" value={form.department} onChange={update} placeholder="Optional" className="auth-input" /></label>
              </div>
            </>}
            <label className="block text-sm font-semibold text-slate-700">Username<input required name="username" value={form.username} onChange={update} autoComplete="username" placeholder="e.g. priya.faculty" className="auth-input" /></label>
            <label className="block text-sm font-semibold text-slate-700">Password<input required minLength="6" type="password" name="password" value={form.password} onChange={update} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} placeholder="At least 6 characters" className="auth-input" /></label>
            {message && <p role="alert" className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-medium text-slate-800 border border-slate-200">{message}</p>}
            <button disabled={busy} className="w-full rounded-xl bg-black py-3 text-sm font-bold text-white shadow-lg shadow-black/20 transition hover:bg-slate-800 disabled:opacity-60">{busy ? 'Please wait…' : mode === 'login' ? 'Sign in to workspace' : 'Create my account'}</button>
          </form>
          {mode === 'login' && <p className="mt-4 text-center text-xs text-slate-500">Demo accounts use their shown usernames and password <span className="font-bold text-black">campus123</span>.</p>}
          {mode === 'signup' && <p className="mt-4 text-center text-xs text-slate-500">No email address is requested or stored.</p>}
        </div>
      </div>
    </div>
  );
};
