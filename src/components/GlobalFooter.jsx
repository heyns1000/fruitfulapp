import React from 'react';
import { GLOBAL_FOOTER_LINKS } from '@/lib/codenestData';

export default function GlobalFooter() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 px-6 md:px-12 border-t border-white/5">
      <div className="max-w-5xl mx-auto text-center">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-4 text-sm">
          {GLOBAL_FOOTER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-200 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
        <p className="text-xs text-gray-500">
          © 2025 FAA™ Treaty System™. All Rights Reserved.
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Powered by 🦍 glyphs + Vault API. Synced with Seedwave™.
        </p>
      </div>
    </footer>
  );
}