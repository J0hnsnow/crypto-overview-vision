import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchAssetDetails, fetchAssetHistory } from '../services/coinCapApi';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const AssetDetail = () => {
  const { id } = useParams();

  const { data: asset, isLoading: assetLoading, error: assetError } = useQuery({
    queryKey: ['asset', id],
    queryFn: () => fetchAssetDetails(id),
  });

  const { data: history, isLoading: historyLoading, error: historyError } = useQuery({
    queryKey: ['assetHistory', id],
    queryFn: () => fetchAssetHistory(id),
  });

  if (assetLoading || historyLoading) return <div className="text-center p-4 futuristic-text">Loading...</div>;
  if (assetError || historyError) return <div className="text-center p-4 text-red-500">Error loading data</div>;

  const chartData = history.map(item => ({
    date: new Date(item.time).toLocaleDateString(),
    price: parseFloat(item.priceUsd),
  }));

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Link to="/">
        <Button className="mb-4 futuristic-button">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>
      </Link>
      <h1 className="futuristic-title">{asset.name} ({asset.symbol})</h1>
      <div className="futuristic-card p-4 mb-6">
        <p className="text-2xl futuristic-text">Current Price: ${parseFloat(asset.priceUsd).toFixed(2)}</p>
        <p className="futuristic-text">Rank: {asset.rank}</p>
        <p className="futuristic-text">Market Cap: ${parseFloat(asset.marketCapUsd).toFixed(2)}</p>
        <p className="futuristic-text">24h Volume: ${parseFloat(asset.volumeUsd24Hr).toFixed(2)}</p>
        <p className="futuristic-text">Supply: {parseFloat(asset.supply).toFixed(0)} {asset.symbol}</p>
      </div>
      <div className="futuristic-card p-4">
        <h2 className="text-2xl font-bold mb-4 futuristic-text">Price History</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <XAxis dataKey="date" stroke="#63b3ed" />
            <YAxis stroke="#63b3ed" />
            <Tooltip contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: '1px solid #63b3ed' }} />
            <Line type="monotone" dataKey="price" stroke="#63b3ed" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AssetDetail;