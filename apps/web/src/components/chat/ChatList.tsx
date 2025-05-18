"use client";

import { formatDateAgo, groupChatsByDate } from "@src/utils/formatDates";

interface ChatListProps {
  chats: any[];
  sidebarOpen: boolean;
  selectedChatId: number | null;
  onSelectChat: (id: number) => void;
  onChatMenu: (id: number) => void;
}

export default function ChatList({
  chats,
  sidebarOpen,
  selectedChatId,
  onSelectChat,
  onChatMenu,
}: ChatListProps) {
  return (
    <div className="p-2 space-y-2">
      {Object.entries(groupChatsByDate(chats)).map(
        ([groupLabel, groupChats]) => (
          <div key={groupLabel}>
            <div className="px-2 py-1 text-xs font-bold tracking-wide uppercase text-muted-foreground">
              {groupLabel}
            </div>
            {groupChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`group flex items-center justify-between gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-muted transition-colors ${
                  selectedChatId === chat.id ? "bg-muted" : ""
                }`}
              >
                <div className="flex flex-col flex-1">
                  <span className="text-sm font-medium">{chat.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDateAgo(new Date(chat.lastMessageAt))}
                  </span>
                </div>

                {selectedChatId === chat.id && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onChatMenu(chat.id);
                    }}
                    className="p-1 transition-colors rounded hover:bg-accent"
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
  );
}
