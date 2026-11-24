import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { strongPassword } from '../lib/password';
import PasswordField from '../components/PasswordField';
import Notice from '../components/Notice';
export default function Auth() { const [signup, setSignup] = useState(false), [email, setEmail] = useState(''), [name, setName] = useState(''), [password, setPassword] = useState(''), [repeat, setRepeat] = useState(''), [busy, setBusy] = useState(false), [notice, setNotice] = useState(null); const toggle = () => { setSignup(!signup); setPassword(''); setRepeat(''); setNotice(null); }; async function submit(e) { e.preventDefault(); setNotice(null); if (signup && (!name.trim() || !strongPassword(password) || password !== repeat)) {
    setNotice({ type: 'error', message: 'Enter your name, meet all password rules and confirm your password.' });
    return;
} setBusy(true); try {
    const { data, error } = signup ? await supabase.auth.signUp({ email: email.trim(), password, options: { data: { full_name: name.trim() } } }) : await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error)
        throw error;
    if (signup && !data.session)
        setNotice({ message: 'Account created. Email confirmation is enabled in Supabase; verify your address before signing in.' });
}
catch (err) {
    setNotice({ type: 'error', message: err.message });
}
finally {
    setBusy(false);
} } return <main className="auth-shell"><section className="auth-art"><div className="brand"><img src="/havenbudget/brand.svg" alt=""/><div>Haven<span>Budget</span><small>HOUSEHOLD FINANCE</small></div></div><div><span className="eyebrow">A LITTLE MORE PEACE OF MIND</span><h1>Make room for<br />what matters<span>.</span></h1><p>One home for your household's income, expenses and everyday goals.</p><img className="auth-illustration" src="/havenbudget/finance.svg" alt="Illustration of a pink wallet, peso coins and savings"/></div><small>Plan thoughtfully. Spend mindfully.</small></section><section className="auth-form"><div className="auth-inner"><span className="eyebrow">YOUR PERSONAL FINANCE SPACE</span><h1>{signup ? 'Create your account' : 'Welcome back'}</h1><p className="muted">{signup ? 'Start organizing your household budget.' : 'Sign in to manage your household budget.'}</p><Notice notice={notice} onClose={() => setNotice(null)}/><form onSubmit={submit} className="stack">{signup && <label>Full name<input required maxLength={80} autoComplete="name" value={name} onChange={e => setName(e.target.value)}/></label>}<label>Email address<input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)}/></label><PasswordField value={password} onChange={setPassword} showRules={signup} autoComplete={signup ? 'new-password' : 'current-password'}/>{signup && <PasswordField label="Confirm password" value={repeat} onChange={setRepeat} autoComplete="new-password"/>}<button className="primary wide" disabled={busy}>{busy ? 'Please wait…' : signup ? 'Create account' : 'Sign in'}</button></form><p className="auth-switch">{signup ? 'Already registered?' : 'New to HavenBudget?'} <button className="text-button" onClick={toggle} disabled={busy}>{signup ? 'Sign in' : 'Create account'}</button></p></div></section></main>; }
