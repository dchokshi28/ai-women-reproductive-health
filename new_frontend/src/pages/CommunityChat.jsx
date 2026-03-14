import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Send, UserCircle2 } from 'lucide-react';
import { chatAPI } from '../services/api';

const CommunityChat = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const fetchMessages = async () => {
    try {
      const response = await chatAPI.getMessages();
      setChatMessages(response.data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      await chatAPI.sendMessage({ message });
      setMessage('');
      fetchMessages();
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const formatTime = (dateString) =>
    new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen app-bg">
        <div className="dot-loader flex gap-2"><span /><span /><span /></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-80px)] p-4 flex flex-col md:p-8 animate-fade-in">
      <div className="bg-white rounded-3xl border border-[#FFCAD4] shadow-sm overflow-hidden flex flex-col h-full">

        {/* Header */}
        <div className="p-4 md:p-5 border-b flex items-center justify-between"
             style={{ background: '#FFF0F3', borderColor: '#FFCAD4' }}>
          <div>
            <h2 className="text-lg font-bold" style={{ color: '#3A3A3A' }}>Support Community</h2>
            <p className="text-xs font-medium" style={{ color: '#9A6B7A' }}>Safe Space · Share & Support</p>
          </div>
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#C94F7C' }} title="Live" />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-3" style={{ background: '#FFF5F7' }}>
          {chatMessages.map(msg => (
            <div key={msg.id}
                 className={`flex ${msg.username === user?.username ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              <div className={`flex gap-2.5 max-w-[78%] ${msg.username === user?.username ? 'flex-row-reverse' : 'flex-row'}`}>
                {msg.username !== user?.username && (
                  <div className="flex-shrink-0 mt-1">
                    <UserCircle2 className="w-7 h-7" style={{ color: '#FFCAD4' }} />
                  </div>
                )}
                <div className={`flex flex-col ${msg.username === user?.username ? 'items-end' : 'items-start'}`}>
                  <span className="text-xs mb-1" style={{ color: '#C4A0AE' }}>
                    {msg.username} · {formatTime(msg.created_at)}
                  </span>
                  <div className="px-4 py-2.5 rounded-2xl text-sm shadow-sm"
                       style={msg.username === user?.username
                         ? { background: '#C94F7C', color: '#fff', borderRadius: '18px 18px 4px 18px' }
                         : { background: '#fff', color: '#3A3A3A', border: '1px solid #FFCAD4', borderRadius: '18px 18px 18px 4px' }}>
                    {msg.message}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t" style={{ borderColor: '#FFCAD4' }}>
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your experience or ask a question…"
              className="flex-1 px-4 py-3 rounded-full text-sm outline-none transition-smooth"
              style={{ background: '#FFF5F7', border: '1px solid #FFCAD4', color: '#3A3A3A' }}
              onFocus={e => e.target.style.borderColor = '#C94F7C'}
              onBlur={e => e.target.style.borderColor = '#FFCAD4'}
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="p-3 rounded-full transition-smooth flex items-center justify-center min-w-[46px] disabled:opacity-40"
              style={{ background: '#C94F7C', color: '#fff' }}
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default CommunityChat;
