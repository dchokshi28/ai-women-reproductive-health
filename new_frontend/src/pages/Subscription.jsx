import { CheckCircle2, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { useState } from 'react';

const Subscription = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async (tier) => {
    setLoading(true);
    try {
      await userAPI.updateSubscription({ tier });
      alert(`Successfully upgraded to ${tier} plan!`);
      window.location.reload();
    } catch (err) {
      alert('Failed to upgrade subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 py-12 animate-fade-in">

      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif', color: '#3A3A3A' }}>
          Choose Your Health Journey
        </h1>
        <p className="text-base" style={{ color: '#9A6B7A' }}>
          Unlock advanced insights and connect with verified medical professionals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">

        {/* Free */}
        <div className="bg-white rounded-3xl p-8 border border-[#FFCAD4] shadow-sm relative">
          {user?.subscription_tier === 'free' && (
            <div className="absolute top-0 right-0 px-4 py-1 rounded-bl-xl rounded-tr-3xl text-xs font-semibold"
                 style={{ background: '#FFCAD4', color: '#C94F7C' }}>
              Current Plan
            </div>
          )}
          <h2 className="text-xl font-bold mb-2" style={{ color: '#3A3A3A' }}>Basic Tracker</h2>
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-4xl font-extrabold" style={{ color: '#3A3A3A' }}>$0</span>
            <span className="text-sm" style={{ color: '#9A6B7A' }}>/ forever</span>
          </div>
          <ul className="space-y-3 mb-8">
            {['Period & Cycle Logging', 'Basic ML Predictions', 'Community Posts Access', 'Health Quizzes', 'General Forum Access'].map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-sm" style={{ color: '#3A3A3A' }}>
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#FFCAD4' }} />
                {f}
              </li>
            ))}
          </ul>
          <button disabled
            className="w-full py-3 px-4 rounded-xl border text-sm font-semibold"
            style={{ borderColor: '#FFCAD4', color: '#9A6B7A', background: '#FFF5F7' }}>
            {user?.subscription_tier === 'free' ? 'Active Plan' : 'Downgrade'}
          </button>
        </div>

        {/* Premium */}
        <div className="rounded-3xl p-8 border shadow-md relative md:-translate-y-4"
             style={{ background: '#FFF0F3', borderColor: '#FF9AA2' }}>
          {user?.subscription_tier === 'premium' && (
            <div className="absolute top-0 right-0 px-4 py-1 rounded-bl-xl rounded-tr-3xl text-xs font-semibold"
                 style={{ background: '#C94F7C', color: '#fff' }}>
              Current Plan
            </div>
          )}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm"
               style={{ background: '#C94F7C', color: '#fff' }}>
            <Star className="w-3.5 h-3.5 fill-current" /> Recommended
          </div>

          <h2 className="text-xl font-bold mb-2" style={{ color: '#3A3A3A' }}>Premium Wellness</h2>
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-4xl font-extrabold" style={{ color: '#C94F7C' }}>$9.99</span>
            <span className="text-sm" style={{ color: '#9A6B7A' }}>/ month</span>
          </div>
          <ul className="space-y-3 mb-8">
            {['Everything in Basic', 'Advanced AI Health Insights', 'Pregnancy Planning Mode', '1-on-1 Doctor Consultations', 'Detailed Cycle Analytics PDF', 'Priority Community Support'].map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-sm" style={{ color: '#3A3A3A' }}>
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#C94F7C' }} />
                {f}
              </li>
            ))}
          </ul>
          <button
            onClick={() => handleUpgrade('premium')}
            disabled={loading || user?.subscription_tier === 'premium'}
            className="w-full py-3 px-4 rounded-xl text-white text-sm font-bold transition-smooth disabled:opacity-50"
            style={{ background: '#C94F7C' }}
            onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.background = '#b3436c'; }}
            onMouseLeave={e => e.currentTarget.style.background = '#C94F7C'}
          >
            {user?.subscription_tier === 'premium' ? 'Active Plan' : loading ? 'Processing…' : 'Upgrade to Premium'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Subscription;
