const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Szerver hiba (státusz: ${response.status})`);
  }
  return response.json();
}

export const apiClient = {
  async getUsers() {
    const res = await fetch(`${API_URL}/api/users`);
    return handleResponse(res);
  },

  async getLeaves() {
    const res = await fetch(`${API_URL}/api/leaves`);
    return handleResponse(res);
  },

  async getOnCallSchedule() {
    const res = await fetch(`${API_URL}/api/oncalls/upcoming-weeks`);
    return handleResponse(res);
  },

  async createLeave(leaveData) {
    const res = await fetch(`${API_URL}/api/leaves/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leaveData)
    });
    return handleResponse(res);
  },

  async approveLeave(id) {
    const res = await fetch(`${API_URL}/api/leaves/approve/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(res);
  },

  async rejectLeave(id) {
    const res = await fetch(`${API_URL}/api/leaves/reject/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(res);
  }
};
