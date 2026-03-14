import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Send, UserCircle2 } from 'lucide-react';
import { chatAPI } from '../services/api';

const CommunityChat = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    try {
      await chatAPI.sendMessage({ message });
      setMessage("");
      fetchMessages();
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep-pink"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-80px)] p-4 flex flex-col md:p-8 animate-fade-in">
      
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
        <div className="bg-gradient-to-r from-blue-50 to-soft-lavender/20 p-4 md:p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Support Community</h2>
            <p className="text-xs text-gray-500 font-medium">Safe Space • Share & Support</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gray-50/50">
          {chatMessages.map(msg => (
            <div key={msg.id} className={`flex ${msg.username === user?.username ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              <div className={`flex gap-3 max-w-[80%] ${msg.username === user?.username ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {msg.username !== user?.username && (
                   <div className="flex-shrink-0 mt-1">
                     <UserCircle2 className="w-8 h-8 text-gray-400" />
                   </div>
                )}
                
                <div className={`flex flex-col ${msg.username === user?.username ? 'items-end' : 'items-start'}`}>
                  <span className="text-xs text-gray-500 mb-1 ml-1">{msg.username} • {formatTime(msg.created_at)}</span>
                  <div className={`px-4 py-3 rounded-2xl shadow-sm ${
                    msg.username === user?.username
                      ? 'bg-deep-pink text-white rounded-tr-sm' 
                      : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'
                  }`}>
                    {msg.message}
                  </div>
                </div>

              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-gray-100">
          <form onSubmit={handleSend} className="flex gap-2">
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your experience or ask a question..."
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-deep-pink/50 focus:border-transparent transition-smooth"
            />
            <button 
              type="submit"
              disabled={!message.trim()}
              className="bg-deep-pink hover:bg-pink-600 disabled:bg-pink-300 disabled:cursor-not-allowed text-white p-3 rounded-full transition-smooth shadow-sm flex items-center justify-center min-w-[50px]"
            >
              <Send className="w-5 h-5 ml-1" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default CommunityChat;
