import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTopAssets } from '../services/coinCapApi';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AssetList = () => {
  const [sortBy, setSortBy] = useState('rank');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: assets, isLoading, error } = useQuery({
    queryKey: ['topAssets'],
    queryFn: () => fetchTopAssets(100),
  });

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
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="futuristic-title">Top Crypto Assets</h1>
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
      <div className="grid gap-4">
        {filteredAssets.map((asset) => (
          <Link key={asset.id} to={`/asset/${asset.id}`} className="block">
            <div className="futuristic-card p-4">
              <h2 className="text-2xl font-bold futuristic-text">{asset.name} ({asset.symbol})</h2>
              <p className="futuristic-text">Rank: {asset.rank}</p>
              <p className="futuristic-text">Price: ${parseFloat(asset.priceUsd).toFixed(2)}</p>
              <p className="futuristic-text">Market Cap: ${parseFloat(asset.marketCapUsd).toFixed(2)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AssetList;