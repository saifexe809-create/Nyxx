'use client';
import { useState } from 'react';

export default function Home() {
  const [secret, setSecret] = useState('');
  const [msg, setMsg] = useState('');
  const [key, setKey] = useState('');
  const [duration, setDuration] = useState('1d');

  const api = async (endpoint, body) => {
    setMsg('جاري التنفيذ...');
    const res = await fetch(`/api/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, secret })
    });
    const data = await res.json();
    setMsg(data.message);
  };

  return (
    <main style={{ padding: 20, fontFamily: 'sans-serif', background: '#111', color: '#fff', minHeight: '100vh' }}>
      <h1 style={{ color: '#d4af64' }}>NYX Control Panel</h1>
      
      <div style={{ marginBottom: 20 }}>
        <input type="password" placeholder="Enter Admin Password" value={secret} onChange={e => setSecret(e.target.value)} style={{ padding: 10, width: '100%', marginBottom: 10, borderRadius: 5, border: '1px solid #333', background: '#222', color: '#fff' }} />
      </div>

      <div style={{ border: '1px solid #d4af64', padding: 15, borderRadius: 10, marginBottom: 20 }}>
        <h3>🔑 Generate Key</h3>
        <select value={duration} onChange={e => setDuration(e.target.value)} style={{ padding: 10, marginRight: 10, borderRadius: 5, background: '#222', color: '#fff', border: '1px solid #333' }}>
          <option value="1d">1 Day</option>
          <option value="3d">3 Days</option>
          <option value="7d">7 Days</option>
          <option value="30d">30 Days</option>
          <option value="forever">Forever</option>
        </select>
        <button onClick={() => api('genkey', { duration })} style={{ padding: 10, background: '#d4af64', color: '#000', border: 'none', borderRadius: 5, cursor: 'pointer', fontWeight: 'bold' }}>Generate</button>
      </div>

      <div style={{ border: '1px solid #d4af64', padding: 15, borderRadius: 10, marginBottom: 20 }}>
        <h3>❌ Revoke Key</h3>
        <input type="text" placeholder="Key (NYX-XXXXXX)" value={key} onChange={e => setKey(e.target.value)} style={{ padding: 10, marginRight: 10, borderRadius: 5, border: '1px solid #333', background: '#222', color: '#fff' }} />
        <button onClick={() => api('revoke', { key })} style={{ padding: 10, background: '#d4af64', color: '#000', border: 'none', borderRadius: 5, cursor: 'pointer', fontWeight: 'bold' }}>Revoke</button>
      </div>

      <div style={{ border: '1px solid #d4af64', padding: 15, borderRadius: 10 }}>
        <h3>🛠️ Maintenance</h3>
        <button onClick={() => api('maintenance', { status: 'on' })} style={{ padding: 10, background: 'red', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer', marginRight: 10, fontWeight: 'bold' }}>Turn ON</button>
        <button onClick={() => api('maintenance', { status: 'off' })} style={{ padding: 10, background: 'green', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer', fontWeight: 'bold' }}>Turn OFF</button>
      </div>

      <p style={{ marginTop: 20, color: '#d4af64', fontWeight: 'bold', fontSize: 16 }}>{msg}</p>
    </main>
  );
}
