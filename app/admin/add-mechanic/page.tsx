"use client";

import { useState } from "react";
import { createMechanicAccount } from "@/actions/auth"; // ajustează calea dacă e nevoie
import toast from "react-hot-toast";

export default function AddMechanicPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Se creează contul...");

    const res = await createMechanicAccount(formData);

    if (res.success) {
      toast.success(res.success, { id: toastId });
      setFormData({ fullName: "", email: "", phone: "", password: "" }); // resetăm formularul
    } else {
      toast.error(res.error || "Eroare", { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">
          👑 Adaugă un Mecanic Nou
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nume Complet Mecanic"
            required
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
          />
          <input
            type="email"
            placeholder="Email Mecanic"
            required
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Număr Telefon"
            required
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Parolă temporară"
            required
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <button
            type="submit"
            className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Creează Cont Mecanic
          </button>
        </form>
      </div>
    </div>
  );
}
