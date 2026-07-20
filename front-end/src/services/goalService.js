import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/api/v1/goals`;

async function token() {
  const value = await AsyncStorage.getItem('access_token');
  if (!value) throw new Error('No hay una sesión activa.');
  return value;
}

async function request(path = '', options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${await token()}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  });

  if (response.status === 204) return null;
  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!response.ok) {
    throw new Error(data?.detail || data?.message || 'Ocurrió un error inesperado.');
  }
  return data;
}

export const getGoals = () => request('/');
export const getGoal = (id) => request(`/${id}`);
export const createGoal = (payload) => request('/', { method: 'POST', body: JSON.stringify(payload) });
export const updateGoal = (id, payload) => request(`/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
export const deleteGoal = (id) => request(`/${id}`, { method: 'DELETE' });
export const addGoalMovement = (id, payload) => request(`/${id}/contributions`, { method: 'POST', body: JSON.stringify(payload) });
export const deleteGoalMovement = (goalId, movementId) => request(`/${goalId}/contributions/${movementId}`, { method: 'DELETE' });
export const pauseGoal = (id) => request(`/${id}/pause`, { method: 'PATCH' });
export const resumeGoal = (id) => request(`/${id}/resume`, { method: 'PATCH' });
export const cancelGoal = (id) => request(`/${id}/cancel`, { method: 'PATCH' });
