import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, Edit3, ShieldCheck } from 'lucide-react';
import { userAPI } from '../services/api';

const Profile = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      setProfile(response.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
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

  const displayUser = profile || user;

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 py-10 animate-fade-in">
      <div className="bg-white rounded-3xl border border-[#FFCAD4] shadow-sm overflow-hidden">

        {/* Header band — solid color, no gradient */}
        <div className="h-28 relative" style={{ background: '#FFCAD4' }}>
          <div className="absolute -bottom-12 left-8 border-4 border-white rounded-full shadow-md" style={{ borderColor: '#fff' }}>
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold"
                 style={{ background: '#FFF0F3', color: '#C94F7C' }}>
              {displayUser?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </div>

        <div className="pt-16 p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#3A3A3A' }}>
                {displayUser?.full_name || displayUser?.username}
              </h1>
              <span className="inline-flex items-center gap-1 mt-2 text-sm font-medium px-3 py-1 rounded-full"
                    style={{ background: '#FFCAD4', color: '#C94F7C' }}>
                <ShieldCheck className="w-4 h-4" /> {displayUser?.subscription_tier || 'free'} Plan
              </span>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-smooth"
                    style={{ borderColor: '#FFCAD4', color: '#9A6B7A', background: '#FFF5F7' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#C94F7C'; e.currentTarget.style.color = '#C94F7C'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#FFCAD4'; e.currentTarget.style.color = '#9A6B7A'; }}>
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              { icon: Mail,     label: 'Email Address', value: displayUser?.email },
              { icon: User,     label: 'Username',      value: `@${displayUser?.username}` },
              { icon: Calendar, label: 'Age',           value: displayUser?.age ? `${displayUser.age} Years` : 'Not set' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="p-5 border rounded-2xl flex items-start gap-4"
                   style={{ borderColor: '#FFCAD4', background: '#FFF5F7' }}>
                <div className="p-2.5 rounded-full" style={{ background: '#FFCAD4' }}>
                  <Icon className="w-5 h-5" style={{ color: '#C94F7C' }} />
                </div>
                <div>
                  <p className="text-xs font-medium" style={{ color: '#9A6B7A' }}>{label}</p>
                  <p className="font-semibold mt-0.5" style={{ color: '#3A3A3A' }}>{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-6 flex justify-end" style={{ borderColor: '#FFCAD4' }}>
            <button
              onClick={logout}
              className="px-6 py-2 rounded-xl border text-sm font-semibold transition-smooth"
              style={{ color: '#C94F7C', borderColor: '#FFCAD4' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#FFF0F3'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
