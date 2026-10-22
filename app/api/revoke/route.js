import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export async function POST(req) {
  const { key, secret } = await req.json();
  if (secret !== process.env.ADMIN_SECRET) return NextResponse.json({ message: '❌ Wrong Password' });

  const { error } = await supabase.from('keys').update({ is_active: false }).eq('key_code', key);
  if (error) return NextResponse.json({ message: 'Error: ' + error.message });
  return NextResponse.json({ message: `✅ Revoked: ${key}` });
}
