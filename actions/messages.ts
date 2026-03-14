"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

// 1. Funcție pentru a prelua toate mesajele unei inspecții
export async function getMessages(inspectionId: string) {
  try {
    const messages = await prisma.message.findMany({
      where: {
        inspectionId: inspectionId,
      },
      orderBy: {
        createdAt: "asc", // Ordonăm crescător, cele mai vechi primele (sus), cele noi jos
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            role: true,
          },
        },
      },
    });
    return messages;
  } catch (error) {
    console.error("Eroare la preluarea mesajelor:", error);
    return [];
  }
}

// 2. Funcție pentru a trimite un mesaj nou
export async function sendMessage(
  inspectionId: string,
  senderId: string,
  content: string,
) {
  try {
    if (!content || content.trim() === "") {
      throw new Error("Mesajul nu poate fi gol");
    }

    const newMessage = await prisma.message.create({
      data: {
        content: content,
        inspectionId: inspectionId,
        senderId: senderId,
      },
    });

    // Revalidăm pagina pentru ca noile mesaje să apară imediat fără refresh manual
    // Presupunem că chat-ul va fi pe pagina de raport a clientului și a mecanicului
    revalidatePath(`/my-inspections/report/${inspectionId}`);
    revalidatePath(`/mechanic-dashboard/report/${inspectionId}`);

    return { success: true, message: newMessage };
  } catch (error) {
    console.error("Eroare la trimiterea mesajului:", error);
    return { success: false, error: "Eroare la trimiterea mesajului" };
  }
}
