import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTopAssets } from '../services/coinCapApi';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AssetList = () => {
  const [sortBy, setSortBy] = useState('rank');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: assets, isLoading, error } = useQuery({
    queryKey: ['topAssets'],
    queryFn: () => fetchTopAssets(100),
  });

  if (isLoading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error: {error.message}</div>;

  const filteredAssets = assets
    .filter(asset => asset.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'tvl') return b.tvl - a.tvl;
      if (sortBy === 'transactions') return b.transactions - a.transactions;
      return a.rank - b.rank;
    });

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Top Crypto Assets</h1>
      <div className="flex gap-4 mb-4">
        <Input
          type="text"
          placeholder="Search assets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rank">Rank</SelectItem>
            <SelectItem value="tvl">TVL</SelectItem>
            <SelectItem value="transactions">Daily Transactions</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4">
        {filteredAssets.map((asset) => (
          <Link key={asset.id} to={`/asset/${asset.id}`} className="block">
            <div className="border-4 border-black p-4 hover:bg-gray-100 transition-colors">
              <h2 className="text-2xl font-bold">{asset.name} ({asset.symbol})</h2>
              <p>Rank: {asset.rank}</p>
              <p>Price: ${parseFloat(asset.priceUsd).toFixed(2)}</p>
              <p>Market Cap: ${parseFloat(asset.marketCapUsd).toFixed(2)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AssetList;