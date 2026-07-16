import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Loader2, Database, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getBrandCatalog, getCatalogStats } from '@/lib/ecosystemCatalog';

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

      // Seed from the unified ecosystem catalog — the same single source of
      // truth the Brand Marketplace renders, so DB and UI stay in lockstep.
      for (const brand of getBrandCatalog()) {
        const brandKey = `${brand.name}-${brand.sector}`;
        if (existingNames.has(brandKey)) continue;

        brandsToCreate.push({
          name: brand.name,
          sector: brand.sector,
          subnodes: brand.subnodes || [],
          description: brand.description,
          health_score: brand.health_score,
          metadata: brand.metadata,
          isSystemBrand: true,
        });
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
    <div className="bg-primary/5 rounded-lg p-6 border-2 border-primary/20">
      <div className="flex items-center gap-3 mb-4">
        <Database className="w-6 h-6 text-primary" />
        <div>
          <h3 className="text-lg font-bold text-foreground">Database Seeder</h3>
          <p className="text-sm text-muted-foreground">Load the unified ecosystem brand catalog into the database</p>
        </div>
      </div>

      {seededCount > 0 && (
        <div className="mb-4 p-3 bg-card rounded border border-fruitful-green/30">
          <div className="flex items-center gap-2 text-fruitful-green">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Seeded {seededCount} brands...</span>
          </div>
        </div>
      )}

      <Button
        onClick={seedDatabase}
        disabled={isSeeding}
        className="w-full bg-primary hover:bg-fruitful-teal-deep text-primary-foreground"
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

      <p className="text-xs text-muted-foreground mt-3">
        This will populate the database with the full FAA.ZONE catalog: {getCatalogStats().totalBrands.toLocaleString()} brands across {getCatalogStats().totalSectors} sectors, with complete metadata, pricing tiers and subnodes — the same source of truth the Brand Marketplace renders.
      </p>
    </div>
  );
}
