import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  bg: '#0D0F14',
  surface: '#161A23',
  border: '#272D3D',
  accent: '#4ADE80',
  textPrimary: '#F0F2F7',
  textSecondary: '#9CA3AF',
};

export default function TermsScreen({ navigation }) {
  return (
    <View style={styles.flex}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={22} color={COLORS.accent} />
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Términos y condiciones</Text>
        <Text style={styles.updated}>Última actualización: Junio 2026</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>1. Uso de Spendly</Text>
          <Text style={styles.paragraph}>
            Spendly es una aplicación de gestión financiera personal diseñada
            para registrar ingresos, gastos y visualizar información básica
            sobre el ahorro del usuario.
          </Text>

          <Text style={styles.sectionTitle}>2. Registro de información</Text>
          <Text style={styles.paragraph}>
            El usuario es responsable de ingresar información correcta y
            verificar los datos antes de guardarlos, especialmente cuando se
            utilicen funciones de escaneo de tickets mediante OCR o inteligencia
            artificial.
          </Text>

          <Text style={styles.sectionTitle}>3. Seguridad de la cuenta</Text>
          <Text style={styles.paragraph}>
            El usuario debe mantener la confidencialidad de sus credenciales de
            acceso. Spendly no solicitará contraseñas fuera de la pantalla de
            inicio de sesión.
          </Text>

          <Text style={styles.sectionTitle}>4. Uso de OCR e IA</Text>
          <Text style={styles.paragraph}>
            Las funciones de OCR e inteligencia artificial pueden asistir en la
            carga automática de gastos, pero sus resultados pueden no ser
            exactos. El usuario deberá confirmar o corregir la información antes
            de guardarla.
          </Text>

          <Text style={styles.sectionTitle}>5. Limitación de responsabilidad</Text>
          <Text style={styles.paragraph}>
            Spendly tiene fines educativos y de organización personal. La
            aplicación no reemplaza asesoramiento financiero, contable o legal
            profesional.
          </Text>

          <Text style={styles.sectionTitle}>6. Cambios futuros</Text>
          <Text style={styles.paragraph}>
            Estos términos podrán actualizarse a medida que se incorporen nuevas
            funcionalidades al proyecto.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.bg },
  container: {
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    alignSelf: 'flex-start',
  },
  backText: {
    color: COLORS.accent,
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  updated: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 24,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 22,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 18,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
}); 