"use client";

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Definim stilurile (seamănă cu CSS / React Native)
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    backgroundColor: "#f9fafb",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 10,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2563eb", // un albastru profesional
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1f2937",
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#ffffff",
    borderRadius: 8,
  },
  label: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    color: "#111827",
    marginBottom: 10,
  },
  mechanicText: {
    fontSize: 12,
    lineHeight: 1.5,
    color: "#374151",
  },
  imagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },
  image: {
    width: 240,
    height: 160,
    objectFit: "cover",
    borderRadius: 4,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 10,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
  },
});

// Aici definim tipurile pe care le așteaptă componenta
interface PdfReportProps {
  inspection: {
    id: string;
    carMake: string | null;
    carModel: string | null;
    reportDetails: string | null;
    photosUrls: string | null;
    createdAt: Date | string;
  };
}

const PdfReport: React.FC<PdfReportProps> = ({ inspection }) => {
  // Transformăm string-ul de poze într-un array
  const photos = inspection.photosUrls ? inspection.photosUrls.split(",") : [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Antetul Documentului */}
        <View style={styles.header}>
          <Text style={styles.logoText}>CarCheck</Text>
          <Text style={{ fontSize: 12, color: "#6b7280" }}>
            Data: {new Date(inspection.createdAt).toLocaleDateString("ro-RO")}
          </Text>
        </View>

        <Text style={styles.title}>Raport de Inspecție Auto</Text>

        {/* Detalii Mașină */}
        <View style={styles.section}>
          <Text style={styles.label}>Vehicul verificat</Text>
          <Text style={styles.value}>
            {inspection.carMake} {inspection.carModel}
          </Text>

          <Text style={styles.label}>ID Referință Cerere</Text>
          <Text style={styles.value}>{inspection.id}</Text>
        </View>

        {/* Concluzia Mecanicului */}
        <View style={styles.section}>
          <Text style={styles.label}>Raport Tehnic / Concluzii</Text>
          <Text style={styles.mechanicText}>
            {inspection.reportDetails || "Nu există detalii înregistrate încă."}
          </Text>
        </View>

        {/* Fotografii Atașate (dacă există) */}
        {photos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.label}>Fotografii de la inspecție</Text>
            <View style={styles.imagesContainer}>
              {photos.map((url, index) => (
                <Image key={index} src={url.trim()} style={styles.image} />
              ))}
            </View>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          Generat automat de platforma CarCheck. Acest document reprezintă
          părerea profesională a mecanicului partener.
        </Text>
      </Page>
    </Document>
  );
};

export default PdfReport;
