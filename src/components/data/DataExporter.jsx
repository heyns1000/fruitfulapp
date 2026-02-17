import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileJson, FileSpreadsheet, Loader2, Database } from 'lucide-react';
import { toast } from 'sonner';

const SECTORS = {
  agriculture: '🌱 Agriculture & Biotech',
  fsf: '🥦 Food, Soil & Farming',
  banking: '🏦 Banking & Finance',
  creative: '🖋️ Creative Tech',
  logistics: '📦 Logistics & Packaging',
  'education-ip': '📚 Education & IP',
  fashion: '✂ Fashion & Identity',
  gaming: '🎮 Gaming & Simulation',
  health: '🧠 Health & Hygiene',
  housing: '🏗️ Housing & Infrastructure',
  justice: '⚖ Justice & Ethics',
  knowledge: '📖 Knowledge & Archives',
  micromesh: '☰ Micro-Mesh Logistics',
  media: '🎬 Motion, Media & Sonic',
  nutrition: '✿ Nutrition & Food Chain',
  'ai-logic': '🧠 AI, Logic & Grid',
  packaging: '📦 Packaging & Materials',
  quantum: '✴️ Quantum Protocols',
  ritual: '☯ Ritual & Culture',
  saas: '🔑 SaaS & Licensing',
  trade: '🧺 Trade Systems',
  utilities: '🔋 Utilities & Energy',
  voice: '🎙️ Voice & Audio',
  webless: '📡 Webless Tech & Nodes',
  nft: '🔁 NFT & Ownership',
  'education-youth': '🎓 Education & Youth',
  zerowaste: '♻️ Zero Waste',
  professional: '🧾 Professional Services',
  'payroll-mining': '🪙 Payroll Mining & Accounting',
  mining: '⛏️ Mining & Resources',
  wildlife: '🦁 Wildlife & Habitat'
};

export default function DataExporter() {
  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: () => base44.entities.Brand.list('-updated_date')
  });

  const exportToJSON = (data, filename) => {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToCSV = (data, filename) => {
    const headers = ['Name', 'Sector', 'Description', 'Subnodes', 'Tags', 'Product ID', 'Vault ID', 'Security Rating', 'Active Nodes'];
    const rows = data.map(brand => [
      brand.name,
      SECTORS[brand.sector] || brand.sector,
      brand.description || '',
      (brand.subnodes || []).join('; '),
      (brand.tags || []).join('; '),
      brand.metadata?.id || '',
      brand.metadata?.vault || '',
      brand.metadata?.securityRating || '',
      brand.metadata?.activeNodes || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportAllJSON = () => {
    const exportData = brands.map(brand => ({
      name: brand.name,
      sector: brand.sector,
      sectorName: SECTORS[brand.sector],
      description: brand.description,
      subnodes: brand.subnodes,
      tags: brand.tags,
      metadata: brand.metadata,
      created_date: brand.created_date,
      updated_date: brand.updated_date
    }));

    exportToJSON(exportData, `omnigrid_complete_database_${new Date().toISOString().split('T')[0]}.json`);
    toast.success(`Exported ${brands.length} brands to JSON!`);
  };

  const handleExportAllCSV = () => {
    exportToCSV(brands, `omnigrid_complete_database_${new Date().toISOString().split('T')[0]}.csv`);
    toast.success(`Exported ${brands.length} brands to CSV!`);
  };

  const handleExportBySector = () => {
    const bySector = {};
    brands.forEach(brand => {
      if (!bySector[brand.sector]) {
        bySector[brand.sector] = {
          sectorName: SECTORS[brand.sector],
          sectorKey: brand.sector,
          brands: []
        };
      }
      bySector[brand.sector].brands.push({
        name: brand.name,
        description: brand.description,
        subnodes: brand.subnodes,
        tags: brand.tags,
        metadata: brand.metadata
      });
    });

    exportToJSON(bySector, `omnigrid_by_sector_${new Date().toISOString().split('T')[0]}.json`);
    toast.success('Exported brands organized by sector!');
  };

  const handleExportSubnodesOnly = () => {
    const subnodeData = brands.map(brand => ({
      brand: brand.name,
      sector: SECTORS[brand.sector],
      subnodes: brand.subnodes || [],
      subnodeCount: (brand.subnodes || []).length
    })).filter(b => b.subnodeCount > 0);

    exportToJSON(subnodeData, `omnigrid_subnodes_${new Date().toISOString().split('T')[0]}.json`);
    toast.success('Exported all subnodes data!');
  };

  const stats = {
    totalBrands: brands.length,
    totalSubnodes: brands.reduce((sum, b) => sum + (b.subnodes?.length || 0), 0),
    sectorsWithData: [...new Set(brands.map(b => b.sector))].length,
    avgSubnodesPerBrand: brands.length > 0 ? 
      (brands.reduce((sum, b) => sum + (b.subnodes?.length || 0), 0) / brands.length).toFixed(1) : 0
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
      <CardHeader>
        <CardTitle className="text-2xl text-purple-900 flex items-center gap-2">
          <Database className="w-6 h-6" />
          Data Export Center
        </CardTitle>
        <CardDescription className="text-purple-700">
          Export your entire ecosystem data in multiple formats - make your data portable and accessible
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-purple-200 text-center">
            <div className="text-2xl font-bold text-purple-900">{stats.totalBrands}</div>
            <div className="text-xs text-purple-600">Total Brands</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-purple-200 text-center">
            <div className="text-2xl font-bold text-purple-900">{stats.totalSubnodes}</div>
            <div className="text-xs text-purple-600">Total Subnodes</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-purple-200 text-center">
            <div className="text-2xl font-bold text-purple-900">{stats.sectorsWithData}</div>
            <div className="text-xs text-purple-600">Active Sectors</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-purple-200 text-center">
            <div className="text-2xl font-bold text-purple-900">{stats.avgSubnodesPerBrand}</div>
            <div className="text-xs text-purple-600">Avg Subnodes</div>
          </div>
        </div>

        {/* Export Options */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-purple-900">📦 Export Options</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              onClick={handleExportAllJSON}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-auto py-4 flex-col items-start"
            >
              <div className="flex items-center gap-2 mb-1">
                <FileJson className="w-5 h-5" />
                <span className="font-bold">Complete Database (JSON)</span>
              </div>
              <span className="text-xs opacity-90">Full export with all metadata</span>
            </Button>

            <Button
              onClick={handleExportAllCSV}
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 h-auto py-4 flex-col items-start"
            >
              <div className="flex items-center gap-2 mb-1">
                <FileSpreadsheet className="w-5 h-5" />
                <span className="font-bold">Complete Database (CSV)</span>
              </div>
              <span className="text-xs opacity-90">Spreadsheet-friendly format</span>
            </Button>

            <Button
              onClick={handleExportBySector}
              variant="outline"
              className="border-2 border-purple-300 hover:bg-purple-50 h-auto py-4 flex-col items-start"
            >
              <div className="flex items-center gap-2 mb-1 text-purple-900">
                <Download className="w-5 h-5" />
                <span className="font-bold">Organized by Sector</span>
              </div>
              <span className="text-xs text-purple-700">Grouped by industry sectors</span>
            </Button>

            <Button
              onClick={handleExportSubnodesOnly}
              variant="outline"
              className="border-2 border-pink-300 hover:bg-pink-50 h-auto py-4 flex-col items-start"
            >
              <div className="flex items-center gap-2 mb-1 text-pink-900">
                <Download className="w-5 h-5" />
                <span className="font-bold">Subnodes Only</span>
              </div>
              <span className="text-xs text-pink-700">Just the subnode data</span>
            </Button>
          </div>
        </div>

        <div className="bg-purple-100 border border-purple-300 rounded-lg p-4 text-sm text-purple-900">
          <p className="font-semibold mb-2">💡 Pro Tip:</p>
          <p>Use JSON exports for backup and migration. Use CSV exports for spreadsheet analysis, reporting, or sharing with non-technical stakeholders.</p>
        </div>
      </CardContent>
    </Card>
  );
}