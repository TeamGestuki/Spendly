import React, {
  useMemo,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';

import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const API_BASE_URL =
  'https://spendly-production-1793.up.railway.app';

export default function ScanScreen({ navigation }) {
    const {
    colors: COLORS,
    isDark,
  } = useTheme();

  const styles = useMemo(
    () => createStyles(COLORS),
    [COLORS]
  );
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState(null);

  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permiso requerido',
        'Necesitamos acceso a tu galería.'
      );
      return;
    }

    const response =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

    if (!response.canceled) {
      setImage(response.assets[0].uri);
      setResult(null);
    }
  };

  const takePhoto = async () => {
    const permission =
      await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permiso requerido',
        'Necesitamos acceso a tu cámara.'
      );
      return;
    }

    const response =
      await ImagePicker.launchCameraAsync({
        quality: 0.8,
      });

    if (!response.canceled) {
      setImage(response.assets[0].uri);
      setResult(null);
    }
  };

  const analyzeTicket = async () => {
    if (!image) return;

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append('file', {
        uri: image,
        name: 'ticket.jpg',
        type: 'image/jpeg',
      });

      const response = await fetch(
        `${API_BASE_URL}/api/v1/scan/ticket`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const data = await response.json();

      console.log('SCAN RESPONSE:', data);

      if (
        data.status === 'error'
      ) {
        Alert.alert(
          'Error',
          data.message
        );

        return;
      }

      setResult(data.data);

    } catch (error) {
      console.log(error);

      Alert.alert(
        'Error',
        'No se pudo analizar el ticket.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={
          isDark
            ? 'light-content'
            : 'dark-content'
        }
        backgroundColor={COLORS.bg}
      />

      <ScrollView
        contentContainerStyle={styles.content}
      >

    <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        >
        <Ionicons
            name="arrow-back"
            size={24}
            color={COLORS.textPrimary}
        />

        <Text style={styles.backText}>
            Volver
        </Text>
    </TouchableOpacity>

        <Text style={styles.title}>
          Escanear ticket
        </Text>

        <Text style={styles.subtitle}>
          Sacá una foto o elegí una imagen de tu ticket o comprobante de compra para poder extraer sus datos.
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={takePhoto}
          >
            <Ionicons
              name="camera-outline"
              size={22}
              color={COLORS.textPrimary}
            />

            <Text style={styles.actionText}>
              Cámara
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={pickImage}
          >
            <Ionicons
              name="image-outline"
              size={22}
              color={COLORS.textPrimary}
            />

            <Text style={styles.actionText}>
              Galería
            </Text>
          </TouchableOpacity>
        </View>

        {image && (
          <>
            <Image
              source={{ uri: image }}
              style={styles.preview}
            />

            <TouchableOpacity
              style={styles.scanBtn}
              onPress={analyzeTicket}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#0D1A12" />
              ) : (
                <>
                  <Ionicons
                    name="sparkles-outline"
                    size={22}
                    color="#0D1A12"
                  />

                  <Text style={styles.scanBtnText}>
                    Analizar ticket
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </>
        )}

        {result && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>
              Resultado IA
            </Text>

            <Info
              styles={styles}
              label="Monto"
              value={`${result.currency} ${result.amount}`}
            />

            <Info
              styles={styles}
              label="Categoría"
              value={result.category}
            />

            <Info
              styles={styles}
              label="Descripción"
              value={result.description}
            />

            <Info
              styles={styles}
              label="Fecha"
              value={result.date}
            />

            <View style={styles.successBox}>
              <Ionicons
                name="checkmark-circle"
                size={22}
                color={COLORS.accent}
              />

              <Text style={styles.successText}>
                Ticket procesado correctamente
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function Info({
  label,
  value,
  styles,
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>
        {label}
      </Text>

      <Text style={styles.infoValue}>
        {value || '-'}
      </Text>
    </View>
  );
}

function createStyles(COLORS) {
  return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  content: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 60,
  },

backButton: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  marginBottom: 24,
},

backText: {
  color: COLORS.textPrimary,
  fontSize: 15,
  fontWeight: '700',
},

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },

  subtitle: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.textSecondary,
  },

  actions: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 28,
  },

  actionBtn: {
    flex: 1,
    height: 62,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionText: {
    marginTop: 6,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },

  preview: {
    width: '100%',
    height: 420,
    borderRadius: 24,
    marginTop: 28,
  },

  scanBtn: {
    marginTop: 22,
    height: 60,
    borderRadius: 20,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },

  scanBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0D1A12',
  },

  resultCard: {
    marginTop: 28,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  resultTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 18,
  },

  infoRow: {
    marginBottom: 16,
  },

  infoLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },

  successBox: {
    marginTop: 18,
    backgroundColor: COLORS.accentSoft,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  successText: {
    color: COLORS.accent,
    fontWeight: '700',
  },
  });
}