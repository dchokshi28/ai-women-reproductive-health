import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Activity, TrendingUp, BookOpen, MessageCircle, Sparkles, Leaf, Bell, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

/* ── Tokens ── */
const C = {
  bg:       '#FFF9FA',
  card:     '#FFFFFF',
  border:   '#EED9DE',
  primary:  '#F7CAD0',
  soft:     '#FFDDE2',
  accent:   '#E87A9A',
  accentHover: '#D96C8D',
  text:     '#3A3A3A',
  sub:      '#5A5052',
  muted:    '#8C7A7F',
  mint:     '#DFF3EA',
  mintText: '#2E7D5A',
};

const DotLoader = () => (
  <div className="flex flex-col items-center justify-center gap-3 py-8">
    <div className="dot-loader"><span /><span /><span /></div>
    <p className="text-sm" style={{ color: C.muted }}>Analyzing your cycle data…</p>
  </div>
);

/* ── Dot scale — pain / mood ── */
const DotScale = ({ value, max = 5, color, label }) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-xs font-medium" style={{ color: C.muted }}>{label}</span>
    <div className="flex items-center gap-1.5">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className="rounded-full inline-block transition-all duration-200" style={{
          width:  i < value ? 11 : 7,
          height: i < value ? 11 : 7,
          background: i < value ? color : '#EED9DE',
          opacity: i < value ? 1 : 0.6,
        }} />
      ))}
      <span className="ml-1 text-xs font-bold" style={{ color }}>{value}/{max}</span>
    </div>
  </div>
);

/* ── Cycle ring ── */
const CycleRing = ({ dayOfCycle, cycleLength }) => {
  const r = 52, circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(dayOfCycle / cycleLength, 1));
  const phases = ['Menstrual', 'Follicular', 'Ovulation', 'Luteal'];
  const phase  = dayOfCycle <= 5 ? phases[0] : dayOfCycle <= 13 ? phases[1] : dayOfCycle <= 16 ? phases[2] : phases[3];
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg width="128" height="128" viewBox="0 0 128 128" className="absolute inset-0">
          <circle cx="64" cy="64" r={r} className="cycle-ring-track" />
          <circle cx="64" cy="64" r={r} className="cycle-ring-progress"
            strokeDasharray={circ} strokeDashoffset={offset} transform="rotate(-90 64 64)" />
        </svg>
        <div className="flex flex-col items-center z-10 select-none">
          <span className="text-2xl font-bold leading-none" style={{ color: C.text }}>{dayOfCycle}</span>
          <span className="text-xs mt-0.5" style={{ color: C.muted }}>of {cycleLength}</span>
        </div>
      </div>
      <span className="mt-3 text-xs font-semibold px-3 py-1 rounded-full"
            style={{ background: C.soft, color: C.accent }}>{phase} Phase</span>
    </div>
  );
};

const Stagger = ({ delay = 0, children }) => (
  <div className="animate-slide-up" style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}>{children}</div>
);

const getDailyTip = (d) => {
  if (d <= 5)  return 'During the menstrual phase, your body benefits from iron-rich foods like spinach and lentils.';
  if (d <= 13) return 'In the follicular phase, estrogen rises — great time to focus on strength training and learning.';
  if (d <= 16) return 'Around ovulation, your communication skills peak. Use this energy for important conversations.';
  return 'In the luteal phase, magnesium from dark chocolate and nuts can help ease PMS symptoms.';
};

const StatRow = ({ label, value, last = false }) => (
  <div className={`flex justify-between items-center py-2.5 ${!last ? 'border-b' : ''}`}
       style={{ borderColor: C.border }}>
    <span className="text-sm" style={{ color: C.sub }}>{label}</span>
    <span className="text-sm font-semibold" style={{ color: C.text }}>{value}</span>
  </div>
);

/* ── Card wrapper ── */
const Card = ({ children, className = '', style = {} }) => (
  <div className={`bg-white rounded-[18px] border shadow-card ${className}`}
       style={{ borderColor: C.border, boxShadow: '0 10px 25px rgba(0,0,0,0.04)', ...style }}>
    {children}
  </div>
);

const CardHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-4">
    <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: C.soft }}>
      <Icon className="w-3.5 h-3.5" style={{ color: C.accent }} />
    </div>
    <h2 className="text-sm font-semibold" style={{ color: C.text }}>{title}</h2>
  </div>
);

/* ─────────────────────────────────────────
   DASHBOARD
───────────────────────────────────────── */
const Dashboard = () => {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [prediction, setPrediction]               = useState(null);
  const [loadingPrediction, setLoadingPrediction] = useState(false);

  const recentCycleData = JSON.parse(localStorage.getItem('recentCycle')) || null;

  useEffect(() => {
    if (recentCycleData && !prediction && !loadingPrediction) {
      setLoadingPrediction(true);
      axios.post('http://localhost:5000/api/predict', recentCycleData)
        .then(r => { setPrediction(r.data); setLoadingPrediction(false); })
        .catch(() => setLoadingPrediction(false));
    }
  }, []);

  const cycleLength  = recentCycleData?.cycleLength || user?.cycleLength || 28;
  const startDate    = recentCycleData?.date ? new Date(recentCycleData.date) : new Date();
  const today        = new Date();
  const dayOfCycle   = Math.max(1, Math.min(Math.floor((today - startDate) / 86400000) + 1, cycleLength));
  const nextPeriod   = new Date(startDate.getTime() + cycleLength * 86400000);
  const daysUntil    = Math.max(0, Math.ceil((nextPeriod - today) / 86400000));
  const countdownPct = Math.max(0, Math.min(100, ((cycleLength - daysUntil) / cycleLength) * 100));
  const dailyTip     = getDailyTip(dayOfCycle);
  const fmt          = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const painLevel = recentCycleData?.painLevel ?? recentCycleData?.Pain_Level ?? null;
  const moodLevel = recentCycleData?.moodLevel ?? recentCycleData?.Mood_Changes ?? null;

  const tiles = [
    { label: 'Doctor Posts',   sub: 'Expert advice',       path: '/posts',        icon: BookOpen,      bg: '#FFECEF' },
    { label: 'Health Quiz',    sub: 'Test your knowledge', path: '/quiz',         icon: Activity,      bg: '#FFF1F4' },
    { label: 'Community Chat', sub: 'Connect with others', path: '/chat',         icon: MessageCircle, bg: '#FDEFF2' },
    { label: 'Notifications',  sub: 'Stay up to date',     path: '/subscription', icon: Bell,          bg: '#FFF3F5' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {/* ── Greeting banner — soft pink highlight ── */}
      <Stagger delay={0}>
        <div className="rounded-2xl px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
             style={{ background: C.soft, border: `1px solid ${C.primary}` }}>
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0"
                 style={{ background: '#fff', color: C.accent, boxShadow: '0 2px 8px rgba(232,122,154,0.18)' }}>
              {(user?.name || user?.username || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: C.text, fontFamily: 'Poppins, sans-serif' }}>
                Hello, {user?.name || user?.username || 'there'} 👋
              </h1>
              <p className="text-sm mt-0.5" style={{ color: C.sub }}>Your reproductive health summary for today.</p>
            </div>
          </div>
          <button onClick={() => navigate('/log-cycle')}
                  className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold self-start sm:self-auto">
            <Calendar className="w-4 h-4" /> Log Cycle
          </button>
        </div>
      </Stagger>

      {/* ── Next Period Countdown — white card ── */}
      <Stagger delay={60}>
        <Card className="px-5 py-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
               style={{ background: C.soft }}>
            <Calendar className="w-5 h-5" style={{ color: C.accent }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-2">
              <span className="text-sm font-semibold" style={{ color: C.text }}>Next Period</span>
              <span className="text-xs" style={{ color: C.muted }}>{fmt(nextPeriod)}</span>
              <span className="ml-auto text-sm font-bold" style={{ color: C.accent }}>
                {daysUntil === 0 ? 'Today' : `${daysUntil} day${daysUntil !== 1 ? 's' : ''} away`}
              </span>
            </div>
            {/* Mint progress bar */}
            <div className="h-2 rounded-full overflow-hidden" style={{ background: '#EED9DE' }}>
              <div className="h-full rounded-full transition-all duration-700"
                   style={{ width: `${countdownPct}%`, background: C.mint }} />
            </div>
          </div>
        </Card>
      </Stagger>

      {/* ── Two cards: Cycle Tracker + AI Insights ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-6 section-divider">

        {/* Cycle Tracker */}
        <Stagger delay={120}>
          <Card className="p-5 h-full">
            <CardHeader icon={Activity} title="Cycle Tracker" />
            <div className="flex justify-center mb-5">
              <CycleRing dayOfCycle={dayOfCycle} cycleLength={cycleLength} />
            </div>
            <div className="rounded-xl px-4 py-1" style={{ background: '#FFF9FA', border: `1px solid ${C.border}` }}>
              <StatRow label="Cycle Start"  value={fmt(startDate)} />
              <StatRow label="Next Period"  value={fmt(nextPeriod)} />
              <StatRow label="Cycle Length" value={`${cycleLength} days`} />
              <StatRow label="Days Away"    value={`${daysUntil} days`} last />
            </div>
            {(painLevel !== null || moodLevel !== null) && (
              <div className="flex gap-6 mt-4 pt-3 border-t" style={{ borderColor: C.border }}>
                {painLevel !== null && <DotScale value={painLevel} max={5} color={C.accent} label="Pain" />}
                {moodLevel !== null && <DotScale value={moodLevel} max={5} color="#F7CAD0" label="Mood" />}
              </div>
            )}
          </Card>
        </Stagger>

        {/* AI Health Insights */}
        <Stagger delay={180}>
          <Card className="p-5 h-full flex flex-col">
            <CardHeader icon={Sparkles} title="AI Health Insights" />

            {!recentCycleData ? (
              <div className="flex flex-col items-center text-center gap-3 py-6 rounded-xl flex-1 justify-center"
                   style={{ background: C.soft, border: `1px dashed ${C.primary}` }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-sm">
                  <Heart className="w-5 h-5" style={{ color: C.accent }} />
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: C.text }}>No insights yet</p>
                  <p className="text-sm leading-relaxed" style={{ color: C.sub }}>
                    Log your first cycle to unlock personalized AI health insights.
                  </p>
                </div>
                <button onClick={() => navigate('/log-cycle')}
                        className="btn-primary text-white text-xs font-semibold px-4 py-2 rounded-lg">
                  Log your first cycle →
                </button>
              </div>

            ) : loadingPrediction ? (
              <DotLoader />

            ) : prediction ? (
              <div className="space-y-3 flex-1">
                <div className="rounded-xl p-4 flex items-start gap-3"
                     style={{ background: '#FFF9FA', border: `1px solid ${C.border}` }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                       style={{ background: C.soft }}>
                    <TrendingUp className="w-4 h-4" style={{ color: C.accent }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm" style={{ color: C.text }}>{prediction.prediction}</h3>
                    <p className="text-sm mt-1 leading-relaxed" style={{ color: C.sub }}>{prediction.recommendation}</p>
                  </div>
                </div>
                {/* Confidence bar — mint */}
                {prediction.confidence != null && (
                  <div className="rounded-xl p-4" style={{ background: '#FFF9FA', border: `1px solid ${C.border}` }}>
                    <div className="flex justify-between text-xs mb-1.5" style={{ color: C.muted }}>
                      <span>Confidence</span>
                      <span className="font-semibold" style={{ color: C.mintText }}>{prediction.confidence}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: '#EED9DE' }}>
                      <div className="h-full rounded-full transition-all duration-1000"
                           style={{ width: `${prediction.confidence}%`, background: C.mint }} />
                    </div>
                  </div>
                )}
                <div className="rounded-xl p-4" style={{ background: '#FFF9FA', border: `1px solid ${C.border}` }}>
                  <p className="text-xs font-semibold mb-1.5" style={{ color: C.accent }}>
                    Day {dayOfCycle} · {dayOfCycle <= 5 ? 'Menstrual' : dayOfCycle <= 13 ? 'Follicular' : dayOfCycle <= 16 ? 'Ovulation' : 'Luteal'} Phase
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: C.sub }}>{dailyTip}</p>
                </div>
              </div>

            ) : (
              <div className="rounded-xl p-4 flex-1" style={{ background: '#FFF9FA', border: `1px solid ${C.border}` }}>
                <p className="text-sm" style={{ color: C.sub }}>Could not load prediction. Please ensure the backend is running.</p>
              </div>
            )}
          </Card>
        </Stagger>
      </div>

      {/* ── Daily Tip — soft pink highlight ── */}
      <Stagger delay={260}>
        <div className="rounded-[18px] px-5 py-4 flex items-start gap-4"
             style={{ background: C.soft, border: `1px solid ${C.primary}` }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-white shadow-sm">
            <Leaf className="w-4 h-4" style={{ color: C.accent }} />
          </div>
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: C.text }}>Daily Tip 🌿</p>
            <p className="text-sm leading-relaxed" style={{ color: C.sub }}>{dailyTip}</p>
          </div>
        </div>
      </Stagger>

      {/* ── Explore Features — white card, icon bg tinted ── */}
      <Stagger delay={340}>
        <Card className="p-5">
          <h2 className="text-sm font-semibold mb-4" style={{ color: C.text }}>Explore Features</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {tiles.map(({ label, sub, path, icon: Icon, bg }, i) => (
              <button key={label} onClick={() => navigate(path)}
                className="rounded-2xl p-5 flex flex-col items-center text-center group border tile-hover bg-white"
                style={{ borderColor: C.border, animationDelay: `${340 + i * 60}ms` }}>
                <div className="w-11 h-11 rounded-full flex items-center justify-center mb-3 transition-transform duration-200 group-hover:scale-110"
                     style={{ background: bg }}>
                  <Icon className="w-5 h-5" style={{ color: C.accent }} />
                </div>
                <span className="text-sm font-semibold block" style={{ color: C.text }}>{label}</span>
                <span className="text-xs mt-1 leading-snug block" style={{ color: C.muted }}>{sub}</span>
              </button>
            ))}
          </div>
        </Card>
      </Stagger>

    </div>
  );
};

export default Dashboard;
