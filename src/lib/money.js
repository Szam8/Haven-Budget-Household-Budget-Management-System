export const peso = value => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(value) || 0);
export const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
export const currentMonth = () => today().slice(0, 7);
export const categories = { income: ['Salary', 'Allowance', 'Business', 'Other income'], expense: ['Food', 'Transport', 'Utilities', 'Education', 'Health', 'Shopping', 'Savings', 'Other expense'] };
export function totals(records) {
    // Work in centavos to avoid accumulating floating-point rounding errors.
    const sum = records.reduce((a, r) => { if (r.type === 'income' || r.type === 'expense')
        a[r.type] += Math.round(Number(r.amount) * 100); return a; }, { income: 0, expense: 0 });
    return { income: sum.income / 100, expense: sum.expense / 100, balance: (sum.income - sum.expense) / 100 };
}
export const inMonth = (records, month) => records.filter(r => r.entry_date.slice(0, 7) === month);
export function categoryTotals(records) { return categories.expense.map(name => ({ name, amount: totals(records.filter(r => r.category === name)).expense })).filter(r => r.amount > 0).sort((a, b) => b.amount - a.amount); }
export const validAmount = v => /^\d+(\.\d{1,2})?$/.test(String(v)) && Number(v) > 0 && Number(v) <= 9999999999.99;
