"use server";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// =========================================================================
// 1. Funcția ORIGINALĂ pentru crearea clienților (Folosită în /register)
// =========================================================================
export async function registerUser(data: {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
}) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return { error: "Acest email este deja folosit." };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
        role: "CLIENT", // Implicit orice user de pe /register e client
      },
    });

    return { success: "Cont creat cu succes!" };
  } catch (error) {
    console.error(error);
    return { error: "Eroare la crearea contului." };
  }
}

// =========================================================================
// 2. Funcția NOUĂ pentru crearea mecanicilor (Folosită de Admin)
// =========================================================================
export async function createMechanicAccount(data: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}) {
  try {
    // 1. Verificăm dacă email-ul există deja
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return { error: "Acest email este deja folosit." };
    }

    // 2. Criptăm parola
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 3. Creăm mecanicul în baza de date cu rolul FORȚAT de MECHANIC
    await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
        role: "MECHANIC", // <-- Aici e cheia!
      },
    });

    return { success: "Contul de mecanic a fost creat cu succes!" };
  } catch (error) {
    console.error(error);
    return { error: "Eroare la crearea contului." };
  }
}
