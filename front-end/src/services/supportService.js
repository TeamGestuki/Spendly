import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://spendly-production-1793.up.railway.app';
const SUPPORT_URL = `${API_BASE_URL}/api/v1/support`;

async function authHeaders(hasBody = false) {
  const token = await AsyncStorage.getItem('access_token');
  if (!token) throw new Error('No hay una sesión activa.');
  return {
    Authorization: `Bearer ${token}`,
    ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
  };
}

async function parseResponse(response) {
  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!response.ok) {
    const detail = data?.detail || data?.message || 'Ocurrió un error inesperado.';
    throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
  }
  return data;
}

async function request(path = '', options = {}) {
  const response = await fetch(`${SUPPORT_URL}${path}`, {
    ...options,
    headers: { ...(await authHeaders(Boolean(options.body))), ...options.headers },
  });
  return parseResponse(response);
}

export const createSupportReport = (payload) => request('/', { method: 'POST', body: JSON.stringify(payload) });
export const getMySupportReports = ({ status, limit = 20, offset = 0 } = {}) => {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  if (status) params.append('status', status);
  return request(`/me?${params.toString()}`);
};
export const getSupportReport = (reportId) => request(`/${reportId}`);
export const updateSupportReport = (reportId, payload) => request(`/${reportId}`, { method: 'PATCH', body: JSON.stringify(payload) });
