import axios from 'axios';

export const monitoringAPI = {
  baseURL: import.meta.env.VITE_API_URL || '/api',

  async getConfigs() {
    return axios.get(`${this.baseURL}/configs`);
  },

  async createConfig(data: {
    keywords: string[];
    interval: number;
    sources: string[];
  }) {
    return axios.post(`${this.baseURL}/configs`, data);
  },

  async getVulnerabilities(params?: {
    status?: string;
    minScore?: number;
  }) {
    return axios.get(`${this.baseURL}/vulnerabilities`, { params });
  }
};
