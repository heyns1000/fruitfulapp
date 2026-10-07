import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import BackButton from '../components/navigation/BackButton';
import { Heart, TrendingUp, Zap, Globe } from 'lucide-react';

const GRAIN = 0.01;

// Simulated global rescue projects funded by Shanana™ Care Grains (15%)
const PROJECTS = [
  {
    id: 1, name: 'Cape Flats Wildlife Corridor', region: 'South Africa',
    lat: -33.95, lng: 18.46, careUSD: 48200, grains: 4820000,
    milestone: 'Phase 2 Complete', status: 'active',
    animals: 340, hectares: 820, impact: 'Lynx & Cape Leopard habitat secured',
    color: '#48bb78', fundedPct: 87,
  },
  {
    id: 2, name: 'Nairobi Green Canopy', region: 'Kenya',
    lat: -1.28, lng: 36.82, careUSD: 31500, grains: 3150000,
    milestone: 'Tree Planting Active', status: 'active',
    animals: 120, hectares: 340, impact: '12,000 trees planted this quarter',
    color: '#48bb78', fundedPct: 64,
  },
  {
    id: 3, name: 'Lagos Estuary Rescue', region: 'Nigeria',
    lat: 6.45, lng: 3.40, careUSD: 22100, grains: 2210000,
    milestone: 'Funding Milestone Reached', status: 'milestone',
    animals: 89, hectares: 210, impact: 'Mangrove restoration complete',
    color: '#ed8936', fundedPct: 100,
  },
  {
    id: 4, name: 'Serengeti Anti-Poaching Fund', region: 'Tanzania',
    lat: -2.33, lng: 34.83, careUSD: 67400, grains: 6740000,
    milestone: 'Ranger Equipment Deployed', status: 'active',
    animals: 1200, hectares: 14763, impact: '43 rangers funded this season',
    color: '#48bb78', fundedPct: 72,
  },
  {
    id: 5, name: 'Drakensberg Condor Watch', region: 'South Africa',
    lat: -29.0, lng: 29.4, careUSD: 18900, grains: 1890000,
    milestone: 'Monitoring Live', status: 'active',
    animals: 54, hectares: 460, impact: 'Bearded vulture nesting monitored',
    color: '#48bb78', fundedPct: 55,
  },
  {
    id: 6, name: 'Accra Coastal Reef Revive', region: 'Ghana',
    lat: 5.55, lng: -0.2, careUSD: 14200, grains: 1420000,
    milestone: 'Reef Planting Q2', status: 'pending',
    animals: 230, hectares: 90, impact: 'Coral restoration in progress',
    color: '#667eea', fundedPct: 38,
  },
  {
    id: 7, name: 'Kalahari Desert Bloom', region: 'Botswana',
    lat: -22.3, lng: 23.9, careUSD: 9800, grains: 980000,
    milestone: 'Seed Bank Established', status: 'active',
    animals: 67, hectares: 1200, impact: 'Indigenous seed vault secured',
    color: '#48bb78', fundedPct: 91,
  },
  {
    id: 8, name: 'Cairo Migratory Bird Stopover', region: 'Egypt',
    lat: 30.05, lng: 31.23, careUSD: 7300, grains: 730000,
    milestone: 'Station Built', status: 'milestone',
    animals: 450, hectares: 35, impact: 'Rest station for 450+ species',
    color: '#ed8936', fundedPct: 100,
  },
  {
    id: 9, name: 'Johannesburg Urban Beehives', region: 'South Africa',
    lat: -26.2, lng: 28.04, careUSD: 5100, grains: 510000,
    milestone: 'Hives Active', status: 'active',
    animals: 2000000, hectares: 12, impact: '2M bees re-established in urban zones',
    color: '#48bb78', fundedPct: 78,
  },
  {
    id: 10, name: 'Dakar Turtle Sanctuary', region: 'Senegal',
    lat: 14.69, lng: -17.44, careUSD: 11600, grains: 1160000,
    milestone: 'Nesting Season Protected', status: 'active',
    animals: 180, hectares: 6, impact: '3 turtle species nesting secured',
    color: '#48bb78', fundedPct: 62,
  },
  {
    id: 11, name: 'Lusaka River Restoration', region: 'Zambia',
    lat: -15.41, lng: 28.28, careUSD: 8700, grains: 870000,
    milestone: 'Water Quality Testing', status: 'pending',
    animals: 95, hectares: 150, impact: 'Kafue tributary cleaned',
    color: '#667eea', fundedPct: 44,
  },
  {
    id: 12, name: 'Kampala Wetlands Shield', region: 'Uganda',
    lat: 0.31, lng: 32.58, careUSD: 19200, grains: 1920000,
    milestone: 'Wetland Mapped', status: 'active',
    animals: 310, hectares: 520, impact: 'Papyrus wetlands preserved',
    color: '#48bb78', fundedPct: 69,
  },
];

const STATUS_COLORS = { active: '#48bb78', milestone: '#ed8936', pending: '#667eea' };
const STATUS_LABELS = { active: '🟢 Active', milestone: '🏆 Milestone', pending: '🔵 Pending' };

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div style={{ background: 'white', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1.5px solid #e2e8f0' }}>
      <div style={{ width: 40, height: 40, borderRadius: '10px', background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon style={{ width: 20, height: 20, color }} />
      </div>
      <div>
        <div style={{ fontSize: '20px', fontWeight: 800, color: '#2d3748' }}>{value}</div>
        <div style={{ fontSize: '12px', color: '#718096', fontWeight: 600 }}>{label}</div>
      </div>
    </div>
  );
}

// Map an optional real care-project record onto the hardcoded project shape, filling
// every field defensively so a partial record can never blank out the UI.
function mapProject(r, i) {
  return {
    id: r.id ?? r.record_id ?? `care-${i}`,
    name: r.name ?? r.title ?? 'Care Project',
    region: r.region ?? r.country ?? '—',
    lat: Number(r.lat ?? r.latitude ?? 0) || 0,
    lng: Number(r.lng ?? r.longitude ?? 0) || 0,
    careUSD: Number(r.careUSD ?? r.careUsd ?? r.amountUSD ?? 0) || 0,
    grains: Number(r.grains ?? 0) || Math.round((Number(r.careUSD ?? 0) || 0) / 0.01),
    milestone: r.milestone ?? r.status ?? '—',
    status: r.status ?? 'active',
    animals: Number(r.animals ?? 0) || 0,
    hectares: Number(r.hectares ?? 0) || 0,
    impact: r.impact ?? r.description ?? '—',
    color: r.color ?? '#48bb78',
    fundedPct: Number(r.fundedPct ?? r.funded ?? 0) || 0,
  };
}

export default function CareGrainsMap() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');

  // Optional real-data upgrade path. No such entity exists today, so the query is
  // fully guarded and the hardcoded PROJECTS array remains the guaranteed fallback.
  const { data: realProjects = [] } = useQuery({
    queryKey: ['care-grains-projects'],
    queryFn: async () => {
      try {
        const rows = await base44.entities.CareProject.list('-created_date', 100);
        return Array.isArray(rows) ? rows : [];
      } catch {
        return [];
      }
    },
  });

  const projects = realProjects.length > 0 ? realProjects.map(mapProject) : PROJECTS;

  const totalCare = projects.reduce((s, p) => s + p.careUSD, 0);
  const totalAnimals = projects.reduce((s, p) => s + p.animals, 0);
  const totalHectares = projects.reduce((s, p) => s + p.hectares, 0);
  const filtered = filter === 'all' ? projects : projects.filter(p => p.status === filter);

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4ff', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#276749,#48bb78)', color: 'white', padding: '32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.07, backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <Heart style={{ width: 30, height: 30 }} />
            <h1 style={{ fontSize: '30px', fontWeight: 900, margin: 0 }}>Care Grains™ Global Deployment</h1>
          </div>
          <p style={{ opacity: 0.85, margin: 0, fontSize: '14px' }}>
            15% of every Shanana™ transaction — visualized across real-world rescue projects
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        <BackButton />

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '14px', margin: '16px 0 24px' }}>
          <StatCard icon={Heart} label="Total Care Deployed" value={`$${totalCare.toLocaleString()}`} color="#48bb78" />
          <StatCard icon={Globe} label="Active Projects" value={projects.length} color="#667eea" />
          <StatCard icon={Zap} label="Animals Protected" value={totalAnimals.toLocaleString()} color="#ed8936" />
          <StatCard icon={TrendingUp} label="Hectares Secured" value={`${totalHectares.toLocaleString()} ha`} color="#e53e3e" />
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {['all', 'active', 'milestone', 'pending'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
              border: '1.5px solid', borderColor: filter === f ? '#276749' : '#e2e8f0',
              background: filter === f ? '#276749' : 'white', color: filter === f ? 'white' : '#4a5568',
            }}>{f.toUpperCase()}</button>
          ))}
        </div>

        {/* Map */}
        <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '24px', border: '2px solid #e2e8f0' }}>
          <MapContainer center={[-5, 22]} zoom={4} style={{ height: '520px', width: '100%' }} scrollWheelZoom={true}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filtered.map(p => (
              <CircleMarker
                key={p.id}
                center={[p.lat, p.lng]}
                radius={8 + Math.sqrt(p.careUSD / 800)}
                pathOptions={{ color: STATUS_COLORS[p.status], fillColor: STATUS_COLORS[p.status], fillOpacity: 0.75, weight: 2 }}
                eventHandlers={{ click: () => setSelected(p) }}
              >
                <Tooltip permanent={false} direction="top">
                  <span style={{ fontWeight: 700 }}>{p.name}</span><br />
                  ${p.careUSD.toLocaleString()} deployed
                </Tooltip>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        {/* Detail panel + project cards */}
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 340px' : '1fr', gap: '20px' }}>

          {/* Project cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '14px', alignContent: 'start' }}>
            {filtered.map(p => (
              <div key={p.id} onClick={() => setSelected(selected?.id === p.id ? null : p)}
                style={{ background: 'white', borderRadius: '12px', padding: '16px', cursor: 'pointer', border: `2px solid ${selected?.id === p.id ? STATUS_COLORS[p.status] : '#e2e8f0'}`, boxShadow: selected?.id === p.id ? `0 4px 16px ${STATUS_COLORS[p.status]}40` : '0 1px 4px rgba(0,0,0,0.05)', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 700, color: '#2d3748', fontSize: '14px', lineHeight: 1.3 }}>{p.name}</span>
                  <span style={{ fontSize: '10px', color: STATUS_COLORS[p.status], fontWeight: 700, flexShrink: 0, marginLeft: '8px' }}>{STATUS_LABELS[p.status]}</span>
                </div>
                <div style={{ fontSize: '11px', color: '#718096', marginBottom: '10px' }}>📍 {p.region}</div>
                {/* Funding bar */}
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#4a5568', marginBottom: '4px' }}>
                    <span>Funded</span><span style={{ fontWeight: 700 }}>{p.fundedPct}%</span>
                  </div>
                  <div style={{ height: '5px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${p.fundedPct}%`, background: STATUS_COLORS[p.status], borderRadius: '3px' }} />
                  </div>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#276749' }}>${p.careUSD.toLocaleString()} care grains</div>
              </div>
            ))}
          </div>

          {/* Inspector */}
          {selected && (
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '2px solid #e2e8f0', height: 'fit-content', position: 'sticky', top: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span style={{ fontWeight: 800, fontSize: '16px', color: '#2d3748' }}>{selected.name}</span>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a0aec0', fontSize: '18px' }}>✕</button>
              </div>

              <div style={{ background: `${STATUS_COLORS[selected.status]}15`, border: `1.5px solid ${STATUS_COLORS[selected.status]}`, borderRadius: '10px', padding: '14px', marginBottom: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 900, color: STATUS_COLORS[selected.status] }}>${selected.careUSD.toLocaleString()}</div>
                <div style={{ fontSize: '11px', color: '#718096' }}>{selected.grains.toLocaleString()} care grains deployed</div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: STATUS_COLORS[selected.status], marginTop: '6px' }}>{STATUS_LABELS[selected.status]}</div>
              </div>

              {[
                ['🏆 Milestone', selected.milestone],
                ['🐾 Animals Protected', selected.animals.toLocaleString()],
                ['🌿 Hectares', `${selected.hectares.toLocaleString()} ha`],
                ['📍 Region', selected.region],
                ['✨ Impact', selected.impact],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f7fafc', fontSize: '13px', gap: '12px' }}>
                  <span style={{ color: '#718096', fontWeight: 600, flexShrink: 0 }}>{k}</span>
                  <span style={{ color: '#2d3748', fontWeight: 700, textAlign: 'right' }}>{v}</span>
                </div>
              ))}

              {/* Funding bar */}
              <div style={{ marginTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', fontWeight: 700 }}>
                  <span style={{ color: '#4a5568' }}>Funding Progress</span>
                  <span style={{ color: STATUS_COLORS[selected.status] }}>{selected.fundedPct}%</span>
                </div>
                <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${selected.fundedPct}%`, background: `linear-gradient(90deg,${STATUS_COLORS[selected.status]},${STATUS_COLORS[selected.status]}aa)`, borderRadius: '4px', transition: 'width 0.6s ease' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '11px', color: '#a0aec0' }}>
          每粒番計, 零浪費 · 15% of every Shanana™ transaction powers real-world rescue · Fruitful Global Planet
        </div>
      </div>
    </div>
  );
}