import { useState } from 'react';

const WATERMARK = '© 2024–2026 Fruitful Holdings (Pty) Ltd · GC7:FSP2021121654:4400302974:VM9s:BL1501:GHOST7CHAIN:FAA13713';

const INTEGRATIONS = [
  { name: 'BushCoding', status: 'connected', description: 'Core AI coding platform', color: '#166534' },
  { name: 'FAA.ZONE', status: 'connected', description: 'Franchise analytics & automation', color: '#166534' },
  { name: 'Banimal Loop', status: 'connected', description: 'NFT + loyalty layer', color: '#166534' },
  { name: 'Convex', status: 'configure', description: 'Realtime backend database', color: '#92400e' },
  { name: 'Paystack', status: 'configure', description: 'African payments gateway', color: '#92400e' },
  { name: 'Anthropic', status: 'configure', description: 'Claude AI models', color: '#92400e' },
];

const API_ENDPOINTS = [
  { method: 'POST', path: '/v1/research', description: 'Deep research query via Fruitful Perplexity Gateway', latency: '1.2s' },
  { method: 'POST', path: '/v1/brief', description: 'Generate structured brief from research results', latency: '0.8s' },
  { method: 'POST', path: '/v1/summarize', description: 'Summarize long-form content for kiosk display', latency: '0.5s' },
  { method: 'GET', path: '/v1/status', description: 'Health check and API quota status', latency: '0.1s' },
];

const LOGS = [
  { ts: '2026-08-25 14:32:01', endpoint: 'POST /v1/research', status: 200, latency: '1.18s', workspace: 'BushCoding' },
  { ts: '2026-08-25 14:31:44', endpoint: 'POST /v1/brief', status: 200, latency: '0.77s', workspace: 'FAA.ZONE' },
  { ts: '2026-08-25 14:30:12', endpoint: 'GET /v1/status', status: 200, latency: '0.09s', workspace: 'Banimal Loop' },
  { ts: '2026-08-25 14:28:55', endpoint: 'POST /v1/research', status: 429, latency: '0.03s', workspace: 'BushCoding' },
  { ts: '2026-08-25 14:27:30', endpoint: 'POST /v1/summarize', status: 200, latency: '0.52s', workspace: 'FAA.ZONE' },
  { ts: '2026-08-25 14:25:18', endpoint: 'POST /v1/brief', status: 200, latency: '0.81s', workspace: 'BushCoding' },
];

const WORKSPACES = ['BushCoding', 'FAA.ZONE', 'Banimal'];

export default function BushPortal() {
  const [activeSection, setActiveSection] = useState('api-keys');
  const [apiKeys, setApiKeys] = useState({
    BushCoding: { key: 'bsk_live_••••••••••••••••3a7f', usage: 2847, limit: 10000 },
    'FAA.ZONE': { key: 'bsk_live_••••••••••••••••9c2d', usage: 1203, limit: 5000 },
    Banimal: { key: 'bsk_live_••••••••••••••••e5b1', usage: 445, limit: 5000 },
  });
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookEvents, setWebhookEvents] = useState(['episode.published']);
  const [webhookLog, setWebhookLog] = useState([
    { ts: '14:31:44', event: 'episode.published', status: '200 OK' },
    { ts: '14:28:55', event: 'order.created', status: '200 OK' },
  ]);

  const navItems = [
    { id: 'api-keys', label: '🔑 API Keys' },
    { id: 'webhooks', label: '🔔 Webhooks' },
    { id: 'integrations', label: '🔌 Integrations' },
    { id: 'logs', label: '📋 Logs' },
    { id: 'docs', label: '📖 Docs' },
  ];

  const allEvents = ['episode.published', 'order.created', 'kiosk.scan', 'franchise.update'];

  const toggleEvent = (ev) => {
    setWebhookEvents(prev => prev.includes(ev) ? prev.filter(e => e !== ev) : [...prev, ev]);
  };

  const testWebhook = () => {
    setWebhookLog(prev => [{ ts: new Date().toTimeString().slice(0, 8), event: webhookEvents[0] || 'test', status: '200 OK' }, ...prev]);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, background: '#1a3c2e', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🌿</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#1a3c2e' }}>BushPortal™</div>
            <div style={{ fontSize: 10, color: '#64748b' }}>Developer Integration Hub</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80' }}></div>
            <span style={{ fontSize: 12, color: '#64748b' }}>API Online</span>
          </div>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1a3c2e', color: '#c8922a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>H</div>
        </div>
      </div>

      <div style={{ display: 'flex', height: 'calc(100vh - 61px)' }}>
        {/* Sidebar Nav */}
        <div style={{ width: 220, background: '#fff', borderRight: '1px solid #e2e8f0', padding: '20px 0' }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              style={{
                display: 'block', width: '100%', padding: '10px 20px',
                background: activeSection === item.id ? '#f0fdf4' : 'none',
                border: 'none', borderLeft: activeSection === item.id ? '3px solid #1a3c2e' : '3px solid transparent',
                color: activeSection === item.id ? '#1a3c2e' : '#64748b',
                fontWeight: activeSection === item.id ? 600 : 400,
                fontSize: 13, cursor: 'pointer', textAlign: 'left',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
          {/* API KEYS */}
          {activeSection === 'api-keys' && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a3c2e', marginBottom: 8 }}>API Keys</h2>
              <p style={{ color: '#64748b', fontSize: 13, marginBottom: 24 }}>Manage API keys per workspace. Keys are scoped to their workspace only.</p>
              {WORKSPACES.map(ws => (
                <div key={ws} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ fontWeight: 700, color: '#1a3c2e' }}>{ws}</div>
                    <button style={{ background: '#1a3c2e', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 12, cursor: 'pointer' }}>Regenerate</button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', borderRadius: 8, padding: '10px 14px', marginBottom: 12 }}>
                    <code style={{ flex: 1, fontSize: 12, color: '#334155', fontFamily: 'monospace' }}>{apiKeys[ws]?.key}</code>
                    <button style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: 6, padding: '4px 10px', fontSize: 11, cursor: 'pointer', color: '#64748b' }}>Copy</button>
                    <button style={{ background: 'none', border: '1px solid #fee2e2', borderRadius: 6, padding: '4px 10px', fontSize: 11, cursor: 'pointer', color: '#dc2626' }}>Revoke</button>
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>
                    Usage: <strong>{apiKeys[ws]?.usage.toLocaleString()}</strong> / {apiKeys[ws]?.limit.toLocaleString()} requests
                    <div style={{ marginTop: 6, height: 4, background: '#e2e8f0', borderRadius: 2 }}>
                      <div style={{ height: 4, background: '#1a3c2e', borderRadius: 2, width: `${(apiKeys[ws]?.usage / apiKeys[ws]?.limit) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* WEBHOOKS */}
          {activeSection === 'webhooks' && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a3c2e', marginBottom: 8 }}>Webhooks</h2>
              <p style={{ color: '#64748b', fontSize: 13, marginBottom: 24 }}>Configure endpoints to receive real-time events from the Fruitful ecosystem.</p>
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, marginBottom: 20 }}>
                <div style={{ fontWeight: 600, color: '#1a3c2e', marginBottom: 12 }}>Endpoint URL</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    value={webhookUrl}
                    onChange={e => setWebhookUrl(e.target.value)}
                    placeholder="https://your-app.com/webhooks/fruitful"
                    style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
                  />
                  <button onClick={testWebhook} style={{ background: '#1a3c2e', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', fontSize: 13, cursor: 'pointer' }}>Test Fire</button>
                </div>
                <div style={{ fontWeight: 600, color: '#1a3c2e', margin: '16px 0 10px' }}>Event Types</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {allEvents.map(ev => (
                    <button
                      key={ev}
                      onClick={() => toggleEvent(ev)}
                      style={{
                        padding: '6px 14px', borderRadius: 20, fontSize: 12, cursor: 'pointer',
                        background: webhookEvents.includes(ev) ? '#1a3c2e' : '#f8fafc',
                        color: webhookEvents.includes(ev) ? '#fff' : '#64748b',
                        border: webhookEvents.includes(ev) ? 'none' : '1px solid #e2e8f0',
                      }}
                    >{ev}</button>
                  ))}
                </div>
              </div>
              <div style={{ fontWeight: 600, color: '#1a3c2e', marginBottom: 10 }}>Delivery Log</div>
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
                {webhookLog.map((log, i) => (
                  <div key={i} style={{ display: 'flex', gap: 16, padding: '12px 20px', borderBottom: i < webhookLog.length - 1 ? '1px solid #f1f5f9' : 'none', fontSize: 12 }}>
                    <span style={{ color: '#94a3b8', fontFamily: 'monospace' }}>{log.ts}</span>
                    <span style={{ color: '#1a3c2e', fontWeight: 600 }}>{log.event}</span>
                    <span style={{ color: '#166534', marginLeft: 'auto' }}>{log.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INTEGRATIONS */}
          {activeSection === 'integrations' && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a3c2e', marginBottom: 8 }}>Integrations</h2>
              <p style={{ color: '#64748b', fontSize: 13, marginBottom: 24 }}>Connect BushPortal™ to the services your build depends on.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                {INTEGRATIONS.map(intg => (
                  <div key={intg.name} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#1a3c2e', marginBottom: 4 }}>{intg.name}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{intg.description}</div>
                    </div>
                    <button style={{
                      padding: '6px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontWeight: 600,
                      background: intg.status === 'connected' ? '#f0fdf4' : '#fff',
                      color: intg.color,
                      border: `1px solid ${intg.status === 'connected' ? '#bbf7d0' : '#e2e8f0'}`,
                    }}>
                      {intg.status === 'connected' ? '✓ Connected' : 'Configure'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LOGS */}
          {activeSection === 'logs' && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a3c2e', marginBottom: 8 }}>API Logs</h2>
              <p style={{ color: '#64748b', fontSize: 13, marginBottom: 20 }}>Searchable log of all API calls across your workspaces.</p>
              <input placeholder="Search logs..." style={{ width: '100%', padding: '10px 16px', borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 16, fontSize: 13, boxSizing: 'border-box' }} />
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 60px 70px 100px', padding: '10px 20px', background: '#f8fafc', fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: 0.5 }}>
                  <span>TIMESTAMP</span><span>ENDPOINT</span><span>STATUS</span><span>LATENCY</span><span>WORKSPACE</span>
                </div>
                {LOGS.map((log, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '160px 1fr 60px 70px 100px', padding: '12px 20px', borderTop: '1px solid #f1f5f9', fontSize: 12, alignItems: 'center' }}>
                    <span style={{ color: '#94a3b8', fontFamily: 'monospace' }}>{log.ts}</span>
                    <span style={{ color: '#334155', fontFamily: 'monospace' }}>{log.endpoint}</span>
                    <span style={{ fontWeight: 700, color: log.status === 200 ? '#166534' : '#dc2626' }}>{log.status}</span>
                    <span style={{ color: '#64748b' }}>{log.latency}</span>
                    <span style={{ fontSize: 11, background: '#f0fdf4', color: '#166534', padding: '2px 8px', borderRadius: 10, display: 'inline-block' }}>{log.workspace}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DOCS */}
          {activeSection === 'docs' && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a3c2e', marginBottom: 8 }}>API Reference</h2>
              <p style={{ color: '#64748b', fontSize: 13, marginBottom: 24 }}>Fruitful Perplexity Gateway — endpoints for research, brief generation, and summarization.</p>
              {API_ENDPOINTS.map(ep => (
                <div key={ep.path} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, fontFamily: 'monospace',
                      background: ep.method === 'GET' ? '#dbeafe' : '#dcfce7',
                      color: ep.method === 'GET' ? '#1e40af' : '#166534',
                    }}>{ep.method}</span>
                    <code style={{ fontSize: 13, color: '#1a3c2e', fontWeight: 600 }}>{ep.path}</code>
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: '#94a3b8' }}>avg {ep.latency}</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>{ep.description}</p>
                </div>
              ))}
              <div style={{ background: '#0d1b2a', borderRadius: 12, padding: 20, marginTop: 24 }}>
                <div style={{ fontSize: 11, color: '#c8922a', fontWeight: 700, marginBottom: 12, letterSpacing: 1 }}>BUSHCODING WEBHOOK SCHEMA</div>
                <pre style={{ fontSize: 12, color: '#4ade80', fontFamily: 'monospace', margin: 0, lineHeight: 1.6 }}>{`{
  "event": "episode.published",
  "workspace": "BushCoding",
  "timestamp": "2026-08-25T14:31:44Z",
  "payload": {
    "episode_id": "ep_abc123",
    "title": "From Here to Timbuktu: Ep.14",
    "feed_url": "https://baobab.fruitful.africa/feeds/ep_abc123"
  },
  "signature": "sha256=GLYPH-TAP-VERIFIED"
}`}</pre>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '10px 32px', borderTop: '1px solid #e2e8f0', fontSize: 9, color: '#94a3b8', background: '#fff' }}>{WATERMARK}</div>
    </div>
  );
}
