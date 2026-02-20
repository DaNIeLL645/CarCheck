"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewRequestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    carUrl: "",
    carMake: "",
    carModel: "",
    location: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await fetch("/api/inspections", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">
          Verifică o mașină nouă
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Link anunț
            </label>
            <input
              type="text"
              required
              className="w-full p-2 border rounded mt-1 text-black"
              onChange={(e) =>
                setFormData({ ...formData, carUrl: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Marca
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded mt-1 text-black"
                onChange={(e) =>
                  setFormData({ ...formData, carMake: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Model
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded mt-1 text-black"
                onChange={(e) =>
                  setFormData({ ...formData, carModel: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Locația
            </label>
            <input
              type="text"
              required
              className="w-full p-2 border rounded mt-1 text-black"
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-4 rounded font-bold hover:bg-blue-700"
          >
            {loading ? "Se trimite..." : "Trimite Comanda"}
          </button>
        </form>
      </div>
    </div>
  );
}
