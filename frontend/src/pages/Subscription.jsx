import { CheckCircle2, Star, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const C = { accent:'#E87A9A', soft:'#FFDDE2', primary:'#F7CAD0', border:'#EED9DE', text:'#3A3A3A', sub:'#5A5052', muted:'#8C7A7F', mint:'#DFF3EA', mintText:'#2E7D5A', mintBorder:'#B8E8D3' };

const FREE_FEATURES = [
  'AI symptom checker (limited queries per day)',
  'Menstrual cycle tracking',
  'Ovulation prediction',
  'Pregnancy week tracker (basic)',
  'Basic health articles (PCOS, periods, fertility)',
  'Period reminders & notifications',
  'Community Q&A forum',
];

const PREMIUM_FEATURES = [
  'Everything in Basic',
  'Detailed personalized health reports',
  'Personalized Health Insights',
  'Detailed Symptom Checker Analysis',
  'Advanced Reproductive Health Reports (PDF)',
  'AI Health Trend Tracking',
  'Smart Health Alerts for Cycle Irregularities',
];

const PlanCard = ({ title, price, period, features, isCurrent, isRecommended, actionLabel, accentColor, accentBg }) => (
  <div className="bg-white rounded-[18px] border shadow-sm relative flex flex-col"
       style={{ borderColor: isRecommended ? accentColor : C.border,
                borderWidth: isRecommended ? '2px' : '1px' }}>

    {isRecommended && (
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full text-white shadow-sm"
           style={{ background: C.accent }}>
        <Star className="w-3 h-3 fill-current" /> Recommended
      </div>
    )}

    {isCurrent && !isRecommended && (
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-semibold px-3 py-1 rounded-full"
           style={{ background: C.soft, color: C.accent }}>
        Current Plan
      </div>
    )}

    <div className="p-6 pb-4" style={{ borderBottom: `1px solid ${C.border}` }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center"
             style={{ background: accentBg }}>
          {isRecommended
            ? <Zap className="w-4 h-4" style={{ color: accentColor }} />
            : <CheckCircle2 className="w-4 h-4" style={{ color: accentColor }} />}
        </div>
        <h2 className="text-base font-bold" style={{ color: C.text }}>{title}</h2>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-extrabold" style={{ color: C.text }}>{price}</span>
        <span className="text-sm" style={{ color: C.muted }}>{period}</span>
      </div>
    </div>

    <ul className="p-6 space-y-3 flex-1">
      {features.map((f, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: accentColor }} />
          <span className="text-sm" style={{ color: C.sub }}>{f}</span>
        </li>
      ))}
    </ul>

    <div className="px-6 pb-6">
      <button
        disabled={isCurrent}
        className="w-full py-2.5 rounded-xl text-sm font-semibold transition-smooth"
        style={isCurrent
          ? { background: C.soft, color: C.muted, cursor: 'default' }
          : { background: C.accent, color: '#fff', boxShadow: '0 4px 14px rgba(232,122,154,0.30)' }}
        onMouseEnter={e => { if (!isCurrent) { e.currentTarget.style.background = '#D96C8D'; e.currentTarget.style.transform = 'scale(1.02)'; } }}
        onMouseLeave={e => { e.currentTarget.style.background = isCurrent ? C.soft : C.accent; e.currentTarget.style.transform = 'scale(1)'; }}
      >
        {actionLabel}
      </button>
    </div>
  </div>
);

const Subscription = () => {
  const { user } = useAuth();
  const isPremium = user?.subscription === 'premium';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-7 animate-fade-in">

      <div className="text-center mb-8 pb-6" style={{ borderBottom: `1px solid ${C.border}` }}>
        <h1 className="text-2xl font-bold" style={{ color: C.text, fontFamily: 'Poppins, sans-serif' }}>
          Choose Your Health Journey
        </h1>
        <p className="text-sm mt-2 max-w-md mx-auto" style={{ color: C.sub }}>
          Unlock advanced insights and connect with verified medical professionals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <PlanCard
          title="Basic Tracker"
          price="Rs. 0"
          period="forever"
          features={FREE_FEATURES}
          isCurrent={!isPremium}
          isRecommended={false}
          actionLabel="Active Plan"
          accentColor={C.mintText}
          accentBg={C.mint}
        />
        <PlanCard
          title="Premium Wellness"
          price="Rs. 199"
          period="/ month"
          features={PREMIUM_FEATURES}
          isCurrent={isPremium}
          isRecommended={true}
          actionLabel="Upgrade to Premium"
          accentColor={C.accent}
          accentBg={C.soft}
        />
      </div>

      <p className="text-center text-xs mt-8" style={{ color: C.muted }}>
        Cancel anytime · Secure payment · No hidden fees
      </p>
    </div>
  );
};

export default Subscription;
