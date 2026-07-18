import React, { useState } from 'react';
import { Download, FileCode, Database, FileJson, Copy, Check, X } from 'lucide-react';
import { toast } from 'sonner';

// ── Code generators ──

function generateEntitySchema(table) {
  const fields = (table.fields || []).map(f => {
    if (typeof f === 'object') return f;
    const [name, type] = f.split(':').map(s => s?.trim());
    return { name, type: type || 'string' };
  });

  const props = {};
  fields.forEach(f => {
    if (!f.name || ['id', 'created_date', 'updated_date', 'created_by_id'].includes(f.name)) return;
    const tsType = f.type || 'string';
    let schema = { type: tsType === 'number' ? 'number' : tsType === 'date' ? 'string' : 'string' };
    if (tsType === 'date') schema.format = 'date';
    props[f.name] = schema;
  });

  const required = fields.filter(f => f.name && !['id', 'created_date', 'updated_date', 'created_by_id'].includes(f.name) && f.required).map(f => f.name);

  return JSON.stringify({
    name: table.tableName,
    type: 'object',
    properties: props,
    ...(required.length > 0 ? { required } : {}),
  }, null, 2);
}

function generatePageComponent(page, appName) {
  const pascalName = page.name?.replace(/[^a-zA-Z0-9]/g, '') || 'Page';
  const route = page.route || '/' + pascalName.toLowerCase();

  // Determine which entities this page might use based on layout
  const layout = page.layout || 'dashboard';
  const entityName = layout === 'dashboard' || layout === 'analytics' ? 'Metrics'
    : layout === 'list' ? 'Item'
    : layout === 'detail' ? 'Item'
    : layout === 'settings' ? 'Setting'
    : 'Item';

  const blocks = page.contentBlocks || [];

  // Generate real JSX from content blocks
  const blockRenderers = blocks.map((block, i) => {
    const type = block.type || 'card_grid';
    const title = block.title || '';
    const items = block.items || [];

    switch (type) {
      case 'hero':
        return `      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl p-10" style={{ background: 'linear-gradient(135deg, rgba(var(--primary-rgb),0.15), transparent)' }}>
        {${JSON.stringify(block.badge || '')} && <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 bg-primary/10 text-primary">${block.badge || ''}</span>}
        <h1 className="text-4xl font-black mb-3">${block.title || ''}</h1>
        <p className="text-lg text-muted-foreground mb-6 max-w-xl">${block.body || ''}</p>
        <button className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold">${block.ctaLabel || 'Get Started'}</button>
      </section>`;

      case 'kpi_grid':
        return `      {/* KPI Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        ${(items.slice(0, 4).map((item, j) => {
          const label = item.label || item.title || item.name || 'Metric';
          const value = item.value || item.count || '—';
          const sub = item.sub || item.trend || '';
          return `        <div key={${j}} className="rounded-2xl p-5 border bg-card">
          <p className="text-3xl font-black text-primary">${value}</p>
          <p className="text-sm font-bold mt-2">${label}</p>
          ${sub ? `<p className="text-xs text-muted-foreground mt-1">${sub}</p>` : ''}
        </div>`;
        }).join('\n'))}
      </section>`;

      case 'data_table':
        const cols = items[0] ? Object.keys(items[0]).slice(0, 5) : ['name', 'status', 'amount', 'date'];
        return `      {/* Data Table */}
      <section className="rounded-2xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>${cols.map(c => `\n            <th className="px-4 py-3 text-left text-xs font-bold uppercase">${c}</th>`).join('')}\n          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b hover:bg-muted/50">
${cols.map(c => `              <td className="px-4 py-3 text-sm">{row.${c} || '—'}</td>`).join('\n')}
            </tr>
          ))}
        </tbody>
        </table>
      </section>`;

      case 'card_grid':
        return `      {/* Card Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.length > 0 ? data.map((item, i) => (
          <div key={i} className="rounded-2xl p-5 border bg-card hover:border-primary/50 transition-colors">
            <h3 className="font-bold mb-2">{item.name || item.title || 'Item'}</h3>
            <p className="text-sm text-muted-foreground mb-3">{item.description || ''}</p>
            <div className="flex justify-between items-center pt-3 border-t">
              <span className="text-xs px-2 py-1 rounded-full bg-muted">{item.sector || item.category || ''}</span>
              <span className="font-bold text-primary">{item.metric || item.value || ''}</span>
            </div>
          </div>
        )) : ${JSON.stringify(items.slice(0, 6).map(item => ({
          name: item.name || item.title || 'Item',
          description: item.description || item.body || '',
          sector: item.sector || item.category || '',
          metric: item.metric || item.value || '',
        })), null, 8)}.map((item, i) => (
          <div key={i} className="rounded-2xl p-5 border bg-card">
            <h3 className="font-bold mb-2">{item.name}</h3>
            <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
            <span className="text-xs px-2 py-1 rounded-full bg-muted">{item.sector}</span>
          </div>
        ))}
      </section>`;

      case 'chart':
        return `      {/* Chart */}
      <section className="rounded-2xl p-6 border bg-card">
        <h3 className="font-bold mb-4">${title}</h3>
        <div className="flex items-end gap-2 h-52">
          {${JSON.stringify(items.slice(0, 12).map(it => ({ label: it.label || it.name || '', value: Number(it.value || it.count || 0) })), null, 8)}.map((item, i) => {
            const maxVal = Math.max(...${JSON.stringify(items.slice(0, 12).map(it => Number(it.value || it.count || 0)))}, 1);
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full rounded-t-lg bg-primary" style={{ height: \`\${(item.value / maxVal) * 100}%\` }} />
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
            );
          })}
        </div>
      </section>`;

      case 'activity_feed':
        return `      {/* Activity Feed */}
      <section className="space-y-2">
        <h3 className="font-bold mb-3">${title}</h3>
        {${JSON.stringify(items.slice(0, 8).map(it => ({ message: it.message || it.title || '', time: it.time || it.date || '', user: it.user || it.name || '' })), null, 8)}.map((item, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30">
            <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
              {item.user?.split(' ').map(w => w[0]).join('').slice(0, 2) || '••'}
            </div>
            <div>
              <p className="text-sm">{item.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
            </div>
          </div>
        ))}
      </section>`;

      case 'form':
        return `      {/* Form */}
      <section className="rounded-2xl p-6 border bg-card max-w-lg">
        <h3 className="font-bold mb-4">${title}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          ${items.slice(0, 5).map((item, j) => {
            const label = item.label || item.name || item.title || 'Field';
            const type = item.type || 'text';
            return `<div key={${j}}">
            <label className="text-xs font-bold uppercase mb-2 block">${label}</label>
            <input type="${type}" className="w-full px-4 py-3 rounded-xl border bg-background" placeholder="Enter ${label.toLowerCase()}" />
          </div>`;
          }).join('\n          ')}
          <button type="submit" className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold">Submit</button>
        </form>
      </section>`;

      default:
        return `      {/* ${type} */}
      <section className="rounded-2xl p-6 border bg-card">
        ${block.title ? `<h3 className="font-bold mb-2">${block.title}</h3>` : ''}
        ${block.body ? `<p className="text-sm text-muted-foreground">${block.body}</p>` : ''}
      </section>`;
    }
  }).join('\n\n');

  return `import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

export default function ${pascalName}() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch real data from the ${entityName} entity
        const items = await base44.entities.${entityName}.list('-created_date', 20);
        setData(items || []);
      } catch (e) {
        console.error('Failed to load ${entityName}:', e);
        setData([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add real form submission logic here
    toast.success('Saved');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]"><div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" /></div>;
  }

  return (
    <div className="px-8 py-8 space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-black">${page.name || pascalName}</h1>
        <p className="text-sm text-muted-foreground mt-1">${page.description || ''}</p>
      </div>
${blockRenderers}
    </div>
  );
}
`;
}

function generateAppFile(pages) {
  const imports = pages.map(p => {
    const name = p.name?.replace(/[^a-zA-Z0-9]/g, '') || 'Page';
    return `import ${name} from './pages/${name}';`;
  }).join('\n');

  const routes = pages.map(p => {
    const name = p.name?.replace(/[^a-zA-Z0-9]/g, '') || 'Page';
    const route = p.route || '/' + name.toLowerCase();
    return `      <Route path="${route}" element={<${name} />} />`;
  }).join('\n');

  return `import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
${imports}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<${pages[0]?.name?.replace(/[^a-zA-Z0-9]/g, '') || 'Home'} />} />
${routes}
      </Routes>
    </Router>
  );
}

export default App;
`;
}

function generateReadme(appData, selectedBrands) {
  return `# ${appData.appName}

> ${appData.tagline || ''}

Generated by HotStack™ · ${new Date(appData.generatedAt || Date.now()).toLocaleDateString()}

## Quick Start

1. **Create entities** in your Base44 app from the files in \`entities/\`:
${appData.databaseSchema?.map(t => `   - \`${t.tableName}\` — ${(t.fields || []).length} fields`).join('\n') || '   - (no entities generated)'}

2. **Add pages** to your app from the files in \`src/pages/\`:
${appData.pages?.map(p => `   - \`${p.name}\` → \`${p.route}\``).join('\n') || '   - (no pages generated)'}

3. **Update routing** in \`src/App.jsx\` using the provided file.

4. **Run your app** — the pages fetch real data from the entities using the Base44 SDK.

## Vibe Prompt
> "${appData.vibePrompt || ''}"

## Brands Used
${selectedBrands.map(b => `- **${b.name}** (${b.sector}) — ${b.subnodes?.length || 0} subnodes`).join('\n')}

## Tech Stack
- **Frontend:** ${(appData.techStack?.frontend || ['React', 'Tailwind CSS']).join(', ')}
- **Backend:** ${(appData.techStack?.backend || ['Base44 SDK']).join(', ')}
- **Database:** ${appData.techStack?.database || 'Base44 Entities'}

## Roles
${appData.rolePermissions?.roles?.map(r => `- **${r.name}** — ${r.description || ''} (${r.permissions?.length || 0} permissions)`).join('\n') || '- (no roles defined)'}

## Features
${appData.features?.map(f => `- **${f.name}** — ${f.description || ''}`).join('\n') || '- (no features defined)'}

## Cross-Pollination
${appData.crossPollination?.map(cp => `- **${cp.brand1}** → **${cp.brand2}** (${cp.connectionType}) — ${cp.feature} [${cp.synergyScore}% synergy]`).join('\n') || '- (no cross-pollination defined)'}
`;
}

// ── Download helper ──

function downloadFile(filename, content, mime = 'text/plain') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Main component ──

export default function CodeExporter({ appData, selectedBrands, onClose }) {
  const [exported, setExported] = useState({});
  const [isExporting, setIsExporting] = useState(false);

  const files = React.useMemo(() => {
    const list = [];

    // Entity schemas
    (appData.databaseSchema || []).forEach(table => {
      list.push({
        id: `entity-${table.tableName}`,
        path: `entities/${table.tableName}.jsonc`,
        icon: 'database',
        content: generateEntitySchema(table),
        type: 'Entity Schema',
      });
    });

    // Page components
    (appData.pages || []).forEach(page => {
      const pascalName = page.name?.replace(/[^a-zA-Z0-9]/g, '') || 'Page';
      list.push({
        id: `page-${pascalName}`,
        path: `src/pages/${pascalName}.jsx`,
        icon: 'code',
        content: generatePageComponent(page, appData.appName),
        type: 'React Page',
      });
    });

    // App.jsx
    list.push({
      id: 'app',
      path: 'src/App.jsx',
      icon: 'code',
      content: generateAppFile(appData.pages || []),
      type: 'Router',
    });

    // README
    list.push({
      id: 'readme',
      path: 'README.md',
      icon: 'doc',
      content: generateReadme(appData, selectedBrands),
      type: 'Documentation',
    });

    return list;
  }, [appData, selectedBrands]);

  const exportAll = async () => {
    setIsExporting(true);
    for (const file of files) {
      await new Promise(r => setTimeout(r, 200));
      const mime = file.path.endsWith('.jsonc') ? 'application/json' : file.path.endsWith('.md') ? 'text/markdown' : 'text/plain';
      downloadFile(file.path.replace(/\//g, '_'), file.content, mime);
      setExported(prev => ({ ...prev, [file.id]: true }));
    }
    setIsExporting(false);
    toast.success(`Exported ${files.length} files`);
  };

  const copyFile = (file) => {
    navigator.clipboard.writeText(file.content);
    toast.success(`Copied ${file.path}`);
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-stone-950 border border-stone-700 rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800">
          <div>
            <h2 className="text-white font-black text-lg flex items-center gap-2">
              <Download className="w-5 h-5 text-orange-500" /> Export Real Code
            </h2>
            <p className="text-stone-500 text-xs mt-1">{files.length} files · deployable React + Base44 entities</p>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Export all button */}
        <div className="px-6 py-4 border-b border-stone-800 bg-stone-900/50">
          <button
            onClick={exportAll}
            disabled={isExporting}
            className="w-full py-3 rounded-xl font-black text-black transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)' }}>
            {isExporting ? 'Exporting…' : `⚡ Export All ${files.length} Files`}
          </button>
          <p className="text-stone-600 text-xs mt-2 text-center">Files download to your computer · drop them into your Base44 app</p>
        </div>

        {/* File list */}
        <div className="flex-1 overflow-auto p-4 space-y-2">
          {files.map(file => (
            <div key={file.id} className="flex items-center gap-3 p-3 rounded-xl border border-stone-800 bg-stone-900 hover:border-stone-700 transition-all">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(249,115,22,0.1)' }}>
                {file.icon === 'database' && <Database className="w-4 h-4 text-orange-500" />}
                {file.icon === 'code' && <FileCode className="w-4 h-4 text-orange-500" />}
                {file.icon === 'doc' && <FileJson className="w-4 h-4 text-orange-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-mono font-bold truncate">{file.path}</p>
                <p className="text-stone-500 text-xs">{file.type} · {file.content.split('\n').length} lines</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {exported[file.id] && <Check className="w-4 h-4 text-green-400" />}
                <button
                  onClick={() => copyFile(file)}
                  className="p-2 rounded-lg border border-stone-700 text-stone-400 hover:text-white hover:bg-stone-800 transition-all">
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => downloadFile(file.path.replace(/\//g, '_'), file.content)}
                  className="p-2 rounded-lg border border-stone-700 text-stone-400 hover:text-white hover:bg-stone-800 transition-all">
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}