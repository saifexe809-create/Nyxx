import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://vudiwjsqcuohuowhkxlz.supabase.co', 
  'sb_publishable_mJ9ev3P4Sjb0bcLSC2xlzQ_MxeemYEp'
);

const ADMIN_SECRET = 'nyx123'; 

export default function App() {
  const [secret, setSecret] = useState('');
  const [msg, setMsg] = useState('');
  const [key, setKey] = useState('');
  const [duration, setDuration] = useState('10m');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = () => {
    if (secret !== ADMIN_SECRET) {
      setMsg('❌ Wrong Password');
      return false;
    }
    return true;
  };

  const generateKey = async () => {
    if (!handleAuth()) return;
    setLoading(true);
    const newKey = 'NYX-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // حساب الوقت بناءً على الاختيار
    let expires = null;
    if (duration !== 'forever') {
      expires = new Date();
      const amount = parseInt(duration);
      if (duration.endsWith('m')) {
        expires.setMinutes(expires.getMinutes() + amount);
      } else if (duration.endsWith('h')) {
        expires.setHours(expires.getHours() + amount);
      } else if (duration.endsWith('d')) {
        expires.setDate(expires.getDate() + amount);
      }
    }
    
    const { error } = await supabase.from('keys').insert({
      key_code: newKey,
      expires_at: expires ? expires.toISOString() : null,
      is_active: true
    });
    
    setLoading(false);
    if (error) setMsg('Error: ' + error.message);
    else setMsg(`✅ Key: ${newKey} (${duration})`);
  };

  const revokeKey = async () => {
    if (!handleAuth()) return;
    setLoading(true);
    const { error } = await supabase.from('keys').update({ is_active: false }).eq('key_code', key);
    setLoading(false);
    if (error) setMsg('Error: ' + error.message);
    else setMsg(`✅ Revoked: ${key}`);
  };

  const toggleMaintenance = async (status) => {
    if (!handleAuth()) return;
    setLoading(true);
    const { error } = await supabase.from('settings').update({ maintenance: status === 'on' }).eq('id', 1);
    setLoading(false);
    if (error) setMsg('Error: ' + error.message);
    else setMsg(`✅ Maintenance: ${status.toUpperCase()}`);
  };

  const setNoticeMsg = async () => {
    if (!handleAuth()) return;
    setLoading(true);
    const { error } = await supabase.from('settings').update({ notice: notice }).eq('id', 1);
    setLoading(false);
    if (error) setMsg('Error: ' + error.message);
    else setMsg(`✅ Notice set to: ${notice}`);
  };

  return (
    <main style={{ padding: 20, fontFamily: 'sans-serif', background: '#111', color: '#fff', minHeight: '100vh' }}>
      <h1 style={{ color: '#d4af64', textAlign: 'center' }}>NYX Control Panel</h1>
      
      <div style={{ marginBottom: 20 }}>
        <input type="password" placeholder="Admin Password" value={secret} onChange={e => setSecret(e.target.value)} style={{ padding: 15, width: '100%', borderRadius: 8, border: '1px solid #333', background: '#222', color: '#fff', boxSizing: 'border-box' }} />
      </div>

      <div style={{ border: '1px solid #d4af64', padding: 20, borderRadius: 12, marginBottom: 20, background: '#1a1a1a' }}>
        <h3 style={{ marginTop: 0 }}>🔑 Generate Key</h3>
        <select value={duration} onChange={e => setDuration(e.target.value)} style={{ padding: 12, marginRight: 10, borderRadius: 8, background: '#222', color: '#fff', border: '1px solid #333', width: '100%', marginBottom: 10 }}>
          <option value="10m">10 Minutes</option>
          <option value="1h">1 Hour</option>
          <option value="2h">2 Hours</option>
          <option value="4h">4 Hours</option>
          <option value="1d">1 Day</option>
          <option value="3d">3 Days</option>
          <option value="7d">7 Days</option>
          <option value="30d">30 Days</option>
          <option value="forever">Forever</option>
        </select>
        <button onClick={generateKey} disabled={loading} style={{ padding: 12, background: '#d4af64', color: '#000', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', width: '100%' }}>{loading ? 'Loading...' : 'Generate Key'}</button>
      </div>

      <div style={{ border: '1px solid #d4af64', padding: 20, borderRadius: 12, marginBottom: 20, background: '#1a1a1a' }}>
        <h3 style={{ marginTop: 0 }}>❌ Revoke Key</h3>
        <input type="text" placeholder="Key (NYX-XXXXXX)" value={key} onChange={e => setKey(e.target.value)} style={{ padding: 12, marginBottom: 10, borderRadius: 8, border: '1px solid #333', background: '#222', color: '#fff', width: '100%', boxSizing: 'border-box' }} />
        <button onClick={revokeKey} disabled={loading} style={{ padding: 12, background: '#d4af64', color: '#000', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', width: '100%' }}>{loading ? 'Loading...' : 'Revoke Key'}</button>
      </div>

      <div style={{ border: '1px solid #d4af64', padding: 20, borderRadius: 12, marginBottom: 20, background: '#1a1a1a' }}>
        <h3 style={{ marginTop: 0 }}>🛠️ Maintenance</h3>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => toggleMaintenance('on')} disabled={loading} style={{ padding: 12, background: 'red', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', flex: 1, fontWeight: 'bold' }}>Turn ON</button>
          <button onClick={() => toggleMaintenance('off')} disabled={loading} style={{ padding: 12, background: 'green', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', flex: 1, fontWeight: 'bold' }}>Turn OFF</button>
        </div>
      </div>

      <div style={{ border: '1px solid #d4af64', padding: 20, borderRadius: 12, marginBottom: 20, background: '#1a1a1a' }}>
        <h3 style={{ marginTop: 0 }}>📢 Notice</h3>
        <input type="text" placeholder="Message..." value={notice} onChange={e => setNotice(e.target.value)} style={{ padding: 12, marginBottom: 10, borderRadius: 8, border: '1px solid #333', background: '#222', color: '#fff', width: '100%', boxSizing: 'border-box' }} />
        <button onClick={setNoticeMsg} disabled={loading} style={{ padding: 12, background: '#d4af64', color: '#000', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', width: '100%' }}>{loading ? 'Loading...' : 'Set Notice'}</button>
      </div>

      <p style={{ marginTop: 20, color: '#d4af64', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>{msg}</p>
    </main>
  );
}
