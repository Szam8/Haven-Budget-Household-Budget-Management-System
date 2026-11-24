import React from 'react';
import { peso } from '../lib/money';
import Icon from './Icon';
export default function MetricCard({ label, value, detail, tone = 'pink', icon = 'budget' }) { return <div className="metric panel"><div className={`metric-icon ${tone}`}><Icon name={icon}/></div><p>{label}</p><strong>{peso(value)}</strong><small>{detail}</small></div>; }
