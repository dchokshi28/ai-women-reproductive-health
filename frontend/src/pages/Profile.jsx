import { useAuth } from '../context/AuthContext';
import { useEffect, useMemo, useState } from 'react';
import { Mail, Calendar, Edit3, ShieldCheck, HeartPulse, User, Sparkles } from 'lucide-react';
import api from '../services/api';

const C = { accent:'#E87A9A', soft:'#FFDDE2', primary:'#F7CAD0', border:'#EED9DE', text:'#3A3A3A', sub:'#5A5052', muted:'#8C7A7F', mint:'#DFF3EA', mintText:'#2E7D5A', bg:'#FFF9FA' };

const stressOptions   = ['Low', 'Medium', 'High'];
const exerciseOptions = ['None', 'Light', 'Moderate', 'Heavy'];
const goalOptions     = ['Trying to Conceive', 'Avoid Pregnancy', 'Just Tracking Cycle'];

const inputClass = "w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-smooth bg-white";
const labelClass = "block text-sm font-medium mb-2";

const InfoCard = ({ icon: Icon, label, value, iconBg, iconColor }) => (
  <div className="p-4 rounded-[14px] flex items-start gap-3"
       style={{ background: C.bg, border: `1px solid ${C.border}` }}>
    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
         style={{ background: iconBg }}>
      <Icon className="w-4 h-4" style={{ color: iconColor }} />
    </div>
    <div>
      <p className="text-xs font-medium" style={{ color: C.muted }}>{label}</p>
      <p className="text-sm font-semibold mt-0.5" style={{ color: C.text }}>{value}</p>
    </div>
  </div>
);

const Profile = () => {
  const { user, logout, login } = useAuth();
  const [health, setHealth] = useState({
    age: user?.age || 25, height: 165, weight: 60,
    cycleLength: user?.cycleLength || 28, periodDuration: 5, menarcheAge: 12,
    stressLevel: 'Medium', sleepHours: 7, exerciseFrequency: 'Moderate',
    conditions: { pcos: false, thyroid: false, diabetes: false },
    goal: 'Just Tracking Cycle',
  });
  const [saving, setSaving]   = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) return;
    api.get('/profile/health-info')
      .then(res => { if (res.data) setHealth(prev => ({ ...prev, ...res.data })); })
      .catch(() => {});
  }, [user]);

  const bmi = useMemo(() => {
    if (!health.height || !health.weight) return '';
    const v = health.weight / Math.pow(health.height / 100, 2);
    return Number.isFinite(v) ? v.toFixed(1) : '';
  }, [health.height, health.weight]);

  const completionPct = useMemo(() => {
    const fields = [health.age, health.height, health.weight, health.cycleLength,
                    health.periodDuration, health.menarcheAge, health.stressLevel,
                    health.sleepHours, health.exerciseFrequency, health.goal];
    return Math.round((fields.filter(v => v !== undefined && v !== null && v !== '').length / fields.length) * 100);
  }, [health]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('conditions.')) {
      const key = name.split('.')[1];
      setHealth(prev => ({ ...prev, conditions: { ...prev.conditions, [key]: checked } }));
      return;
    }
    setHealth(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await api.post('/profile/health-info', { ...health, bmi });
      login({ ...user, age: health.age, cycleLength: health.cycleLength });
      setMessage('Health information saved successfully.');
    } catch {
      setMessage('Could not save. Please try again later.');
    } finally {
      setSaving(false);
    }
  };

  const focusStyle = (e) => { e.target.style.borderColor = C.accent; e.target.style.boxShadow = '0 0 0 3px rgba(232,122,154,0.12)'; };
  const blurStyle  = (e) => { e.target.style.borderColor = C.border;  e.target.style.boxShadow = 'none'; };

  const initials = (user?.name || user?.email || 'U').charAt(0).toUpperCase();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-7 animate-fade-in space-y-5">

      {/* Profile header card */}
      <div className="bg-white rounded-[18px] border shadow-sm p-6" style={{ borderColor: C.border }}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0"
                 style={{ background: C.soft, color: C.accent }}>
              {initials}
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: C.text, fontFamily: 'Poppins, sans-serif' }}>
                {user?.name || 'Demo User'}
              </h1>
              <div className="mt-1.5 inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" style={{ color: C.mintText }} />
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                      style={{ background: C.mint, color: C.mintText }}>
                  Free Plan Active
                </span>
              </div>
              {/* Completion bar */}
              <div className="mt-3 w-48">
                <div className="flex justify-between text-xs mb-1" style={{ color: C.muted }}>
                  <span>Profile Completion</span>
                  <span className="font-semibold" style={{ color: C.text }}>{completionPct}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: C.border }}>
                  <div className="h-full rounded-full transition-all duration-700"
                       style={{ width: `${completionPct}%`, background: C.accent }} />
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border transition-smooth self-start"
            style={{ borderColor: C.border, color: C.sub }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border;  e.currentTarget.style.color = C.sub; }}
          >
            <Edit3 className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* Quick info grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <InfoCard icon={Mail}       label="Email"        value={user?.email || 'user@example.com'} iconBg={C.soft}    iconColor={C.accent}   />
        <InfoCard icon={User}       label="Age"          value={`${health.age} yrs`}               iconBg={C.mint}    iconColor={C.mintText} />
        <InfoCard icon={Calendar}   label="Cycle Length" value={`${health.cycleLength} days`}      iconBg={C.primary} iconColor={C.accent}   />
        <InfoCard icon={HeartPulse} label="BMI"          value={bmi || '—'}                        iconBg="#FFF1F4"   iconColor={C.accent}   />
      </div>

      {/* Health info form */}
      <div className="bg-white rounded-[18px] border shadow-sm p-6" style={{ borderColor: C.border }}>
        <div className="flex items-start justify-between gap-4 mb-5 pb-4"
             style={{ borderBottom: `1px solid ${C.border}` }}>
          <div>
            <h2 className="text-base font-semibold" style={{ color: C.text }}>Health Information</h2>
            <p className="text-sm mt-0.5" style={{ color: C.sub }}>
              Keep this up-to-date for better AI predictions.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs flex-shrink-0" style={{ color: C.muted }}>
            <Sparkles className="w-3.5 h-3.5" style={{ color: C.accent }} />
            Tip: More data = better insights
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'age',    label: 'Age',         min: 10, max: 99  },
              { name: 'height', label: 'Height (cm)', min: 100, max: 220 },
              { name: 'weight', label: 'Weight (kg)', min: 30, max: 200  },
            ].map(f => (
              <div key={f.name}>
                <label className={labelClass} style={{ color: C.text }}>{f.label}</label>
                <input name={f.name} type="number" min={f.min} max={f.max}
                       value={health[f.name]} onChange={handleChange}
                       className={inputClass} style={{ borderColor: C.border }}
                       onFocus={focusStyle} onBlur={blurStyle} />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'cycleLength',    label: 'Cycle Length (days)',   min: 18, max: 45 },
              { name: 'periodDuration', label: 'Period Duration (days)', min: 1,  max: 15 },
              { name: 'menarcheAge',    label: 'Age at First Period',    min: 8,  max: 25 },
            ].map(f => (
              <div key={f.name}>
                <label className={labelClass} style={{ color: C.text }}>{f.label}</label>
                <input name={f.name} type="number" min={f.min} max={f.max}
                       value={health[f.name]} onChange={handleChange}
                       className={inputClass} style={{ borderColor: C.border }}
                       onFocus={focusStyle} onBlur={blurStyle} />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'stressLevel',       label: 'Stress Level',       options: stressOptions   },
              { name: 'exerciseFrequency', label: 'Exercise Frequency', options: exerciseOptions },
              { name: 'goal',              label: 'Goal',               options: goalOptions     },
            ].map(f => (
              <div key={f.name}>
                <label className={labelClass} style={{ color: C.text }}>{f.label}</label>
                <select name={f.name} value={health[f.name]} onChange={handleChange}
                        className={inputClass} style={{ borderColor: C.border }}
                        onFocus={focusStyle} onBlur={blurStyle}>
                  {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div>
            <label className={labelClass} style={{ color: C.text }}>Sleep Hours</label>
            <input name="sleepHours" type="number" min={0} max={16}
                   value={health.sleepHours} onChange={handleChange}
                   className={inputClass} style={{ borderColor: C.border, maxWidth: '160px' }}
                   onFocus={focusStyle} onBlur={blurStyle} />
          </div>

          {/* Health conditions */}
          <div>
            <p className={labelClass} style={{ color: C.text }}>Health Conditions</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { key: 'pcos',     label: 'PCOS'             },
                { key: 'thyroid',  label: 'Thyroid Disorder' },
                { key: 'diabetes', label: 'Diabetes'         },
              ].map(c => (
                <label key={c.key}
                       className="flex items-center gap-2.5 px-4 py-3 rounded-xl border cursor-pointer transition-smooth"
                       style={{ borderColor: health.conditions[c.key] ? C.accent : C.border,
                                background:   health.conditions[c.key] ? C.soft  : '#FFFFFF' }}>
                  <input type="checkbox" name={`conditions.${c.key}`}
                         checked={health.conditions[c.key]} onChange={handleChange}
                         className="h-4 w-4 rounded" style={{ accentColor: C.accent }} />
                  <span className="text-sm font-medium" style={{ color: C.text }}>{c.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-1">
            <button type="submit" disabled={saving}
                    className="w-full btn-primary text-white font-semibold py-3 rounded-xl flex justify-center items-center disabled:opacity-50">
              {saving
                ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                : 'Save Health Info'}
            </button>
            {message && (
              <p className="mt-3 text-sm text-center" style={{ color: C.sub }}>{message}</p>
            )}
          </div>
        </form>
      </div>

    </div>
  );
};

export default Profile;
