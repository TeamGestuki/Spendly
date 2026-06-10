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

export default function PrivacyScreen({ navigation }) {
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

        <Text style={styles.title}>Política de privacidad</Text>
        <Text style={styles.updated}>Última actualización: Junio 2026</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>1. Información que recopilamos</Text>
          <Text style={styles.paragraph}>
            Spendly puede almacenar datos necesarios para el funcionamiento de
            la aplicación, como correo electrónico, ingresos, gastos,
            categorías, fechas, descripciones y datos obtenidos desde tickets o
            comprobantes.
          </Text>

          <Text style={styles.sectionTitle}>2. Uso de la información</Text>
          <Text style={styles.paragraph}>
            La información se utiliza para mostrar resúmenes financieros,
            calcular gastos, ingresos, ahorro mensual y mejorar la organización
            personal del usuario dentro de la app.
          </Text>

          <Text style={styles.sectionTitle}>3. Tickets, OCR e inteligencia artificial</Text>
          <Text style={styles.paragraph}>
            Cuando el usuario cargue una imagen de un ticket o comprobante, la
            app podrá procesarla mediante OCR e inteligencia artificial para
            extraer información como monto, categoría y descripción. El usuario
            podrá revisar y corregir los datos antes de guardarlos.
          </Text>

          <Text style={styles.sectionTitle}>4. Protección de datos</Text>
          <Text style={styles.paragraph}>
            Spendly busca proteger la información del usuario mediante
            autenticación y manejo seguro de contraseñas. Las contraseñas no se
            almacenan en texto plano.
          </Text>

          <Text style={styles.sectionTitle}>5. Compartir información</Text>
          <Text style={styles.paragraph}>
            Spendly no vende ni comparte información personal del usuario con
            terceros. Los datos se utilizan únicamente para las funcionalidades
            principales de la aplicación.
          </Text>

          <Text style={styles.sectionTitle}>6. Responsabilidad del usuario</Text>
          <Text style={styles.paragraph}>
            El usuario debe verificar la información ingresada o detectada
            automáticamente antes de guardarla, especialmente cuando provenga de
            tickets procesados mediante OCR o IA.
          </Text>

          <Text style={styles.sectionTitle}>7. Proyecto académico</Text>
          <Text style={styles.paragraph}>
            Spendly es un proyecto académico en desarrollo. Algunas
            funcionalidades pueden cambiar, ampliarse o ajustarse en futuras
            versiones.
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