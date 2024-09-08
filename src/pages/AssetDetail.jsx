import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchAssetDetails, fetchAssetHistory } from '../services/coinCapApi';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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

  if (assetLoading || historyLoading) return <div className="text-center p-4">Loading...</div>;
  if (assetError || historyError) return <div className="text-center p-4 text-red-500">Error loading data</div>;

  const chartData = history.map(item => ({
    date: new Date(item.time).toLocaleDateString(),
    price: parseFloat(item.priceUsd),
  }));

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">{asset.name} ({asset.symbol})</h1>
      <div className="border-4 border-black p-4 mb-6">
        <p className="text-2xl">Current Price: ${parseFloat(asset.priceUsd).toFixed(2)}</p>
        <p>Rank: {asset.rank}</p>
        <p>Market Cap: ${parseFloat(asset.marketCapUsd).toFixed(2)}</p>
        <p>24h Volume: ${parseFloat(asset.volumeUsd24Hr).toFixed(2)}</p>
        <p>Supply: {parseFloat(asset.supply).toFixed(0)} {asset.symbol}</p>
      </div>
      <div className="border-4 border-black p-4">
        <h2 className="text-2xl font-bold mb-4">Price History</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AssetDetail;