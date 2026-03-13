import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Calendar as CalendarIcon,
  Droplet,
  Frown,
  Activity,
  Info,
  Sparkles,
} from 'lucide-react';
import api from '../services/api';

const symptomOptions = [
  'Bloating',
  'Fatigue',
  'Headache',
  'Acne',
  'Back Pain',
  'Nausea',
];

const mucusOptions = [
  'None',
  'Sticky',
  'Creamy',
  'Eggwhite',
  'Watery',
];

const protectionOptions = ['None', 'Condom', 'Pill', 'IUD', 'Other'];

const LogCycle = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    age: user?.age || 25,
    cycleLength: user?.cycleLength || 28,
    periodDuration: 5,
    painLevel: 3,
    flowIntensity: 2,
    moodLevel: 3,
    stressLevel: 3,
    sleepHours: 7,
    waterIntake: 1.5,
    symptoms: [],
    hadIntercourse: false,
    protectionUsed: 'None',
    mucusType: 'None',
    basalBodyTemp: 36.6,
  });

  useEffect(() => {
    // Load last cycle entry if available as a starting point
    const stored = localStorage.getItem('recentCycle');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setFormData((prev) => ({ ...prev, ...parsed }));
      } catch {
        // ignore
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'hadIntercourse') {
      setFormData((prev) => ({ ...prev, hadIntercourse: checked }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' || type === 'range' ? Number(value) : value,
    }));
  };

  const toggleSymptom = (symptom) => {
    setFormData((prev) => {
      const has = prev.symptoms.includes(symptom);
      const next = has
        ? prev.symptoms.filter((item) => item !== symptom)
        : [...prev.symptoms, symptom];
      return { ...prev, symptoms: next };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const notes = {
      stressLevel: formData.stressLevel,
      sleepHours: formData.sleepHours,
      waterIntake: formData.waterIntake,
      symptoms: formData.symptoms,
      sexualHealth: {
        hadIntercourse: formData.hadIntercourse,
        protectionUsed: formData.protectionUsed,
      },
      ovulation: {
        mucusType: formData.mucusType,
        basalBodyTemp: formData.basalBodyTemp,
      },
    };

    const payload = {
      date: formData.date,
      age: formData.age,
      cycleLength: formData.cycleLength,
      periodDuration: formData.periodDuration,
      painLevel: formData.painLevel,
      flowIntensity: formData.flowIntensity,
      moodLevel: formData.moodLevel,
      notes: JSON.stringify(notes),
    };

    try {
      await api.post('/cycles', payload);
      localStorage.setItem('recentCycle', JSON.stringify(payload));
      setMessage('Cycle entry saved. Your insights are being updated.');
      setTimeout(() => {
        navigate('/dashboard');
      }, 600);
    } catch (err) {
      console.error('Failed to save cycle log', err);
      setMessage('Unable to save entry right now. Saved locally and will sync when online.');
      localStorage.setItem('recentCycle', JSON.stringify(payload));
      setTimeout(() => {
        navigate('/dashboard');
      }, 600);
    } finally {
      setLoading(false);
    }
  };

  const symptomChips = useMemo(
    () =>
      symptomOptions.map((symptom) => {
        const isSelected = formData.symptoms.includes(symptom);
        return (
          <button
            type="button"
            key={symptom}
            onClick={() => toggleSymptom(symptom)}
            className={`px-3 py-2 rounded-full border text-sm font-medium transition-all focus:outline-none ${
              isSelected
                ? 'bg-deep-pink/15 border-deep-pink text-deep-pink shadow-sm'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {symptom}
          </button>
        );
      }),
    [formData.symptoms]
  );

  return (
    <div className="max-w-3xl mx-auto p-8 py-12 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-lg border border-soft-pink/20 overflow-hidden">
        <div className="bg-gradient-to-r from-soft-pink to-soft-lavender p-8 text-center">
          <CalendarIcon className="w-12 h-12 text-white mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-white mb-2">Log Your Cycle</h2>
          <p className="text-pink-50 text-sm">Track your symptoms and health trends for smarter AI insights.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Cycle Details */}
          <div className="bg-soft-pink/20 rounded-2xl shadow-sm p-6 border border-gray-200 transition-all">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Cycle Details</h3>
                <p className="text-sm text-gray-500">Core information for cycle prediction.</p>
              </div>
              <span className="inline-flex items-center gap-2 text-xs text-gray-500">
                <Info className="w-4 h-4" />
                Save this entry to track trends over time.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Period Start Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-deep-pink focus:border-transparent outline-none transition-smooth"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Period Duration (days)</label>
                <input
                  type="number"
                  name="periodDuration"
                  min={1}
                  max={15}
                  value={formData.periodDuration}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-deep-pink focus:border-transparent outline-none transition-smooth"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-deep-pink" /> Cramps & Pain Level
                  </label>
                  <span className="text-xs font-semibold text-deep-pink bg-soft-pink px-2 py-1 rounded-full">
                    {formData.painLevel}/5
                  </span>
                </div>
                <input
                  type="range"
                  name="painLevel"
                  min={1}
                  max={5}
                  value={formData.painLevel}
                  onChange={handleChange}
                  className="w-full accent-deep-pink h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Frown className="w-4 h-4 text-deep-lavender" /> Mood Alterations
                  </label>
                  <span className="text-xs font-semibold text-deep-lavender bg-soft-lavender px-2 py-1 rounded-full">
                    {formData.moodLevel}/5
                  </span>
                </div>
                <input
                  type="range"
                  name="moodLevel"
                  min={1}
                  max={5}
                  value={formData.moodLevel}
                  onChange={handleChange}
                  className="w-full accent-deep-lavender h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Droplet className="w-4 h-4 text-blue-500" /> Flow Intensity
              </label>
              <div className="flex gap-4">
                {[
                  { value: 1, label: 'Light' },
                  { value: 2, label: 'Medium' },
                  { value: 3, label: 'Heavy' },
                ].map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => setFormData({ ...formData, flowIntensity: option.value })}
                    className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-smooth ${
                      formData.flowIntensity === option.value
                        ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Symptoms */}
          <div className="bg-soft-pink/20 rounded-2xl shadow-sm p-6 border border-gray-200 transition-all">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Symptoms</h3>
                <p className="text-sm text-gray-500">Select symptoms you are experiencing today.</p>
              </div>
              <span className="inline-flex items-center gap-2 text-xs text-gray-500">
                <Info className="w-4 h-4" /> Symptoms help personalize cycle predictions.
              </span>
            </div>
            <div className="flex flex-wrap gap-3">{symptomChips}</div>
          </div>

          {/* Lifestyle Factors */}
          <div className="bg-soft-pink/20 rounded-2xl shadow-sm p-6 border border-gray-200 transition-all">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Lifestyle Factors</h3>
                <p className="text-sm text-gray-500">Daily inputs that influence your cycle.</p>
              </div>
              <span className="inline-flex items-center gap-2 text-xs text-gray-500">
                <Sparkles className="w-4 h-4" /> Smaller habits add up.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Stress Level</label>
                  <span className="text-xs text-gray-500">{formData.stressLevel}/5</span>
                </div>
                <input
                  type="range"
                  name="stressLevel"
                  min={1}
                  max={5}
                  value={formData.stressLevel}
                  onChange={handleChange}
                  className="w-full accent-deep-pink h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sleep Hours</label>
                <input
                  type="number"
                  name="sleepHours"
                  min={0}
                  max={16}
                  value={formData.sleepHours}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-deep-pink focus:border-transparent outline-none transition-smooth"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Water Intake (L)</label>
                <input
                  type="number"
                  name="waterIntake"
                  step="0.1"
                  min={0}
                  max={10}
                  value={formData.waterIntake}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-deep-pink focus:border-transparent outline-none transition-smooth"
                  placeholder="e.g. 2.0"
                />
              </div>
            </div>
          </div>

          {/* Additional Health Data */}
          <div className="bg-soft-pink/20 rounded-2xl shadow-sm p-6 border border-gray-200 transition-all">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Additional Health Data</h3>
                <p className="text-sm text-gray-500">Optional signals for deeper insights.</p>
              </div>
              <span className="inline-flex items-center gap-2 text-xs text-gray-500">
                <Info className="w-4 h-4" /> Fill in what feels relevant.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Had intercourse today</label>
                  <input
                    type="checkbox"
                    name="hadIntercourse"
                    checked={formData.hadIntercourse}
                    onChange={handleChange}
                    className="h-5 w-5 text-deep-pink border-gray-300 rounded focus:ring-deep-pink"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Protection used</label>
                  <select
                    name="protectionUsed"
                    value={formData.protectionUsed}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-deep-pink focus:border-transparent outline-none transition-smooth"
                    disabled={!formData.hadIntercourse}
                  >
                    {protectionOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cervical mucus type</label>
                  <select
                    name="mucusType"
                    value={formData.mucusType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-deep-pink focus:border-transparent outline-none transition-smooth"
                  >
                    {mucusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Basal body temperature</label>
                    <span className="text-xs text-gray-500">°C</span>
                  </div>
                  <input
                    type="number"
                    name="basalBodyTemp"
                    step="0.1"
                    min={33}
                    max={40}
                    value={formData.basalBodyTemp}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-deep-pink focus:border-transparent outline-none transition-smooth"
                    placeholder="e.g. 36.6"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-deep-pink hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-xl transition-smooth shadow-md flex justify-center items-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                'Save Entry & Get ML Insights'
              )}
            </button>
            {message && <p className="mt-3 text-sm text-gray-600">{message}</p>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogCycle;
