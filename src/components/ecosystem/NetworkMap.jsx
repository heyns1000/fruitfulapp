import React, { useRef, useEffect, useState, useCallback } from 'react';
import { SECTOR_LIST, ECOSYSTEM_DATA } from '../data/ecosystemData';

// Visual config per node type
const NC = {
  sector:  { fill: '#2563eb', glow: '#93c5fd', text: '#fff', r: 38, fs: 11, fw: '700' },
  brand:   { fill: '#059669', glow: '#6ee7b7', text: '#fff', r: 22, fs: 10, fw: '600' },
  subnode: { fill: '#92400e', glow: '#fbbf24', text: '#fef3c7', r: 13, fs: 8, fw: 'normal' },
};
const MAX_BRANDS = 20;

function mkGraph(sector, brand, W, H) {
  const nodes = [], edges = [];
  const cx = W / 2, cy = H / 2;

  if (!sector) {
    const keys = Object.keys(SECTOR_LIST).filter(k => ECOSYSTEM_DATA[k]?.length > 0);
    keys.forEach((k, i) => {
      const a = (i / keys.length) * Math.PI * 2 - Math.PI / 2;
      const r = Math.min(cx, cy) * 0.72;
      nodes.push({
        id: k,
        label: SECTOR_LIST[k].replace(/^\S+\s/, '').slice(0, 16),
        full: SECTOR_LIST[k],
        type: 'sector',
        x: cx + Math.cos(a) * r,
        y: cy + Math.sin(a) * r,
        vx: 0, vy: 0,
      });
    });
  } else {
    nodes.push({
      id: sector,
      label: (SECTOR_LIST[sector] || sector).replace(/^\S+\s/, '').slice(0, 16),
      full: SECTOR_LIST[sector],
      type: 'sector',
      x: cx, y: cy, vx: 0, vy: 0, fixed: true,
    });

    const brands = (ECOSYSTEM_DATA[sector] || []).slice(0, MAX_BRANDS);
    brands.forEach((b, i) => {
      const a = (i / brands.length) * Math.PI * 2 - Math.PI / 2;
      const d = Math.min(cx, cy) * 0.52;
      const bid = 'B|' + b.name;
      nodes.push({
        id: bid,
        label: b.name.slice(0, 13),
        full: b.name,
        type: 'brand',
        brandName: b.name,
        price: b.masterLicensePrice,
        subNodes: b.subNodes,
        x: cx + Math.cos(a) * d + (Math.random() - .5) * 20,
        y: cy + Math.sin(a) * d + (Math.random() - .5) * 20,
        vx: 0, vy: 0,
      });
      edges.push({ s: sector, t: bid, et: 'sb' });

      if (brand === b.name && b.subNodes.length > 0) {
        b.subNodes.forEach((sub, j) => {
          const sa = a + (j - (b.subNodes.length - 1) / 2) * (0.8 / Math.max(b.subNodes.length, 1));
          const sid = 'S|' + b.name + '|' + j;
          nodes.push({
            id: sid,
            label: sub.replace('™', '').slice(0, 11),
            full: sub,
            type: 'subnode',
            x: cx + Math.cos(a) * d + Math.cos(sa) * 95,
            y: cy + Math.sin(a) * d + Math.sin(sa) * 95,
            vx: 0, vy: 0,
          });
          edges.push({ s: bid, t: sid, et: 'bs' });
        });
      }
    });
  }
  return { nodes, edges };
}

function simTick(nodes, edges, W, H) {
  const map = {};
  nodes.forEach(n => map[n.id] = n);

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j];
      const dx = a.x - b.x || 0.1, dy = a.y - b.y || 0.1;
      const d2 = Math.max(dx * dx + dy * dy, 1);
      const f = 5500 / d2 / Math.sqrt(d2);
      const fx = dx * f, fy = dy * f;
      if (!a.fixed) { a.vx += fx; a.vy += fy; }
      if (!b.fixed) { b.vx -= fx; b.vy -= fy; }
    }
  }

  edges.forEach(e => {
    const s = map[e.s], t = map[e.t];
    if (!s || !t) return;
    const dx = t.x - s.x, dy = t.y - s.y;
    const d = Math.sqrt(dx * dx + dy * dy) || 1;
    const ideal = e.et === 'bs' ? 95 : 170;
    const f = (d - ideal) * 0.025;
    const fx = (dx / d) * f, fy = (dy / d) * f;
    if (!s.fixed) { s.vx += fx; s.vy += fy; }
    if (!t.fixed) { t.vx -= fx; t.vy -= fy; }
  });

  nodes.forEach(n => {
    if (n.fixed) return;
    n.vx += (W / 2 - n.x) * 0.0015;
    n.vy += (H / 2 - n.y) * 0.0015;
    n.vx *= 0.8; n.vy *= 0.8;
    n.x = Math.max(35, Math.min(W - 35, n.x + n.vx));
    n.y = Math.max(35, Math.min(H - 35, n.y + n.vy));
  });
}

function drawScene(ctx, nodes, edges, W, H, hovId) {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, W, H);

  const map = {};
  nodes.forEach(n => map[n.id] = n);

  edges.forEach(e => {
    const s = map[e.s], t = map[e.t];
    if (!s || !t) return;
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(t.x, t.y);
    ctx.strokeStyle = e.et === 'bs' ? 'rgba(251,191,36,0.3)' : 'rgba(110,231,183,0.3)';
    ctx.lineWidth = e.et === 'bs' ? 1 : 1.5;
    ctx.stroke();
  });

  nodes.forEach(n => {
    const cfg = NC[n.type];
    const hov = n.id === hovId;
    const r = cfg.r + (hov ? 6 : 0);

    const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 2.5);
    grd.addColorStop(0, cfg.glow + (hov ? '50' : '22'));
    grd.addColorStop(1, 'transparent');
    ctx.beginPath(); ctx.arc(n.x, n.y, r * 2.5, 0, Math.PI * 2);
    ctx.fillStyle = grd; ctx.fill();

    ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
    ctx.fillStyle = cfg.fill; ctx.fill();
    ctx.strokeStyle = cfg.glow; ctx.lineWidth = hov ? 2.5 : 1.5; ctx.stroke();

    ctx.fillStyle = cfg.text;
    ctx.font = `${cfg.fw} ${cfg.fs}px Inter, sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const words = n.label.split(' ');
    if (words.length > 1 && n.label.length > 10 && n.type !== 'subnode') {
      const m = Math.ceil(words.length / 2);
      ctx.fillText(words.slice(0, m).join(' '), n.x, n.y - 5.5);
      ctx.fillText(words.slice(m).join(' '), n.x, n.y + 5.5);
    } else {
      ctx.fillText(n.label, n.x, n.y);
    }
  });
}

export default function NetworkMap() {
  const canvasRef = useRef(null);
  const sim = useRef({ nodes: [], edges: [], alpha: 1, dragNode: null, dragMoved: false, hovId: null, raf: null });
  const [sel, setSel] = useState({ sector: null, brand: null });
  const [info, setInfo] = useState(null);
  const [W, setW] = useState(800);
  const H = Math.max(480, Math.round(W * 0.58));

  const rebuild = useCallback((sector, brand) => {
    const { nodes, edges } = mkGraph(sector, brand, W, H);
    sim.current.nodes = nodes;
    sim.current.edges = edges;
    sim.current.alpha = 1;
  }, [W, H]);

  useEffect(() => { rebuild(sel.sector, sel.brand); }, [sel, rebuild]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let active = true;
    const loop = () => {
      if (!active) return;
      const { nodes, edges, alpha } = sim.current;
      if (alpha > 0.005) {
        simTick(nodes, edges, W, H);
        sim.current.alpha *= 0.993;
      }
      drawScene(ctx, nodes, edges, W, H, sim.current.hovId);
      sim.current.raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { active = false; if (sim.current.raf) cancelAnimationFrame(sim.current.raf); };
  }, [W, H]);

  useEffect(() => {
    const el = canvasRef.current?.parentElement;
    if (!el) return;
    const obs = new ResizeObserver(([e]) => setW(Math.max(300, e.contentRect.width)));
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const nodeAt = (x, y) => {
    const ns = sim.current.nodes;
    for (let i = ns.length - 1; i >= 0; i--) {
      const n = ns[i], cfg = NC[n.type];
      if ((x - n.x) ** 2 + (y - n.y) ** 2 <= (cfg.r + 6) ** 2) return n;
    }
    return null;
  };

  const getXY = (e) => {
    const c = canvasRef.current;
    const rect = c.getBoundingClientRect();
    return [(e.clientX - rect.left) * (W / rect.width), (e.clientY - rect.top) * (H / rect.height)];
  };

  const onMouseMove = (e) => {
    const [x, y] = getXY(e);
    if (sim.current.dragNode) {
      sim.current.dragNode.x = x;
      sim.current.dragNode.y = y;
      sim.current.dragNode.vx = 0;
      sim.current.dragNode.vy = 0;
      sim.current.dragMoved = true;
      return;
    }
    const n = nodeAt(x, y);
    sim.current.hovId = n?.id || null;
    canvasRef.current.style.cursor = n ? 'pointer' : 'default';
  };

  const onMouseDown = (e) => {
    const [x, y] = getXY(e);
    const n = nodeAt(x, y);
    if (n) { sim.current.dragNode = n; sim.current.dragMoved = false; }
  };

  const onMouseUp = () => {
    const { dragNode, dragMoved } = sim.current;
    sim.current.dragNode = null;
    if (dragNode && !dragMoved) handleClick(dragNode);
  };

  const handleClick = (n) => {
    if (n.type === 'sector') {
      if (sel.sector === n.id) {
        setSel({ sector: null, brand: null });
        setInfo(null);
      } else {
        setSel({ sector: n.id, brand: null });
        setInfo({ type: 'sector', id: n.id, label: n.full });
      }
    } else if (n.type === 'brand') {
      if (sel.brand === n.brandName) {
        setSel(s => ({ ...s, brand: null }));
        setInfo({ type: 'sector', id: sel.sector, label: SECTOR_LIST[sel.sector] });
      } else {
        setSel(s => ({ ...s, brand: n.brandName }));
        setInfo({ type: 'brand', name: n.brandName, price: n.price, count: n.subNodes?.length || 0 });
      }
    } else if (n.type === 'subnode') {
      setInfo({ type: 'subnode', label: n.full });
    }
  };

  const crumbs = [
    { label: 'All Sectors', onClick: () => { setSel({ sector: null, brand: null }); setInfo(null); } },
    sel.sector ? { label: (SECTOR_LIST[sel.sector] || sel.sector).replace(/^\S+\s/, ''), onClick: () => { setSel(s => ({ ...s, brand: null })); setInfo({ type: 'sector', id: sel.sector, label: SECTOR_LIST[sel.sector] }); } } : null,
    sel.brand ? { label: sel.brand, onClick: null } : null,
  ].filter(Boolean);

  return (
    <div className="bg-[#0f172a] rounded-2xl border border-[#1e3a5f] overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-[#1e3a5f]">
        <div>
          <h2 className="text-lg font-black text-[#90cdf4]">🕸️ Network Map</h2>
          <nav className="flex items-center gap-1.5 mt-1 text-xs">
            {crumbs.map((c, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="text-[#334155]">›</span>}
                {c.onClick
                  ? <button onClick={c.onClick} className="text-[#60a5fa] hover:text-white transition-colors">{c.label}</button>
                  : <span className="text-[#94a3b8]">{c.label}</span>}
              </React.Fragment>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4 text-xs">
          {[['#2563eb', 'Sector'], ['#059669', 'Brand'], ['#92400e', 'Subnode']].map(([c, l]) => (
            <span key={l} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: c }} />
              <span className="text-[#94a3b8]">{l}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="relative">
        {info && (
          <div className="absolute top-3 right-3 z-10 bg-[#1e293b]/95 backdrop-blur-sm border border-[#334155] rounded-xl p-4 max-w-[220px] shadow-2xl text-sm">
            {info.type === 'sector' && <>
              <p className="font-bold text-[#90cdf4]">{info.label}</p>
              <p className="text-[#64748b] text-xs mt-1">{ECOSYSTEM_DATA[info.id]?.length || 0} brands · Click a brand node</p>
            </>}
            {info.type === 'brand' && <>
              <p className="font-bold text-[#6ee7b7]">{info.name}™</p>
              <p className="text-[#94a3b8] text-xs">Master License</p>
              <p className="text-[#6ee7b7] font-black text-xl mt-0.5">${info.price?.toLocaleString()}</p>
              <p className="text-[#64748b] text-xs mt-1">{info.count} subnodes · Click again to expand</p>
            </>}
            {info.type === 'subnode' && <>
              <p className="font-bold text-[#fbbf24]">{info.label}</p>
              <p className="text-[#64748b] text-xs mt-1">Network Subnode</p>
            </>}
            <button onClick={() => setInfo(null)} className="absolute top-2 right-2 text-[#475569] hover:text-white leading-none text-base">×</button>
          </div>
        )}
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          style={{ width: '100%', height: H, display: 'block' }}
          onMouseMove={onMouseMove}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseLeave={() => { sim.current.dragNode = null; sim.current.hovId = null; }}
        />
      </div>

      <div className="px-4 py-3 border-t border-[#1e3a5f] text-center text-xs text-[#475569]">
        Click <span className="text-[#3b82f6]">sector</span> → see brands · Click <span className="text-[#059669]">brand</span> → see subnodes · Drag any node to reposition
      </div>
    </div>
  );
}