import React from 'react';
import Icon from './Icon';
export default function Notice({ notice, onClose }) { if (!notice)
    return null; return <div className={`notice ${notice.type === 'error' ? 'error' : ''}`} role={notice.type === 'error' ? 'alert' : 'status'}><span>{notice.message}</span>{onClose && <button className="icon-button" aria-label="Dismiss message" onClick={onClose}><Icon name="close"/></button>}</div>; }
