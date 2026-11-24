import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { currentMonth, inMonth, totals, peso, validAmount } from '../lib/money';
import SpendingChart from '../components/SpendingChart';
import MetricCard from '../components/MetricCard';
export default function Budget({ records, budgets, user, refresh, notify }) { const [month, setMonth] = useState(currentMonth()), [amount, setAmount] = useState(''), [busy, setBusy] = useState(false); const selected = inMonth(records, month), spent = totals(selected).expense, limit = Number(budgets.find(b => b.month === `${month}-01`)?.amount || 0), used = limit ? spent / limit * 100 : 0; async function save(e) { e.preventDefault(); if (!month || !validAmount(amount)) {
    notify('Enter a valid month and positive budget amount.', 'error');
    return;
} setBusy(true); try {
    const { error } = await supabase.from('budgets').upsert({ user_id: user.id, month: `${month}-01`, amount: Number(amount) }, { onConflict: 'user_id,month' });
    if (error)
        throw error;
    setAmount('');
    if (await refresh())
        notify('Monthly budget saved.');
}
catch (e) {
    notify(e.message, 'error');
}
finally {
    setBusy(false);
} } return <><div className="page-heading"><div><span className="eyebrow">PLAN AHEAD</span><h1>Monthly budget</h1><p>Set your household spending limit and track progress.</p></div><label>Selected month<input type="month" required value={month} onChange={e => { if (e.target.value)
    setMonth(e.target.value); }}/></label></div><div className="metrics"><MetricCard label="Monthly limit" value={limit} detail="Your planned expenses"/><MetricCard label="Expenses so far" value={spent} detail="Actual spending"/><MetricCard label="Remaining" value={limit ? limit - spent : 0} detail={limit ? 'Limit minus spending' : 'Set a limit first'} tone="green"/></div><div className="two-col"><section className="panel"><h2>Set spending limit</h2><p className="muted">Save a new limit or update the existing one for {month}.</p><form onSubmit={save} className="stack"><label>Monthly amount (PHP)<input type="number" min="0.01" step="0.01" max="9999999999.99" required value={amount} onChange={e => setAmount(e.target.value)} placeholder={limit ? String(limit) : 'e.g. 10000'}/></label><button className="primary" disabled={busy}>{busy ? 'Saving…' : 'Save budget'}</button></form><div className="budget-progress"><div><strong>{limit ? `${used.toFixed(1)}% used` : 'No budget set'}</strong><span>{peso(spent)} / {peso(limit)}</span></div><div className="track"><div style={{ width: `${Math.min(100, used)}%` }}/></div>{limit > 0 && spent > limit && <p className="form-error">You have exceeded this month's budget.</p>}</div></section><SpendingChart records={selected}/></div></>; }
