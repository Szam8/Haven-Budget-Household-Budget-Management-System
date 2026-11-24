import React, { useEffect, useState } from 'react';
import { supabase, readPages } from '../lib/supabase';
import Notice from '../components/Notice';
export default function Admin() { const [users, setUsers] = useState([]), [error, setError] = useState(null), [busy, setBusy] = useState(true), [search, setSearch] = useState(''); async function load() { setBusy(true); setError(null); try {
    const rows = await readPages(() => supabase.rpc('admin_list_users').order('created_at', { ascending: false }).order('id'));
    setUsers(rows);
}
catch (e) {
    setError({ type: 'error', message: e.message });
}
finally {
    setBusy(false);
} } useEffect(() => { load(); }, []); const filtered = users.filter(u => `${u.full_name} ${u.role}`.toLowerCase().includes(search.toLowerCase())); return <><div className="page-heading"><div><span className="eyebrow">ADMINISTRATION</span><h1>Admin dashboard</h1><p>Monitor registered accounts. Private household records are not exposed.</p></div><button className="secondary" disabled={busy} onClick={load}>{busy ? 'Loading…' : 'Refresh users'}</button></div><Notice notice={error}/><div className="metrics">{[['Registered profiles', users.length], ['Members', users.filter(u => u.role === 'member').length], ['Administrators', users.filter(u => u.role === 'admin').length]].map(([label, count]) => <div className="panel metric" key={label}><p>{label}</p><strong>{busy ? '…' : error ? '—' : count}</strong></div>)}</div><div className="filter-bar"><label>Search users<input value={search} onChange={e => setSearch(e.target.value)} placeholder="Name or role"/></label></div><div className="panel table-wrap"><table><thead><tr><th>Name</th><th>Role</th><th>Registered</th></tr></thead><tbody>{filtered.map(u => <tr key={u.id}><td>{u.full_name}</td><td>{u.role}</td><td>{new Date(u.created_at).toLocaleDateString('en-PH')}</td></tr>)}</tbody></table>{!busy && !filtered.length && <p className="empty">No profiles found.</p>}</div></>; }
