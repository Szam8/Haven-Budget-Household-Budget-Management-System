import React, { useEffect, useRef } from 'react';
export default function ConfirmDialog({ open, title, description, onCancel, onConfirm, busy = false, children, label = 'Delete' }) { const ref = useRef(null); useEffect(() => { const el = ref.current; if (open && !el.open)
    el.showModal(); if (!open && el.open)
    el.close(); }, [open]); return <dialog ref={ref} className="dialog" onCancel={e => { e.preventDefault(); if (!busy)
    onCancel(); }}><h2>{title}</h2><p className="muted">{description}</p>{children}<div className="actions"><button className="secondary" disabled={busy} onClick={onCancel}>Cancel</button><button className="danger" disabled={busy} onClick={onConfirm}>{busy ? 'Please wait…' : label}</button></div></dialog>; }
