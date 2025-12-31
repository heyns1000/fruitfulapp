import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, Award, Globe, Package } from 'lucide-react';
import { FAA_ZONE_INDEX } from '../components/data/AllSectorData';

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

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export default function SectorAnalytics() {
  const [selectedSector, setSelectedSector] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['brands-analytics'],
    queryFn: () => base44.entities.Brand.list(),
  });

  // Filter brands by date range
  const filteredBrands = useMemo(() => {
    if (dateRange === 'all') return brands;
    
    const now = new Date();
    const cutoffDate = new Date();
    
    if (dateRange === '7d') cutoffDate.setDate(now.getDate() - 7);
    else if (dateRange === '30d') cutoffDate.setDate(now.getDate() - 30);
    else if (dateRange === '90d') cutoffDate.setDate(now.getDate() - 90);
    
    return brands.filter(b => new Date(b.created_date) >= cutoffDate);
  }, [brands, dateRange]);

  // Calculate sector metrics
  const sectorMetrics = useMemo(() => {
    const metrics = {};
    
    filteredBrands.forEach(brand => {
      if (!metrics[brand.sector]) {
        metrics[brand.sector] = {
          totalBrands: 0,
          subnodeCount: 0
        };
      }
      metrics[brand.sector].totalBrands++;
      metrics[brand.sector].subnodeCount += brand.subnodes?.length || 0;
    });
    
    return metrics;
  }, [filteredBrands]);

  // Brands per sector chart data
  const brandsPerSectorData = useMemo(() => {
    const data = Object.entries(sectorMetrics).map(([sector, metrics]) => ({
      name: SECTORS[sector] || sector,
      brands: metrics.totalBrands,
      sector: sector
    }));
    
    if (selectedSector !== 'all') {
      return data.filter(d => d.sector === selectedSector);
    }
    
    return data.sort((a, b) => b.brands - a.brands).slice(0, 10);
  }, [sectorMetrics, selectedSector]);

  // Fee analysis data
  const feeAnalysisData = useMemo(() => {
    return Object.entries(FAA_ZONE_INDEX).map(([sector, info]) => ({
      name: SECTORS[sector] || sector,
      monthly: parseFloat(info.monthlyFee.replace('$', '')),
      annual: parseFloat(info.annualFee.replace('$', '').replace(',', ''))
    }));
  }, []);

  // Payout tier distribution
  const payoutTierData = useMemo(() => {
    const tiers = {};
    Object.values(FAA_ZONE_INDEX).forEach(info => {
      tiers[info.payoutTier] = (tiers[info.payoutTier] || 0) + 1;
    });
    
    return Object.entries(tiers).map(([tier, count]) => ({
      name: tier,
      value: count
    }));
  }, []);

  // Region distribution
  const regionData = useMemo(() => {
    const regions = {};
    Object.values(FAA_ZONE_INDEX).forEach(info => {
      regions[info.region] = (regions[info.region] || 0) + 1;
    });
    
    return Object.entries(regions).map(([region, count]) => ({
      name: region,
      value: count
    }));
  }, []);

  // Summary stats
  const summaryStats = useMemo(() => {
    const totalBrands = filteredBrands.length;
    const totalSubnodes = filteredBrands.reduce((sum, b) => sum + (b.subnodes?.length || 0), 0);
    const avgMonthlyFee = feeAnalysisData.reduce((sum, d) => sum + d.monthly, 0) / feeAnalysisData.length;
    const avgAnnualFee = feeAnalysisData.reduce((sum, d) => sum + d.annual, 0) / feeAnalysisData.length;
    
    return {
      totalBrands,
      totalSubnodes,
      avgMonthlyFee: avgMonthlyFee.toFixed(0),
      avgAnnualFee: avgAnnualFee.toFixed(0),
      totalSectors: Object.keys(sectorMetrics).length
    };
  }, [filteredBrands, feeAnalysisData, sectorMetrics]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📊 Sector Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive metrics and insights across all FAA.ZONE™ sectors</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sector Filter</label>
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  <SelectItem value="all">All Sectors</SelectItem>
                  {Object.entries(SECTORS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Brands</CardTitle>
              <Package className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.totalBrands}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subnodes</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.totalSubnodes}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sectors</CardTitle>
              <Globe className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.totalSectors}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Monthly Fee</CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${summaryStats.avgMonthlyFee}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Annual Fee</CardTitle>
              <Award className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${summaryStats.avgAnnualFee}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Brands per Sector */}
          <Card>
            <CardHeader>
              <CardTitle>Total Brands per Sector</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={brandsPerSectorData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={12} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="brands" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Fee Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly vs Annual Fees by Sector</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={feeAnalysisData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={12} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="monthly" stroke="#10b981" name="Monthly ($)" />
                  <Line type="monotone" dataKey="annual" stroke="#f59e0b" name="Annual ($)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Payout Tier Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Payout Tier Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={payoutTierData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {payoutTierData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Region Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Region Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={regionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {regionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Metrics Table */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Sector Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Sector</th>
                    <th className="px-4 py-3 text-center font-semibold">Brands</th>
                    <th className="px-4 py-3 text-center font-semibold">Subnodes</th>
                    <th className="px-4 py-3 text-center font-semibold">Monthly Fee</th>
                    <th className="px-4 py-3 text-center font-semibold">Annual Fee</th>
                    <th className="px-4 py-3 text-center font-semibold">Tier</th>
                    <th className="px-4 py-3 text-center font-semibold">Region</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {Object.entries(sectorMetrics)
                    .filter(([sector]) => selectedSector === 'all' || sector === selectedSector)
                    .sort((a, b) => b[1].totalBrands - a[1].totalBrands)
                    .map(([sector, metrics]) => {
                      const faaInfo = FAA_ZONE_INDEX[sector];
                      return (
                        <tr key={sector} className="hover:bg-gray-50">
                          <td className="px-4 py-3">{SECTORS[sector] || sector}</td>
                          <td className="px-4 py-3 text-center font-semibold">{metrics.totalBrands}</td>
                          <td className="px-4 py-3 text-center">{metrics.subnodeCount}</td>
                          <td className="px-4 py-3 text-center">{faaInfo?.monthlyFee || 'N/A'}</td>
                          <td className="px-4 py-3 text-center">{faaInfo?.annualFee || 'N/A'}</td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-medium">
                              {faaInfo?.payoutTier || 'N/A'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center text-gray-600">{faaInfo?.region || 'N/A'}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}