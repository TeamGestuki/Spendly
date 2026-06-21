/*
 * transactionService.js
 * Servicio real de transacciones para Spendly
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL =
  'https://spendly-production-1793.up.railway.app';

const API_URL =
  `${API_BASE_URL}/api/v1/transactions`;

const parseResponse = async (response) => {
  const text = await response.text();

  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return { detail: text };
  }
};

async function authHeaders() {
  const token = await AsyncStorage.getItem('access_token');

  if (!token) {
    throw new Error('No hay sesión activa');
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function getTransactions(type = null) {
  const headers = await authHeaders();

  const url = type
    ? `${API_URL}/?type=${type}`
    : `${API_URL}/`;

  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  const data = await parseResponse(response);

  console.log('GET TRANSACTIONS STATUS:', response.status);
  console.log('GET TRANSACTIONS DATA:', data);

  if (!response.ok) {
    throw new Error(
      data?.detail || 'Error al obtener transacciones'
    );
  }

  return data;
}

export async function createTransaction(data) {
  const headers = await authHeaders();

  const response = await fetch(`${API_URL}/`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  const responseData = await parseResponse(response);

  console.log('CREATE TRANSACTION STATUS:', response.status);
  console.log('CREATE TRANSACTION DATA:', responseData);

  if (!response.ok) {
    throw new Error(
      responseData?.detail || 'Error al crear transacción'
    );
  }

  return responseData;
}

export async function deleteTransaction(id) {
  const headers = await authHeaders();

  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers,
  });

  const data = await parseResponse(response);

  console.log('DELETE TRANSACTION STATUS:', response.status);
  console.log('DELETE TRANSACTION DATA:', data);

  if (!response.ok) {
    throw new Error(
      data?.detail || 'Error al eliminar transacción'
    );
  }

  return true;
}

export async function updateTransaction(id, data) {
  throw new Error(
    'Editar transacciones todavía no está implementado en backend.'
  );
}