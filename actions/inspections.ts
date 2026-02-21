"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Această funcție primește datele din formular și ID-ul clientului logat
export async function createInspection(formData: FormData, clientId: string) {
  const carUrl = formData.get("carUrl") as string;
  const carMake = formData.get("carMake") as string;
  const carModel = formData.get("carModel") as string;
  const location = formData.get("location") as string;

  // Verificăm dacă a completat câmpurile obligatorii
  if (!carUrl || !location) {
    return { error: "Link-ul și locația sunt obligatorii!" };
  }

  // Salvăm în baza de date
  try {
    await prisma.inspection.create({
      data: {
        carUrl,
        carMake,
        carModel,
        location,
        clientId: clientId, // Îi atribuim inspecția clientului logat
        status: "PENDING", // Statusul inițial
      },
    });

    return { success: "Cererea a fost adăugată cu succes!" };
  } catch (error) {
    return { error: "A apărut o eroare la salvarea cererii." };
  }
}
// Funcție pentru a aduce inspecțiile unui anumit client
export async function getClientInspections(clientId: string) {
  try {
    const inspections = await prisma.inspection.findMany({
      where: {
        clientId: clientId,
      },
      orderBy: {
        createdAt: "desc", // Le ordonăm ca cele mai noi să fie primele
      },
    });
    return inspections;
  } catch (error) {
    console.error("Eroare la aducerea inspecțiilor:", error);
    return [];
  }
}
// 1. Aducem toate inspecțiile care sunt în așteptare (PENDING)
export async function getPendingInspections() {
  try {
    const inspections = await prisma.inspection.findMany({
      where: {
        status: "PENDING",
      },
      orderBy: {
        createdAt: "desc",
      },
      // Aducem și numele clientului ca mecanicul să știe a cui e mașina
      include: {
        client: {
          select: { fullName: true },
        },
      },
    });
    return inspections;
  } catch (error) {
    console.error("Eroare la aducerea inspecțiilor PENDING:", error);
    return [];
  }
}

// 2. Funcția prin care mecanicul acceptă / preia o inspecție
export async function acceptInspection(
  inspectionId: string,
  mechanicId: string,
) {
  try {
    await prisma.inspection.update({
      where: { id: inspectionId },
      data: {
        status: "ACCEPTED", // Schimbăm statusul
        mechanicId: mechanicId, // O legăm de ID-ul acestui mecanic
      },
    });
    return { success: "Inspecția a fost acceptată cu succes!" };
  } catch (error) {
    return { error: "A apărut o eroare la acceptarea inspecției." };
  }
}
// 3. Aducem inspecțiile acceptate de un anumit mecanic (pentru a le putea finaliza)
export async function getMechanicAcceptedInspections(mechanicId: string) {
  try {
    const inspections = await prisma.inspection.findMany({
      where: {
        mechanicId: mechanicId,
        status: "ACCEPTED", // Aducem doar ce este în lucru
      },
      include: {
        client: { select: { fullName: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return inspections;
  } catch (error) {
    console.error("Eroare la aducerea inspecțiilor acceptate:", error);
    return [];
  }
}

// 4. Funcția prin care mecanicul trimite formularul/raportul
export async function submitInspectionReport(
  inspectionId: string,
  reportDetails: string,
) {
  try {
    await prisma.inspection.update({
      where: { id: inspectionId },
      data: {
        status: "COMPLETED", // Schimbăm statusul pentru a înștiința clientul
        reportDetails: reportDetails,
      },
    });
    return { success: "Raportul a fost trimis clientului cu succes!" };
  } catch (error) {
    return { error: "A apărut o eroare la trimiterea raportului." };
  }
}
// 5. Funcția pentru trimiterea raportului complex cu link-uri media
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
    await prisma.inspection.update({
      where: { id: inspectionId },
      data: {
        status: "COMPLETED", // Mașina este gata
        reportDetails: data.reportDetails,
        photosUrls: data.photosUrls,
        engineMediaUrl: data.engineMediaUrl,
        diagnosticUrl: data.diagnosticUrl,
        model3dUrl: data.model3dUrl,
      },
    });
    return { success: "Raportul complet a fost salvat și trimis clientului!" };
  } catch (error) {
    console.error(error);
    return { error: "Eroare la salvarea în baza de date." };
  }
}
