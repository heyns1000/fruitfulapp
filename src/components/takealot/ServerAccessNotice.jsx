import React from 'react';
import { Server } from 'lucide-react';

export default function ServerAccessNotice({ compact = false }) {
  if (compact) {
    return (
      <p className="text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
        Live calls and webhook receipt run server-side and switch on with the Builder+ plan — upgrade from
        Plan and billing in workspace settings.
      </p>
    );
  }

  return (
    <div className="flex gap-4 bg-amber-50 border border-amber-200 rounded-2xl p-5">
      <Server className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
      <div className="space-y-2">
        <p className="font-semibold text-amber-900">Server access required for live calls</p>
        <p className="text-sm text-amber-800 leading-relaxed">
          The Takealot API key must stay on the server, so every request runs through the app&rsquo;s backend and
          webhook events are received at a backend endpoint. This app&rsquo;s current plan does not include backend
          functions, so nothing is being sent to Takealot yet.
        </p>
        <p className="text-sm font-medium text-amber-900">
          Upgrade from Plan and billing in workspace settings to switch the connection on. Nothing configured here is
          lost — it activates as it stands.
        </p>
      </div>
    </div>
  );
}