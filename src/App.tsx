import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from "@aws-amplify/ui-react";
import "./App.css";
import { ChatSidebar } from "./components/ChatSidebar";
import { ConversationView } from "./components/ConversationView";
import { MessageComposer } from "./components/MessageComposer";

const client = generateClient<Schema>();

function App() {
  const chatModel = client.models.Chat;
  const messageModel = client.models.Message;
  const isSchemaReady = Boolean(chatModel && messageModel);
  const [chats, setChats] = useState<Array<Schema["Chat"]["type"]>>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<Schema["Message"]["type"]>>([]);
  const [newMessage, setNewMessage] = useState("");
  const [newChatName, setNewChatName] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { signOut } = useAuthenticator();

  const selectedChat = useMemo(
    () => chats.find((chat) => chat.id === selectedChatId) ?? null,
    [chats, selectedChatId],
  );

  useEffect(() => {
    if (!chatModel) {
      return;
    }

    const subscription = chatModel.observeQuery().subscribe({
      next: ({ items }) => {
        const sortedChats = [...items].sort((a, b) => a.name.localeCompare(b.name));
        setChats(sortedChats);
        if (!selectedChatId && sortedChats.length > 0) {
          setSelectedChatId(sortedChats[0].id);
        }
      },
    });

    return () => subscription.unsubscribe();
  }, [chatModel, selectedChatId]);

  useEffect(() => {
    if (!selectedChatId || !messageModel) {
      return;
    }

    const subscription = messageModel.observeQuery({
      filter: { chatId: { eq: selectedChatId } },
    }).subscribe({
      next: ({ items }) => {
        const sortedMessages = [...items].sort((a, b) =>
          (a.createdAt ?? "").localeCompare(b.createdAt ?? ""),
        );
        setMessages(sortedMessages);
      },
    });

    return () => subscription.unsubscribe();
  }, [messageModel, selectedChatId]);

  const visibleMessages = selectedChatId ? messages : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function createChat(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = newChatName.trim();
    if (!name || !chatModel) return;

    const { data } = await chatModel.create({ name });
    setNewChatName("");
    if (data?.id) {
      setSelectedChatId(data.id);
    }
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = newMessage.trim();
    if (!content || !selectedChatId || !messageModel) return;

    setNewMessage("");
    await messageModel.create({
      chatId: selectedChatId,
      content,
      createdAt: new Date().toISOString(),
    });
  }

  return (
    <main className="chat-app">
      <ChatSidebar
        chats={chats}
        selectedChatId={selectedChatId}
        newChatName={newChatName}
        onNewChatNameChange={setNewChatName}
        onCreateChat={createChat}
        onSelectChat={setSelectedChatId}
        onSignOut={signOut}
      />

      <section className="conversation-panel">
        {!isSchemaReady && (
          <div className="conversation-header">
            <h2>Backend schema not synced</h2>
            <p>
              Run your Amplify sandbox/deploy command to apply the new Chat/Message models, then refresh this page.
            </p>
          </div>
        )}
        <ConversationView
          chatName={selectedChat ? selectedChat.name : "Select a chat"}
          messages={visibleMessages}
          messagesEndRef={messagesEndRef}
        />
        <MessageComposer
          newMessage={newMessage}
          disabled={!selectedChatId || !isSchemaReady}
          hasSelectedChat={Boolean(selectedChat)}
          onNewMessageChange={setNewMessage}
          onSendMessage={sendMessage}
        />
      </section>
    </main>
  );
}

export default App;
