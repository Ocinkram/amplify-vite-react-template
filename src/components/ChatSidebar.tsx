import type { Schema } from "../../amplify/data/resource";
import { FormEvent } from "react";

type ChatSidebarProps = {
  chats: Array<Schema["Chat"]["type"]>;
  selectedChatId: string | null;
  newChatName: string;
  onNewChatNameChange: (value: string) => void;
  onCreateChat: (event: FormEvent<HTMLFormElement>) => void;
  onSelectChat: (chatId: string) => void;
  onSignOut: () => void;
};

export function ChatSidebar({
  chats,
  selectedChatId,
  newChatName,
  onNewChatNameChange,
  onCreateChat,
  onSelectChat,
  onSignOut,
}: ChatSidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>Chats</h1>
        <button type="button" onClick={onSignOut}>
          Sign out
        </button>
      </div>
      <form onSubmit={onCreateChat} className="new-chat-form">
        <input
          value={newChatName}
          onChange={(event) => onNewChatNameChange(event.target.value)}
          placeholder="New chat name"
          aria-label="New chat name"
        />
        <button type="submit">Create</button>
      </form>
      <ul className="chat-list">
        {chats.map((chat) => (
          <li key={chat.id}>
            <button
              type="button"
              onClick={() => onSelectChat(chat.id)}
              className={chat.id === selectedChatId ? "chat-item active" : "chat-item"}
            >
              {chat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
