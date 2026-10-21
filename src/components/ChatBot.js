import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
 
function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! 👋 How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);
 
  // scroll to the latest message whenever a new one arrives
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);
 
  const sendMessage = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
 
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setError('');
 
    try {
      // send the whole conversation, the AI API does not remember previous messages
      const response = await axios.post('http://localhost:5000/api/chat', { messages: newMessages });
      setMessages([...newMessages, { role: 'assistant', content: response.data.reply }]);
    } catch (error) {
      setError(error.response?.data?.errorMessage || 'Cannot reach the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-3 flex h-[28rem] w-80 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-blue-600 px-4 py-3 text-white">
            <span className="font-semibold">AI Assistant</span>
            <button onClick={() => setIsOpen(false)} aria-label="Close chat" className="text-xl leading-none">
              ×
            </button>
          </div>
 
          <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-3">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'rounded-br-sm bg-blue-600 text-white'
                      : 'rounded-bl-sm border border-gray-200 bg-white text-gray-800'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && <p className="text-sm italic text-gray-500">AI is typing…</p>}
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div ref={bottomRef} />
          </div>
 
          <form onSubmit={sendMessage} className="flex gap-2 border-t border-gray-200 p-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}
 
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-2xl text-white shadow-lg transition-colors hover:bg-blue-700"
      >
        {isOpen ? '×' : '💬'}
      </button>
    </div>
  );
}
 
export default ChatBot;
