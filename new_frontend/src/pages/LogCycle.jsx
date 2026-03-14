import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Droplet, Frown, Activity } from 'lucide-react';
import { cyclesAPI } from '../services/api';

const PHASES = [
  { label: 'Menstrual',  days: '1–5',   color: '#C94F7C', bg: '#FFF0F3' },
  { label: 'Follicular', days: '6–13',  color: '#FF9AA2', bg: '#FFF5F7' },
  { label: 'Ovulation',  days: '14–16', color: '#C94F7C', bg: '#FFF0F3' },
  { label: 'Luteal',     days: '17–28', color: '#FF9AA2', bg: '#FFCAD4' },
];

const getPhaseIndex = (day) => {
  if (day <= 5)  return 0;
  if (day <= 13) return 1;
  if (day <= 16) return 2;
  return 3;
};

const CycleTimeline = ({ startDate }) => {
  const today = new Date();
  const start = new Date(startDate);
  const dayOfCycle = Math.max(1, Math.min(
    Math.floor((today - start) / (1000 * 60 * 60 * 24)) + 1, 28
  ));
  const activeIndex = getPhaseIndex(dayOfCycle);

  return (
    <div className="bg-white rounded-[18px] border border-[#FFCAD4] p-5 shadow-sm mb-6">
      <p className="text-sm font-semibold mb-4" style={{ color: '#3A3A3A' }}>Cycle Timeline</p>
      <div className="flex items-center">
        {PHASES.map((phase, i) => (
          <div key={phase.label} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all"
                style={{
                  background: i === activeIndex ? phase.color : phase.bg,
                  borderColor: i === activeIndex ? phase.color : '#FFCAD4',
                  color: i === activeIndex ? '#fff' : '#9A6B7A',
                  boxShadow: i === activeIndex ? `0 0 0 3px ${phase.color}30` : 'none',
                }}
              >
                {i + 1}
              </div>
              <span className="text-xs font-medium mt-1.5 text-center leading-tight"
                    style={{ color: i === activeIndex ? phase.color : '#9A6B7A' }}>
                {phase.label}
              </span>
              <span className="text-xs mt-0.5" style={{ color: '#C4A0AE' }}>{phase.days}</span>
            </div>
            {i < PHASES.length - 1 && (
              <div className="h-0.5 w-6 flex-shrink-0 rounded-full mb-6"
                   style={{ background: i < activeIndex ? '#C94F7C' : '#FFCAD4' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const LogCycle = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const [formData, setFormData] = useState({
    date: new Date().toISOString(),
    cycle_length: 28,
    period_duration: 5,
    pain_level: 3,
    flow_intensity: 2,
    mood_changes: 3,
    notes: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === 'number' || e.target.type === 'range'
        ? Number(e.target.value)
        : e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await cyclesAPI.create(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to log cycle');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 border border-[#FFCAD4] rounded-xl outline-none transition-smooth text-[#3A3A3A] bg-white text-sm";
  const labelClass = "block text-sm font-medium mb-2" ;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">

      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'Poppins, sans-serif', color: '#3A3A3A' }}>Log Your Cycle</h1>
        <p className="text-sm mt-1" style={{ color: '#9A6B7A' }}>Track your symptoms for accurate AI predictions.</p>
      </div>

      <CycleTimeline startDate={formData.date} />

      <div className="bg-white rounded-[18px] border border-[#FFCAD4] shadow-sm overflow-hidden">

        {error && (
          <div className="mx-6 mt-5 p-3 rounded-xl text-sm border"
               style={{ background: '#FFF0F3', color: '#C94F7C', borderColor: '#FFCAD4' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass} style={{ color: '#3A3A3A' }}>Period Start Date</label>
              <input
                type="date" name="date"
                className={inputClass}
                value={formData.date.split('T')[0]}
                onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value).toISOString() })}
                required
              />
            </div>
            <div>
              <label className={labelClass} style={{ color: '#3A3A3A' }}>Cycle Length (Days)</label>
              <input
                type="number" name="cycle_length" min="21" max="40"
                className={inputClass}
                value={formData.cycle_length}
                onChange={handleChange} required
              />
            </div>
          </div>

          <div>
            <label className={labelClass} style={{ color: '#3A3A3A' }}>Period Duration (Days)</label>
            <input
              type="number" name="period_duration" min="1" max="15"
              className={inputClass}
              value={formData.period_duration}
              onChange={handleChange} required
            />
          </div>

          {/* Pain Level */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium flex items-center gap-2" style={{ color: '#3A3A3A' }}>
                <Activity className="w-4 h-4" style={{ color: '#C94F7C' }} /> Pain Level
              </label>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: '#FFCAD4', color: '#C94F7C' }}>
                {formData.pain_level}/5
              </span>
            </div>
            <input
              type="range" name="pain_level" min="1" max="5"
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{ accentColor: '#C94F7C' }}
              value={formData.pain_level}
              onChange={handleChange}
            />
            <div className="flex justify-between text-xs mt-1.5" style={{ color: '#C4A0AE' }}>
              <span>None</span><span>Mild</span><span>Moderate</span><span>Severe</span><span>Extreme</span>
            </div>
          </div>

          {/* Flow Intensity */}
          <div>
            <label className="text-sm font-medium flex items-center gap-2 mb-3" style={{ color: '#3A3A3A' }}>
              <Droplet className="w-4 h-4" style={{ color: '#FF9AA2' }} /> Flow Intensity
            </label>
            <div className="flex gap-3">
              {[{ value: 1, label: 'Light' }, { value: 2, label: 'Medium' }, { value: 3, label: 'Heavy' }].map((opt) => (
                <button
                  type="button" key={opt.value}
                  onClick={() => setFormData({ ...formData, flow_intensity: opt.value })}
                  className="flex-1 py-2.5 rounded-xl border text-sm font-medium transition-smooth"
                  style={formData.flow_intensity === opt.value
                    ? { background: '#FFCAD4', borderColor: '#C94F7C', color: '#C94F7C' }
                    : { borderColor: '#FFCAD4', color: '#9A6B7A', background: '#fff' }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mood Changes */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium flex items-center gap-2" style={{ color: '#3A3A3A' }}>
                <Frown className="w-4 h-4" style={{ color: '#FF9AA2' }} /> Mood Changes
              </label>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: '#FFCAD4', color: '#C94F7C' }}>
                {formData.mood_changes}/5
              </span>
            </div>
            <input
              type="range" name="mood_changes" min="1" max="5"
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{ accentColor: '#FF9AA2' }}
              value={formData.mood_changes}
              onChange={handleChange}
            />
          </div>

          {/* Notes */}
          <div>
            <label className={labelClass} style={{ color: '#3A3A3A' }}>Notes (Optional)</label>
            <textarea
              name="notes" rows="3"
              className={inputClass}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional symptoms or observations…"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit" disabled={loading}
              className="w-full btn-primary text-white font-semibold py-3 px-4 rounded-xl flex justify-center items-center disabled:opacity-50"
            >
              {loading
                ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                : 'Save Entry & Get AI Insights'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default LogCycle;
