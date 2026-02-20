import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, fullName, role } = body;

    // 1. Verificăm dacă emailul există deja
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Acest email este deja folosit!" },
        { status: 400 },
      );
    }

    // 2. Creăm utilizatorul nou
    const user = await prisma.user.create({
      data: {
        email,
        password, // Notă: Într-o aplicație reală, parola se criptează aici!
        fullName,
        role: role || "CLIENT", // Dacă nu specificăm, e client simplu
      },
    });

    return NextResponse.json({ message: "Cont creat cu succes!", user });
  } catch (error) {
    return NextResponse.json({ error: "Eroare la server" }, { status: 500 });
  }
}
