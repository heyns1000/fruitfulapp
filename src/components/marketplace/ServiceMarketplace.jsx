import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search, ShoppingCart, Star, Package, Plus, X, SlidersHorizontal, MapPin, Tag, Heart, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import { useCart } from '../cart/CartContext';
import { useWishlist } from '../wishlist/WishlistContext';

const CURRENCY_SYMBOLS = {
  USD: '$', EUR: '€', GBP: '£', ZAR: 'R', NGN: '₦', KES: 'KSh',
};

export default function ServiceMarketplace({ services }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedArtisan, setSelectedArtisan] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [activeTags, setActiveTags] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  // Only show products that have a proper brandId AND brandName (no orphaned/mock items)
  const activeServices = services.filter(s => s.status === 'active' && s.brandId && s.brandName);

  // Derive filter options from data
  const allTags = useMemo(() => {
    const tags = new Set();
    activeServices.forEach(s => s.tags?.forEach(t => tags.add(t)));
    return [...tags].sort();
  }, [activeServices]);

  const allArtisans = useMemo(() => {
    const names = new Set(activeServices.map(s => s.brandName).filter(Boolean));
    return [...names].sort();
  }, [activeServices]);

  const allLocations = useMemo(() => {
    const locs = new Set(activeServices.flatMap(s => s.delivery?.regions || []).filter(Boolean));
    return [...locs].sort();
  }, [activeServices]);

  const maxPrice = useMemo(() => {
    const prices = activeServices.map(s => s.pricing?.[selectedCurrency] || s.pricing?.USD || 0);
    return Math.max(...prices, 500);
  }, [activeServices, selectedCurrency]);

  const filteredServices = useMemo(() => {
    return activeServices.filter(service => {
      const price = service.pricing?.[selectedCurrency] || service.pricing?.USD || 0;
      const matchesSearch = !searchTerm ||
        service.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.tags?.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
      const matchesArtisan = selectedArtisan === 'all' || service.brandName === selectedArtisan;
      const matchesLocation = selectedLocation === 'all' || service.delivery?.regions?.includes(selectedLocation);
      const matchesTags = activeTags.length === 0 || activeTags.every(tag => service.tags?.includes(tag));
      return matchesSearch && matchesCategory && matchesPrice && matchesArtisan && matchesLocation && matchesTags;
    });
  }, [activeServices, searchTerm, selectedCategory, priceRange, selectedArtisan, selectedLocation, activeTags, selectedCurrency]);

  // Applied filters for chips
  const appliedFilters = [];
  if (selectedCategory !== 'all') appliedFilters.push({ label: selectedCategory.replace('_', ' '), clear: () => setSelectedCategory('all') });
  if (selectedArtisan !== 'all') appliedFilters.push({ label: selectedArtisan, clear: () => setSelectedArtisan('all') });
  if (selectedLocation !== 'all') appliedFilters.push({ label: `Ships to: ${selectedLocation}`, clear: () => setSelectedLocation('all') });
  if (priceRange[0] > 0 || priceRange[1] < maxPrice) appliedFilters.push({ label: `${CURRENCY_SYMBOLS[selectedCurrency]}${priceRange[0]}–${CURRENCY_SYMBOLS[selectedCurrency]}${priceRange[1]}`, clear: () => setPriceRange([0, maxPrice]) });
  activeTags.forEach(tag => appliedFilters.push({ label: `#${tag}`, clear: () => setActiveTags(prev => prev.filter(t => t !== tag)) }));

  const clearAll = () => {
    setSearchTerm(''); setSelectedCategory('all'); setSelectedArtisan('all');
    setSelectedLocation('all'); setPriceRange([0, maxPrice]); setActiveTags([]);
  };

  const toggleTag = (tag) => setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  const buyNow = (service) => {
    const price = service.pricing?.[selectedCurrency] || service.pricing?.USD || 0;
    addToCart({ id: service.id, name: service.serviceName, price, productCode: service.productCode, imageUrl: service.imageUrl, brandName: service.brandName });
    navigate(createPageUrl('Checkout'));
  };

  return (
    <div className="space-y-6">

      {/* Search bar + toggle filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search products, brands, tags..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
        <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
          <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
          <SelectContent>
            {Object.keys(CURRENCY_SYMBOLS).map(c => <SelectItem key={c} value={c}>{CURRENCY_SYMBOLS[c]} {c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={() => setShowFilters(f => !f)} className="gap-2">
          <SlidersHorizontal className="w-4 h-4" /> Filters {appliedFilters.length > 0 && <Badge className="bg-purple-600 text-white ml-1">{appliedFilters.length}</Badge>}
        </Button>
      </div>

      {/* Faceted filter panel */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Category</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="digital_service">Digital Service</SelectItem>
                <SelectItem value="physical_product">Physical Product</SelectItem>
                <SelectItem value="subscription">Subscription</SelectItem>
                <SelectItem value="consulting">Consulting</SelectItem>
                <SelectItem value="license">License</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Artisan / Brand</label>
            <Select value={selectedArtisan} onValueChange={setSelectedArtisan}>
              <SelectTrigger><SelectValue placeholder="All Artisans" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Artisans</SelectItem>
                {allArtisans.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block flex items-center gap-1"><MapPin className="w-3 h-3" /> Ships To</label>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger><SelectValue placeholder="All Regions" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {allLocations.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">
              Price ({CURRENCY_SYMBOLS[selectedCurrency]}): {priceRange[0]} – {priceRange[1]}
            </label>
            <Slider
              min={0} max={maxPrice} step={10}
              value={priceRange}
              onValueChange={setPriceRange}
              className="mt-3"
            />
          </div>

          {allTags.length > 0 && (
            <div className="sm:col-span-2 lg:col-span-4">
              <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block flex items-center gap-1"><Tag className="w-3 h-3" /> Tags</label>
              <div className="flex flex-wrap gap-2">
                {allTags.slice(0, 30).map(tag => (
                  <button key={tag} onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${activeTags.includes(tag) ? 'bg-purple-600 text-white border-purple-600' : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-purple-400'}`}>
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Applied filter chips */}
      {appliedFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-500">Active filters:</span>
          {appliedFilters.map((f, i) => (
            <Badge key={i} className="bg-purple-100 text-purple-800 border border-purple-300 gap-1 pr-1 pl-3 py-1">
              {f.label}
              <button onClick={f.clear} className="ml-1 hover:text-red-600"><X className="w-3 h-3" /></button>
            </Badge>
          ))}
          <button onClick={clearAll} className="text-xs text-red-500 hover:underline ml-1">Clear all</button>
        </div>
      )}

      {/* Results count */}
      <p className="text-sm text-gray-500">{filteredServices.length} product{filteredServices.length !== 1 ? 's' : ''} found</p>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredServices.length === 0 ? (
          <div className="col-span-full flex flex-col items-center py-16 text-gray-400 gap-3">
            <Package className="w-12 h-12 opacity-30" />
            <p className="text-lg">No products match your filters</p>
            <Button variant="outline" onClick={clearAll}>Clear Filters</Button>
          </div>
        ) : (
          filteredServices.map(service => {
            const price = service.pricing?.[selectedCurrency] || service.pricing?.USD || 0;
            const sym = CURRENCY_SYMBOLS[selectedCurrency] || '$';
            return (
              <Card key={service.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
                {/* Product Image — always visible */}
                <div className="relative bg-gray-100 aspect-square overflow-hidden">
                  {service.imageUrl ? (
                    <img
                      src={service.imageUrl}
                      alt={service.serviceName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-16 h-16 text-gray-300" />
                    </div>
                  )}
                  {service.inventory?.available <= 5 && service.inventory?.available > 0 && (
                    <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      Only {service.inventory.available} left
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex flex-col gap-2">
                    <Badge className="bg-white/90 text-gray-700 text-xs capitalize shadow">
                      {service.category?.replace('_', ' ')}
                    </Badge>
                  </div>
                  <button
                    onClick={() => toggleWishlist(service)}
                    className="absolute top-2 left-2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow hover:scale-110 transition-all"
                  >
                    <Heart className={`w-4 h-4 transition-colors ${isInWishlist(service.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                  </button>
                </div>

                <CardContent className="p-4 flex flex-col flex-1 gap-2">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">{service.serviceName}</h3>
                    <Link to={createPageUrl(`ArtisanShop?brandName=${encodeURIComponent(service.brandName)}`)}
                      className="text-xs text-purple-600 hover:underline font-medium mt-0.5 block">
                      {service.brandName}™
                    </Link>
                  </div>

                  <p className="text-xs text-gray-500 line-clamp-2 flex-1">{service.description}</p>

                  {service.rating > 0 && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold text-gray-700">{service.rating.toFixed(1)}</span>
                      <span>({service.reviewCount} reviews)</span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1">
                    {service.tags?.slice(0, 3).map((tag, idx) => (
                      <button key={idx} onClick={() => { toggleTag(tag); if (!showFilters) setShowFilters(true); }}
                        className="text-xs bg-gray-100 hover:bg-purple-100 text-gray-600 hover:text-purple-700 px-2 py-0.5 rounded-full transition-colors">
                        #{tag}
                      </button>
                    ))}
                  </div>

                  <div className="mt-auto pt-3 border-t flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xl font-extrabold text-purple-700">{sym}{price.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">{selectedCurrency}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline"
                        onClick={() => addToCart({ id: service.id, name: service.serviceName, price, productCode: service.productCode, imageUrl: service.imageUrl, brandName: service.brandName })}
                        className="border-purple-300 text-purple-700 hover:bg-purple-50 px-2"
                        title="Add to cart">
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button size="sm" onClick={() => buyNow(service)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-3 gap-1">
                        <Zap className="w-3 h-3" />Buy
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

    </div>
  );
}