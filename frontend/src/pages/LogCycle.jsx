import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Droplet, Frown, Activity, Info, Sparkles } from 'lucide-react';
import api from '../services/api';

const C = { accent:'#E87A9A', soft:'#FFDDE2', primary:'#F7CAD0', border:'#EED9DE', text:'#3A3A3A', sub:'#5A5052', muted:'#8C7A7F' };

const PHASES = [
  { label:'Menstrual',  days:'1–5',   color:'#E87A9A', bg:'#FFDDE2' },
  { label:'Follicular', days:'6–13',  color:'#F7CAD0', bg:'#FFF9FA' },
  { label:'Ovulation',  days:'14–16', color:'#E87A9A', bg:'#FFDDE2' },
  { label:'Luteal',     days:'17–28', color:'#F7CAD0', bg:'#FFF1F4' },
];
const getPhaseIndex = (d) => d <= 5 ? 0 : d <= 13 ? 1 : d <= 16 ? 2 : 3;

const CycleTimeline = ({ dateStr }) => {
  const day    = Math.max(1, Math.min(Math.floor((new Date() - new Date(dateStr)) / 86400000) + 1, 28));
  const active = getPhaseIndex(day);
  return (
    <div className="bg-white rounded-[18px] border p-5 mb-5" style={{ borderColor: C.border, boxShadow:'0 10px 25px rgba(0,0,0,0.04)' }}>
      <p className="text-sm font-semibold mb-4" style={{ color: C.text }}>Cycle Timeline</p>
      <div className="flex items-start">
        {PHASES.map((ph, i) => (
          <div key={ph.label} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all"
                   style={{ background: i===active ? ph.color : ph.bg, borderColor: i===active ? ph.color : C.border,
                            color: i===active ? '#fff' : C.muted, boxShadow: i===active ? `0 0 0 3px ${ph.color}28` : 'none' }}>
                {i+1}
              </div>
              <span className="text-xs font-medium mt-1.5 text-center leading-tight"
                    style={{ color: i===active ? ph.color : C.muted }}>{ph.label}</span>
              <span className="text-xs mt-0.5" style={{ color: C.muted }}>{ph.days}</span>
            </div>
            {i < PHASES.length-1 && (
              <div className="h-0.5 w-5 flex-shrink-0 rounded-full mb-7"
                   style={{ background: i < active ? C.accent : C.border }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const Section = ({ title, subtitle, icon: Icon, children }) => (
  <div className="bg-white rounded-[18px] border p-5" style={{ borderColor: C.border, boxShadow:'0 10px 25px rgba(0,0,0,0.04)' }}>
    <div className="flex items-start justify-between gap-3 mb-4">
      <div>
        <h3 className="text-sm font-semibold" style={{ color: C.text }}>{title}</h3>
        {subtitle && <p className="text-xs mt-0.5" style={{ color: C.muted }}>{subtitle}</p>}
      </div>
      {Icon && <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: C.primary }} />}
    </div>
    {children}
  </div>
);

const Badge = ({ value, max=5 }) => (
  <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
        style={{ background: C.soft, color: C.accent }}>{value}/{max}</span>
);

const iCls = "w-full px-4 py-2.5 border rounded-xl outline-none transition-smooth text-sm bg-white";
const iSty = { borderColor: C.border, color: C.text };
const lCls = "block text-sm font-medium mb-2";

const symptomOptions    = ['Bloating','Fatigue','Headache','Acne','Back Pain','Nausea'];
const mucusOptions      = ['None','Sticky','Creamy','Eggwhite','Watery'];
const protectionOptions = ['None','Condom','Pill','IUD','Other'];

const LogCycle = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0], age: user?.age||25,
    cycleLength: user?.cycleLength||28, periodDuration:5, painLevel:3,
    flowIntensity:2, moodLevel:3, stressLevel:3, sleepHours:7, waterIntake:1.5,
    symptoms:[], hadIntercourse:false, protectionUsed:'None', mucusType:'None', basalBodyTemp:36.6,
  });

  useEffect(() => {
    const s = localStorage.getItem('recentCycle');
    if (s) { try { setFormData(p => ({ ...p, ...JSON.parse(s) })); } catch {} }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name==='hadIntercourse') { setFormData(p => ({ ...p, hadIntercourse:checked })); return; }
    setFormData(p => ({ ...p, [name]: type==='number'||type==='range' ? Number(value) : value }));
  };

  const toggleSymptom = (s) => setFormData(p => ({
    ...p, symptoms: p.symptoms.includes(s) ? p.symptoms.filter(x=>x!==s) : [...p.symptoms, s]
  }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setMessage('');
    const notes = { stressLevel:formData.stressLevel, sleepHours:formData.sleepHours, waterIntake:formData.waterIntake,
      symptoms:formData.symptoms, sexualHealth:{hadIntercourse:formData.hadIntercourse, protectionUsed:formData.protectionUsed},
      ovulation:{mucusType:formData.mucusType, basalBodyTemp:formData.basalBodyTemp} };
    const payload = { date:formData.date, age:formData.age, cycleLength:formData.cycleLength,
      periodDuration:formData.periodDuration, painLevel:formData.painLevel,
      flowIntensity:formData.flowIntensity, moodLevel:formData.moodLevel, notes:JSON.stringify(notes) };
    try {
      await api.post('/cycles', payload);
      localStorage.setItem('recentCycle', JSON.stringify(payload));
      setMessage('Cycle entry saved. Your insights are being updated.');
      setTimeout(() => navigate('/dashboard'), 600);
    } catch {
      localStorage.setItem('recentCycle', JSON.stringify(payload));
      setMessage('Saved locally and will sync when online.');
      setTimeout(() => navigate('/dashboard'), 600);
    } finally { setLoading(false); }
  };

  const chips = useMemo(() => symptomOptions.map(s => {
    const sel = formData.symptoms.includes(s);
    return (
      <button type="button" key={s} onClick={() => toggleSymptom(s)}
              className="px-3 py-2 rounded-full border text-sm font-medium transition-smooth"
              style={sel ? { background:C.soft, borderColor:C.accent, color:C.accent }
                         : { borderColor:C.border, color:C.sub, background:'#fff' }}>
        {s}
      </button>
    );
  }), [formData.symptoms]);

  const focusStyle = (e) => { e.target.style.borderColor=C.accent; e.target.style.boxShadow='0 0 0 3px rgba(232,122,154,0.12)'; };
  const blurStyle  = (e) => { e.target.style.borderColor=C.border; e.target.style.boxShadow='none'; };

  return (
    <div className="max-w-3xl mx-auto px-4 py-7 animate-fade-in">
      <div className="mb-5">
        <h1 className="text-2xl font-bold" style={{ color:C.text, fontFamily:'Poppins, sans-serif' }}>Log Your Cycle</h1>
        <p className="text-sm mt-1" style={{ color:C.sub }}>Track your symptoms and health trends for smarter AI insights.</p>
      </div>

      <CycleTimeline dateStr={formData.date} />

      <form onSubmit={handleSubmit} className="space-y-4">

        <Section title="Cycle Details" subtitle="Core information for cycle prediction." icon={Info}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={lCls} style={{ color:C.text }}>Last Period Start Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange}
                     className={iCls} style={iSty} onFocus={focusStyle} onBlur={blurStyle} required />
            </div>
            <div>
              <label className={lCls} style={{ color:C.text }}>Period Duration (days)</label>
              <input type="number" name="periodDuration" min={1} max={15} value={formData.periodDuration}
                     onChange={handleChange} className={iCls} style={iSty} onFocus={focusStyle} onBlur={blurStyle} required />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium flex items-center gap-2" style={{ color:C.text }}>
                  <Activity className="w-4 h-4" style={{ color:C.accent }} /> Pain Level
                </label>
                <Badge value={formData.painLevel} />
              </div>
              <input type="range" name="painLevel" min={1} max={5} value={formData.painLevel} onChange={handleChange}
                     className="w-full h-2 rounded-lg appearance-none cursor-pointer" style={{ accentColor:C.accent }} />
              <div className="flex justify-between text-xs mt-1" style={{ color:C.muted }}>
                <span>None</span><span>Mild</span><span>Moderate</span><span>Severe</span><span>Extreme</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium flex items-center gap-2" style={{ color:C.text }}>
                  <Frown className="w-4 h-4" style={{ color:C.primary }} /> Mood Changes
                </label>
                <Badge value={formData.moodLevel} />
              </div>
              <input type="range" name="moodLevel" min={1} max={5} value={formData.moodLevel} onChange={handleChange}
                     className="w-full h-2 rounded-lg appearance-none cursor-pointer" style={{ accentColor:C.primary }} />
            </div>
          </div>
          <div className="mt-4">
            <label className="text-sm font-medium flex items-center gap-2 mb-3" style={{ color:C.text }}>
              <Droplet className="w-4 h-4" style={{ color:C.primary }} /> Flow Intensity
            </label>
            <div className="flex gap-3">
              {[{value:1,label:'Light'},{value:2,label:'Medium'},{value:3,label:'Heavy'}].map(o => (
                <button type="button" key={o.value} onClick={() => setFormData({...formData, flowIntensity:o.value})}
                        className="flex-1 py-2.5 rounded-xl border text-sm font-medium transition-smooth"
                        style={formData.flowIntensity===o.value
                          ? { background:C.soft, borderColor:C.accent, color:C.accent }
                          : { borderColor:C.border, color:C.sub, background:'#fff' }}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </Section>

        <Section title="Symptoms" subtitle="Select symptoms you are experiencing today." icon={Info}>
          <div className="flex flex-wrap gap-2">{chips}</div>
        </Section>

        <Section title="Lifestyle Factors" subtitle="Daily inputs that influence your cycle." icon={Sparkles}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium" style={{ color:C.text }}>Stress Level</label>
                <Badge value={formData.stressLevel} />
              </div>
              <input type="range" name="stressLevel" min={1} max={5} value={formData.stressLevel} onChange={handleChange}
                     className="w-full h-2 rounded-lg appearance-none cursor-pointer" style={{ accentColor:C.accent }} />
            </div>
            <div>
              <label className={lCls} style={{ color:C.text }}>Sleep Hours</label>
              <input type="number" name="sleepHours" min={0} max={16} value={formData.sleepHours}
                     onChange={handleChange} className={iCls} style={iSty} onFocus={focusStyle} onBlur={blurStyle} />
            </div>
            <div>
              <label className={lCls} style={{ color:C.text }}>Water Intake (L)</label>
              <input type="number" name="waterIntake" step="0.1" min={0} max={10} value={formData.waterIntake}
                     onChange={handleChange} className={iCls} style={iSty} onFocus={focusStyle} onBlur={blurStyle} placeholder="e.g. 2.0" />
            </div>
          </div>
        </Section>

        <Section title="Additional Health Data" subtitle="Optional signals for deeper insights." icon={Info}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium" style={{ color:C.text }}>Had intercourse today</label>
                <input type="checkbox" name="hadIntercourse" checked={formData.hadIntercourse}
                       onChange={handleChange} className="h-5 w-5 rounded" style={{ accentColor:C.accent }} />
              </div>
              <div>
                <label className={lCls} style={{ color:C.text }}>Protection used</label>
                <select name="protectionUsed" value={formData.protectionUsed} onChange={handleChange}
                        className={iCls} style={iSty} onFocus={focusStyle} onBlur={blurStyle}
                        disabled={!formData.hadIntercourse}>
                  {protectionOptions.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className={lCls} style={{ color:C.text }}>Cervical mucus type</label>
                <select name="mucusType" value={formData.mucusType} onChange={handleChange}
                        className={iCls} style={iSty} onFocus={focusStyle} onBlur={blurStyle}>
                  {mucusOptions.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium" style={{ color:C.text }}>Basal body temperature</label>
                  <span className="text-xs" style={{ color:C.muted }}>°C</span>
                </div>
                <input type="number" name="basalBodyTemp" step="0.1" min={33} max={40} value={formData.basalBodyTemp}
                       onChange={handleChange} className={iCls} style={iSty} onFocus={focusStyle} onBlur={blurStyle} placeholder="e.g. 36.6" />
              </div>
            </div>
          </div>
        </Section>

        <div className="pt-1">
          <button type="submit" disabled={loading}
                  className="w-full btn-primary font-semibold py-3 px-4 rounded-xl flex justify-center items-center disabled:opacity-50">
            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : 'Save Entry & Get ML Insights'}
          </button>
          {message && <p className="mt-3 text-sm text-center" style={{ color:C.sub }}>{message}</p>}
        </div>
      </form>
    </div>
  );
};

export default LogCycle;
