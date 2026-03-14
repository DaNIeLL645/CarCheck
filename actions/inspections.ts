"use server";

import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";
import StatusEmail from "@/components/emails/StatusEmail";

const prisma = new PrismaClient();
const resend = new Resend("re_X51pLGA8_46DXTWpFftSuzKkwQNnPb4KM");

// =========================================================================
// 1. Funcția prin care Clientul adaugă o mașină nouă (și consumă un credit)
// =========================================================================
export async function createInspection(data: {
  carUrl: string;
  carMake: string;
  carModel: string;
  location: string;
  clientId: string;
}) {
  if (!data.carUrl || !data.location) {
    return { error: "Link-ul și locația sunt obligatorii!" };
  }

  try {
    // 1. Verificăm creditele utilizatorului
    const user = await prisma.user.findUnique({
      where: { id: data.clientId },
    });

    if (!user || user.credits < 1) {
      return {
        error:
          "Nu ai suficiente credite pentru a adăuga o mașină. Te rugăm să achiziționezi un pachet.",
      };
    }

    // 2. Facem Tranzacția (scădem creditul ȘI adăugăm mașina direct ca PLĂTITĂ)
    const [newInspection, updatedUser] = await prisma.$transaction([
      prisma.inspection.create({
        data: {
          carUrl: data.carUrl,
          carMake: data.carMake,
          carModel: data.carModel,
          location: data.location,
          clientId: data.clientId,
          status: "PENDING",
          paymentStatus: "PAID", // <--- SETĂM DIRECT CA PLĂTIT!
        },
      }),
      prisma.user.update({
        where: { id: data.clientId },
        data: { credits: { decrement: 1 } }, // <--- SCĂDEM UN CREDIT!
      }),
    ]);

    return { success: true, inspectionId: newInspection.id };
  } catch (error) {
    console.error(error);
    return { error: "A apărut o eroare la salvarea cererii." };
  }
}

// =========================================================================
// RESTUL FUNCȚIILOR RĂMÂN IDENTICE CU CE AVEAI ÎNAINTE
// =========================================================================

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

export async function acceptInspection(
  inspectionId: string,
  mechanicId: string,
) {
  try {
    const updatedInspection = await prisma.inspection.update({
      where: { id: inspectionId },
      data: { status: "ACCEPTED", mechanicId: mechanicId },
      include: { client: true },
    });

    if (updatedInspection.client.email) {
      await resend.emails.send({
        from: "CarCheck <onboarding@resend.dev>",
        to: updatedInspection.client.email,
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
    console.error("Eroare:", error);
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
    return { error: "A apărut o eroare la salvarea recenziei." };
  }
}

export async function getMechanicStats(mechanicId: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: { mechanicId: mechanicId },
      include: {
        inspection: { include: { client: { select: { fullName: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews
        : 0;

    return {
      reviews,
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalReviews,
    };
  } catch (error) {
    return { reviews: [], averageRating: 0, totalReviews: 0 };
  }
}
export async function cancelAndRefundInspection(inspectionId: string) {
  try {
    // 1. Găsim inspecția pentru a afla cine este clientul
    const inspection = await prisma.inspection.findUnique({
      where: { id: inspectionId },
      include: { client: true },
    });

    if (!inspection) return { error: "Inspecția nu a fost găsită." };
    if (inspection.status === "CANCELED")
      return { error: "Această inspecție este deja anulată." };

    // 2. Facem o tranzacție: Anulăm inspecția ȘI dăm creditul înapoi clientului
    await prisma.$transaction([
      prisma.inspection.update({
        where: { id: inspectionId },
        data: { status: "CANCELED" },
      }),
      prisma.user.update({
        where: { id: inspection.clientId },
        data: { credits: { increment: 1 } }, // Dăm înapoi 1 credit!
      }),
    ]);

    // (Opțional) Aici ai putea trimite și un email clientului cu Resend să-l anunți
    // că anunțul a expirat și și-a primit creditul înapoi.

    return {
      success: "Comanda a fost anulată și creditul a fost returnat clientului!",
    };
  } catch (error) {
    console.error(error);
    return { error: "Eroare la anularea comenzii." };
  }
}
export async function getInspectionById(id: string) {
  try {
    const inspection = await prisma.inspection.findUnique({
      where: { id: id },
      include: {
        client: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
        mechanic: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
    });
    return inspection;
  } catch (error) {
    console.error("Eroare la preluarea inspecției:", error);
    return null;
  }
}
