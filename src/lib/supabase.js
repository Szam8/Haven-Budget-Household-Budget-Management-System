import { createClient } from '@supabase/supabase-js';
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const configured = Boolean(url && key && !url.includes('YOUR_PROJECT') && !key.includes('YOUR_PUBLISHABLE') && /^https?:\/\//.test(url));
export const supabase = configured ? createClient(url, key) : null;
// Read every page instead of silently dropping records at the API row limit.
export async function readPages(makeQuery) {
    const rows = [];
    const pageSize = 200;
    for (let start = 0;; start += pageSize) {
        const { data, error } = await makeQuery().range(start, start + pageSize - 1);
        if (error)
            throw error;
        rows.push(...(data || []));
        if (!data || data.length < pageSize)
            return rows;
    }
}
