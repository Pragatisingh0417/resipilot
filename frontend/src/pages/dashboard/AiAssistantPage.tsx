import { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import { api } from '@/lib/api';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message { role: 'user' | 'assistant'; content: string; }

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm the ResiPilot AI Assistant. I can help you with case management, risk assessment, foster family matching, and more. How can I help you today?" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input };
    const allMsgs = [...messages, userMsg];
    setMessages(allMsgs);
    setInput('');
    setLoading(true);

    let assistantSoFar = '';
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant' && prev.length === allMsgs.length + 1) {
          return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
        }
        return [...prev, { role: 'assistant', content: assistantSoFar }];
      });
    };

    console.log("SENDING:", {
  messages: allMsgs.map(m => ({ role: m.role, content: m.content })),
  caseData: { test: "data" }
});

    try {
const resp = await api.stream('/ai/chat', { 
  messages: allMsgs.map(m => ({ role: m.role, content: m.content })),
  caseData: {
    // TEMP dummy data (later connect real DB)
    childAge: 10,
    incidents: 2,
    attendance: "75%",
    behavior: "Needs monitoring"
  }
});


if (!resp.body) throw new Error('No response body');
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const json = line.slice(6).trim();
          if (json === '[DONE]') break;
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) upsert(content);
          } catch {}
        }
      }
    } catch (e: any) {
      upsert('\n\n*Error: ' + e.message + '*');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header title="AI Assistant" description="Get help with case management and analysis" />
      <div className="flex-1 p-6 flex flex-col min-h-0">
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 bg-brand-50 rounded-full flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-brand-600" />
                  </div>
                )}
                <div className={`max-w-[70%] p-4 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-brand-600 text-white' : 'bg-gray-50 text-gray-700'}`}>
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            {loading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-brand-50 rounded-full flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-brand-600" />
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl"><Loader2 className="h-4 w-4 animate-spin text-gray-400" /></div>
              </div>
            )}
          </div>
          <div className="border-t p-4 flex gap-3">
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="Ask about cases, risk assessment, matching..." disabled={loading} />
            <button onClick={handleSend} disabled={loading || !input.trim()}
              className="px-4 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
