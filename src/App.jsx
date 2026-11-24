import React, { useEffect, useState, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { configured, supabase, readPages } from './lib/supabase';
import Auth from './pages/Auth';
import Layout from './components/Layout';
import Notice from './components/Notice';
import Home from './pages/Home';
import Transactions from './pages/Transactions';
import Budget from './pages/Budget';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
export default function App() { const [session, setSession] = useState(null), [ready, setReady] = useState(false), [data, setData] = useState(null), [loadError, setLoadError] = useState(''), [notice, setNotice] = useState(null); const user = session?.user; const uid = user?.id; const notify = useCallback((message, type = 'success') => setNotice({ message, type }), []); useEffect(() => { if (!configured)
    return; let active = true; const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, next) => { if (active) {
    setSession(next);
    setReady(true);
} }); supabase.auth.getSession().then(({ data, error }) => { if (active) {
    if (error)
        notify(error.message, 'error');
    setSession(data.session);
    setReady(true);
} }); return () => { active = false; subscription.unsubscribe(); }; }, [notify]); const refresh = useCallback(async () => { if (!uid)
    return; try {
    const [profile, tx, budget] = await Promise.all([supabase.from('profiles').select('id,full_name,role').eq('id', uid).single(), readPages(() => supabase.from('transactions').select('*').eq('user_id', uid).order('entry_date', { ascending: false }).order('created_at', { ascending: false }).order('id')), readPages(() => supabase.from('budgets').select('*').eq('user_id', uid).order('id'))]);
    const error = profile.error;
    if (error)
        throw error;
    setData({ uid, profile: profile.data, records: tx, budgets: budget });
    setLoadError('');
    return true;
}
catch (e) {
    setLoadError(e.message);
    notify(e.message, 'error');
    return false;
} }, [uid, notify]); useEffect(() => { setData(null); setLoadError(''); if (uid)
    refresh(); }, [uid, refresh]); async function logout() { const { error } = await supabase.auth.signOut(); if (error)
    notify(error.message, 'error');
else {
    setData(null);
    setNotice(null);
} } async function deleted() { await supabase.auth.signOut({ scope: 'local' }); setSession(null); setData(null); setNotice(null); } if (!configured)
    return <main className="setup panel"><img src="/havenbudget/brand.svg" alt="" width="56"/><h1>Connect HavenBudget</h1><p>Create .env.local from .env.example, enter your Supabase project URL and publishable key, then restart Vite.</p></main>; if (!ready)
    return <main className="setup">Loading HavenBudget…</main>; if (!user)
    return <Routes><Route path="/login" element={<Auth />}/><Route path="*" element={<Navigate to="/login" replace/>}/></Routes>; if (data?.uid !== uid)
    return <main className="setup panel"><h1>{loadError ? 'Database connection needs attention' : 'Loading your workspace…'}</h1>{loadError && <><p role="alert">{loadError}</p><p>Check your Supabase SQL setup and permissions.</p><button className="primary" onClick={refresh}>Try again</button><button className="secondary" onClick={logout}>Log out</button></>}</main>; const props = { ...data, user, refresh, notify }; return <><div className="toast"><Notice notice={notice} onClose={() => setNotice(null)}/></div><Routes><Route element={<Layout profile={data.profile} user={user} onLogout={logout}/>}><Route path="/home" element={<Home {...props}/>}/><Route path="/transactions" element={<Transactions {...props}/>}/><Route path="/budget" element={<Budget {...props}/>}/><Route path="/reports" element={<Reports {...props}/>}/><Route path="/settings" element={<Settings key={uid} {...props} onDeleted={deleted}/>}/><Route path="/admin" element={data.profile.role === 'admin' ? <Admin /> : <Navigate to="/home" replace/>}/><Route path="*" element={<Navigate to="/home" replace/>}/></Route></Routes></>; }
