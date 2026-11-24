import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { strongPassword } from '../lib/password';
import PasswordField from '../components/PasswordField';
import ConfirmDialog from '../components/ConfirmDialog';
export default function Settings({ user, profile, refresh, notify, onDeleted }) { const [name, setName] = useState(profile?.full_name || ''), [password, setPassword] = useState(''), [repeat, setRepeat] = useState(''), [current, setCurrent] = useState(''), [deleteOpen, setDeleteOpen] = useState(false), [deletePassword, setDeletePassword] = useState(''), [busy, setBusy] = useState(false), [deleteError, setDeleteError] = useState(''); async function run(action) { setBusy(true); try {
    await action();
}
catch (e) {
    notify(e.message, 'error');
}
finally {
    setBusy(false);
} } async function verify(value) { const { error } = await supabase.auth.signInWithPassword({ email: user.email, password: value }); if (error)
    throw new Error('Current password is incorrect or could not be verified.'); } function saveName(e) { e.preventDefault(); run(async () => { if (!name.trim())
    throw new Error('Enter your full name.'); const { error } = await supabase.from('profiles').update({ full_name: name.trim() }).eq('id', user.id).select('id').single(); if (error)
    throw error; if (await refresh())
    notify('Profile updated.'); }); } function savePassword(e) { e.preventDefault(); run(async () => { if (!strongPassword(password) || password !== repeat)
    throw new Error('Meet all password rules and match the confirmation.'); await verify(current); const { error } = await supabase.auth.updateUser({ password }); if (error)
    throw error; setPassword(''); setRepeat(''); setCurrent(''); notify('Password changed.'); }); } async function remove() { setBusy(true); setDeleteError(''); try {
    await verify(deletePassword);
    const { error } = await supabase.rpc('delete_my_account');
    if (error)
        throw error;
    setDeleteOpen(false);
    await onDeleted();
}
catch (e) {
    setDeleteError(e.message);
}
finally {
    setBusy(false);
} } return <><div className="page-heading"><div><span className="eyebrow">ACCOUNT</span><h1>Settings</h1><p>Manage your account information and security.</p></div></div><div className="two-col"><form className="panel stack" onSubmit={saveName}><h2>Personal information</h2><label>Full name<input required maxLength={80} value={name} onChange={e => setName(e.target.value)}/></label><label>Email address<input readOnly value={user.email || ''}/></label><button className="primary" disabled={busy}>Save profile</button></form><form className="panel stack" onSubmit={savePassword}><h2>Change password</h2><PasswordField label="Current password" value={current} onChange={setCurrent}/><PasswordField label="New password" value={password} onChange={setPassword} showRules autoComplete="new-password"/><PasswordField label="Confirm new password" value={repeat} onChange={setRepeat} autoComplete="new-password"/><button className="primary" disabled={busy}>Update password</button></form></div><section className="panel danger-zone"><div><h2>Delete account</h2><p className="muted">Permanently remove your profile, transactions, budgets and login account.</p></div><button className="danger" disabled={busy} onClick={() => { setDeletePassword(''); setDeleteError(''); setDeleteOpen(true); }}>Delete my account</button></section><ConfirmDialog open={deleteOpen} title="Delete your account?" description="This is permanent. Enter your current password to confirm." busy={busy} onCancel={() => { setDeleteOpen(false); setDeletePassword(''); }} onConfirm={remove} label="Permanently delete"><PasswordField value={deletePassword} onChange={setDeletePassword}/>{deleteError && <p role="alert" className="form-error">{deleteError}</p>}</ConfirmDialog></>; }
