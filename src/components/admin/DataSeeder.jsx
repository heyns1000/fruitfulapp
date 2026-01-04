import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Loader2, Database, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ALL_SECTOR_DATA } from '../data/AllSectorData';

export default function DataSeeder() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seededCount, setSeededCount] = useState(0);
  const [hasChecked, setHasChecked] = React.useState(false);

  // Auto-seed on mount if database is empty
  React.useEffect(() => {
    const autoSeed = async () => {
      if (hasChecked) return;
      setHasChecked(true);
      
      try {
        const existingBrands = await base44.entities.Brand.list();
        if (existingBrands.length === 0) {
          await seedDatabase();
        }
      } catch (error) {
        console.error('Auto-seed check failed:', error);
      }
    };
    
    autoSeed();
  }, []);

  const seedDatabase = async () => {
    setIsSeeding(true);
    setSeededCount(0);
    
    try {
      // First, check for existing brands to avoid duplicates
      const existingBrands = await base44.entities.Brand.list();
      const existingNames = new Set(existingBrands.map(b => `${b.name}-${b.sector}`));
      
      let totalSeeded = 0;
      const brandsToCreate = [];
      
      for (const [sectorKey, data] of Object.entries(ALL_SECTOR_DATA)) {
        const { brands, subNodes } = data;
        
        // Ensure we have the minimum length between brands and subNodes
        const maxLength = Math.min(brands.length, subNodes.length);
        
        for (let i = 0; i < maxLength; i++) {
          const brandName = brands[i];
          const brandKey = `${brandName}-${sectorKey}`;
          
          // Skip if already exists
          if (existingNames.has(brandKey)) {
            continue;
          }
          
          const subnodes = Array.isArray(subNodes[i]) ? subNodes[i] : [];
          
          brandsToCreate.push({
            name: brandName,
            sector: sectorKey,
            subnodes: subnodes,
            metadata: {
              id: `${brandName.slice(0, 3).toUpperCase()}-${sectorKey.slice(0, 3).toUpperCase()}-${Math.floor(Math.random() * 9000) + 1000}`,
              vault: `VAULT-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
              layer: `Layer ${Math.random() < 0.5 ? 'Alpha' : 'Beta'} v${(Math.random() * 2 + 1).toFixed(1)}`,
              deploymentZone: `Zone ${String.fromCharCode(65 + Math.floor(Math.random() * 5))} ${Math.floor(Math.random() * 10) + 1}`,
              securityRating: `FAA-SEC ${['A+', 'A', 'B+'][Math.floor(Math.random() * 3)]}`,
              activeNodes: Math.floor(Math.random() * 5000) + 100
            },
            isSystemBrand: true
          });
        }
      }
      
      // Bulk create all brands
      if (brandsToCreate.length > 0) {
        await base44.entities.Brand.bulkCreate(brandsToCreate);
        totalSeeded = brandsToCreate.length;
        setSeededCount(totalSeeded);
        toast.success(`Successfully seeded ${totalSeeded} brands across all sectors!`);
      } else {
        toast.info('All brands already exist in the database');
      }
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
        This will populate the database with all {Object.keys(ALL_SECTOR_DATA).length} sectors including Banking ({ALL_SECTOR_DATA.banking.brands.length} brands), Agriculture ({ALL_SECTOR_DATA.agriculture.brands.length} brands), Webless ({ALL_SECTOR_DATA.webless.brands.length} brands), Health ({ALL_SECTOR_DATA.health.brands.length} brands), and AI-Logic ({ALL_SECTOR_DATA['ai-logic'].brands.length} brands) with complete metadata and subnodes.
      </p>
    </div>
  );
}