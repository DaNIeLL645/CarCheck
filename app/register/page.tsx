"use client";

import { useState } from "react";
import { registerUser } from "@/actions/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Se creează contul...");

    // Trimitem doar datele necesare, FĂRĂ rol
    const res = await registerUser(formData);

    if (res.success) {
      toast.success(res.success, { id: toastId });
      router.push("/login");
    } else {
      toast.error(res.error || "Eroare la creare", { id: toastId });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Creează un cont de Client
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nume Complet
            </label>
            <input
              type="text"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefon
            </label>
            <input
              type="text"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parolă
            </label>
            <input
              type="password"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 mt-4"
          >
            {loading ? "Se încarcă..." : "Înregistrează-te"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Ai deja cont?{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Autentifică-te aici
          </Link>
        </p>
      </div>
    </div>
  );
}
