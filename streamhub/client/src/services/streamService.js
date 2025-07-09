import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const streamService = {
  async getActiveStreams() {
    try {
      console.log('Fetching active streams from:', `${API_BASE_URL}/stream/active`); // Debug log
      const response = await axios.get(`${API_BASE_URL}/stream/active`);
      console.log('Active streams response:', response.data); // Debug log
      return response.data.streams;
    } catch (error) {
      console.error('Failed to fetch active streams:', error.response?.data || error.message); // Debug log
      throw new Error(error.response?.data?.error || 'Failed to fetch active streams');
    }
  },

  async startStream(title) {
    try {
      const response = await axios.post(`${API_BASE_URL}/stream/start`, { title });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to start stream');
    }
  },

  async stopStream() {
    try {
      const response = await axios.post(`${API_BASE_URL}/stream/stop`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to stop stream');
    }
  },

  async getStreamKey() {
    try {
      const response = await axios.get(`${API_BASE_URL}/stream-key`);
      return response.data.streamKey;
    } catch (error) {
      throw new Error(error.response?.data?.msg || 'Failed to get stream key');
    }
  },

  async updateStreamTitle(title) {
    try {
      const response = await axios.put(`${API_BASE_URL}/stream/update-title`, { title });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update stream title');
    }
  }
};
