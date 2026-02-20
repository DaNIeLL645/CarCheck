import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Funcția GET - Pentru a vedea inspecțiile
export async function GET() {
  try {
    const inspections = await prisma.inspection.findMany({
      include: { client: true },
    });
    return NextResponse.json(inspections);
  } catch (error) {
    return NextResponse.json(
      { error: "Eroare la citirea datelor" },
      { status: 500 },
    );
  }
}

// Funcția POST - Pentru a salva o comandă nouă
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Căutăm un client existent sau creăm unul nou
    let client = await prisma.user.findFirst();

    if (!client) {
      client = await prisma.user.create({
        data: {
          email: "client@test.ro",
          password: "demo",
          fullName: "Client Test",
          role: "CLIENT",
        },
      });
    }

    // Creăm inspecția
    const newInspection = await prisma.inspection.create({
      data: {
        carUrl: body.carUrl,
        carMake: body.carMake,
        carModel: body.carModel,
        location: body.location,
        status: "PENDING",
        clientId: client.id,
      },
    });

    return NextResponse.json(newInspection);
  } catch (error) {
    console.error("Eroare la salvare:", error);
    return NextResponse.json(
      { error: "Nu am putut salva comanda" },
      { status: 500 },
    );
  }
}
