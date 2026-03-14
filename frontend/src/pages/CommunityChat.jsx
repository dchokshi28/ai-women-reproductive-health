import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Send, UserCircle2, Users } from 'lucide-react';

const C = { accent:'#E87A9A', soft:'#FFDDE2', primary:'#F7CAD0', border:'#EED9DE', text:'#3A3A3A', sub:'#5A5052', muted:'#8C7A7F', bg:'#FFF9FA' };

const CommunityChat = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: 'Sarah T.',  text: 'Does anyone else get crazy sugar cravings a week before?', isCurrentUser: false, time: '10:00 AM' },
    { id: 2, user: 'Emma W.',   text: 'Yes! Dark chocolate is my go-to remedy.',                  isCurrentUser: false, time: '10:05 AM' },
    { id: 3, user: 'Chloe M.',  text: 'Magnesium supplements helped me a lot with cravings.',     isCurrentUser: false, time: '10:15 AM' },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setChatMessages(prev => [...prev, {
      id: Date.now(), user: user?.name || 'You', text: message,
      isCurrentUser: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
    setMessage('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        id: Date.now() + 1, user: 'HerHealth Bot',
        text: 'This is a mock chat instance. Real-time messaging will be available in v2!',
        isCurrentUser: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-7 animate-fade-in"
         style={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>

      <div className="bg-white rounded-[18px] border shadow-sm overflow-hidden flex flex-col flex-1"
           style={{ borderColor: C.border }}>

        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between"
             style={{ borderBottom: `1px solid ${C.border}`, background: C.soft }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: C.primary }}>
              <Users className="w-4 h-4" style={{ color: C.accent }} />
            </div>
            <div>
              <h2 className="text-sm font-semibold" style={{ color: C.text }}>Support Community</h2>
              <p className="text-xs" style={{ color: C.muted }}>Safe Space · Share & Support</p>
            </div>
          </div>
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: C.accent }} title="Live" />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4" style={{ background: C.bg }}>
          {chatMessages.map(msg => (
            <div key={msg.id}
                 className={`flex ${msg.isCurrentUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              <div className={`flex gap-2.5 max-w-[78%] ${msg.isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                {!msg.isCurrentUser && (
                  <div className="flex-shrink-0 mt-1">
                    <UserCircle2 className="w-7 h-7" style={{ color: C.primary }} />
                  </div>
                )}
                <div className={`flex flex-col ${msg.isCurrentUser ? 'items-end' : 'items-start'}`}>
                  <span className="text-xs mb-1" style={{ color: C.muted }}>{msg.user} · {msg.time}</span>
                  <div className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                       style={msg.isCurrentUser
                         ? { background: C.accent, color: '#fff', borderRadius: '18px 18px 4px 18px' }
                         : { background: '#fff', border: `1px solid ${C.border}`, color: C.text, borderRadius: '18px 18px 18px 4px' }}>
                    {msg.text}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white" style={{ borderTop: `1px solid ${C.border}` }}>
          <form onSubmit={handleSend} className="flex gap-2">
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)}
                   placeholder="Share your experience or ask a question…"
                   className="flex-1 px-4 py-2.5 rounded-full text-sm outline-none transition-smooth"
                   style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.text }}
                   onFocus={e => { e.target.style.borderColor = C.accent; e.target.style.boxShadow = '0 0 0 3px rgba(232,122,154,0.12)'; }}
                   onBlur={e  => { e.target.style.borderColor = C.border;  e.target.style.boxShadow = 'none'; }} />
            <button type="submit" disabled={!message.trim()}
                    className="btn-primary text-white p-2.5 rounded-full flex items-center justify-center w-10 h-10 disabled:opacity-40">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default CommunityChat;
