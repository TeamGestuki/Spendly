import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/api/v1/scan`;

async function parseResponse(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return {
      detail: text,
    };
  }
}

export async function analyzeTicket(imageAsset) {
  const token =
    await AsyncStorage.getItem(
      'access_token'
    );

  if (!token) {
    throw new Error(
      'No hay una sesión activa.'
    );
  }

  if (!imageAsset?.uri) {
    throw new Error(
      'No se seleccionó una imagen.'
    );
  }

  const fileName =
    imageAsset.fileName ||
    `ticket-${Date.now()}.jpg`;

  const mimeType =
    imageAsset.mimeType ||
    'image/jpeg';

  const formData =
    new FormData();

  formData.append(
    'file',
    {
      uri: imageAsset.uri,
      name: fileName,
      type: mimeType,
    }
  );

  const response =
    await fetch(
      `${API_URL}/ticket`,
      {
        method: 'POST',
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
        body: formData,
      }
    );

  const data =
    await parseResponse(
      response
    );

  console.log(
    'SCAN STATUS:',
    response.status
  );

  console.log(
    'SCAN DATA:',
    data
  );

  if (!response.ok) {
    throw new Error(
      data?.detail ||
      data?.message ||
      'No se pudo analizar el comprobante.'
    );
  }

  if (
    data?.status ===
    'error'
  ) {
    throw new Error(
      data.message ||
      'No se detectó un comprobante válido.'
    );
  }

  if (!data?.data) {
    throw new Error(
      'El análisis no devolvió datos válidos.'
    );
  }

  return data.data;
}
