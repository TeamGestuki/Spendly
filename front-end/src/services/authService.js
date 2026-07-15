import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL =
  "https://spendly-production-1793.up.railway.app";

const API_URL =
  `${API_BASE_URL}/api/v1/auth`;

const parseResponse = async (response) => {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    return { detail: text };
  }
};

export const registerUser = async (
  fullName,
  email,
  password
) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      full_name: fullName,
      email,
      password,
    }),
  });

  const data = await parseResponse(response);

  console.log("REGISTER STATUS:", response.status);
  console.log("REGISTER DATA:", data);

  if (!response.ok) {
    throw new Error(
      data.detail || "Tuvimos un problema, intentalo más tarde."
    );
  }

  return data;
};

export const loginUser = async (
  email,
  password,
  rememberSession = false,
  deviceName = 'Dispositivo móvil'
) => {
  const formData = new URLSearchParams();

  formData.append("username", email);
  formData.append("password", password);
  formData.append(
    "remember_me",
    rememberSession ? "true" : "false"
  );
  formData.append("device_name", deviceName);

  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      data.detail || "Email o contraseña incorrectos"
    );
  }

  return data;
};

export const getCurrentUser = async () => {
  const token = await AsyncStorage.getItem('access_token');

  if (!token) {
    throw new Error('No hay sesión activa');
  }

  const response = await fetch(`${API_URL}/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await parseResponse(response);

  console.log("CURRENT USER STATUS:", response.status);
  console.log("CURRENT USER DATA:", data);

  if (!response.ok) {
    throw new Error(
      data.detail || 'No se pudo obtener el usuario'
    );
  }

  return data;
};

export const uploadProfileAvatar = async (imageUri) => {
  const token = await AsyncStorage.getItem('access_token');

  if (!token) {
    throw new Error('No hay sesión activa');
  }

  const formData = new FormData();

  formData.append('file', {
    uri: imageUri,
    name: 'avatar.jpg',
    type: 'image/jpeg',
  });

  const response = await fetch(
    `${API_BASE_URL}/api/v1/profile/avatar`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const data = await parseResponse(response);

  console.log("UPLOAD AVATAR STATUS:", response.status);
  console.log("UPLOAD AVATAR DATA:", data);

  if (!response.ok) {
    throw new Error(
      data.detail || 'No se pudo subir la imagen'
    );
  }

  return data;
};

export const updateCurrentUser = async (data) => {
  const token = await AsyncStorage.getItem('access_token');

  if (!token) {
    throw new Error('No hay sesión activa');
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/profile`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const responseData = await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      responseData.detail || 'No se pudo actualizar el perfil'
    );
  }

  return responseData;
};

export const deleteProfileAvatar = async () => {
  const token = await AsyncStorage.getItem('access_token');

  if (!token) {
    throw new Error('No hay sesión activa');
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/profile/avatar`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await parseResponse(response);

  console.log('DELETE STATUS:', response.status);
  console.log('DELETE DATA:', data);

  if (!response.ok) {
    throw new Error(
      data.detail || 'No se pudo eliminar la foto'
    );
  }

  return data;
};

export const changePassword = async (
  currentPassword,
  newPassword
) => {
  const token = await AsyncStorage.getItem('access_token');

  if (!token) {
    throw new Error('No hay sesión activa');
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/profile/password`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    }
  );

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      data.detail || 'No se pudo cambiar la contraseña'
    );
  }

  return data;
};

export const getActiveSessions = async () => {
  const token = await AsyncStorage.getItem('access_token');

  if (!token) {
    throw new Error('No hay sesión activa');
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/profile/sessions`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      data.detail || 'No se pudieron obtener las sesiones'
    );
  }

  return data;
};

export const revokeSession = async (
  sessionId,
  currentPassword
) => {
  const token = await AsyncStorage.getItem('access_token');

  if (!token) {
    throw new Error('No hay sesión activa');
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/profile/sessions/${sessionId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        current_password: currentPassword,
      }),
    }
  );

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      data.detail || 'No se pudo cerrar la sesión'
    );
  }

  return data;
};

export const revokeOtherSessions = async (
  currentPassword
) => {
  const token = await AsyncStorage.getItem('access_token');

  if (!token) {
    throw new Error('No hay sesión activa');
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/profile/sessions`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        current_password: currentPassword,
      }),
    }
  );

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      data.detail || 'No se pudieron cerrar las sesiones'
    );
  }

  return data;
};