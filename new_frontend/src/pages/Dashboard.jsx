import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Activity, TrendingUp, BookOpen, MessageCircle, Sparkles, Leaf, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cyclesAPI } from '../services/api';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Title, Tooltip, Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DotLoader = () => (
  <div className="flex flex-col items-center justify-center gap-3 h-40">
    <div className="dot-loader flex gap-2"><span /><span /><span /></div>
    <p className="text-sm tracking-wide" style={{ color: '#9A6B7A' }}>Analyzing your cycle data…</p>
  </div>
);

/* ── Dot scale indicator (mood / pain) ── */
const DotScale = ({ value, max = 5, activeColor, label }) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-xs font-medium" style={{ color: '#9A6B7A' }}>{label}</span>
    <div className="flex items-center gap-1.5">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className="rounded-full transition-all duration-200"
          style={{
            width: i < value ? 12 : 9,
            height: i < value ? 12 : 9,
            background: i < value ? activeColor : '#FFCAD4',
            opacity: i < value ? 1 : 0.45,
            boxShadow: i < value ? `0 0 0 2px ${activeColor}22` : 'none',
          }}
        />
      ))}
      <span className="ml-1 text-xs font-semibold" style={{ color: activeColor }}>{value}/{max}</span>
    </div>
  </div>
);

const CycleRing = ({ dayOfCycle, cycleLength }) => {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(dayOfCycle / cycleLength, 1);
  const offset = circumference * (1 - progress);

  const getPhase = (day) => {
    if (day <= 5)  return { label: 'Menstrual',  color: '#FF9AA2' };
    if (day <= 13) return { label: 'Follicular', color: '#C94F7C' };
    if (day <= 16) return { label: 'Ovulation',  color: '#FF9AA2' };
    return               { label: 'Luteal',     color: '#FFCAD4' };
  };
  const phase = getPhase(dayOfCycle);

  return (
    <div className="flex flex-col items-center justify-center py-2">
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={radius} className="cycle-ring-track" />
        <circle cx="65" cy="65" r={radius} className="cycle-ring-progress"
          strokeDasharray={circumference} strokeDashoffset={offset}
          transform="rotate(-90 65 65)" />
      </svg>
      <div className="absolute flex flex-col items-center pointer-events-none" style={{ marginTop: '-8px' }}>
        <span className="text-2xl font-bold" style={{ color: '#3A3A3A' }}>Day {dayOfCycle}</span>
        <span className="text-xs font-semibold mt-0.5 px-2.5 py-0.5 rounded-full"
              style={{ background: '#FFCAD4', color: '#C94F7C' }}>
          {phase.label}
        </span>
      </div>
    </div>
  );
};

const Stagger = ({ delay = 0, children }) => (
  <div className="animate-slide-up" style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}>
    {children}
  </div>
);

const getDailyTip = (day) => {
  if (day <= 5)  return 'During the menstrual phase, your body benefits from iron-rich foods like spinach and lentils.';
  if (day <= 13) return 'In the follicular phase, estrogen rises — great time to focus on strength training and learning.';
  if (day <= 16) return 'Around ovulation, your communication skills peak. Use this energy for important conversations.';
  return 'In the luteal phase, magnesium from dark chocolate and nuts can help ease PMS symptoms.';
};

/* ─────────────────────────────────────────
   DASHBOARD
───────────────────────────────────────── */
const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cycles, setCycles]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchCycles(); }, []);

  const fetchCycles = async () => {
    try {
      const res = await cyclesAPI.getAll();
      setCycles(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const latestCycle  = cycles[0];
  const cycleLength  = latestCycle?.cycle_length || 28;
  // Next period = start date of logged cycle + cycle length
  const startDate    = latestCycle ? new Date(latestCycle.date) : new Date();
  const today        = new Date();
  const dayOfCycle   = Math.max(1, Math.min(
    Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1,
    cycleLength
  ));
  const nextPeriod   = new Date(startDate.getTime() + cycleLength * 86400000);
  const daysUntil    = Math.max(0, Math.ceil((nextPeriod - today) / 86400000));
  const countdownPct = Math.max(0, Math.min(100, ((cycleLength - daysUntil) / cycleLength) * 100));
  const dailyTip     = getDailyTip(dayOfCycle);

  const fmt = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const chartData = {
    labels: cycles.slice(0, 6).reverse().map((_, i) => `Cycle ${i + 1}`),
    datasets: [
      {
        label: 'Pain Level',
        data: cycles.slice(0, 6).reverse().map(c => c.pain_level),
        borderColor: '#C94F7C', backgroundColor: 'rgba(201,79,124,0.07)',
        tension: 0.4, pointRadius: 5, pointBackgroundColor: '#C94F7C',
        pointBorderColor: '#fff', pointBorderWidth: 2,
      },
      {
        label: 'Mood',
        data: cycles.slice(0, 6).reverse().map(c => c.mood_changes),
        borderColor: '#FF9AA2', backgroundColor: 'rgba(255,154,162,0.07)',
        tension: 0.4, pointRadius: 5, pointBackgroundColor: '#FF9AA2',
        pointBorderColor: '#fff', pointBorderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: '#3A3A3A', font: { family: 'Inter', size: 12 } } },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true, max: 5, grid: { color: 'rgba(255,202,212,0.35)' }, ticks: { color: '#9A6B7A' } },
      x: { grid: { display: false }, ticks: { color: '#9A6B7A' } },
    },
  };

  const tiles = [
    { label: 'Doctor Posts',   sub: 'Expert advice',       path: '/posts', icon: BookOpen,      bg: '#FFF0F3', iconColor: '#C94F7C' },
    { label: 'Health Quiz',    sub: 'Test your knowledge', path: '/quiz',  icon: Activity,      bg: '#FFCAD4', iconColor: '#C94F7C' },
    { label: 'Community Chat', sub: 'Connect with others', path: '/chat',  icon: MessageCircle, bg: '#FFF0F3', iconColor: '#C94F7C' },
    { label: 'Notifications',  sub: 'Stay up to date',     path: '/',      icon: Bell,          bg: '#FFCAD4', iconColor: '#C94F7C' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-7">

      {/* ── Greeting ── */}
      <Stagger delay={0}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-7 section-divider">
          <div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: 'Poppins, sans-serif', color: '#3A3A3A' }}>
              Hello, {user?.username || 'there'} 👋
            </h1>
            <p className="mt-1 text-sm" style={{ color: '#9A6B7A' }}>Your daily reproductive health overview.</p>
          </div>
          <button
            onClick={() => navigate('/log-cycle')}
            className="btn-primary text-white px-6 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2 self-start sm:self-auto"
          >
            <Calendar className="w-4 h-4" />
            Log Cycle
          </button>
        </div>
      </Stagger>

      {/* ── Next Period Countdown ── */}
      <Stagger delay={60}>
        <div className="bg-white rounded-2xl border border-[#FFCAD4] px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
               style={{ background: '#FFCAD4' }}>
            <Calendar className="w-5 h-5" style={{ color: '#C94F7C' }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 mb-2">
              <span className="text-sm font-semibold" style={{ color: '#3A3A3A' }}>Next Period</span>
              <span className="text-xs" style={{ color: '#9A6B7A' }}>{fmt(nextPeriod)}</span>
              <span className="ml-auto text-sm font-bold" style={{ color: '#C94F7C' }}>
                {daysUntil === 0 ? 'Today' : `${daysUntil} day${daysUntil !== 1 ? 's' : ''} away`}
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: '#FFCAD4' }}>
              <div className="h-full rounded-full transition-all duration-700"
                   style={{ width: `${countdownPct}%`, background: '#C94F7C' }} />
            </div>
          </div>
        </div>
      </Stagger>

      {/* ── Two-card row: Cycle Tracker + AI Insights ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-7 section-divider">

        {/* Cycle Tracker */}
        <Stagger delay={120}>
          <div className="bg-white rounded-[18px] border border-[#FFCAD4] p-6 shadow-sm h-full">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#FFCAD4' }}>
                <Activity className="w-4 h-4" style={{ color: '#C94F7C' }} />
              </div>
              <h2 className="font-semibold" style={{ color: '#3A3A3A' }}>Cycle Tracker</h2>
            </div>
            <div className="relative flex justify-center mb-4">
              <CycleRing dayOfCycle={dayOfCycle} cycleLength={cycleLength} />
            </div>
            <div className="space-y-0">
              <div className="flex justify-between items-center text-sm py-2.5 border-b border-[#FFCAD4]">
                <span style={{ color: '#9A6B7A' }}>Next Period</span>
                <span className="font-semibold" style={{ color: '#3A3A3A' }}>{fmt(nextPeriod)}</span>
              </div>
              <div className="flex justify-between items-center text-sm py-2.5 border-b border-[#FFCAD4]">
                <span style={{ color: '#9A6B7A' }}>Days Away</span>
                <span className="font-semibold" style={{ color: '#C94F7C' }}>{daysUntil} days</span>
              </div>
              <div className="flex justify-between items-center text-sm py-2.5 border-b border-[#FFCAD4]">
                <span style={{ color: '#9A6B7A' }}>Cycle Length</span>
                <span className="font-semibold" style={{ color: '#3A3A3A' }}>{cycleLength} days</span>
              </div>
              <div className="flex justify-between items-center text-sm py-2.5 border-b border-[#FFCAD4]">
                <span style={{ color: '#9A6B7A' }}>Cycle Start</span>
                <span className="font-semibold" style={{ color: '#3A3A3A' }}>{fmt(startDate)}</span>
              </div>
              {/* Mood & Pain dot indicators */}
              {latestCycle && (
                <div className="flex gap-6 pt-3">
                  <DotScale value={latestCycle.pain_level || 0} max={5} activeColor="#C94F7C" label="Pain" />
                  <DotScale value={latestCycle.mood_changes || 0} max={5} activeColor="#FF9AA2" label="Mood" />
                </div>
              )}
            </div>
          </div>
        </Stagger>

        {/* AI Health Insights */}
        <Stagger delay={180}>
          <div className="bg-white rounded-[18px] border border-[#FFCAD4] p-6 shadow-sm h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#FFCAD4' }}>
                <Sparkles className="w-4 h-4" style={{ color: '#C94F7C' }} />
              </div>
              <h2 className="font-semibold" style={{ color: '#3A3A3A' }}>AI Health Insights</h2>
            </div>

            {loading ? (
              <DotLoader />
            ) : !latestCycle ? (
              <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center py-8">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: '#FFCAD4' }}>
                  <TrendingUp className="w-7 h-7" style={{ color: '#C94F7C' }} />
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#9A6B7A' }}>
                  Log your first cycle to unlock personalized AI health insights.
                </p>
                <button
                  onClick={() => navigate('/log-cycle')}
                  className="btn-primary text-white px-5 py-2 rounded-full text-sm font-semibold mt-1"
                >
                  Log Now
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4 flex-1">
                <div className="rounded-xl p-4 border border-[#FFCAD4]" style={{ background: '#FFF5F7' }}>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                         style={{
                           background: latestCycle.prediction === 'Normal Cycle' ? '#FFCAD4'
                             : latestCycle.prediction === 'Possible Irregularity' ? '#FFD6E0'
                             : '#FFB3B3',
                           color: '#C94F7C',
                         }}>
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm" style={{ color: '#3A3A3A' }}>{latestCycle.prediction}</h3>
                      <p className="text-sm mt-1 leading-relaxed" style={{ color: '#9A6B7A' }}>{latestCycle.recommendation}</p>
                    </div>
                  </div>
                  {latestCycle.confidence != null && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-1.5" style={{ color: '#9A6B7A' }}>
                        <span>Confidence</span>
                        <span className="font-semibold" style={{ color: '#C94F7C' }}>{latestCycle.confidence}%</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: '#FFCAD4' }}>
                        <div className="h-full rounded-full transition-all duration-1000"
                             style={{ width: `${latestCycle.confidence}%`, background: '#C94F7C' }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Phase tips */}
                <div className="rounded-xl p-4 border border-[#FFCAD4]" style={{ background: '#FFF5F7' }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: '#C94F7C' }}>
                    Day {dayOfCycle} · {dayOfCycle <= 5 ? 'Menstrual' : dayOfCycle <= 13 ? 'Follicular' : dayOfCycle <= 16 ? 'Ovulation' : 'Luteal'} Phase
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: '#9A6B7A' }}>{dailyTip}</p>
                </div>
              </div>
            )}
          </div>
        </Stagger>
      </div>

      {/* ── Daily Tip ── */}
      <Stagger delay={260}>
        <div className="bg-white rounded-[18px] border border-[#FFCAD4] px-6 py-4 shadow-sm flex items-start gap-4">
          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
               style={{ background: '#FFCAD4' }}>
            <Leaf className="w-4 h-4" style={{ color: '#C94F7C' }} />
          </div>
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: '#3A3A3A' }}>Daily Tip 🌿</p>
            <p className="text-sm leading-relaxed" style={{ color: '#9A6B7A' }}>{dailyTip}</p>
          </div>
        </div>
      </Stagger>

      {/* ── Chart ── */}
      {cycles.length > 0 && (
        <Stagger delay={320}>
          <div className="bg-white rounded-[18px] border border-[#FFCAD4] p-6 shadow-sm pb-7 section-divider">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#FFCAD4' }}>
                <TrendingUp className="w-4 h-4" style={{ color: '#C94F7C' }} />
              </div>
              <h2 className="font-semibold" style={{ color: '#3A3A3A' }}>Cycle Trends</h2>
            </div>
            <Line data={chartData} options={chartOptions} />
          </div>
        </Stagger>
      )}

      {/* ── Explore Features ── */}
      <Stagger delay={400}>
        <div className="bg-white rounded-[18px] border border-[#FFCAD4] p-6 shadow-sm">
          <h2 className="font-semibold mb-4" style={{ color: '#3A3A3A' }}>Explore Features</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {tiles.map(({ label, sub, path, icon: Icon, bg, iconColor }, i) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className="tile-hover rounded-2xl p-5 flex flex-col items-center text-center group border border-[#FFCAD4] bg-white"
                style={{ animationDelay: `${400 + i * 70}ms` }}
              >
                <div className="w-11 h-11 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-smooth"
                     style={{ background: bg }}>
                  <Icon className="w-5 h-5" style={{ color: iconColor }} />
                </div>
                <span className="font-semibold text-sm" style={{ color: '#3A3A3A' }}>{label}</span>
                <span className="text-xs mt-0.5" style={{ color: '#9A6B7A' }}>{sub}</span>
              </button>
            ))}
          </div>
        </div>
      </Stagger>

    </div>
  );
};

export default Dashboard;
