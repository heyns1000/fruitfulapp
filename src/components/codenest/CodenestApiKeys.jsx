import React from 'react';
import { API_KEYS_INDEX } from '@/lib/codenestData';
import { AlertTriangle } from 'lucide-react';

// Mask any displayed value to a short prefix + bullets so a full credential is
// never rendered. Placeholders ("•••• (set VITE_…)") and the server-managed
// status label are already safe and are shown verbatim.
const maskValue = (value) => {
  if (typeof value !== 'string') return value;
  if (value.startsWith('•') || value.includes('Managed server-side')) return value;
  if (value.length <= 4) return value;
  return `${value.slice(0, 4)}••••`;
};

export default function CodenestApiKeys() {
  return (
    <div className="bg-[#2a2a2e] rounded-xl p-6 border border-[#3a3a3e]">
      <h3 className="text-xl font-bold text-[#B8860B] mb-2">Consolidated API Key Index (Fruitful Global)</h3>
      <p className="text-gray-400 text-sm mb-4">Comprehensive list of all API keys and credentials identified across the ecosystem.</p>
      <div className="bg-red-500/10 border-l-4 border-red-500 rounded p-3 mb-4 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
        <p className="text-red-400 text-xs">
          <strong>Security Note:</strong> Directly embedding API keys in client-side code is not recommended for production. Use a secure backend server to proxy API requests and manage keys via environment variables.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#3a3a3e]">
              <th className="text-left py-2 px-3 text-[#B8860B] font-semibold">API/Service</th>
              <th className="text-left py-2 px-3 text-[#B8860B] font-semibold">Key/Credential</th>
              <th className="text-left py-2 px-3 text-[#B8860B] font-semibold">Embedded Locations</th>
            </tr>
          </thead>
          <tbody>
            {API_KEYS_INDEX.map((k, i) => (
              <tr key={i} className="border-b border-[#3a3a3e] hover:bg-[#3a3a3e]/50">
                <td className="py-2 px-3">
                  <span className="font-semibold text-gray-200">{k.service}</span>
                  {k.context && <div className="text-xs text-gray-500">{k.context}</div>}
                </td>
                <td className="py-2 px-3"><code className="text-xs text-gray-300 font-mono break-all">{maskValue(k.key)}</code></td>
                <td className="py-2 px-3 text-xs text-gray-400">{k.locations.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}