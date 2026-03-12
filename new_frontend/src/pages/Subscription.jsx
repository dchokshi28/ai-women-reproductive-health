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
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Choose Your Health Journey</h1>
        <p className="text-gray-500 text-lg">Unlock advanced insights and connect with verified medical professionals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200 relative">
          {user?.subscription_tier === 'free' && (
             <div className="absolute top-0 right-0 bg-gray-100 text-gray-600 px-4 py-1 rounded-bl-xl rounded-tr-3xl text-sm font-semibold">
               Current Plan
             </div>
          )}
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Basic Tracker</h2>
          <div className="flex items-baseline gap-2 mb-6 text-gray-800">
            <span className="text-4xl font-extrabold">$0</span>
            <span className="text-gray-500">/ forever</span>
          </div>
          
          <ul className="space-y-4 mb-8">
            {[
              "Period & Cycle Logging",
              "Basic ML Predictions",
              "Community Posts Access",
              "Health Quizzes",
              "General Forum Access"
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700 font-medium">{feature}</span>
              </li>
            ))}
          </ul>
          
          <button 
            disabled
            className="w-full py-3 px-4 rounded-xl border-2 border-gray-200 text-gray-500 font-semibold bg-gray-50"
          >
             {user?.subscription_tier === 'free' ? 'Active Plan' : 'Downgrade'}
          </button>
        </div>

        <div className="bg-gradient-to-br from-soft-pink/30 to-soft-lavender/30 rounded-3xl p-8 shadow-lg border border-deep-pink/30 relative transform md:-translate-y-4">
          {user?.subscription_tier === 'premium' && (
             <div className="absolute top-0 right-0 bg-deep-pink text-white px-4 py-1 rounded-bl-xl rounded-tr-3xl text-sm font-semibold">
               Current Plan
             </div>
          )}
          
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-deep-pink text-white px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1 shadow-md">
            <Star className="w-4 h-4 fill-current" /> Recommended
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Premium Wellness</h2>
          <div className="flex items-baseline gap-2 mb-6 text-gray-800">
            <span className="text-4xl font-extrabold">$9.99</span>
            <span className="text-gray-500">/ month</span>
          </div>
          
          <ul className="space-y-4 mb-8">
            {[
              "Everything in Basic",
              "Advanced AI Health Insights",
              "Pregnancy Planning Mode",
              "1-on-1 Doctor Consultations",
              "Detailed Cycle Analytics PDF",
              "Priority Community Support"
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-deep-pink" />
                <span className="text-gray-800 font-medium">{feature}</span>
              </li>
            ))}
          </ul>
          
          <button 
            onClick={() => handleUpgrade('premium')}
            disabled={loading || user?.subscription_tier === 'premium'}
            className="w-full py-3 px-4 rounded-xl bg-deep-pink hover:bg-pink-600 text-white font-bold shadow-md transition-smooth disabled:opacity-50"
          >
             {user?.subscription_tier === 'premium' ? 'Active Plan' : loading ? 'Processing...' : 'Upgrade to Premium'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Subscription;
