import { NextResponse } from "next/server";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

// Inițializăm Stripe cu cheia ta secretă din .env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16", // Folosim o versiune stabilă a API-ului
});

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { inspectionId } = await req.json();

    // 1. Căutăm inspecția în baza de date
    const inspection = await prisma.inspection.findUnique({
      where: { id: inspectionId },
    });

    if (!inspection) {
      return NextResponse.json(
        { error: "Inspecția nu a fost găsită." },
        { status: 404 },
      );
    }

    // 2. Creăm „factura” (Checkout Session) în Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "ron", // Moneda: LEI
            product_data: {
              name: `Verificare Auto: ${inspection.carMake || "Auto"} ${inspection.carModel || ""}`,
              description:
                "Taxă standard pentru verificarea mașinii de către un mecanic CarCheck.",
            },
            unit_amount: 15000, // Stripe folosește "bani" (cenți). 15000 = 150.00 RON
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      // Unde îl trimitem după ce plătește cu succes sau dacă dă cancel
      success_url: `http://localhost:3000/my-inspections?success=true`,
      cancel_url: `http://localhost:3000/dashboard?canceled=true`,
    });

    // 3. Salvăm ID-ul tranzacției în baza noastră de date ca să știm ce comandă a plătit
    await prisma.inspection.update({
      where: { id: inspectionId },
      data: { stripeSessionId: session.id },
    });

    // Trimitem înapoi link-ul de plată pe care să dăm click
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Eroare la inițializarea plății:", error);
    return NextResponse.json(
      { error: "A apărut o eroare internă la plată." },
      { status: 500 },
    );
  }
}
