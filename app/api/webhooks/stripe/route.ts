import { NextResponse } from "next/server";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

const prisma = new PrismaClient();

export async function POST(req: Request) {
  console.log("🔔 [WEBHOOK] Am primit un mesaj de la Stripe pe portul local!");

  try {
    const body = await req.text();

    // NOU PENTRU NEXT.JS 15+: Trebuie să punem 'await' la headers()
    const headersList = await headers();
    const signature = headersList.get("Stripe-Signature");

    if (!signature) {
      console.error("❌ [WEBHOOK] Lipsește semnătura Stripe!");
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!endpointSecret) {
      console.error(
        "❌ [WEBHOOK] EROARE: Parola STRIPE_WEBHOOK_SECRET lipsește din .env!",
      );
      return NextResponse.json({ error: "Missing secret" }, { status: 500 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
      console.log(
        `✅ [WEBHOOK] Semnătură validă! Tip eveniment: ${event.type}`,
      );
    } catch (err: any) {
      console.error("❌ [WEBHOOK] EROARE SEMNĂTURĂ:", err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 },
      );
    }

    // Când plata este gata
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log(
        "📦 [WEBHOOK] Sesiune Stripe generată. Metadata:",
        session.metadata,
      );

      const userId = session.metadata?.userId;
      const creditsToAdd = parseInt(session.metadata?.creditsToAdd || "0", 10);

      if (userId && creditsToAdd > 0) {
        try {
          console.log(
            `⏳ [WEBHOOK] Adaug ${creditsToAdd} credite utilizatorului ${userId}...`,
          );

          const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
              credits: { increment: creditsToAdd },
            },
          });

          console.log(
            `💰 [WEBHOOK] SUCCES! Utilizatorul are acum ${updatedUser.credits} credite!`,
          );
        } catch (dbError) {
          console.error("❌ [WEBHOOK] EROARE BAZĂ DE DATE:", dbError);
        }
      } else {
        console.error(
          "❌ [WEBHOOK] EROARE: Lipsește userId sau creditele din metadata!",
        );
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (globalError) {
    console.error("❌ [WEBHOOK] EROARE CRITICĂ GLOBALĂ:", globalError);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
