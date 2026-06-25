import React, { useCallback, useState, TextInput} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import {
  getActiveSessions,
  revokeSession,
  revokeOtherSessions,
} from '../services/authService';

const COLORS = {
  bg: '#0D0F14',
  surface: '#161A23',
  surfaceHigh: '#1E2330',
  border: '#272D3D',
  accent: '#4ADE80',
  accentDim: '#1A3D28',
  textPrimary: '#F0F2F7',
  textSecondary: '#9CA3AF',
  textMuted: '#6B748A',
  red: '#F87171',
  blue: '#60A5FA',
  orange: '#FB923C',
};

function AppIcon({ name, size = 20, color = COLORS.textSecondary }) {
  return <Ionicons name={name} size={size} color={color} />;
}

function formatDate(value) {
  if (!value) return 'Sin datos';

  try {
    const date = new Date(value);

    return date.toLocaleString('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Sin datos';
  }
}

function getDeviceLabel(session) {
  if (session.device_name) return session.device_name;

  const agent = session.user_agent || '';

  if (agent.includes('iPhone')) return 'iPhone';
  if (agent.includes('Android')) return 'Android';
  if (agent.includes('Windows')) return 'Windows';
  if (agent.includes('Mac')) return 'Mac';
  if (agent.includes('Linux')) return 'Linux';

  return 'Dispositivo desconocido';
}

function getDeviceIcon(session) {
  const text = `${session.device_name || ''} ${session.user_agent || ''}`;

  if (text.includes('iPhone') || text.includes('Android')) {
    return 'phone-portrait-outline';
  }

  if (text.includes('Windows') || text.includes('Mac') || text.includes('Linux')) {
    return 'desktop-outline';
  }

  return 'hardware-chip-outline';
}

export default function SessionsScreen({ navigation }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedSession, setSelectedSession] = useState(null);
  const [confirmAllVisible, setConfirmAllVisible] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const loadSessions = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError('');

      const data = await getActiveSessions();
      setSessions(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || 'No se pudieron cargar las sesiones.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSessions(false);
    }, [])
  );

  const currentSession = sessions.find((s) => s.is_current);
  const otherSessions = sessions.filter((s) => !s.is_current);

  const handleRevokeSession = async () => {
    if (!selectedSession) return;

    try {
      setActionLoading(true);

      if (!password) {
        setPasswordError('Ingresá tu contraseña.');
        return;
      }

      await revokeSession(selectedSession.id, password);
      setPassword('');
      setPasswordError('');

      setSelectedSession(null);
      await loadSessions(false);
    } catch (e) {
      setError(e.message || 'No se pudo cerrar la sesión.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRevokeOthers = async () => {
    try {
      setActionLoading(true);

      if (!password) {
        setPasswordError('Ingresá tu contraseña.');
        return;
      }

      await revokeOtherSessions(password);
      setPassword('');
      setPasswordError('');

      setConfirmAllVisible(false);
      await loadSessions(false);
    } catch (e) {
      setError(e.message || 'No se pudieron cerrar las sesiones.');
    } finally {
      setActionLoading(false);
    }
  };

  const renderSessionCard = (session) => {
    const isCurrent = !!session.is_current;

    return (
      <View key={session.id} style={styles.sessionCard}>
        <View style={styles.sessionHeader}>
          <View
            style={[
              styles.deviceIcon,
              {
                backgroundColor: isCurrent
                  ? COLORS.accentDim
                  : 'rgba(96,165,250,0.12)',
              },
            ]}
          >
            <AppIcon
              name={getDeviceIcon(session)}
              size={22}
              color={isCurrent ? COLORS.accent : COLORS.blue}
            />
          </View>

          <View style={styles.sessionBody}>
            <View style={styles.sessionTitleRow}>
              <Text style={styles.deviceName}>
                {getDeviceLabel(session)}
              </Text>

              {isCurrent && (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentBadgeText}>Actual</Text>
                </View>
              )}
            </View>

            <Text style={styles.sessionDetail}>
              IP: {session.ip_address || 'Sin datos'}
            </Text>

            <Text style={styles.sessionDetail}>
              Última actividad: {formatDate(session.last_seen_at)}
            </Text>

            <Text style={styles.sessionDetail}>
              Creada: {formatDate(session.created_at)}
            </Text>
          </View>
        </View>

        {!isCurrent && (
          <TouchableOpacity
            style={styles.closeSessionBtn}
            onPress={() => setSelectedSession(session)}
            activeOpacity={0.8}
          >
            <AppIcon name="log-out-outline" size={17} color={COLORS.red} />
            <Text style={styles.closeSessionText}>Cerrar sesión</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <AppIcon name="chevron-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.topBarTitle}>Dispositivos conectados</Text>

        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={COLORS.accent} />
          <Text style={styles.loadingText}>Cargando sesiones...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadSessions(true)}
              tintColor={COLORS.accent}
            />
          }
        >
          <View style={styles.heroCard}>
            <View style={styles.heroIcon}>
              <AppIcon name="shield-checkmark-outline" size={28} color={COLORS.accent} />
            </View>

            <Text style={styles.heroTitle}>Sesiones activas</Text>

            <Text style={styles.heroText}>
              Revisá los dispositivos donde tu cuenta está iniciada y cerrá accesos que no reconozcas.
            </Text>
          </View>

          {!!error && (
            <View style={styles.errorBox}>
              <AppIcon name="alert-circle-outline" size={18} color={COLORS.red} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Text style={styles.sectionTitle}>Sesión actual</Text>

          {currentSession ? (
            renderSessionCard(currentSession)
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No se detectó la sesión actual.</Text>
            </View>
          )}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Otros dispositivos</Text>

            {otherSessions.length > 0 && (
              <TouchableOpacity
                onPress={() => setConfirmAllVisible(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.closeAllText}>Cerrar todas</Text>
              </TouchableOpacity>
            )}
          </View>

          {otherSessions.length > 0 ? (
            otherSessions.map(renderSessionCard)
          ) : (
            <View style={styles.emptyCard}>
              <AppIcon name="checkmark-circle-outline" size={26} color={COLORS.accent} />
              <Text style={styles.emptyTitle}>Todo en orden</Text>
              <Text style={styles.emptyText}>
                No hay otros dispositivos conectados a tu cuenta.
              </Text>
            </View>
          )}

          <Text style={styles.infoText}>
            Si cerrás una sesión, ese dispositivo tendrá que volver a iniciar sesión.
          </Text>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      <Modal
        visible={!!selectedSession}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedSession(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModal}>
            <View style={styles.modalIcon}>
              <AppIcon name="log-out-outline" size={26} color={COLORS.red} />
            </View>

            <Text style={styles.modalTitle}>Cerrar sesión</Text>

            <Text style={styles.modalText}>
              ¿Querés cerrar sesión en este dispositivo?
            </Text>

            <Text style={styles.modalDeviceName}>
              {selectedSession ? getDeviceLabel(selectedSession) : ''}
            </Text>

            <TextInput
              style={styles.passwordInput}
              placeholder="Contraseña actual"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError('');
              }}
            />

            {!!passwordError && (
              <Text style={styles.passwordError}>
                {passwordError}
              </Text>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setSelectedSession(null)}
                disabled={actionLoading}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={handleRevokeSession}
                disabled={actionLoading}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmText}>
                  {actionLoading ? 'Cerrando...' : 'Cerrar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={confirmAllVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmAllVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModal}>
            <View style={styles.modalIcon}>
              <AppIcon name="exit-outline" size={26} color={COLORS.red} />
            </View>

            <Text style={styles.modalTitle}>Cerrar otras sesiones</Text>

            <Text style={styles.modalText}>
              Esto cerrará tu cuenta en todos los demás dispositivos, pero mantendrá esta sesión activa.
            </Text>

            <TextInput
                style={styles.passwordInput}
                placeholder="Contraseña actual"
                placeholderTextColor={COLORS.textMuted}
                secureTextEntry
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordError('');
                }}
              />

              {!!passwordError && (
                <Text style={styles.passwordError}>
                  {passwordError}
                </Text>
              )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setConfirmAllVisible(false)}
                disabled={actionLoading}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={handleRevokeOthers}
                disabled={actionLoading}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmText}>
                  {actionLoading ? 'Cerrando...' : 'Cerrar todas'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: COLORS.bg,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 30,
  },

  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },

  heroCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.16)',
    padding: 22,
    marginBottom: 24,
    alignItems: 'center',
  },
  heroIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  heroText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(248,113,113,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.25)',
    borderRadius: 16,
    padding: 12,
    gap: 8,
    marginBottom: 18,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.red,
    lineHeight: 17,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 2,
  },
  closeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.red,
    marginBottom: 10,
  },

  sessionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 14,
  },
  sessionHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  deviceIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionBody: {
    flex: 1,
  },
  sessionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 5,
  },
  deviceName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  currentBadge: {
    backgroundColor: COLORS.accentDim,
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.25)',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  currentBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.accent,
  },
  sessionDetail: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },

  closeSessionBtn: {
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(248,113,113,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  closeSessionText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.red,
  },

  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    marginBottom: 18,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 8,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },

  infoText: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 18,
    textAlign: 'center',
    paddingHorizontal: 10,
    marginTop: 4,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  confirmModal: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 24,
    alignItems: 'center',
  },
  modalIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(248,113,113,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  modalDeviceName: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 22,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 10,
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceHigh,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  confirmBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(248,113,113,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.red,
  },

passwordInput: {
  width: '100%',
  height: 48,
  borderRadius: 14,
  backgroundColor: COLORS.surfaceHigh,
  borderWidth: 1,
  borderColor: COLORS.border,
  paddingHorizontal: 14,
  color: COLORS.textPrimary,
  fontSize: 14,
  marginTop: 8,
},

passwordError: {
  width: '100%',
  fontSize: 12,
  color: COLORS.red,
  marginTop: 8,
  textAlign: 'left',
},
});