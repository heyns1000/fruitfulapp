import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Loader2, Database, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ALL_SECTOR_DATA } from '../data/AllSectorData';

export default function DataSeeder() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seededCount, setSeededCount] = useState(0);

  const seedDatabase = async () => {
    setIsSeeding(true);
    setSeededCount(0);
    
    try {
      let totalSeeded = 0;
      
      for (const [sectorKey, data] of Object.entries(ALL_SECTOR_DATA)) {
        const { brands, subNodes } = data;
        
        for (let i = 0; i < Math.min(brands.length, subNodes.length); i++) {
          const brand = brands[i];
          const subnodes = subNodes[i] || [];
          
          await base44.entities.Brand.create({
            name: brand,
            sector: sectorKey,
            subnodes: subnodes,
            metadata: {
              id: `${brand.slice(0, 3).toUpperCase()}-${sectorKey.slice(0, 3).toUpperCase()}-${Math.floor(Math.random() * 9000) + 1000}`,
              vault: `VAULT-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
              layer: `Layer ${Math.random() < 0.5 ? 'Alpha' : 'Beta'} v${(Math.random() * 2 + 1).toFixed(1)}`,
              deploymentZone: `Zone ${String.fromCharCode(65 + Math.floor(Math.random() * 5))} ${Math.floor(Math.random() * 10) + 1}`,
              securityRating: `FAA-SEC ${['A+', 'A', 'B+'][Math.floor(Math.random() * 3)]}`,
              activeNodes: Math.floor(Math.random() * 5000) + 100
            },
            isSystemBrand: true
          });
          
          totalSeeded++;
          setSeededCount(totalSeeded);
        }
      }
      
      toast.success(`Successfully seeded ${totalSeeded} brands!`);
    } catch (error) {
      console.error('Seeding error:', error);
      toast.error('Failed to seed data');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-indigo-200">
      <div className="flex items-center gap-3 mb-4">
        <Database className="w-6 h-6 text-indigo-600" />
        <div>
          <h3 className="text-lg font-bold text-indigo-900">Database Seeder</h3>
          <p className="text-sm text-gray-600">Load comprehensive brand data from the original system</p>
        </div>
      </div>
      
      {seededCount > 0 && (
        <div className="mb-4 p-3 bg-white rounded border border-green-200">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Seeded {seededCount} brands...</span>
          </div>
        </div>
      )}
      
      <Button
        onClick={seedDatabase}
        disabled={isSeeding}
        className="w-full bg-indigo-600 hover:bg-indigo-700"
        size="lg"
      >
        {isSeeding ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Seeding Database...
          </>
        ) : (
          <>
            <Database className="w-4 h-4 mr-2" />
            Load All Core Brands & Subnodes
          </>
        )}
      </Button>
      
      <p className="text-xs text-gray-500 mt-3">
        This will populate the database with all banking and agriculture brands with their complete metadata and subnodes.
      </p>
    </div>
  );
}