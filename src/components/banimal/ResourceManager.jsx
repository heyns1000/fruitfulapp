import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Database, Server, HardDrive, Cpu, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function ResourceManager({ brands }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('allocation');

  const totalResources = {
    compute: 100000,
    storage: 500000,
    bandwidth: 200000
  };

  const brandsWithResources = brands.map(brand => ({
    ...brand,
    resources: {
      compute: Math.floor((brand.metadata?.resourceAllocation || 50) * 1000),
      storage: Math.floor((brand.metadata?.resourceAllocation || 50) * 5000),
      bandwidth: Math.floor((brand.metadata?.resourceAllocation || 50) * 2000)
    }
  }));

  const usedResources = brandsWithResources.reduce((acc, brand) => ({
    compute: acc.compute + brand.resources.compute,
    storage: acc.storage + brand.resources.storage,
    bandwidth: acc.bandwidth + brand.resources.bandwidth
  }), { compute: 0, storage: 0, bandwidth: 0 });

  const filteredBrands = brandsWithResources
    .filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'allocation') {
        return (b.metadata?.resourceAllocation || 0) - (a.metadata?.resourceAllocation || 0);
      }
      return b.resources.compute - a.resources.compute;
    });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              Compute Units
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-700 mb-2">
              {usedResources.compute.toLocaleString()} / {totalResources.compute.toLocaleString()}
            </p>
            <Progress value={(usedResources.compute / totalResources.compute) * 100} className="h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <HardDrive className="w-4 h-4" />
              Storage (GB)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-700 mb-2">
              {usedResources.storage.toLocaleString()} / {totalResources.storage.toLocaleString()}
            </p>
            <Progress value={(usedResources.storage / totalResources.storage) * 100} className="h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Server className="w-4 h-4" />
              Bandwidth (Mbps)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-700 mb-2">
              {usedResources.bandwidth.toLocaleString()} / {totalResources.bandwidth.toLocaleString()}
            </p>
            <Progress value={(usedResources.bandwidth / totalResources.bandwidth) * 100} className="h-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="allocation">Resource Allocation</SelectItem>
            <SelectItem value="compute">Compute Usage</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filteredBrands.map((brand) => (
          <Card key={brand.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{brand.name}™</h3>
                  <p className="text-sm text-gray-500">
                    Allocation: {brand.metadata?.resourceAllocation || 50}%
                  </p>
                </div>
                <Badge className="bg-orange-100 text-orange-800">
                  {brand.metadata?.activeNodes || 0} Nodes
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="flex items-center gap-1 text-gray-600 mb-1">
                    <Cpu className="w-3 h-3" />
                    <span>Compute</span>
                  </div>
                  <p className="font-semibold text-blue-700">
                    {brand.resources.compute.toLocaleString()}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1 text-gray-600 mb-1">
                    <HardDrive className="w-3 h-3" />
                    <span>Storage</span>
                  </div>
                  <p className="font-semibold text-purple-700">
                    {brand.resources.storage.toLocaleString()} GB
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1 text-gray-600 mb-1">
                    <Server className="w-3 h-3" />
                    <span>Bandwidth</span>
                  </div>
                  <p className="font-semibold text-green-700">
                    {brand.resources.bandwidth.toLocaleString()} Mbps
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}