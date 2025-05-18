"use client";

import { Button } from "@src/components/ui/button";
import { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simula uma resposta do assistente
    setTimeout(() => {
      const response: Message = {
        role: "assistant",
        content: "Entendi! Poderia me dar mais detalhes?",
      };
      setMessages((prev) => [...prev, response]);
    }, 1000);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col flex-1 bg-background">
      <div className="flex-1 px-4 py-6 space-y-4 overflow-auto">
        {hasMessages &&
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-2xl w-fit p-4 rounded-md ${
                msg.role === "user"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "mr-auto bg-muted text-muted-foreground"
              }`}
            >
              {msg.content}
            </div>
          ))}
      </div>

      <div
        className={`${
          !hasMessages
            ? "flex-1 flex flex-col items-center justify-center"
            : "p-4 border-t border-border"
        } bg-background`}
      >
        {!hasMessages && (
          <h2 className="mb-6 text-xl text-center text-muted-foreground">
            Olá! Como posso te ajudar no planejamento do evento?
          </h2>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex w-full max-w-3xl gap-2 mx-auto"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 border rounded-md bg-background text-foreground border-border focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0"
            placeholder="Digite sua mensagem..."
          />
          <Button type="submit">Enviar</Button>
        </form>
      </div>
    </div>
  );
}
