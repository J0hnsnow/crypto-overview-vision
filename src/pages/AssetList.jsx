import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTopAssets, fetchUsdToKshRate } from '../services/coinCapApi';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const AssetList = () => {
  const [sortBy, setSortBy] = useState('rank');
  const [searchTerm, setSearchTerm] = useState('');
  const [usdToKshRate, setUsdToKshRate] = useState(null);

  const { data: assets, isLoading, error } = useQuery({
    queryKey: ['topAssets'],
    queryFn: () => fetchTopAssets(100),
  });

  useEffect(() => {
    const getExchangeRate = async () => {
      try {
        const rate = await fetchUsdToKshRate();
        setUsdToKshRate(rate);
      } catch (error) {
        console.error('Failed to fetch exchange rate:', error);
      }
    };
    getExchangeRate();
  }, []);

  if (isLoading) return <div className="text-center p-4 futuristic-text">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error: {error.message}</div>;

  const filteredAssets = assets
    .filter(asset => asset.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'tvl') return b.tvl - a.tvl;
      if (sortBy === 'transactions') return b.transactions - a.transactions;
      return a.rank - b.rank;
    });

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="futuristic-title">Track Top 100 Crypto Currencies</h1>
      <div className="flex gap-4 mb-4">
        <Input
          type="text"
          placeholder="Search assets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="futuristic-input flex-grow"
        />
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="futuristic-select w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rank">Rank</SelectItem>
            <SelectItem value="tvl">TVL</SelectItem>
            <SelectItem value="transactions">Daily Transactions</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssets.map((asset) => (
          <div key={asset.id} className="futuristic-card p-4 h-full relative">
            <span className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
              Rank: {asset.rank}
            </span>
            <h2 className="text-lg font-bold futuristic-text truncate mt-6">{asset.name} ({asset.symbol})</h2>
            <p className="futuristic-text text-sm">Price (USD): ${parseFloat(asset.priceUsd).toFixed(2)}</p>
            {usdToKshRate && (
              <p className="futuristic-text text-sm">
                Price (KSH): {(parseFloat(asset.priceUsd) * usdToKshRate).toFixed(2)} KSH
              </p>
            )}
            <p className="futuristic-text text-sm truncate">Market Cap: ${parseFloat(asset.marketCapUsd).toFixed(2)}</p>
            <div className="mt-4 flex justify-between items-center">
              <Link to={`/asset/${asset.id}`} className="futuristic-button text-sm">
                View Details
              </Link>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="futuristic-button text-sm">Learn More</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] futuristic-card">
                  <DialogHeader>
                    <DialogTitle className="futuristic-text">{asset.name} ({asset.symbol})</DialogTitle>
                  </DialogHeader>
                  <div className="futuristic-text">
                    <p>Rank: {asset.rank}</p>
                    <p>Price (USD): ${parseFloat(asset.priceUsd).toFixed(2)}</p>
                    {usdToKshRate && (
                      <p>Price (KSH): {(parseFloat(asset.priceUsd) * usdToKshRate).toFixed(2)} KSH</p>
                    )}
                    <p>Market Cap: ${parseFloat(asset.marketCapUsd).toFixed(2)}</p>
                    <p>24h Volume: ${parseFloat(asset.volumeUsd24Hr).toFixed(2)}</p>
                    <p>Supply: {parseFloat(asset.supply).toFixed(0)} {asset.symbol}</p>
                    <p>Max Supply: {asset.maxSupply ? parseFloat(asset.maxSupply).toFixed(0) : 'N/A'}</p>
                    <p>% Change (24h): {parseFloat(asset.changePercent24Hr).toFixed(2)}%</p>
                    <p>Established: {asset.firstHistoricalData ? new Date(asset.firstHistoricalData).toLocaleDateString() : 'N/A'}</p>
                    <p>Type: {asset.type || 'N/A'}</p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetList;