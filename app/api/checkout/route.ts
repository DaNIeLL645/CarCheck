import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  try {
    // Acum primim ID-ul utilizatorului și câte credite vrea să cumpere
    const { userId, credits } = await req.json();

    if (!userId || !credits) {
      return NextResponse.json({ error: "Date incomplete." }, { status: 400 });
    }

    // Calculăm prețul în funcție de pachetul ales (1, 2 sau 3 credite)
    let unitAmount = 0;
    if (credits === 1)
      unitAmount = 15000; // 150.00 RON
    else if (credits === 2)
      unitAmount = 20000; // 200.00 RON (Reducere 100 lei)
    else if (credits === 3)
      unitAmount = 25000; // 250.00 RON (Reducere 200 lei)
    else {
      return NextResponse.json({ error: "Pachet invalid." }, { status: 400 });
    }

    // Creăm Sesiunea de plată Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "ron",
            product_data: {
              name: `Pachet ${credits} Verificăr${credits === 1 ? "e" : "i"} Auto`,
              description:
                "Creditele vor fi adăugate automat în contul tău CarCheck.",
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      // Adăugăm metadata pentru a ști CUI îi dăm creditele când se confirmă plata
      metadata: {
        userId: userId,
        creditsToAdd: credits.toString(),
      },
      success_url: `http://localhost:3000/my-inspections?success=true`,
      cancel_url: `http://localhost:3000/my-inspections?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Eroare la checkout:", error);
    return NextResponse.json(
      { error: "Eroare internă la plată." },
      { status: 500 },
    );
  }
}
