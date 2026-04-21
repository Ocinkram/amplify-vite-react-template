import type { Schema } from "../../amplify/data/resource";
import type { RefObject } from "react";

type ConversationViewProps = {
  chatName: string;
  messages: Array<Schema["Message"]["type"]>;
  messagesEndRef: RefObject<HTMLDivElement>;
};

export function ConversationView({
  chatName,
  messages,
  messagesEndRef,
}: ConversationViewProps) {
  return (
    <>
      <div className="conversation-header">
        <h2>{chatName}</h2>
      </div>
      <div className="messages">
        {messages.map((message) => (
          <article key={message.id} className="message">
            <p>{message.content}</p>
            <time dateTime={message.createdAt ?? ""}>
              {message.createdAt ? new Date(message.createdAt).toLocaleTimeString() : ""}
            </time>
          </article>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </>
  );
}
