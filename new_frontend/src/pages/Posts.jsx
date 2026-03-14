import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, BadgeCheck } from 'lucide-react';
import { postsAPI } from '../services/api';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    try {
      const response = await postsAPI.getAll();
      setPosts(response.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen app-bg">
        <div className="dot-loader flex gap-2"><span /><span /><span /></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 animate-fade-in space-y-5">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'Poppins, sans-serif', color: '#3A3A3A' }}>
          Verified Health Feed
        </h1>
        <p className="text-sm mt-1" style={{ color: '#9A6B7A' }}>Expert advice from certified gynecologists.</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12" style={{ color: '#9A6B7A' }}>No posts available.</div>
      ) : (
        posts.map(post => (
          <div key={post.id} className="bg-white rounded-2xl border border-[#FFCAD4] overflow-hidden shadow-sm transition-smooth hover:shadow-md hover:border-[#FF9AA2]">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={post.profile_image || post.profileImage}
                  alt={post.doctor_name || post.doctorName}
                  className="w-12 h-12 rounded-full object-cover border-2"
                  style={{ borderColor: '#FFCAD4' }}
                />
                <div>
                  <h3 className="font-semibold flex items-center gap-1.5" style={{ color: '#3A3A3A' }}>
                    {post.doctor_name || post.doctorName}
                    {post.verified && <BadgeCheck className="w-4 h-4" style={{ color: '#C94F7C' }} />}
                  </h3>
                  <span className="text-xs" style={{ color: '#9A6B7A' }}>Gynecologist & Health Expert</span>
                </div>
              </div>

              <h4 className="text-lg font-bold mb-2" style={{ color: '#3A3A3A' }}>{post.title}</h4>
              <p className="text-sm leading-relaxed mb-5" style={{ color: '#9A6B7A' }}>{post.content}</p>

              <div className="flex items-center gap-5 pt-4 border-t" style={{ borderColor: '#FFCAD4' }}>
                <button className="flex items-center gap-1.5 text-sm font-medium transition-smooth group"
                        style={{ color: '#9A6B7A' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#C94F7C'}
                        onMouseLeave={e => e.currentTarget.style.color = '#9A6B7A'}>
                  <Heart className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  {post.likes}
                </button>
                <button className="flex items-center gap-1.5 text-sm font-medium transition-smooth group"
                        style={{ color: '#9A6B7A' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#FF9AA2'}
                        onMouseLeave={e => e.currentTarget.style.color = '#9A6B7A'}>
                  <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  {post.comments}
                </button>
                <button className="flex items-center gap-1.5 text-sm font-medium transition-smooth ml-auto"
                        style={{ color: '#9A6B7A' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#C94F7C'}
                        onMouseLeave={e => e.currentTarget.style.color = '#9A6B7A'}>
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Posts;
