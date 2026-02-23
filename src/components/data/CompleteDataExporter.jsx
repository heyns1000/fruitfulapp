import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Package, Zap, Database } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function CompleteDataExporter() {
  const [exporting, setExporting] = useState(false);

  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: () => base44.entities.Brand.list(),
  });

  const exportCompleteSectorData = async (sector) => {
    setExporting(true);
    try {
      const sectorBrands = brands.filter(b => b.sector === sector);
      
      // Build COMPLETE sector export with ALL data
      const completeExport = {
        sector: sector,
        exportType: 'ONE_HIT_WONDER_COMPLETE_EXPORT',
        exportDate: new Date().toISOString(),
        totalBrands: sectorBrands.length,
        totalSubnodes: sectorBrands.reduce((sum, b) => sum + (b.subnodes?.length || 0), 0),
        brands: sectorBrands.map(brand => ({
          // Core brand info
          id: brand.id,
          name: brand.name,
          sector: brand.sector,
          description: brand.description,
          
          // Complete subnodes with ALL data
          subnodes: brand.subnodes || [],
          
          // All tags
          tags: brand.tags || [],
          
          // Complete metadata
          metadata: {
            id: brand.metadata?.id,
            vault: brand.metadata?.vault,
            layer: brand.metadata?.layer,
            deploymentZone: brand.metadata?.deploymentZone,
            securityRating: brand.metadata?.securityRating,
            activeNodes: brand.metadata?.activeNodes,
            ...(brand.metadata || {})
          },
          
          // System flags
          isSystemBrand: brand.isSystemBrand,
          aiGenerated: brand.aiGenerated,
          
          // Timestamps
          created_date: brand.created_date,
          updated_date: brand.updated_date
        })),
        
        // Aggregated sector insights
        sectorInsights: {
          topSubnodes: [...new Set(sectorBrands.flatMap(b => b.subnodes || []))],
          allTags: [...new Set(sectorBrands.flatMap(b => b.tags || []))],
          deploymentZones: [...new Set(sectorBrands.map(b => b.metadata?.deploymentZone).filter(Boolean))],
          securityRatings: [...new Set(sectorBrands.map(b => b.metadata?.securityRating).filter(Boolean))]
        },
        
        // Instructions for app builders
        usage: {
          title: 'One-Hit Wonder Export',
          description: 'Copy this complete sector data into any app builder or coding tool for instant application generation',
          includes: [
            'Complete brand data with all fields',
            'All subnodes and their relationships',
            'Full metadata including deployment zones and security ratings',
            'Aggregated sector insights',
            'Ready-to-use JSON format'
          ]
        }
      };

      const blob = new Blob([JSON.stringify(completeExport, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${sector}_COMPLETE_ONE_HIT_WONDER.json`;
      a.click();
      
      toast.success(`Exported complete ${sector} sector data!`);
    } catch (error) {
      toast.error('Export failed');
      console.error(error);
    } finally {
      setExporting(false);
    }
  };

  const exportAllSectorsComplete = async () => {
    setExporting(true);
    try {
      const sectors = [...new Set(brands.map(b => b.sector))];
      
      const megaExport = {
        exportType: 'COMPLETE_ECOSYSTEM_ONE_HIT_WONDER',
        exportDate: new Date().toISOString(),
        totalSectors: sectors.length,
        totalBrands: brands.length,
        totalSubnodes: brands.reduce((sum, b) => sum + (b.subnodes?.length || 0), 0),
        
        // Complete data by sector
        sectors: sectors.map(sector => {
          const sectorBrands = brands.filter(b => b.sector === sector);
          return {
            sector: sector,
            brandCount: sectorBrands.length,
            brands: sectorBrands.map(brand => ({
              id: brand.id,
              name: brand.name,
              description: brand.description,
              subnodes: brand.subnodes || [],
              tags: brand.tags || [],
              metadata: brand.metadata || {},
              isSystemBrand: brand.isSystemBrand,
              aiGenerated: brand.aiGenerated
            }))
          };
        }),
        
        // Global ecosystem insights
        ecosystemInsights: {
          allSubnodes: [...new Set(brands.flatMap(b => b.subnodes || []))],
          allTags: [...new Set(brands.flatMap(b => b.tags || []))],
          deploymentZones: [...new Set(brands.map(b => b.metadata?.deploymentZone).filter(Boolean))],
          securityRatings: [...new Set(brands.map(b => b.metadata?.securityRating).filter(Boolean))],
          totalActiveNodes: brands.reduce((sum, b) => sum + (b.metadata?.activeNodes || 0), 0)
        },
        
        usage: {
          title: 'Complete Ecosystem Export - Ultimate One-Hit Wonder',
          description: 'The entire FAA.ZONE ecosystem with complete data for all sectors, brands, and subnodes',
          powerLevel: 'MAXIMUM',
          instructions: 'Copy this into any app builder for instant multi-brand, multi-sector application generation'
        }
      };

      const blob = new Blob([JSON.stringify(megaExport, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `COMPLETE_ECOSYSTEM_ONE_HIT_WONDER_${Date.now()}.json`;
      a.click();
      
      toast.success('Exported complete ecosystem data!');
    } catch (error) {
      toast.error('Export failed');
      console.error(error);
    } finally {
      setExporting(false);
    }
  };

  const sectors = [...new Set(brands.map(b => b.sector))];

  return (
    <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-900">
          <Zap className="w-6 h-6 text-purple-600" />
          One-Hit Wonder Data Export
        </CardTitle>
        <CardDescription>
          Export complete sector data with all brands, subnodes, and metadata for instant app generation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Ultimate Export */}
        <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-lg">🚀 Complete Ecosystem Export</h3>
              <p className="text-sm text-purple-100">
                {brands.length} brands • {sectors.length} sectors • 
                {brands.reduce((sum, b) => sum + (b.subnodes?.length || 0), 0)} subnodes
              </p>
            </div>
          </div>
          <Button 
            onClick={exportAllSectorsComplete}
            disabled={exporting}
            className="w-full mt-2 bg-white text-purple-600 hover:bg-purple-50"
          >
            <Package className="w-4 h-4 mr-2" />
            {exporting ? 'Exporting...' : 'Export Complete Ecosystem'}
          </Button>
        </div>

        {/* Individual Sector Exports */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Export by Sector</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sectors.map(sector => {
              const sectorBrands = brands.filter(b => b.sector === sector);
              const subnodeCount = sectorBrands.reduce((sum, b) => sum + (b.subnodes?.length || 0), 0);
              
              return (
                <div key={sector} className="p-3 bg-white rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{sector}</h4>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {sectorBrands.length} brands
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                          {subnodeCount} subnodes
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full mt-2"
                    onClick={() => exportCompleteSectorData(sector)}
                    disabled={exporting}
                  >
                    <Download className="w-3 h-3 mr-2" />
                    Export {sector}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info Box */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <Database className="w-4 h-4" />
            What's Included in Each Export:
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ Complete brand data (name, sector, description)</li>
            <li>✓ All subnodes with full details</li>
            <li>✓ Complete metadata (layers, zones, security, nodes)</li>
            <li>✓ All tags and categorization</li>
            <li>✓ Aggregated sector insights</li>
            <li>✓ Ready-to-use JSON format</li>
          </ul>
          <p className="text-sm text-blue-900 font-semibold mt-3">
            🎯 Copy exported data → Paste into app builder → Instant working app!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}