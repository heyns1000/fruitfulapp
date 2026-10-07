import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  RadialBarChart, RadialBar, PieChart, Pie, Cell
} from 'recharts';
import BackButton from '../components/navigation/BackButton';
import { Zap, Activity, TrendingUp, CheckCircle } from 'lucide-react';

const GRAIN = 0.01;
const SUCCESS_STATUSES = ['success', 'paid', 'confirmed', 'completed', 'succeeded'];

// Build real PulseTrade cycle points from verified PaymentTransaction / Order records.
// Returns null when there is nothing real so the simulation fallback stays in control.
function buildCyclesFromRecords(records) {
  if (!Array.isArray(records) || records.length === 0) return null;
  // Records arrive newest-first; render oldest → newest.
  const ordered = [...records].reverse();
  return ordered.map((r, i) => {
    const usd = Number(r.amount ?? r.totalAmount ?? 0) || 0;
    const status = String(r.status ?? r.paymentStatus ?? '').toLowerCase();
    const ok = SUCCESS_STATUSES.includes(status);
    const grains = Math.round(usd / GRAIN);
    const careGrains = Math.round(grains * 0.15);
    const latencyMs = Number(r.metadata?.latencyMs ?? r.latencyMs ?? 0) || 0;
    return {
      cycle: `P${i + 1}`,
      txVelocity: 1,
      totalGrains: grains,
      careGrains,
      bizGrains: grains - careGrains,
      syncSuccess: ok ? 100 : 0,
      syncFailed: ok ? 0 : 100,
      usd,
      latencyMs,
    };
  });
}
const COLORS = ['#667eea', '#48bb78', '#ed8936', '#e53e3e', '#764ba2'];

// ── Simulated real-time PulseTrade data generator ──
function generateCycle(i) {
  const base = 29 + Math.round(Math.sin(i * 0.8) * 12);
  const txCount = 4 + Math.floor(Math.random() * 8);
  const successRate = 85 + Math.floor(Math.random() * 14);
  const grains = Math.round(base / GRAIN);
  const careGrains = Math.round(grains * 0.15);
  return {
    cycle: `P${i}`,
    txVelocity: txCount,
    totalGrains: grains,
    careGrains,
    bizGrains: grains - careGrains,
    syncSuccess: successRate,
    syncFailed: 100 - successRate,
    usd: base,
    latencyMs: 300 + Math.floor(Math.random() * 8600), // max target 9000ms
  };
}

const INITIAL_DATA = Array.from({ length: 20 }, (_, i) => generateCycle(i + 1));

const GRAIN_DIST = [
  { name: 'Banimals Care', value: 15, color: '#48bb78' },
  { name: 'Business', value: 85, color: '#667eea' },
];

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <div style={{ width: 44, height: 44, borderRadius: '12px', background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon style={{ width: 22, height: 22, color }} />
      </div>
      <div>
        <div style={{ fontSize: '24px', fontWeight: 800, color: '#2d3748' }}>{value}</div>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#4a5568' }}>{label}</div>
        {sub && <div style={{ fontSize: '11px', color: '#a0aec0', marginTop: '2px' }}>{sub}</div>}
      </div>
    </div>
  );
}

export default function PulseTradeAnalytics() {
  const [data, setData] = useState(INITIAL_DATA);
  const [live, setLive] = useState(true);
  const [hasReal, setHasReal] = useState(false);
  const cycleRef = useRef(INITIAL_DATA.length + 1);
  const [pulseMs, setPulseMs] = useState(0);
  const startRef = useRef(Date.now());

  // Real transaction source: prefer PaymentTransaction, fall back to Order, each
  // guarded so a missing entity / empty result never throws.
  const { data: realTx = [] } = useQuery({
    queryKey: ['pulsetrade-real-tx'],
    queryFn: async () => {
      let rows = [];
      try {
        rows = await base44.entities.PaymentTransaction.list('-created_date', 100);
      } catch {
        rows = [];
      }
      if (!Array.isArray(rows) || rows.length === 0) {
        try {
          rows = await base44.entities.Order.list('-created_date', 100);
        } catch {
          rows = [];
        }
      }
      return Array.isArray(rows) ? rows : [];
    },
  });

  // When real records exist, seed the charts with them and stop the simulation.
  // Otherwise INITIAL_DATA + the 9s simulation tick remain as the fallback.
  useEffect(() => {
    const real = buildCyclesFromRecords(realTx);
    if (real && real.length > 0) {
      setData(real.slice(-30));
      setHasReal(true);
      setLive(false);
    }
  }, [realTx]);

  useEffect(() => {
    const tickId = setInterval(() => {
      const elapsed = (Date.now() - startRef.current) % 9000;
      setPulseMs(elapsed);
    }, 100);
    return () => clearInterval(tickId);
  }, []);

  useEffect(() => {
    // Simulation tick is a fallback only — never runs once real data is loaded.
    if (!live || hasReal) return;
    const id = setInterval(() => {
      const newPoint = generateCycle(cycleRef.current++);
      setData(prev => [...prev.slice(-29), newPoint]);
    }, 9000);
    return () => clearInterval(id);
  }, [live, hasReal]);

  const latest = data[data.length - 1] || {};
  const avgSync = data.length
    ? Math.round(data.reduce((s, d) => s + (d.syncSuccess || 0), 0) / data.length)
    : 0;
  const totalTx = data.reduce((s, d) => s + (d.txVelocity || 0), 0);
  const totalGrains = data.reduce((s, d) => s + (d.totalGrains || 0), 0);
  const pulseProgress = pulseMs / 9000;

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4ff', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#667eea,#764ba2)', color: 'white', padding: '32px 32px 28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Zap style={{ width: 32, height: 32 }} />
            <h1 style={{ fontSize: '32px', fontWeight: 900, margin: 0 }}>PulseTrade™ Analytics</h1>
          </div>
          <p style={{ opacity: 0.85, margin: 0, fontSize: '14px' }}>Real-time transaction velocity · grain distribution · 9-second sync monitoring</p>
          <p style={{ opacity: 0.7, margin: '4px 0 0', fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px' }}>
            {hasReal ? '● REAL DATA — live PaymentTransaction / Order feed' : '○ SIMULATION — awaiting live transaction feed'}
          </p>

          {/* Live pulse bar */}
          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '12px', opacity: 0.8 }}>9s Cycle Progress</span>
            <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '3px', overflow: 'hidden', maxWidth: '300px' }}>
              <div style={{ height: '100%', width: `${pulseProgress * 100}%`, background: '#48bb78', borderRadius: '3px', transition: 'width 0.1s linear', boxShadow: '0 0 8px #48bb78' }} />
            </div>
            <span style={{ fontSize: '12px', fontFamily: 'monospace', opacity: 0.9 }}>{(pulseMs / 1000).toFixed(1)}s</span>
            <button
              onClick={() => setLive(l => !l)}
              style={{ padding: '5px 14px', borderRadius: '20px', border: '1.5px solid rgba(255,255,255,0.5)', background: live ? 'rgba(255,255,255,0.2)' : 'transparent', color: 'white', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
            >
              {live ? '⏸ PAUSE' : '▶ LIVE'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 24px' }}>
        <BackButton />

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '16px', marginBottom: '28px', marginTop: '16px' }}>
          <StatCard icon={Activity} label="Avg Sync Success" value={`${avgSync}%`} sub="Target: ≥90%" color="#48bb78" />
          <StatCard icon={Zap} label="Total TX (session)" value={totalTx.toLocaleString()} sub={`${data.length} cycles`} color="#667eea" />
          <StatCard icon={TrendingUp} label="Total Grains" value={totalGrains.toLocaleString()} sub={`$${(totalGrains * GRAIN).toFixed(2)} USD`} color="#ed8936" />
          <StatCard icon={CheckCircle} label="Latest Latency" value={`${(((latest.latencyMs || 0)) / 1000).toFixed(2)}s`} sub="Target: <9s" color={(latest.latencyMs || 0) < 9000 ? '#48bb78' : '#e53e3e'} />
        </div>

        {/* Charts grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

          {/* TX Velocity */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 700, color: '#2d3748' }}>⚡ Transaction Velocity</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="velGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#667eea" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#667eea" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="cycle" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Area type="monotone" dataKey="txVelocity" stroke="#667eea" fill="url(#velGrad)" strokeWidth={2} name="TX/Cycle" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* 9s Sync Success Rate */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 700, color: '#2d3748' }}>⏱ 9s Sync Success Rate</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="cycle" tick={{ fontSize: 10 }} />
                <YAxis domain={[70, 100]} tick={{ fontSize: 10 }} />
                <Tooltip formatter={v => `${v}%`} />
                <Line type="monotone" dataKey="syncSuccess" stroke="#48bb78" strokeWidth={2.5} dot={false} name="Success %" />
                <Line type="monotone" dataKey="syncFailed" stroke="#e53e3e" strokeWidth={1.5} dot={false} strokeDasharray="4 2" name="Failed %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>

          {/* Grain Distribution stacked bar */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 700, color: '#2d3748' }}>🌾 Grain Distribution (Care vs Business)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.slice(-15)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="cycle" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="bizGrains" stackId="g" fill="#667eea" name="Business Grains" />
                <Bar dataKey="careGrains" stackId="g" fill="#48bb78" name="Care Grains (15%)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie: grain split */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 700, color: '#2d3748', alignSelf: 'flex-start' }}>💚 Care Split</h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={GRAIN_DIST} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" label={({ name, value }) => `${value}%`} labelLine={false}>
                  {GRAIN_DIST.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip formatter={v => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            {GRAIN_DIST.map(d => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#4a5568', marginTop: '4px' }}>
                <span style={{ width: 10, height: 10, background: d.color, borderRadius: '50%', display: 'inline-block' }} />
                {d.name}: <strong>{d.value}%</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Latency */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 700, color: '#2d3748' }}>🕐 Checkout Latency (ms) — Target &lt;9,000ms</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="latGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ed8936" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ed8936" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="cycle" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 9500]} tick={{ fontSize: 10 }} tickFormatter={v => `${(v/1000).toFixed(0)}s`} />
              <Tooltip formatter={v => `${(v/1000).toFixed(2)}s`} />
              <Area type="monotone" dataKey="latencyMs" stroke="#ed8936" fill="url(#latGrad)" strokeWidth={2} name="Latency" />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '11px', color: '#a0aec0' }}>
            每粒番計, 零浪費 · Every grain counted. Zero waste tolerated. · Fruitful Global Planet
          </div>
        </div>
      </div>
    </div>
  );
}