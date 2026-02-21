"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { uploadFiles } from "@/utils/uploadthing";
import { submitDetailedReport } from "@/actions/inspections";

export default function DetailedReportPage() {
  const params = useParams();
  const inspectionId = params.id as string;
  const router = useRouter();

  // State-uri pentru text și fișiere
  const [reportText, setReportText] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [engineMedia, setEngineMedia] = useState<File | null>(null);
  const [diagnosticFile, setDiagnosticFile] = useState<File | null>(null);
  const [model3d, setModel3d] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText) {
      toast.error("Te rugăm să scrii concluziile inspecției.");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading(
      "Se încarcă fișierele pe server (poate dura câteva momente)...",
    );

    try {
      // Variabile pentru a ține link-urile finale
      let photosUrls = "";
      let engineMediaUrl = "";
      let diagnosticUrl = "";
      let model3dUrl = "";

      // 1. Încărcăm Pozele
      if (photos.length > 0) {
        toast.loading("Încărcăm pozele...", { id: toastId });
        const res = await uploadFiles("carImages", { files: photos });
        photosUrls = res.map((file) => file.url).join(","); // Le unim cu virgulă
      }

      // 2. Încărcăm Video/Audio Motor
      if (engineMedia) {
        toast.loading("Încărcăm sunetul motorului...", { id: toastId });
        const res = await uploadFiles("engineMedia", { files: [engineMedia] });
        engineMediaUrl = res[0].url;
      }

      // 3. Încărcăm Diagnoza
      if (diagnosticFile) {
        toast.loading("Încărcăm rezultatul diagnozei...", { id: toastId });
        const res = await uploadFiles("diagnosticFile", {
          files: [diagnosticFile],
        });
        diagnosticUrl = res[0].url;
      }

      // 4. Încărcăm Modelul 3D
      if (model3d) {
        toast.loading("Încărcăm modelul 3D...", { id: toastId });
        const res = await uploadFiles("model3D", { files: [model3d] });
        model3dUrl = res[0].url;
      }

      // 5. Salvăm totul în baza noastră de date
      toast.loading("Salvăm raportul final...", { id: toastId });
      const dbResult = await submitDetailedReport(inspectionId, {
        reportDetails: reportText,
        photosUrls,
        engineMediaUrl,
        diagnosticUrl,
        model3dUrl,
      });

      if (dbResult.success) {
        toast.success(dbResult.success, { id: toastId });
        router.push("/mechanic-dashboard/my-tasks");
      } else {
        toast.error(dbResult.error || "Eroare necunoscută", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error("A apărut o eroare la încărcarea fișierelor!", {
        id: toastId,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/mechanic-dashboard/my-tasks"
            className="text-blue-600 hover:underline font-medium"
          >
            ← Înapoi la mașinile în lucru
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-blue-600 px-8 py-6">
            <h1 className="text-2xl font-extrabold text-white">
              📋 Formular Inspecție Detaliată
            </h1>
            <p className="text-blue-100 mt-2">ID Cerere: {inspectionId}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <section>
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">
                1. Concluzii Textuale *
              </h3>
              <textarea
                required
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[150px]"
                placeholder="Ex: Mașina este în stare excelentă..."
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
              />
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">
                2. Galerie Foto (Max 10)
              </h3>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setPhotos(Array.from(e.target.files || []))}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">
                3. Sunet Motor (MP3/MP4)
              </h3>
              <input
                type="file"
                accept="video/mp4,video/x-m4v,video/*,audio/*"
                onChange={(e) => setEngineMedia(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">
                4. Diagnoză (Tester)
              </h3>
              <input
                type="file"
                accept="application/pdf,image/*"
                onChange={(e) => setDiagnosticFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
              />
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">
                5. Model 3D (.glb, .obj)
              </h3>
              <input
                type="file"
                accept=".glb,.gltf,.obj"
                onChange={(e) => setModel3d(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
            </section>

            <button
              type="submit"
              disabled={isUploading}
              className={`w-full py-4 text-white font-extrabold text-lg rounded-xl transition-colors shadow-lg mt-8 ${isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {isUploading
                ? "Se trimite..."
                : "Finalizează și Trimite Raportul ✅"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
