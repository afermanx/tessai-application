import { formatDistanceToNow, isToday, isYesterday, format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatDateAgo(date: Date) {
  return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
}

type chats = {
  id: number;
  lastMessageAt: string;
};
export function groupChatsByDate(chats: typeof chats) {
  const groups: Record<string, typeof chats> = {};

  chats.forEach((chat: typeof chats) => {
    const date = new Date(chat.lastMessageAt);
    let label = "";

    if (isToday(date)) {
      label = "Hoje";
    } else if (isYesterday(date)) {
      label = "Ontem";
    } else {
      label = format(date, "dd 'de' MMMM yyyy", { locale: ptBR });
    }

    if (!groups[label]) groups[label] = [];
    groups[label].push(chat);
  });

  return groups;
}
