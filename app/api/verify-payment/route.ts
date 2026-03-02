import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const bundleId = searchParams.get("bundleId");

  if (bundleId) {
    try {
      // 💡 Actualizăm statusul indiferent dacă e pachet sau mașină singură
      await prisma.inspection.updateMany({
        where: {
          OR: [{ bundleId: bundleId }, { id: bundleId }],
        },
        data: { paymentStatus: "PAID" },
      });

      console.log(`✅ Succes: ${bundleId} a fost marcat ca PAID!`);

      // 💡 AICI E REZOLVAREA PT MECANIC: Ștergem memoria site-ului ca să reîncarce mașinile
      revalidatePath("/", "layout");
    } catch (error) {
      console.error("Eroare la actualizarea bazei de date:", error);
    }
  }

  // Redirecționăm clientul înapoi în panoul lui
  return NextResponse.redirect(
    new URL("/my-inspections?success=true", req.url),
  );
}
