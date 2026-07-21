import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { getAdminActivity } from '../../services/adminService';

// Componentes y utilidades auxiliares
const Icon = ({ name, size = 20, color }) => (
  <Ionicons name={name} size={size} color={color} />
);

const listOf = (r) =>
  Array.isArray(r) ? r : r?.items || r?.activity || r?.logs || r?.results || [];

const date = (v) => {
  if (!v) return '-';
  const d = new Date(v);
  return isNaN(d) ? String(v) : d.toLocaleString('es-AR');
};

function cfg(a, C) {
  a = String(a || '').toLowerCase();
  if (a.includes('role')) return ['Cambio de rol', 'shield-checkmark-outline', C.purple];
  if (a.includes('reply')) return ['Respuesta de soporte', 'chatbox-ellipses-outline', C.accent];
  if (a.includes('report')) return ['Gestión de reporte', 'document-text-outline', C.orange];
  if (a.includes('email')) return ['Prueba de correo', 'mail-outline', C.orange];
  if (a.includes('notification')) return ['Prueba de notificación', 'notifications-outline', C.purple];
  if (a.includes('user')) return ['Gestión de usuario', 'person-circle-outline', C.blue];
  return [a || 'Acción administrativa', 'settings-outline', C.textSecondary];
}

function Card({ x, s, C }) {
  const [t, icon, color] = cfg(x?.action, C);
  const admin = x?.admin?.full_name || x?.admin_name || x?.admin_email || `Admin #${x?.admin_id ?? '-'}`;
  const target = x?.target_type ? `${x.target_type}${x.target_id != null ? ` #${x.target_id}` : ''}` : 'Sin objetivo';
  const details = typeof x?.details === 'string' ? x.details : x?.details ? JSON.stringify(x.details) : '';

  return (
    <View style={s.card}>
      <View style={[s.icon, { backgroundColor: `${color}16` }]}>
        <Icon name={icon} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.cardTitle}>{t}</Text>
        <Text style={s.admin}>{admin}</Text>
        <Text style={s.target}>{target}</Text>
        {!!details && <Text style={s.details}>{details}</Text>}
        <Text style={s.date}>{date(x?.created_at)}</Text>
      </View>
    </View>
  );
}

// Pantalla principal
export default function AdminActivityScreen({ navigation }) {
  const { colors: C, isDark } = useTheme();
  const s = useMemo(() => styles(C), [C]);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setError('');
      setData(listOf(await getAdminActivity()));
    } catch (e) {
      setError(e?.message || 'No se pudo cargar la actividad.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <SafeAreaView edges={['top']} style={s.flex}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={C.bg} />
      
      <View style={s.header}>
        <TouchableOpacity style={s.back} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" color={C.textPrimary} />
        </TouchableOpacity>
        <View style={{ marginLeft: 13 }}>
          <Text style={s.title}>Actividad</Text>
          <Text style={s.subtitle}>Auditoría administrativa</Text>
        </View>
      </View>

      {loading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color={C.accent} />
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(x, i) => String(x?.id ?? i)}
          renderItem={({ item }) => <Card x={item} s={s} C={C} />}
          ListHeaderComponent={
            <>
              <View style={s.info}>
                <Icon name="information-circle-outline" color={C.blue} />
                <Text style={s.infoText}>
                  Historial de cambios de usuarios, reportes y pruebas del sistema.
                </Text>
              </View>
              {!!error && (
                <View style={s.error}>
                  <Text style={s.errorText}>{error}</Text>
                </View>
              )}
              <Text style={s.count}>{data.length} acciones cargadas</Text>
            </>
          }
          ListEmptyComponent={
            <View style={s.empty}>
              <Icon name="time-outline" size={36} color={C.textMuted} />
              <Text style={s.emptyTitle}>Todavía no hay actividad</Text>
              <Text style={s.emptyText}>Las acciones administrativas aparecerán acá.</Text>
            </View>
          }
          ListFooterComponent={<Text style={s.footer}>Spendly © 2026</Text>}
          contentContainerStyle={s.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                load(true);
              }}
              tintColor={C.accent}
              colors={[C.accent]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

// Estilos de la pantalla
function styles(C) {
  return StyleSheet.create({
    flex: {
      flex: 1,
      backgroundColor: C.bg
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 18,
      borderBottomWidth: 1,
      borderBottomColor: C.border
    },
    back: {
      width: 42,
      height: 42,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: C.surface,
      borderWidth: 1,
      borderColor: C.border
    },
    title: {
      color: C.textPrimary,
      fontSize: 20,
      fontWeight: '800'
    },
    subtitle: {
      color: C.textSecondary,
      fontSize: 12,
      marginTop: 2
    },
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    content: {
      padding: 18,
      flexGrow: 1
    },
    info: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: `${C.blue}10`,
      borderWidth: 1,
      borderColor: `${C.blue}30`,
      borderRadius: 15,
      padding: 13,
      marginBottom: 13
    },
    infoText: {
      flex: 1,
      color: C.textSecondary,
      fontSize: 12,
      lineHeight: 18,
      marginLeft: 10
    },
    count: {
      color: C.textMuted,
      fontSize: 11,
      marginBottom: 10
    },
    card: {
      flexDirection: 'row',
      backgroundColor: C.surface,
      borderWidth: 1,
      borderColor: C.border,
      borderRadius: 18,
      padding: 14,
      marginBottom: 10
    },
    icon: {
      width: 43,
      height: 43,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12
    },
    cardTitle: {
      color: C.textPrimary,
      fontSize: 14,
      fontWeight: '800'
    },
    admin: {
      color: C.textSecondary,
      fontSize: 11,
      marginTop: 3
    },
    target: {
      color: C.textMuted,
      fontSize: 10,
      marginTop: 2
    },
    details: {
      color: C.textSecondary,
      fontSize: 11,
      lineHeight: 17,
      marginTop: 9,
      backgroundColor: C.bg,
      borderRadius: 11,
      padding: 9
    },
    date: {
      color: C.textMuted,
      fontSize: 10,
      marginTop: 9
    },
    error: {
      backgroundColor: `${C.red}10`,
      borderWidth: 1,
      borderColor: `${C.red}35`,
      borderRadius: 14,
      padding: 12,
      marginBottom: 12
    },
    errorText: {
      color: C.textSecondary
    },
    empty: {
      alignItems: 'center',
      paddingVertical: 55
    },
    emptyTitle: {
      color: C.textPrimary,
      fontSize: 16,
      fontWeight: '800',
      marginTop: 12
    },
    emptyText: {
      color: C.textSecondary,
      fontSize: 13,
      marginTop: 5,
      textAlign: 'center'
    },
    footer: {
      color: C.textMuted,
      fontSize: 12,
      textAlign: 'center',
      marginTop: 22
    }
  });
}
