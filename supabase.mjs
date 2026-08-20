const base = process.env.SUPABASE_URL?.replace(/\/$/, '');
const key = process.env.SUPABASE_SECRET_KEY;

export function configured() { return Boolean(base && key); }

export async function query(table, options = {}) {
  if (!configured()) throw new Error('Supabase não configurado');
  const { method = 'GET', body, params = '' } = options;
  const response = await fetch(`${base}/rest/v1/${table}${params}`, {
    method,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!response.ok) throw new Error(await response.text());
  return response.status === 204 ? null : response.json();
}
