"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react"; // Am adăugat getSession
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setError(null);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Email sau parolă incorectă!");
    } else {
      // Aici e magia! Citim sesiunea ca să vedem ce rol are omul
      const session = await getSession();

      if (session?.user && (session.user as any).role === "MECHANIC") {
        router.push("/mechanic-dashboard"); // Îl trimitem la panoul lui
      } else {
        router.push("/my-inspections"); // Clientul e trimis la cererile lui
      }

      router.refresh(); // Reîmprospătăm ca să apară meniul corect
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-blue-600">
          Conectare
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
            {error}
          </p>
        )}

        <form action={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parolă
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
          >
            Intră în cont
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Nu ai un cont?{" "}
          <Link
            href="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Înregistrează-te aici
          </Link>
        </p>
      </div>
    </div>
  );
}
