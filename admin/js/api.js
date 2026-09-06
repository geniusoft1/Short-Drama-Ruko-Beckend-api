/**
 * Ruko Admin - API Client
 * Handles all HTTP requests to the backend server
 */

const API_BASE = window.location.origin;

class RukoAPI {
  constructor() {
    this.baseUrl = `${API_BASE}/api`;
  }

  getToken() {
    return localStorage.getItem('ruko_token');
  }

  async request(method, path, data = null, isAdmin = true) {
    const url = `${this.baseUrl}${path}`;
    const headers = { 'Content-Type': 'application/json' };

    if (isAdmin && this.getToken()) {
      headers['Authorization'] = `Bearer ${this.getToken()}`;
    }

    const config = { method, headers };
    if (data && method !== 'GET') {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);
      const json = await response.json();

      if (response.status === 401 || response.status === 403) {
        // Token expired or invalid — redirect to login
        if (isAdmin && window.location.pathname !== '/admin/index.html') {
          localStorage.removeItem('ruko_token');
          localStorage.removeItem('ruko_admin');
          window.location.href = '/admin/index.html';
          return;
        }
      }

      if (!response.ok) {
        throw new Error(json.message || `HTTP ${response.status}`);
      }

      return json;
    } catch (err) {
      if (err.name === 'TypeError') {
        throw new Error('Cannot connect to server. Make sure the backend is running.');
      }
      throw err;
    }
  }

  get(path) { return this.request('GET', path); }
  post(path, data) { return this.request('POST', path, data); }
  patch(path, data) { return this.request('PATCH', path, data); }
  delete(path) { return this.request('DELETE', path); }

  // ==================== AUTH ====================
  async login(username, password) {
    return this.request('POST', '/auth/login', { username, password }, false);
  }

  async me() { return this.get('/auth/me'); }

  // ==================== DASHBOARD ====================
  async getStats() { return this.get('/admin/stats'); }

  // ==================== SOURCES ====================
  async getSources() { return this.get('/admin/sources'); }
  async updateSource(id, data) { return this.patch(`/admin/sources/${id}`, data); }
  async syncSource(id) { return this.post(`/admin/sources/${id}/sync`); }
  async syncAll() { return this.post('/admin/sync-all'); }
  async getQueueStats() { return this.get('/admin/queue/stats'); }

  // ==================== DRAMAS ====================
  async getDramas(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.get(`/admin/dramas${qs ? '?' + qs : ''}`);
  }
  async getDrama(id) { return this.get(`/admin/dramas/${id}`); }
  async updateDrama(id, data) { return this.patch(`/admin/dramas/${id}`, data); }
  async deleteDrama(id) { return this.delete(`/admin/dramas/${id}`); }
  async createDrama(data) { return this.post('/admin/dramas', data); }
  async downloadDrama(id) { return this.post(`/admin/dramas/${id}/download`); }

  // ==================== EPISODES ====================
  async getEpisodes(dramaId) { return this.get(`/admin/dramas/${dramaId}/episodes`); }
  async updateEpisode(id, data) { return this.patch(`/admin/episodes/${id}`, data); }
  async deleteEpisode(id) { return this.delete(`/admin/episodes/${id}`); }

  // ==================== API KEYS ====================
  async getApiKeys() { return this.get('/admin/api-keys'); }
  async createApiKey(data) { return this.post('/admin/api-keys', data); }
  async revokeApiKey(id) { return this.delete(`/admin/api-keys/${id}`); }

  // ==================== SYNC LOGS ====================
  async getSyncLogs() { return this.get('/admin/sync-logs'); }
}

// Global API instance
window.api = new RukoAPI();
