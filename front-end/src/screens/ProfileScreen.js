/**
 * ProfileScreen.js
 * Pantalla de perfil y configuración de Spendly.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Switch,
  Modal,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  purple: '#C084FC',
};

const USER = {
  name: 'Pedro Díaz',
  email: 'pedro.diaz@gmail.com',
  initials: 'PD',
  plan: 'Cuenta activa',
};

function AppIcon({ name, size = 20, color = COLORS.textSecondary }) {
  return <Ionicons name={name} size={size} color={color} />;
}

function SettingItem({
  icon,
  iconColor = COLORS.accent,
  label,
  value,
  onPress,
  isLast,
  rightElement,
}) {
  return (
    <TouchableOpacity
      style={[styles.settingItem, isLast && styles.settingItemLast]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={[styles.settingIconWrapper, { backgroundColor: `${iconColor}18` }]}>
        <AppIcon name={icon} size={18} color={iconColor} />
      </View>

      <View style={styles.settingBody}>
        <Text style={styles.settingLabel}>{label}</Text>
        {!!value && <Text style={styles.settingValue}>{value}</Text>}
      </View>

      {rightElement || (
        <AppIcon name="chevron-forward" size={16} color={COLORS.textMuted} />
      )}
    </TouchableOpacity>
  );
}

export default function ProfileScreen({ navigation }) {
  const [darkModeOn, setDarkModeOn] = useState(true);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = async () => {
    await AsyncStorage.removeItem('access_token');
    setLogoutModalVisible(false);
    navigation.replace('Login');
  };

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mi Perfil</Text>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <AppIcon name="create-outline" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.heroCard}>
          <TouchableOpacity
            style={styles.avatarRing}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarText}>{USER.initials}</Text>
            </View>

            <View style={styles.avatarEditBadge}>
              <AppIcon name="camera-outline" size={13} color="#0D1A12" />
            </View>
          </TouchableOpacity>

          <Text style={styles.heroName}>{USER.name}</Text>
          <Text style={styles.heroEmail}>{USER.email}</Text>

          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{USER.plan}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Cuenta</Text>
        <View style={styles.card}>
          <SettingItem
            icon="person-outline"
            iconColor={COLORS.accent}
            label="Editar datos personales"
            value="Nombre, email y foto de perfil"
            onPress={() => navigation.navigate('EditProfile')}
          />

          <SettingItem
            icon="lock-closed-outline"
            iconColor={COLORS.blue}
            label="Cambiar contraseña"
            value="Actualizá tu clave de acceso"
            onPress={() => navigation.navigate('ChangePassword')}
          />

          <SettingItem
            icon="shield-checkmark-outline"
            iconColor={COLORS.purple}
            label="Seguridad y acceso"
            value="Sesiones, bloqueo y autenticación"
            onPress={() => navigation.navigate('SecuritySettings')}
            isLast
          />
        </View>

        <Text style={styles.sectionTitle}>Preferencias</Text>
        <View style={styles.card}>
          <SettingItem
            icon="moon-outline"
            iconColor={COLORS.purple}
            label="Modo oscuro"
            value={darkModeOn ? 'Activado' : 'Desactivado'}
            onPress={() => setDarkModeOn(v => !v)}
            rightElement={
              <Switch
                value={darkModeOn}
                onValueChange={setDarkModeOn}
                trackColor={{ false: COLORS.border, true: COLORS.accentDim }}
                thumbColor={darkModeOn ? COLORS.accent : COLORS.textMuted}
                ios_backgroundColor={COLORS.border}
              />
            }
          />

          <SettingItem
            icon="cash-outline"
            iconColor={COLORS.orange}
            label="Moneda principal"
            value="ARS — Peso argentino"
            onPress={() => navigation.navigate('CurrencySettings')}
          />

          <SettingItem
            icon="language-outline"
            iconColor={COLORS.blue}
            label="Idioma"
            value="Español"
            onPress={() => navigation.navigate('LanguageSettings')}
          />

          <SettingItem
            icon="notifications-outline"
            iconColor={COLORS.orange}
            label="Notificaciones"
            value="Alertas, recordatorios y resúmenes"
            onPress={() => navigation.navigate('NotificationSettings')}
            isLast
          />
        </View>

        <Text style={styles.sectionTitle}>Datos y privacidad</Text>
        <View style={styles.card}>
          <SettingItem
            icon="download-outline"
            iconColor={COLORS.accent}
            label="Exportar datos"
            value="Descargar gastos, ingresos y reportes"
            onPress={() => navigation.navigate('ExportData')}
          />

          <SettingItem
            icon="eye-off-outline"
            iconColor={COLORS.blue}
            label="Privacidad"
            value="Control de datos personales"
            onPress={() => navigation.navigate('Privacy')}
          />

          <SettingItem
            icon="document-text-outline"
            iconColor={COLORS.purple}
            label="Términos y condiciones"
            value="Condiciones de uso de Spendly"
            onPress={() => navigation.navigate('Terms')}
            isLast
          />
        </View>

        <Text style={styles.sectionTitle}>Soporte</Text>
        <View style={styles.card}>
          <SettingItem
            icon="help-circle-outline"
            iconColor={COLORS.blue}
            label="Centro de ayuda"
            value="Preguntas frecuentes y guías"
            onPress={() => navigation.navigate('HelpCenter')}
          />

          <SettingItem
            icon="bug-outline"
            iconColor={COLORS.orange}
            label="Reportar un problema"
            value="Avisanos si algo no funciona"
            onPress={() => navigation.navigate('ReportProblem')}
          />

          <SettingItem
            icon="information-circle-outline"
            iconColor={COLORS.purple}
            label="Acerca de Spendly"
            value="Versión 1.0.0"
            onPress={() => navigation.navigate('AboutSpendly')}
            isLast
          />
        </View>

        <Text style={styles.sectionTitle}>Sesión</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <AppIcon name="log-out-outline" size={20} color={COLORS.red} />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

        <View style={{ height: 90 }} />
      </ScrollView>

      <Modal
        visible={logoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.logoutModal}>
            <View style={styles.modalIconWrapper}>
              <AppIcon name="log-out-outline" size={26} color={COLORS.red} />
            </View>

            <Text style={styles.modalTitle}>Cerrar sesión</Text>

            <Text style={styles.modalText}>
              ¿Estás seguro de que querés cerrar sesión en Spendly?
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setLogoutModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmLogoutButton}
                onPress={confirmLogout}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmLogoutText}>Cerrar sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <AppIcon name="home-outline" size={24} color={COLORS.textMuted} />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <AppIcon name="card-outline" size={24} color={COLORS.textMuted} />
          <Text style={styles.navLabel}>Gastos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navScanWrapper} activeOpacity={0.85}>
          <View style={styles.navScanBtn}>
            <AppIcon name="scan-outline" size={26} color="#0D1A12" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <AppIcon name="bar-chart-outline" size={24} color={COLORS.textMuted} />
          <Text style={styles.navLabel}>Stats</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <AppIcon name="flag-outline" size={24} color={COLORS.textMuted} />
          <Text style={styles.navLabel}>Metas</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { paddingHorizontal: 20, paddingTop: 56 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  heroCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.15)',
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  avatarRing: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    borderColor: 'rgba(74,222,128,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    position: 'relative',
  },
  avatarFallback: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: COLORS.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.accent,
  },
  avatarEditBadge: {
    position: 'absolute',
    right: -2,
    bottom: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  heroName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  heroEmail: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentDim,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.25)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accent,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: COLORS.accent,
    fontWeight: '600',
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
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 12,
  },
  settingItemLast: {
    borderBottomWidth: 0,
  },
  settingIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  settingBody: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  settingValue: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  logoutBtn: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.25)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 10,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.red,
  },

  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(22,26,35,0.97)',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 24,
    paddingTop: 12,
    paddingHorizontal: 20,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  navLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  navScanWrapper: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 8,
  },
  navScanBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    marginTop: -28,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoutModal: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 24,
    alignItems: 'center',
  },
  modalIconWrapper: {
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
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceHigh,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  confirmLogoutButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(248,113,113,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmLogoutText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.red,
  },
});