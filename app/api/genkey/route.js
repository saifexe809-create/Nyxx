import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export async function POST(req) {
  const { duration, secret } = await req.json();
  if (secret !== process.env.ADMIN_SECRET) return NextResponse.json({ message: '❌ Wrong Password' });

  const key = 'NYX-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  let expires = null;
  if (duration !== 'forever') {
    expires = new Date();
    expires.setDate(expires.getDate() + parseInt(duration));
  }

  const { error } = await supabase.from('keys').insert({ key_code: key, expires_at: expires ? expires.toISOString() : null, is_active: true });
  if (error) return NextResponse.json({ message: 'Error: ' + error.message });
  return NextResponse.json({ message: `✅ Key: ${key} (${duration})` });
}
