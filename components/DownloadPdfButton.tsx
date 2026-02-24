"use client";

import React, { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfReport from "./PdfReport";

export default function DownloadPdfButton({ inspection }: { inspection: any }) {
  const [isClient, setIsClient] = useState(false);

  // Previne erorile de hydration din Next.js
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <button
        disabled
        className="bg-gray-100 text-gray-500 py-2 px-4 rounded-lg border border-gray-300 shadow-sm"
      >
        ⏳ Se pregătește PDF-ul...
      </button>
    );
  }

  return (
    <PDFDownloadLink
      document={<PdfReport inspection={inspection} />}
      fileName={`Raport_CarCheck_${inspection.carMake || "Auto"}_${inspection.carModel || ""}.pdf`}
    >
      {({ loading }) =>
        loading ? (
          <button className="bg-blue-400 text-white font-semibold py-2 px-6 rounded-lg shadow-md cursor-wait">
            Se generează...
          </button>
        ) : (
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all border border-blue-800">
            📄 Descarcă PDF
          </button>
        )
      }
    </PDFDownloadLink>
  );
}
