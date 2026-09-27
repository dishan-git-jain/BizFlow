// Frontend API Service client connecting React app with Express REST API Backend

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const getHeaders = () => {
  const token = localStorage.getItem('bizflow_auth_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const fetchWithTimeout = async (url, options = {}, timeoutMs = 1200) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return res;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
};

const handleResponse = async (res) => {
  let data;
  try {
    data = await res.json();
  } catch (e) {
    throw new Error('Server response error. Using offline mode.');
  }
  if (!res.ok) {
    throw new Error(data.error || 'API Request failed');
  }
  return data;
};

export const api = {
  // AUTH
  sendOtp: async (email) => {
    const res = await fetchWithTimeout(`${API_BASE_URL}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return handleResponse(res);
  },

  verifyOtp: async (email, code) => {
    const res = await fetchWithTimeout(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    });
    const data = await handleResponse(res);
    if (data.token) {
      localStorage.setItem('bizflow_auth_token', data.token);
    }
    return data;
  },

  getProfile: async () => {
    const res = await fetchWithTimeout(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  updateProfile: async (profileData) => {
    const res = await fetchWithTimeout(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData)
    });
    return handleResponse(res);
  },

  // EMPLOYEES CRUD
  getEmployees: async () => {
    const res = await fetchWithTimeout(`${API_BASE_URL}/employees`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  createEmployee: async (empData) => {
    const res = await fetchWithTimeout(`${API_BASE_URL}/employees`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(empData)
    });
    return handleResponse(res);
  },

  updateEmployee: async (id, empData) => {
    const res = await fetchWithTimeout(`${API_BASE_URL}/employees/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(empData)
    });
    return handleResponse(res);
  },

  deleteEmployee: async (id) => {
    const res = await fetchWithTimeout(`${API_BASE_URL}/employees/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // TASKS CRUD
  getTasks: async () => {
    const res = await fetchWithTimeout(`${API_BASE_URL}/tasks`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  createTask: async (taskData) => {
    const res = await fetchWithTimeout(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(taskData)
    });
    return handleResponse(res);
  },

  updateTask: async (id, taskData) => {
    const res = await fetchWithTimeout(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(taskData)
    });
    return handleResponse(res);
  },

  deleteTask: async (id) => {
    const res = await fetchWithTimeout(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // PRESETS
  loadPreset: async (businessType) => {
    const res = await fetchWithTimeout(`${API_BASE_URL}/presets/load`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ businessType })
    });
    return handleResponse(res);
  },

  clearPreset: async () => {
    const res = await fetchWithTimeout(`${API_BASE_URL}/presets/clear`, {
      method: 'POST',
      headers: getHeaders()
    });
    return handleResponse(res);
  }
};
