import { useState } from 'react';

const WATERMARK = '© 2024–2026 Fruitful Holdings (Pty) Ltd · GC7:FSP2021121654:4400302974:VM9s:BL1501:GHOST7CHAIN:FAA13713';

const TREE_HOUSES = [
  { id: 1, name: 'Dakar Treehouse', country: 'Senegal', status: 'Active', capacity: 60, trees: 4200, podcasters: ['Aminata D.', 'Cheikh B.'] },
  { id: 2, name: 'Cape Town Studio', country: 'South Africa', status: 'Active', capacity: 80, trees: 6100, podcasters: ['Zara M.', 'Lebo K.'] },
  { id: 3, name: 'Harare Hub', country: 'Zimbabwe', status: 'Active', capacity: 40, trees: 3800, podcasters: ['Tatenda C.'] },
  { id: 4, name: 'Gaborone Node', country: 'Botswana', status: 'Active', capacity: 35, trees: 2900, podcasters: ['Kagiso S.', 'Onalenna D.'] },
  { id: 5, name: 'Osaka Treehouse', country: 'Japan', status: 'Active', capacity: 55, trees: 5100, podcasters: ['Hana Y.', 'Ryo T.'] },
  { id: 6, name: 'Austin Studio', country: 'USA · Texas', status: 'Active', capacity: 70, trees: 4400, podcasters: ['Marcus J.', 'Elena R.'] },
  { id: 7, name: 'Mexico City Hub', country: 'Mexico', status: 'Active', capacity: 65, trees: 5800, podcasters: ['Sofía L.', 'Diego M.'] },
  { id: 8, name: 'Reykjavik Pod', country: 'Iceland', status: 'Active', capacity: 25, trees: 1200, podcasters: ['Björn E.'] },
  { id: 9, name: 'Cairo Treehouse', country: 'Egypt', status: 'Active', capacity: 50, trees: 3600, podcasters: ['Nour A.', 'Hassan F.'] },
  { id: 10, name: 'Chiang Mai Studio', country: 'Thailand', status: 'Active', capacity: 45, trees: 4700, podcasters: ['Ploy W.', 'Krit P.'] },
  { id: 11, name: 'Vancouver Node', country: 'Canada', status: 'Coming 2026', capacity: 90, trees: 7200, podcasters: [] },
  { id: 12, name: 'Lagos Treehouse', country: 'Nigeria', status: 'Active', capacity: 75, trees: 6500, podcasters: ['Chioma O.', 'Emeka N.'] },
  { id: 13, name: 'Nairobi Hub', country: 'Kenya', status: 'Active', capacity: 60, trees: 5300, podcasters: ['Amina W.', 'Brian O.'] },
  { id: 14, name: 'São Paulo Studio', country: 'Brazil', status: 'Active', capacity: 85, trees: 7800, podcasters: ['Fernanda S.', 'Lucas A.'] },
  { id: 15, name: 'Mumbai Treehouse', country: 'India', status: 'Active', capacity: 70, trees: 6900, podcasters: ['Priya R.', 'Arjun V.'] },
  { id: 16, name: 'Berlin Hub', country: 'Germany', status: 'Active', capacity: 55, trees: 4100, podcasters: ['Klaus M.', 'Anna L.'] },
];

const EPISODES = [
  { id: 1, title: 'Roots & Routes: African Storytelling', host: 'Aminata D.', location: 'Dakar', genre: 'Culture', duration: '42min', listeners: 3200 },
  { id: 2, title: 'Ubuntu Tech: Building Tomorrow', host: 'Zara M.', location: 'Cape Town', genre: 'Technology', duration: '38min', listeners: 5100 },
  { id: 3, title: 'The Baobab Sessions: Jazz Edition', host: 'Hana Y.', location: 'Osaka', genre: 'Music', duration: '61min', listeners: 2800 },
  { id: 4, title: 'From Here to Timbuktu: Ep.14', host: 'Chioma O.', location: 'Lagos', genre: 'Travel', duration: '55min', listeners: 7400 },
  { id: 5, title: 'Pampas to Savanna', host: 'Fernanda S.', location: 'São Paulo', genre: 'Nature', duration: '47min', listeners: 3900 },
  { id: 6, title: 'Kalahari Voices', host: 'Kagiso S.', location: 'Gaborone', genre: 'Culture', duration: '33min', listeners: 2100 },
];

export default function BaobabTree() {
  const [activeTab, setActiveTab] = useState('home');
  const [terminalOutput, setTerminalOutput] = useState([
    '> BaobabTree™ GLYPH-TAP CONSOLE v2.1',
    '> SOVEREIGN LINK: ESTABLISHED',
    '> Type help for available commands',
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleTerminalCommand = (e) => {
    if (e.key !== 'Enter') return;
    const cmd = terminalInput.trim().toLowerCase();
    let response = [];
    if (cmd === 'help') {
      response = ['Available: push_episode | sync_stream | lock_feed | status | clear'];
    } else if (cmd === 'status') {
      response = ['SOVEREIGN STATUS: ACTIVE', 'FEED DRIFT: 2.1%', 'VAULT PULSE: ████████░░ 82%', 'LIVE DROPS: 47 active'];
    } else if (cmd === 'push_episode') {
      response = ['[PUSH] Queuing episode upload...', '[PUSH] Encoding GLYPH signature...', '[PUSH] Episode queued. ETA: 3min'];
    } else if (cmd === 'sync_stream') {
      response = ['[SYNC] Connecting to 16 tree houses...', '[SYNC] Stream synchronized across all nodes.'];
    } else if (cmd === 'lock_feed') {
      response = ['[LOCK] Feed sovereignty enforced. Access restricted.'];
    } else if (cmd === 'clear') {
      setTerminalOutput([]);
      setTerminalInput('');
      return;
    } else if (cmd) {
      response = [`Unknown command: ${cmd}. Type help.`];
    }
    setTerminalOutput(prev => [...prev, `$ ${terminalInput}`, ...response]);
    setTerminalInput('');
  };

  const filteredHouses = TREE_HOUSES.filter(h =>
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'treehouses', label: 'Digital Tree Houses' },
    { id: 'podcasts', label: 'Live Podcasts' },
    { id: 'dashboard', label: 'Podcaster Dashboard' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', background: '#f5f0e8' }}>
      {/* Sidebar */}
      <div style={{ width: 260, background: '#1a3c2e', color: '#e8dfc8', display: 'flex', flexDirection: 'column', padding: '24px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 20px 24px' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#c8922a', letterSpacing: 1 }}>🌳 BaobabTree™</div>
          <div style={{ fontSize: 11, color: '#8aab96', marginTop: 4 }}>Global Podcasting Network</div>
        </div>

        <div style={{ padding: '12px 20px', background: '#0f2318', margin: '0 12px 20px', borderRadius: 8 }}>
          <div style={{ fontSize: 10, color: '#c8922a', fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>NETWORK STATUS</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: '#8aab96' }}>Live Podcasts</span>
            <span style={{ fontSize: 11, color: '#4ade80', fontWeight: 700 }}>47</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: '#8aab96' }}>Active Podcasters</span>
            <span style={{ fontSize: 11, color: '#4ade80', fontWeight: 700 }}>1,247</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, color: '#8aab96' }}>Tree Houses Online</span>
            <span style={{ fontSize: 11, color: '#4ade80', fontWeight: 700 }}>16</span>
          </div>
        </div>

        <nav style={{ flex: 1 }}>
          {[
            { id: 'home', label: 'BushPortal Home' },
            { id: 'treehouses', label: 'Digital Tree Houses', badge: '16' },
            { id: 'home', label: 'Command Center' },
            { id: 'podcasts', label: 'Live Podcasts', badge: '47' },
            { id: 'dashboard', label: 'Podcast Studios' },
            { id: 'dashboard', label: 'Podcaster Community' },
            { id: 'home', label: 'Global Network Map' },
            { id: 'podcasts', label: 'Content Discovery' },
            { id: 'treehouses', label: 'Featured Locations' },
            { id: 'dashboard', label: 'Analytics & Insights' },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', padding: '9px 20px', background: 'none', border: 'none',
                color: '#c8ddd1', fontSize: 12, cursor: 'pointer', textAlign: 'left',
              }}
            >
              <span>{item.label}</span>
              {item.badge && (
                <span style={{ background: '#c8922a', color: '#fff', borderRadius: 10, padding: '1px 7px', fontSize: 10, fontWeight: 700 }}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ padding: '16px 20px', borderTop: '1px solid #2d5040' }}>
          <div style={{ fontSize: 10, color: '#c8922a', fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>CONNECTED REGIONS</div>
          {[['Africa', 12], ['Asia', 8], ['Americas', 5], ['Europe', 4]].map(([region, count]) => (
            <div key={region} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: '#8aab96' }}>{region}</span>
              <span style={{ fontSize: 11, color: '#4ade80' }}>{count} active</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        {/* Tab Bar */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e2d8c8', display: 'flex', padding: '0 24px' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '14px 20px', background: 'none', border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #c8922a' : '2px solid transparent',
                color: activeTab === tab.id ? '#c8922a' : '#666',
                fontWeight: activeTab === tab.id ? 700 : 400,
                fontSize: 13, cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, padding: 32 }}>
          {/* HOME TAB */}
          {activeTab === 'home' && (
            <div>
              <div style={{ background: 'linear-gradient(135deg, #1a3c2e 0%, #2d5a3d 100%)', borderRadius: 16, padding: '48px 40px', marginBottom: 32, color: '#fff', textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🌳</div>
                <h1 style={{ fontSize: 36, fontWeight: 800, color: '#c8922a', margin: '0 0 8px' }}>BaobabTree™</h1>
                <p style={{ fontSize: 18, color: '#c8ddd1', margin: '0 0 24px' }}>From Here to Timbuktu — Stories That Travel</p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <button style={{ background: '#c8922a', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Join the Network</button>
                  <button style={{ background: 'transparent', color: '#c8ddd1', border: '1px solid #4a7060', borderRadius: 8, padding: '12px 24px', fontSize: 14, cursor: 'pointer' }}>Explore Tree Houses</button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40 }}>
                {[['247', 'Storytellers'], ['156K', 'Listeners'], ['3.4K', 'Episodes'], ['23', 'Languages']].map(([val, label]) => (
                  <div key={label} style={{ background: '#fff', borderRadius: 12, padding: '20px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: '#1a3c2e' }}>{val}</div>
                    <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>{label}</div>
                  </div>
                ))}
              </div>

              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a3c2e', marginBottom: 20 }}>Why BaobabTree™?</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {[
                  ['🌍', 'Global Reach', 'Connect your podcast to 16 tree house studios across 4 continents'],
                  ['🎙️', 'Sovereign Feeds', 'Own your RSS feed — no platform lock-in, ever'],
                  ['🔒', 'GLYPH-TAP™ Security', 'Military-grade episode signing and distribution'],
                  ['📡', 'Live Streaming', 'Broadcast live from any tree house studio worldwide'],
                  ['📊', 'Deep Analytics', 'Know exactly who listens, where, and when'],
                  ['🤝', 'Community', 'Connect with 1,247 podcasters across the network'],
                ].map(([icon, title, desc]) => (
                  <div key={title} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                    <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
                    <div style={{ fontWeight: 700, color: '#1a3c2e', marginBottom: 4 }}>{title}</div>
                    <div style={{ fontSize: 12, color: '#666', lineHeight: 1.5 }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TREE HOUSES TAB */}
          {activeTab === 'treehouses' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
                {[['16', 'Tree Houses'], ['840', 'Total Capacity'], ['15', 'Active Studios'], ['71,500', 'Baobab Trees']].map(([val, label]) => (
                  <div key={label} style={{ background: '#1a3c2e', borderRadius: 12, padding: 20, textAlign: 'center' }}>
                    <div style={{ fontSize: 26, fontWeight: 800, color: '#c8922a' }}>{val}</div>
                    <div style={{ fontSize: 11, color: '#8aab96', marginTop: 4 }}>{label}</div>
                  </div>
                ))}
              </div>

              <input
                placeholder="Search tree houses or countries..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '10px 16px', borderRadius: 8, border: '1px solid #ddd', marginBottom: 20, fontSize: 13, boxSizing: 'border-box', background: '#fff' }}
              />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {filteredHouses.map(house => (
                  <div key={house.id} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#1a3c2e' }}>{house.name}</div>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
                        background: house.status === 'Active' ? '#dcfce7' : '#fef3c7',
                        color: house.status === 'Active' ? '#166534' : '#92400e',
                      }}>{house.status}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#888', marginBottom: 12 }}>📍 {house.country}</div>
                    <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                      <div style={{ fontSize: 11, color: '#555' }}>👥 Cap: <strong>{house.capacity}</strong></div>
                      <div style={{ fontSize: 11, color: '#555' }}>🌳 Trees: <strong>{house.trees.toLocaleString()}</strong></div>
                    </div>
                    {house.podcasters.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {house.podcasters.map(p => (
                          <span key={p} style={{ background: '#f0ebe0', color: '#5a4030', fontSize: 10, padding: '2px 8px', borderRadius: 10 }}>{p}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LIVE PODCASTS TAB */}
          {activeTab === 'podcasts' && (
            <div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                <input
                  placeholder="Search episodes..."
                  style={{ flex: 1, padding: '10px 16px', borderRadius: 8, border: '1px solid #ddd', fontSize: 13, background: '#fff' }}
                />
                <select style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #ddd', fontSize: 13, background: '#fff' }}>
                  <option>All Locations</option>
                  {TREE_HOUSES.map(h => <option key={h.id}>{h.country}</option>)}
                </select>
                <select style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #ddd', fontSize: 13, background: '#fff' }}>
                  <option>All Genres</option>
                  <option>Culture</option><option>Technology</option><option>Music</option><option>Travel</option><option>Nature</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                {EPISODES.map(ep => (
                  <div key={ep.id} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', display: 'flex', gap: 16 }}>
                    <button style={{ width: 48, height: 48, borderRadius: '50%', background: '#1a3c2e', color: '#c8922a', border: 'none', fontSize: 18, cursor: 'pointer', flexShrink: 0 }}>▶</button>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#1a3c2e', marginBottom: 4 }}>{ep.title}</div>
                      <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>by {ep.host} · 📍 {ep.location}</div>
                      <div style={{ display: 'flex', gap: 12 }}>
                        <span style={{ fontSize: 11, background: '#f0ebe0', color: '#5a4030', padding: '2px 8px', borderRadius: 10 }}>{ep.genre}</span>
                        <span style={{ fontSize: 11, color: '#666' }}>⏱ {ep.duration}</span>
                        <span style={{ fontSize: 11, color: '#666' }}>👂 {ep.listeners.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PODCASTER DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {/* Terminal */}
                <div style={{ background: '#0d1b2a', borderRadius: 12, padding: 20, gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: 11, color: '#c8922a', fontWeight: 700, marginBottom: 12, letterSpacing: 2 }}>GLYPH-TAP CONSOLE™</div>
                  <div style={{ height: 160, overflowY: 'auto', marginBottom: 12 }}>
                    {terminalOutput.map((line, i) => (
                      <div key={i} style={{ fontSize: 12, color: line.startsWith('$') ? '#c8922a' : '#4ade80', fontFamily: 'monospace', lineHeight: 1.6 }}>{line}</div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ color: '#c8922a', fontFamily: 'monospace', fontSize: 13 }}>$</span>
                    <input
                      value={terminalInput}
                      onChange={e => setTerminalInput(e.target.value)}
                      onKeyDown={handleTerminalCommand}
                      placeholder="push_episode | sync_stream | lock_feed | status | help"
                      style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#e8dfc8', fontFamily: 'monospace', fontSize: 12 }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[
                    ['SOVEREIGN STATUS', 'ACTIVE', '#4ade80'],
                    ['FEED DRIFT', '2.1%', '#fbbf24'],
                    ['LAST DROP', '14m ago', '#60a5fa'],
                    ['VAULT PULSE', '████░ 82%', '#c084fc'],
                  ].map(([label, value, color]) => (
                    <div key={label} style={{ background: '#0d1b2a', borderRadius: 10, padding: 16 }}>
                      <div style={{ fontSize: 10, color: '#8aab96', marginBottom: 6, letterSpacing: 1 }}>{label}</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color, fontFamily: 'monospace' }}>{value}</div>
                    </div>
                  ))}
                </div>

                {/* Upload Panel */}
                <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                  <div style={{ fontWeight: 700, color: '#1a3c2e', marginBottom: 16 }}>Upload New Episode</div>
                  <input placeholder="Episode title" style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #ddd', marginBottom: 10, fontSize: 13, boxSizing: 'border-box' }} />
                  <textarea placeholder="Episode description" rows={3} style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #ddd', marginBottom: 10, fontSize: 13, resize: 'none', boxSizing: 'border-box' }} />
                  <div style={{ border: '2px dashed #c8ddd1', borderRadius: 8, padding: '20px', textAlign: 'center', marginBottom: 12, color: '#8aab96', fontSize: 12 }}>Drop audio file here or click to browse</div>
                  <button style={{ width: '100%', background: '#1a3c2e', color: '#c8922a', border: 'none', borderRadius: 8, padding: '10px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Publish Episode</button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: '12px 32px', borderTop: '1px solid #e2d8c8', fontSize: 9, color: '#aaa', background: '#fff' }}>{WATERMARK}</div>
      </div>
    </div>
  );
}
