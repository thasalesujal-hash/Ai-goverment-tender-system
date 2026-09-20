import { ChatMessage as ChatMessageType } from "../../types";
import { User, Bot } from "lucide-react";
import { SourceReference } from "../common/SourceReference";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-700"
        }`}
      >
        {isUser ? <User size={18} /> : <Bot size={18} />}
      </div>
      <div
        className={`max-w-[80%] rounded-xl px-4 py-3 ${
          isUser ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-800"
        }`}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
        {!isUser && message.source && (
          <SourceReference
            source={message.source}
            sourceDetail={message.sourceDetail}
          />
        )}
        <p className={`mt-1 text-xs ${isUser ? "text-blue-200" : "text-slate-400"}`}>
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
}
