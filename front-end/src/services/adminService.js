import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';

const ADMIN_API_URL = `${API_BASE_URL}/api/v1/admin`;

const parseResponse = async (response) => {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return { detail: text };
  }
};

const getAccessToken = async () => {
  const token = await AsyncStorage.getItem('access_token');

  if (!token) {
    throw new Error('No hay sesión activa');
  }

  return token;
};

const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== '' &&
      value !== 'all'
    ) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();

  return queryString ? `?${queryString}` : '';
};

const adminRequest = async (
  endpoint,
  {
    method = 'GET',
    body,
    params,
  } = {}
) => {
  const token = await getAccessToken();
  const queryString = buildQueryString(params);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(
    `${ADMIN_API_URL}${endpoint}${queryString}`,
    {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }
  );

  const data = await parseResponse(response);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Tu sesión venció. Volvé a iniciar sesión.');
    }

    if (response.status === 403) {
      throw new Error(
        data?.detail || 'No tenés permisos de administrador.'
      );
    }

    throw new Error(
      data?.detail || 'No se pudo completar la operación.'
    );
  }

  return data;
};

// ─────────────────────────────────────────────────────────────
// Dashboard y actividad
// ─────────────────────────────────────────────────────────────

export const getAdminDashboard = async () => {
  return adminRequest('/dashboard');
};

export const getAdminOnlineUsers = async (threshold = 90) => {
  return adminRequest('/online-users', {
    params: { threshold },
  });
};

export const getAdminActivity = async ({
  page = 1,
  pageSize = 20,
} = {}) => {
  return adminRequest('/activity', {
    params: {
      page,
      page_size: pageSize,
    },
  });
};

// ─────────────────────────────────────────────────────────────
// Usuarios
// ─────────────────────────────────────────────────────────────

export const getAdminUsers = async ({
  page = 1,
  pageSize = 20,
  search,
  status = 'all',
  role,
  isActive,
  online,
} = {}) => {
  const filters = {
    page,
    page_size: pageSize,
    search,
    role,
    is_active: isActive,
    online,
  };

  // Compatibilidad con los filtros usados por AdminUsersScreen.
  if (status === 'active') {
    filters.is_active = true;
  } else if (status === 'inactive') {
    filters.is_active = false;
  } else if (status === 'admin') {
    filters.role = 'admin';
  } else if (status === 'online') {
    filters.online = true;
  }

  return adminRequest('/users', {
    params: filters,
  });
};

export const getAdminUser = async (userId) => {
  if (!userId) {
    throw new Error('El ID del usuario es obligatorio.');
  }

  return adminRequest(`/users/${userId}`);
};

export const updateAdminUserStatus = async (
  userId,
  isActive
) => {
  if (!userId) {
    throw new Error('El ID del usuario es obligatorio.');
  }

  return adminRequest(`/users/${userId}/status`, {
    method: 'PATCH',
    body: {
      is_active: Boolean(isActive),
    },
  });
};

export const updateAdminUserRole = async (
  userId,
  role
) => {
  if (!userId) {
    throw new Error('El ID del usuario es obligatorio.');
  }

  if (!['user', 'admin'].includes(role)) {
    throw new Error('El rol indicado no es válido.');
  }

  return adminRequest(`/users/${userId}/role`, {
    method: 'PATCH',
    body: { role },
  });
};

// ─────────────────────────────────────────────────────────────
// Reportes de soporte
// ─────────────────────────────────────────────────────────────

export const getAdminReports = async ({
  page = 1,
  pageSize = 20,
  search,
  status = 'all',
  category,
} = {}) => {
  return adminRequest('/reports', {
    params: {
      page,
      page_size: pageSize,
      search,
      status,
      category,
    },
  });
};

export const getAdminReport = async (reportId) => {
  if (!reportId) {
    throw new Error('El ID del reporte es obligatorio.');
  }

  return adminRequest(`/reports/${reportId}`);
};

export const updateAdminReportStatus = async (
  reportId,
  status
) => {
  if (!reportId) {
    throw new Error('El ID del reporte es obligatorio.');
  }

  const validStatuses = [
    'open',
    'in_review',
    'resolved',
    'closed',
  ];

  if (!validStatuses.includes(status)) {
    throw new Error('El estado indicado no es válido.');
  }

  return adminRequest(`/reports/${reportId}/status`, {
    method: 'PATCH',
    body: { status },
  });
};

export const replyAdminReport = async (
  reportId,
  message
) => {
  if (!reportId) {
    throw new Error('El ID del reporte es obligatorio.');
  }

  if (!message?.trim()) {
    throw new Error('La respuesta no puede estar vacía.');
  }

  return adminRequest(`/reports/${reportId}/reply`, {
    method: 'POST',
    body: {
      message: message.trim(),
    },
  });
};

export const getAdminToolsHealth = async () => {
  return adminRequest('/tools/health');
};

export const getAdminScannerHealth = async () => {
  return adminRequest('/tools/scanner-health');
};

export const sendAdminTestEmail = async () => {
  return adminRequest('/tools/test-email', {
    method: 'POST',
    body: {
      subject: 'Prueba de Spendly',
      message:
        'El servicio de correo está funcionando correctamente.',
    },
  });
};

export const sendAdminTestNotification = async (
  type = 'simple'
) => {
  const validTypes = [
    'simple',
    'goal',
    'reminder',
    'warning',
  ];

  const notificationType = validTypes.includes(type)
    ? type
    : 'simple';

  return adminRequest('/tools/test-notification', {
    method: 'POST',
    body: {
      type: notificationType,
    },
  });
};
