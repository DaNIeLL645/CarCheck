"use client";

import { useState, useEffect, useRef } from "react";
import { getMessages, sendMessage } from "@/actions/messages";

type Message = {
  id: string;
  content: string;
  createdAt: Date;
  senderId: string;
  sender: {
    id: string;
    fullName: string;
    role: string;
  };
};

export default function Chat({
  inspectionId,
  currentUserId,
}: {
  inspectionId: string;
  currentUserId: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 1. NOU: O referință doar pentru div-ul care conține mesajele
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    const data = await getMessages(inspectionId);
    // @ts-expect-error
    setMessages(data);
  };

  useEffect(() => {
    fetchMessages();

    const interval = setInterval(() => {
      fetchMessages();
    }, 5000);

    return () => clearInterval(interval);
  }, [inspectionId]);

  // 2. REZOLVARE BUG SCROLL: Facem scroll doar ÎN INTERIORUL cutiei de chat, NU pe toată pagina!
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsLoading(true);
    const result = await sendMessage(inspectionId, currentUserId, newMessage);

    if (result.success) {
      setNewMessage("");
      await fetchMessages();
    } else {
      alert("Eroare la trimiterea mesajului.");
    }
    setIsLoading(false);
  };

  return (
    // 3. REZOLVARE FUNDAL NEGRU: Am forțat bg-white pe container și am izolat culorile
    <div className="flex flex-col h-[500px] bg-white border border-gray-200 rounded-xl shadow-sm mt-4 overflow-hidden">
      {/* Antetul */}
      <div className="p-4 border-b bg-blue-50 font-bold text-blue-800 flex items-center gap-2">
        <span className="text-xl">💬</span> Chat Live
      </div>

      {/* Zona mesajelor - Aici am pus scroll-ul interior */}
      <div
        ref={chatScrollRef}
        className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50"
      >
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 text-sm mt-4">
            Niciun mesaj încă. Scrie ceva pentru a începe conversația!
          </p>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <span className="text-xs text-gray-500 mb-1 px-1">
                  {isMe ? "Tu" : msg.sender.fullName} (
                  {msg.sender.role === "MECHANIC" ? "Mecanic" : "Client"})
                </span>
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm ${
                    isMe
                      ? "bg-blue-600 text-white rounded-br-sm shadow-md"
                      : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input-ul text */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 border-t bg-white flex gap-2"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Scrie un mesaj..."
          className="flex-1 px-4 py-2 border rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder-gray-400"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !newMessage.trim()}
          className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium shadow-sm"
        >
          {isLoading ? "..." : "Trimite"}
        </button>
      </form>
    </div>
  );
}
