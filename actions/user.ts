"use server";

import { PrismaClient } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";

const prisma = new PrismaClient();

export async function getUserCredits(userId: string) {
  noStore(); // Această linie INTERZICE folosirea memoriei Cache (Next.js)

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    return user?.credits || 0;
  } catch (error) {
    console.error("Eroare la obținerea creditelor:", error);
    return 0;
  }
}
