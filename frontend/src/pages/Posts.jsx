import { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, MessageCircle, Share2, BadgeCheck } from 'lucide-react';

const C = { accent:'#E87A9A', soft:'#FFDDE2', primary:'#F7CAD0', border:'#EED9DE', text:'#3A3A3A', sub:'#5A5052', muted:'#8C7A7F' };

const Posts = () => {
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/posts')
      .then(res  => { setPosts(res.data); setLoading(false); })
      .catch(()  => { setLoading(false); });
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="dot-loader"><span /><span /><span /></div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-7 animate-fade-in">
      <div className="mb-6 pb-5" style={{ borderBottom: `1px solid ${C.border}` }}>
        <h1 className="text-2xl font-bold" style={{ color: C.text, fontFamily: 'Poppins, sans-serif' }}>
          Verified Health Feed
        </h1>
        <p className="text-sm mt-1" style={{ color: C.muted }}>
          Expert advice and awareness from certified gynecologists.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-[18px] border p-12 text-center shadow-sm" style={{ borderColor: C.border }}>
          <p className="text-sm" style={{ color: C.muted }}>No posts available right now. Check back soon.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-[18px] border shadow-sm overflow-hidden tile-hover"
                 style={{ borderColor: C.border }}>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <img src={post.profileImage} alt={post.doctorName}
                       className="w-10 h-10 rounded-full object-cover border-2"
                       style={{ borderColor: C.primary }} />
                  <div>
                    <h3 className="text-sm font-semibold flex items-center gap-1.5" style={{ color: C.text }}>
                      {post.doctorName}
                      {post.verified && <BadgeCheck className="w-4 h-4" style={{ color: C.accent }} />}
                    </h3>
                    <span className="text-xs" style={{ color: C.muted }}>Gynecologist & Health Expert</span>
                  </div>
                </div>

                <h4 className="text-base font-semibold mb-2" style={{ color: C.text }}>{post.title}</h4>
                <p className="text-sm leading-relaxed" style={{ color: C.sub }}>{post.content}</p>

                <div className="flex items-center gap-5 mt-4 pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
                  <button className="flex items-center gap-1.5 text-sm transition-smooth"
                          style={{ color: C.muted }}
                          onMouseEnter={e => e.currentTarget.style.color = C.accent}
                          onMouseLeave={e => e.currentTarget.style.color = C.muted}>
                    <Heart className="w-4 h-4" />
                    <span className="font-medium">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-sm transition-smooth"
                          style={{ color: C.muted }}
                          onMouseEnter={e => e.currentTarget.style.color = C.accent}
                          onMouseLeave={e => e.currentTarget.style.color = C.muted}>
                    <MessageCircle className="w-4 h-4" />
                    <span className="font-medium">{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-sm transition-smooth ml-auto"
                          style={{ color: C.muted }}
                          onMouseEnter={e => e.currentTarget.style.color = C.accent}
                          onMouseLeave={e => e.currentTarget.style.color = C.muted}>
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;
