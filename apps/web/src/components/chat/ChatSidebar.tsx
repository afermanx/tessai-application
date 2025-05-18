"use client";

import { Button } from "@src/components/ui/button";
import { Separator } from "@src/components/ui/separator";
import { ScrollArea } from "@src/components/ui/scroll-area";
import { Menu, Search, Edit } from "lucide-react";
import { useRef, useEffect } from "react";
import Image from "next/image";
import logo from "@src/../public/tess-logo-color.svg";
import ChatList from "./ChatList";

interface SidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  chats: any[];
  selectedChatId: number | null;
  onSelectChat: (id: number) => void;
  onChatMenu: (id: number) => void;
}

export default function Sidebar({
  sidebarOpen,
  toggleSidebar,
  chats,
  selectedChatId,
  onSelectChat,
  onChatMenu,
}: SidebarProps) {
  return (
    <aside
      className={`flex flex-col h-full border-r border-border transition-all duration-300 bg-background ${
        sidebarOpen ? "w-64" : "w-16"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8"
          onClick={toggleSidebar}
        >
          <Menu className="w-5 h-5" />
        </Button>

        {sidebarOpen && (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" title="Buscar em Chats">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" title="Novo Chat">
              <Edit className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 p-4 space-y-2">
        <Button variant="ghost" className={`w-full justify-center`}>
          <Image src={logo} alt="Logo" width={80} height={50} />
          {sidebarOpen && (
            <>
              <Separator orientation="vertical" />
              <span className="text-xl font-semibold">A.I</span>
            </>
          )}
        </Button>
        <Separator />

        <ScrollArea className="h-full">
          <ChatList
            chats={chats}
            sidebarOpen={sidebarOpen}
            selectedChatId={selectedChatId}
            onSelectChat={onSelectChat}
            onChatMenu={onChatMenu}
          />
        </ScrollArea>
      </div>
    </aside>
  );
}
