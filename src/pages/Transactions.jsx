import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import TransactionForm from '../components/TransactionForm';
import TransactionTable from '../components/TransactionTable';
import ConfirmDialog from '../components/ConfirmDialog';
import Icon from '../components/Icon';
export default function Transactions({ records, user, refresh, notify }) { const [params, setParams] = useSearchParams(); const [editing, setEditing] = useState(null), [search, setSearch] = useState(''), [type, setType] = useState('all'), [deleting, setDeleting] = useState(null), [busy, setBusy] = useState(false); const creating = params.get('new') === '1'; const close = () => { setEditing(null); setParams({}); }; const filtered = records.filter(r => (type === 'all' || r.type === type) && `${r.description} ${r.category} ${r.entry_date}`.toLowerCase().includes(search.toLowerCase())); async function save(values) { setBusy(true); try {
    const query = editing ? supabase.from('transactions').update(values).eq('id', editing.id).eq('user_id', user.id) : supabase.from('transactions').insert({ ...values, user_id: user.id });
    const { error } = await query.select('id').single();
    if (error)
        throw error;
    close();
    if (await refresh())
        notify('Transaction saved.');
}
catch (e) {
    notify(e.message, 'error');
}
finally {
    setBusy(false);
} } async function remove() { setBusy(true); try {
    const { error } = await supabase.from('transactions').delete().eq('id', deleting.id).eq('user_id', user.id).select('id').single();
    if (error)
        throw error;
    setDeleting(null);
    if (await refresh())
        notify('Transaction deleted.');
}
catch (e) {
    notify(e.message, 'error');
}
finally {
    setBusy(false);
} } return <><div className="page-heading"><div><span className="eyebrow">RECORDS</span><h1>Transactions</h1><p>Manage all your income and expense entries.</p></div><button className="primary" onClick={() => { setEditing(null); setParams({ new: '1' }); }}><Icon name="plus"/> Add transaction</button></div>{(creating || editing) && <TransactionForm key={editing?.id || 'new'} initial={editing} onSave={save} onCancel={close} busy={busy}/>}<div className="filter-bar"><label>Search records<input placeholder="Description, category or date" value={search} onChange={e => setSearch(e.target.value)}/></label><label>Type<select value={type} onChange={e => setType(e.target.value)}><option value="all">All transactions</option><option value="income">Income</option><option value="expense">Expenses</option></select></label><span className="muted">{filtered.length} records</span></div><TransactionTable records={filtered} onEdit={r => { setParams({}); setEditing(r); }} onDelete={setDeleting}/><ConfirmDialog open={Boolean(deleting)} title="Delete transaction?" description={`Remove ${deleting?.description || 'this record'} permanently?`} onCancel={() => setDeleting(null)} onConfirm={remove} busy={busy}/></>; }
