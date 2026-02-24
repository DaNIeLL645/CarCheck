"use server";

import { PrismaClient } from "@prisma/client";
// IMPORTĂM RESEND ȘI TEMPLATE-UL NOSTRU DE EMAIL
import { Resend } from "resend";
import StatusEmail from "@/components/emails/StatusEmail";

const prisma = new PrismaClient();
// Inițializăm Resend cu cheia ta (ideal ar fi process.env.RESEND_API_KEY în producție)
const resend = new Resend("re_X51pLGA8_46DXTWpFftSuzKkwQNnPb4KM");

// Această funcție primește datele din formular și ID-ul clientului logat
export async function createInspection(formData: FormData, clientId: string) {
  const carUrl = formData.get("carUrl") as string;
  const carMake = formData.get("carMake") as string;
  const carModel = formData.get("carModel") as string;
  const location = formData.get("location") as string;

  if (!carUrl || !location) {
    return { error: "Link-ul și locația sunt obligatorii!" };
  }

  try {
    const newInspection = await prisma.inspection.create({
      data: {
        carUrl,
        carMake,
        carModel,
        location,
        clientId: clientId,
        status: "PENDING",
      },
    });

    // RETURNĂM ID-UL PENTRU STRIPE AICI
    return { success: true, inspectionId: newInspection.id };
  } catch (error) {
    return { error: "A apărut o eroare la salvarea cererii." };
  }
}
export async function getClientInspections(clientId: string) {
  try {
    const inspections = await prisma.inspection.findMany({
      where: { clientId: clientId },
      orderBy: { createdAt: "desc" },
    });
    return inspections;
  } catch (error) {
    console.error("Eroare la aducerea inspecțiilor:", error);
    return [];
  }
}

export async function getPendingInspections() {
  try {
    const inspections = await prisma.inspection.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
      include: {
        client: { select: { fullName: true } },
      },
    });
    return inspections;
  } catch (error) {
    console.error("Eroare la aducerea inspecțiilor PENDING:", error);
    return [];
  }
}

// =========================================================================
// 2. Funcția prin care mecanicul acceptă / preia o inspecție + TRIMITE EMAIL
// =========================================================================
export async function acceptInspection(
  inspectionId: string,
  mechanicId: string,
) {
  try {
    const updatedInspection = await prisma.inspection.update({
      where: { id: inspectionId },
      data: {
        status: "ACCEPTED",
        mechanicId: mechanicId,
      },
      // Avem nevoie de datele clientului ca să știm cui trimitem emailul
      include: { client: true },
    });

    // --- TRIMITEM EMAILUL CĂ MAȘINA A FOST PRELUATĂ ---
    if (updatedInspection.client.email) {
      await resend.emails.send({
        from: "CarCheck <onboarding@resend.dev>", // Emailul de test Resend
        to: updatedInspection.client.email, // Emailul clientului din baza ta de date
        subject: "🚗 Cererea ta a fost acceptată!",
        react: StatusEmail({
          userName: updatedInspection.client.fullName,
          carMake: updatedInspection.carMake || "Mașina",
          carModel: updatedInspection.carModel || "ta",
          status: "ACCEPTED",
          reportUrl: "http://localhost:3000/my-inspections",
        }),
      });
    }

    return { success: "Inspecția a fost acceptată cu succes!" };
  } catch (error) {
    console.error(error);
    return { error: "A apărut o eroare la acceptarea inspecției." };
  }
}

export async function getMechanicAcceptedInspections(mechanicId: string) {
  try {
    const inspections = await prisma.inspection.findMany({
      where: { mechanicId: mechanicId, status: "ACCEPTED" },
      include: { client: { select: { fullName: true } } },
      orderBy: { createdAt: "desc" },
    });
    return inspections;
  } catch (error) {
    console.error("Eroare la aducerea inspecțiilor acceptate:", error);
    return [];
  }
}

export async function submitInspectionReport(
  inspectionId: string,
  reportDetails: string,
) {
  try {
    await prisma.inspection.update({
      where: { id: inspectionId },
      data: { status: "COMPLETED", reportDetails: reportDetails },
    });
    return { success: "Raportul a fost trimis clientului cu succes!" };
  } catch (error) {
    return { error: "A apărut o eroare la trimiterea raportului." };
  }
}

// =========================================================================
// 5. Funcția pentru trimiterea raportului complex + TRIMITE EMAIL
// =========================================================================
export async function submitDetailedReport(
  inspectionId: string,
  data: {
    reportDetails: string;
    photosUrls?: string;
    engineMediaUrl?: string;
    diagnosticUrl?: string;
    model3dUrl?: string;
  },
) {
  try {
    const updatedInspection = await prisma.inspection.update({
      where: { id: inspectionId },
      data: {
        status: "COMPLETED",
        reportDetails: data.reportDetails,
        photosUrls: data.photosUrls,
        engineMediaUrl: data.engineMediaUrl,
        diagnosticUrl: data.diagnosticUrl,
        model3dUrl: data.model3dUrl,
      },
      include: { client: true },
    });

    // --- TRIMITEM EMAILUL CĂ RAPORTUL ESTE GATA ---
    if (updatedInspection.client.email) {
      await resend.emails.send({
        from: "CarCheck <onboarding@resend.dev>",
        to: updatedInspection.client.email,
        subject: "✅ Raportul de inspecție este gata!",
        react: StatusEmail({
          userName: updatedInspection.client.fullName,
          carMake: updatedInspection.carMake || "Mașina",
          carModel: updatedInspection.carModel || "ta",
          status: "COMPLETED",
          reportUrl: `http://localhost:3000/my-inspections/report/${updatedInspection.id}`,
        }),
      });
    }

    return { success: "Raportul complet a fost salvat și trimis clientului!" };
  } catch (error) {
    console.error(error);
    return { error: "Eroare la salvarea în baza de date." };
  }
}
// =========================================================================
// 6. Funcția pentru a lăsa o recenzie mecanicului
// =========================================================================
export async function submitReview(
  inspectionId: string,
  mechanicId: string,
  rating: number,
  comment: string,
) {
  try {
    await prisma.review.create({
      data: {
        rating: rating,
        comment: comment,
        inspectionId: inspectionId,
        mechanicId: mechanicId,
      },
    });
    return { success: "Recenzia a fost trimisă cu succes! Mulțumim!" };
  } catch (error) {
    console.error("Eroare la salvarea recenziei:", error);
    return { error: "A apărut o eroare la salvarea recenziei." };
  }
}
// =========================================================================
// 7. Funcția pentru a obține profilul și recenziile mecanicului
// =========================================================================
export async function getMechanicStats(mechanicId: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: { mechanicId: mechanicId },
      include: {
        inspection: {
          include: { client: { select: { fullName: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculăm media notelor
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews
        : 0;

    return {
      reviews,
      averageRating: parseFloat(averageRating.toFixed(1)), // ex: 4.8
      totalReviews,
    };
  } catch (error) {
    console.error("Eroare la preluarea recenziilor:", error);
    return { reviews: [], averageRating: 0, totalReviews: 0 };
  }
}
