import test from 'node:test';
import assert from 'node:assert/strict';
import { totals, inMonth, categoryTotals, validAmount } from './money.js';
import { strongPassword } from './password.js';
const rows = [{ type: 'income', amount: '1000.10', entry_date: '2026-11-01', category: 'Salary' }, { type: 'expense', amount: '0.10', entry_date: '2026-11-02', category: 'Food' }, { type: 'expense', amount: '0.20', entry_date: '2026-11-03', category: 'Food' }];
test('centavo arithmetic', () => assert.deepEqual(totals(rows), { income: 1000.1, expense: 0.3, balance: 999.8 }));
test('month filtering', () => assert.equal(inMonth(rows, '2026-10').length, 0));
test('category spending', () => assert.deepEqual(categoryTotals(rows), [{ name: 'Food', amount: 0.3 }]));
test('amount validation', () => { for (const x of ['-1', '0', '1.001', '1e5', ''])
    assert.equal(validAmount(x), false); assert.equal(validAmount('1.50'), true); });
test('password validation', () => { assert.equal(strongPassword('Example!25'), true); assert.equal(strongPassword('example'), false); });
