"use client";

import { useState } from "react";
import { Button } from "@src/components/ui/button";
import { Separator } from "@src/components/ui/separator";
import { ScrollArea } from "@src/components/ui/scroll-area";
import { Menu, Search, Edit } from "lucide-react";
import Image from "next/image";
import logo from "@src/../public/tess-logo-color.svg";

import { formatDateAgo, groupChatsByDate } from "@src/utils/formatDates";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Olá! Como posso te ajudar no planejamento do eventoas?",
    },
  ]);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
  };
  const [chatSelecionadoId, setChatSelecionadoId] = useState<number | null>(
    null
  );

  const handleSelectChat = (id: number) => {
    setChatSelecionadoId(id);
    // abrir chat, etc.
  };

  const handleChatMenu = (id: number) => {
    console.log("Abrir opções do chat", id);
    // menu de ações: deletar, renomear...
  };
  const chats = Array.from({ length: 800 }).map((_, index) => ({
    id: index + 1,
    title: `Planejamento do Evento ${index + 1}`,
    lastMessageAt: new Date("2025-05-16T13:45:00"),
  }));

  return (
    <div className="flex h-screen w-screen bg-background text-foreground transition-colors">
      {/* Sidebar */}
      <aside
        className={`flex flex-col h-full border-r border-border transition-all duration-300 bg-background ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 cursor-pointer"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          {sidebarOpen && (
            <div className="flex gap-2">
              <span className="font-semibold text-base">
                <Button
                  title="Buscar em Chats"
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 cursor-pointer"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <Search className="h-8 w-8" />
                </Button>
              </span>
              <span className="font-semibold text-base">
                <Button
                  title="Novo Chat"
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 cursor-pointer"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <Edit className="h-8 w-8" />
                </Button>
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 p-4 space-y-2">
          <Button
            variant="ghost"
            className={` cursor-pointer text-center w-full justify-center transition-opacity duration-300 ${
              sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <Image src={logo} alt="alt" width={80} height={50} />
            <Separator orientation="vertical" />
            <span className="font-semibold text-xl">A.I</span>
          </Button>
          <Separator
            className={`my-2 transition-opacity duration-300 ${
              sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          />

          {/* Lista de chats */}
          <ScrollArea
            className={`h-9/10 w-full ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <div className="p-2 space-y-2 overflow-auto scrollbar-thin max-h-full">
              {Object.entries(groupChatsByDate(chats)).map(
                ([groupLabel, groupChats]) => (
                  <div key={groupLabel}>
                    <div
                      className={`text-xs font-bold text-muted-foreground px-2 py-1 uppercase tracking-wide  ${
                        sidebarOpen
                          ? "opacity-100"
                          : "opacity-0 pointer-events-none"
                      }`}
                    >
                      {groupLabel}
                    </div>
                    {groupChats.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => handleSelectChat(chat.id)}
                        className={`group flex items-center justify-between gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-muted transition-colors ${
                          sidebarOpen
                            ? "opacity-100"
                            : "opacity-0 pointer-events-none"
                        } ${chatSelecionadoId === chat.id ? "bg-muted" : ""}`}
                      >
                        <div className="flex flex-col flex-1">
                          <span className="font-medium text-sm">
                            {chat.title}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDateAgo(new Date(chat.lastMessageAt))}
                          </span>
                        </div>

                        {chatSelecionadoId === chat.id && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              handleChatMenu(chat.id);
                            }}
                            className="p-1 rounded hover:bg-accent transition-colors"
                            title="Mais opções"
                          >
                            <span className="text-xl font-bold text-muted-foreground">
                              ⋯
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </ScrollArea>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex flex-col flex-1 overflow-hidden">
        {/* Mensagens */}
        <div className="flex-1 overflow-auto px-4 py-6 space-y-4">
          {messages.map((msg, idx) => (
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

        {/* Campo de input fixo no rodapé */}
        <div className="p-4 border-t border-border bg-background">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2 max-w-3xl mx-auto w-full"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-background text-foreground border border-border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0"
              placeholder="Digite sua mensagem..."
            />
            <Button type="submit">Enviar</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
