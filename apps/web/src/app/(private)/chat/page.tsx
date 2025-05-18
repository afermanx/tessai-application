"use client";

import { useState } from "react";
import Sidebar from "@src/components/chat/ChatSidebar";
import ChatWindow from "@src/components/chat/index";

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatSelecionadoId, setChatSelecionadoId] = useState<number | null>(
    null
  );

  const chats = Array.from({ length: 3 }).map((_, index) => ({
    id: index + 1,
    title: `Planejamento do Evento ${index + 1}`,
    lastMessageAt: new Date(),
  }));

  return (
    <div className="flex w-screen h-screen bg-background text-foreground">
      <Sidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        chats={chats}
        selectedChatId={chatSelecionadoId}
        onSelectChat={(id) => setChatSelecionadoId(id)}
        onChatMenu={(id) => console.log("Menu chat", id)}
      />
      <ChatWindow />
    </div>
  );
}
