import React, { useState } from 'react';
import { ALL_SECTORS_DATA } from '@/lib/codenestData';
import { ChevronDown, ChevronUp, Copy, Network } from 'lucide-react';
import { toast } from 'sonner';

const FOOTER_PAGES = ['/privacy', '/terms', '/contact', '/copyright', '/developers', '/vaultmesh', '/fruitful', '/faa.zone', '/about', '/accessibility'];

export default function CodenestEcosystemMap() {
  const [expandedSector, setExpandedSector] = useState(null);
  const [expandedBrand, setExpandedBrand] = useState({});

  const copy = (text) => { navigator.clipboard.writeText(text); toast.success('Copied to clipboard'); };

  return (
    <div className="space-y-6">
      <div className="bg-[#2a2a2e] rounded-xl p-6 border border-[#3a3a3e]">
        <h2 className="text-2xl font-extrabold text-[#B8860B] mb-2 text-center">Global Repository & Routing Structure</h2>
        <p className="text-gray-400 text-center text-sm mb-6 max-w-2xl mx-auto">
          The precise, templated file path and repository structure for the entire FAA.Zone ecosystem. Click a sector to expand its details and reveal exact URLs.
        </p>
        <div className="space-y-3">
          {Object.entries(ALL_SECTORS_DATA).map(([sectorKey, sector]) => (
            <div key={sectorKey} className="border border-[#3a3a3e] rounded-lg p-4 bg-[#1a1a1c]">
              <button
                onClick={() => setExpandedSector(expandedSector === sectorKey ? null : sectorKey)}
                className="flex justify-between items-center w-full text-left"
              >
                <span className="text-[#0071e3] text-lg font-bold">{sector.name} <span className="text-gray-500 text-sm">({sector.baseUrl})</span></span>
                {expandedSector === sectorKey ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              {expandedSector === sectorKey && (
                <div className="mt-4 pl-4 border-l-2 border-[#3a3a3e] space-y-3">
                  <div>
                    <h4 className="text-[#B8860B] text-sm font-semibold mb-1">Repository & Base URL:</h4>
                    <div className="flex items-center gap-2 bg-[#3a3a3e] rounded px-3 py-1.5">
                      <code className="text-gray-300 text-xs flex-1">{sector.repoName}/</code>
                      <button onClick={() => copy(`${sector.repoName}/`)} className="text-[#0071e3] hover:text-white"><Copy className="w-3 h-3" /></button>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[#B8860B] text-sm font-semibold mb-1">Brands & Subnodes:</h4>
                    <div className="space-y-2">
                      {sector.brands.map((brand) => (
                        <div key={brand.name} className="border border-[#3a3a3e] rounded p-2 bg-[#2a2a2e]">
                          <button
                            onClick={() => setExpandedBrand({ ...expandedBrand, [`${sectorKey}-${brand.name}`]: !expandedBrand[`${sectorKey}-${brand.name}`] })}
                            className="flex justify-between items-center w-full text-left"
                          >
                            <span className="text-white text-sm font-medium">{brand.name}</span>
                            {expandedBrand[`${sectorKey}-${brand.name}`] ? <ChevronUp className="w-3 h-3 text-gray-400" /> : <ChevronDown className="w-3 h-3 text-gray-400" />}
                          </button>
                          {expandedBrand[`${sectorKey}-${brand.name}`] && (
                            <div className="mt-2 space-y-1">
                              <div className="flex items-center gap-2 bg-[#3a3a3e] rounded px-2 py-1">
                                <code className="text-gray-400 text-xs flex-1">{sector.baseUrl}/brands/{brand.name.toLowerCase().replace(/ /g, '-')}/index</code>
                                <button onClick={() => copy(`${sector.baseUrl}/brands/${brand.name.toLowerCase().replace(/ /g, '-')}/index`)} className="text-[#0071e3]"><Copy className="w-3 h-3" /></button>
                              </div>
                              {brand.subnodes.map((sub) => (
                                <div key={sub} className="flex items-center gap-2 bg-[#3a3a3e] rounded px-2 py-1 ml-4">
                                  <code className="text-gray-400 text-xs flex-1">{sector.baseUrl}/brands/{brand.name.toLowerCase().replace(/ /g, '-')}/{sub.toLowerCase().replace(/ /g, '-')}/index</code>
                                  <button onClick={() => copy(`${sector.baseUrl}/brands/${brand.name.toLowerCase().replace(/ /g, '-')}/${sub.toLowerCase().replace(/ /g, '-')}/index`)} className="text-[#0071e3]"><Copy className="w-3 h-3" /></button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[#B8860B] text-sm font-semibold mb-1">Global Footer Pages:</h4>
                    <div className="bg-[#3a3a3e] rounded p-2">
                      {FOOTER_PAGES.map((p) => (
                        <div key={p} className="flex items-center gap-2 py-0.5">
                          <code className="text-gray-400 text-xs flex-1">{sector.baseUrl}{p}</code>
                          <button onClick={() => copy(`${sector.baseUrl}${p}`)} className="text-[#0071e3]"><Copy className="w-3 h-3" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#2a2a2e] rounded-xl p-6 border border-[#3a3a3e]">
        <h2 className="text-2xl font-extrabold text-[#B8860B] mb-2 text-center">Global Footer Repository: The Legal Standard</h2>
        <p className="text-gray-400 text-center text-sm mb-4 max-w-2xl mx-auto">
          The global footer, including all mandatory legal and ecosystem links, is managed from a single, dedicated repository to ensure strict consistency and legal compliance.
        </p>
        <div className="bg-[#1a1a1c] rounded-lg p-4 border border-[#3a3a3e] max-w-2xl mx-auto">
          <h3 className="text-[#B8860B] text-sm font-bold mb-2">Conceptual footer-global-repo Structure:</h3>
          <pre className="text-gray-400 text-xs whitespace-pre-wrap font-mono">
{`/footer-global-repo/
├── src/
│   ├── components/
│   │   └── GlobalFooter.js
│   └── styles/
│       └── footer.css
├── public/
│   ├── privacy.html
│   ├── terms.html
│   ├── contact.html
│   ├── copyright.html
│   ├── developers.html
│   ├── vaultmesh.html
│   ├── fruitful.html
│   ├── faa.zone.html
│   ├── about.html
│   └── accessibility.html
└── package.json`}
          </pre>
        </div>
      </div>
    </div>
  );
}