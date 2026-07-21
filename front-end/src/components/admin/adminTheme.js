export const withAlpha = (color, alpha = '18') => {
  if (!color || typeof color !== 'string') {
    return color;
  }

  if (color.startsWith('#') && color.length === 7) {
    return `${color}${alpha}`;
  }

  return color;
};

export const getAdminStatusConfig = (status, colors) => {
  const configs = {
    open: {
      label: 'Abierto',
      color: colors.red,
      icon: 'mail-unread-outline',
    },
    in_review: {
      label: 'En revisión',
      color: colors.orange,
      icon: 'eye-outline',
    },
    resolved: {
      label: 'Resuelto',
      color: colors.accent,
      icon: 'checkmark-circle-outline',
    },
    closed: {
      label: 'Cerrado',
      color: colors.textSecondary,
      icon: 'archive-outline',
    },
    active: {
      label: 'Activo',
      color: colors.accent,
      icon: 'checkmark-circle-outline',
    },
    inactive: {
      label: 'Inactivo',
      color: colors.red,
      icon: 'close-circle-outline',
    },
    healthy: {
      label: 'Operativo',
      color: colors.accent,
      icon: 'checkmark-circle-outline',
    },
    warning: {
      label: 'Advertencia',
      color: colors.orange,
      icon: 'warning-outline',
    },
    error: {
      label: 'Error',
      color: colors.red,
      icon: 'alert-circle-outline',
    },
  };

  return (
    configs[status] || {
      label: status || 'Sin estado',
      color: colors.textSecondary,
      icon: 'help-circle-outline',
    }
  );
};

export const getInitials = (name = '') => {
  const cleanName = String(name).trim();

  if (!cleanName) {
    return 'U';
  }

  return cleanName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();
};

export const formatAdminDate = (
  value,
  options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }
) => {
  if (!value) {
    return '-';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString('es-AR', options);
};

export const formatAdminDateTime = (value) => {
  if (!value) {
    return '-';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
