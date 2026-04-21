import { FormEvent } from "react";

type MessageComposerProps = {
  newMessage: string;
  disabled: boolean;
  hasSelectedChat: boolean;
  onNewMessageChange: (value: string) => void;
  onSendMessage: (event: FormEvent<HTMLFormElement>) => void;
};

export function MessageComposer({
  newMessage,
  disabled,
  hasSelectedChat,
  onNewMessageChange,
  onSendMessage,
}: MessageComposerProps) {
  return (
    <form onSubmit={onSendMessage} className="message-form">
      <input
        value={newMessage}
        onChange={(event) => onNewMessageChange(event.target.value)}
        placeholder={hasSelectedChat ? "Type a message..." : "Select a chat first"}
        disabled={disabled}
        aria-label="Message content"
      />
      <button type="submit" disabled={disabled}>
        Send
      </button>
    </form>
  );
}
