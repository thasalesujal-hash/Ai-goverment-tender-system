import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { ChatMessage } from "../components/chat/ChatMessage";
import { ChatInput } from "../components/chat/ChatInput";
import { SuggestedQuestions } from "../components/chat/SuggestedQuestions";
import { LoadingState } from "../components/common/LoadingState";
import { copilotService } from "../services/copilotService";
import { ChatMessage as ChatMessageType } from "../types";
import { Bot, ArrowLeft } from "lucide-react";

export default function Chat() {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function init() {
      if (!id) return;
      const questions = await copilotService.getSuggestedQuestions(id);
      setSuggestedQuestions(questions);
      setLoading(false);
    }
    init();
  }, [id]);

  const handleSend = async (content: string) => {
    const userMessage: ChatMessageType = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setSending(true);

    try {
      const response = await copilotService.sendMessage(id!, content);
      const assistantMessage: ChatMessageType = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response.answer,
        source: response.source,
        sourceDetail: response.sourceDetail,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setSending(false);
    }
  };

  const handleSelectQuestion = (question: string) => {
    handleSend(question);
  };

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-8rem)] flex-col">
        <div className="mb-4 flex items-center gap-4">
          <Link to={`/tenders/${id}`}>
            <button className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900">
              <ArrowLeft size={18} />
              Back to Tender
            </button>
          </Link>
        </div>

        <div className="flex-1 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-200 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Bot size={24} />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">Tender Copilot</h1>
              <p className="text-xs text-slate-500">Ask questions about this tender document.</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <LoadingState lines={3} />
            ) : messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-4 rounded-full bg-blue-50 p-4 text-blue-600">
                  <Bot size={32} />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">How can I help you?</h3>
                <p className="mb-6 max-w-sm text-sm text-slate-500">
                  Ask any question about this tender and I will find the answer from the documents.
                </p>
                <SuggestedQuestions
                  questions={suggestedQuestions}
                  onSelect={handleSelectQuestion}
                />
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}
                {sending && (
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-700">
                      <Bot size={18} />
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                      <div className="flex gap-1">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0.2s]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 p-4">
            <ChatInput onSend={handleSend} disabled={sending} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
