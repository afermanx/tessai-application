import api from "@src/lib/api";

export function sendMessage(
  conversationId: string | null,
  message: string,
  userId: number,
  sender: string
) {
  const url = conversationId
    ? `/conversations/${conversationId}/message`
    : `/conversations/message`;

  return api.post(url, {
    content: message,
    userId,
    sender,
  });
}

export function getConversations() {
  return api.get("/conversations");
}

export function getConversationMessages(conversationId: string) {
  return api.get(`/conversations/${conversationId}/messages`);
}

export function deleteConversation(conversationId: string) {
  return api.delete(`/conversations/${conversationId}`);
}
