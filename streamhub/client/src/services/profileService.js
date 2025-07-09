import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const profileService = {
  async getProfile() {
    try {
      const response = await axios.get(`${API_BASE_URL}/profile`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch profile');
    }
  },

  async changePassword(oldPassword, newPassword) {
    try {
      const response = await axios.post(`${API_BASE_URL}/change-password`, {
        oldPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to change password');
    }
  },

  async deleteAccount() {
    try {
      const response = await axios.delete(`${API_BASE_URL}/delete-account`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete account');
    }
  }
};
