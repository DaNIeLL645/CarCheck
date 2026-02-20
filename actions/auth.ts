"use server";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const role = formData.get("role") as string;

  if (!email || !password || !fullName) {
    return { error: "Toate câmpurile sunt obligatorii!" };
  }

  // Verificăm dacă utilizatorul există deja
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Acest email este deja folosit!" };
  }

  // Criptăm parola
  const hashedPassword = await bcrypt.hash(password, 10);

  // Creăm utilizatorul
  try {
    await prisma.user.create({
      data: {
        email,
        fullName,
        password: hashedPassword,
        role: role || "CLIENT",
      },
    });

    return { success: "Cont creat cu succes!" };
  } catch (error) {
    return { error: "A apărut o eroare la crearea contului." };
  }
}
