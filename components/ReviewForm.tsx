"use client";

import { useState } from "react";
import { submitReview } from "@/actions/inspections";

interface ReviewFormProps {
  inspectionId: string;
  mechanicId: string;
  // Pasăm un prop ca să știm dacă a lăsat deja review (să nu-i lăsăm să dea de 10 ori)
  hasReviewed: boolean;
}

export default function ReviewForm({
  inspectionId,
  mechanicId,
  hasReviewed,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(hasReviewed);

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Te rugăm să selectezi o notă de la 1 la 5 stele!");
      return;
    }

    setIsSubmitting(true);
    const res = await submitReview(inspectionId, mechanicId, rating, comment);

    if (res.success) {
      setSubmitted(true);
    } else {
      alert(res.error);
    }
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <span className="text-4xl mb-2 block">⭐</span>
        <h4 className="text-lg font-bold text-green-800">
          Mulțumim pentru recenzie!
        </h4>
        <p className="text-green-600 text-sm">
          Feedback-ul tău ajută comunitatea CarCheck.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white border border-gray-200 shadow-sm rounded-xl p-6">
      <h4 className="text-lg font-bold text-gray-900 mb-2">
        Cum a fost colaborarea cu mecanicul?
      </h4>
      <p className="text-gray-500 text-sm mb-4">
        Lasă o notă și un comentariu pentru a ajuta alți clienți.
      </p>

      {/* Sistemul de Steluțe Interactiv */}
      <div className="flex items-center gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`text-3xl transition-colors ${
              star <= (hover || rating) ? "text-yellow-400" : "text-gray-300"
            }`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(rating)}
          >
            ★
          </button>
        ))}
      </div>

      {/* Câmpul pentru comentariu */}
      <textarea
        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none mb-4"
        rows={3}
        placeholder="Scrie un scurt comentariu (opțional)..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>

      {/* Buton de trimitere */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="bg-gray-900 hover:bg-black text-white font-semibold py-2 px-6 rounded-lg transition-all disabled:opacity-50"
      >
        {isSubmitting ? "Se trimite..." : "Trimite Recenzia"}
      </button>
    </div>
  );
}
