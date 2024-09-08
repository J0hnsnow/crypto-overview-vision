import axios from 'axios';

const BASE_URL = 'https://api.coincap.io/v2';

export const fetchTopAssets = async (limit = 100) => {
  try {
    const response = await axios.get(`${BASE_URL}/assets?limit=${limit}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching top assets:', error);
    throw error;
  }
};

export const fetchAssetDetails = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/assets/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching asset details:', error);
    throw error;
  }
};

export const fetchAssetHistory = async (id, interval = 'd1') => {
  try {
    const response = await axios.get(`${BASE_URL}/assets/${id}/history?interval=${interval}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching asset history:', error);
    throw error;
  }
};