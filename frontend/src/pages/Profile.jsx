import { useAuth } from '../context/AuthContext';
import { useEffect, useMemo, useState } from 'react';
import { User, Mail, Calendar, Edit3, ShieldCheck, HeartPulse, Activity, Sparkles } from 'lucide-react';
import api from '../services/api';

const stressOptions = ['Low', 'Medium', 'High'];
const exerciseOptions = ['None', 'Light', 'Moderate', 'Heavy'];
const goalOptions = ['Trying to Conceive', 'Avoid Pregnancy', 'Just Tracking Cycle'];

const Profile = () => {
  const { user, logout, login } = useAuth();
  const [health, setHealth] = useState({
    age: user?.age || 25,
    height: 165,
    weight: 60,
    cycleLength: user?.cycleLength || 28,
    periodDuration: 5,
    menarcheAge: 12,
    stressLevel: 'Medium',
    sleepHours: 7,
    exerciseFrequency: 'Moderate',
    conditions: { pcos: false, thyroid: false, diabetes: false },
    goal: 'Just Tracking Cycle',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) return;
    const loadHealth = async () => {
      setLoading(true);
      try {
        const res = await api.get('/profile/health-info');
        if (res.data) {
          setHealth((prev) => ({ ...prev, ...res.data }));
        }
      } catch (err) {
        // silent fail - backend may not be available
        console.warn('Could not load health info', err);
      } finally {
        setLoading(false);
      }
    };
    loadHealth();
  }, [user]);

  const bmi = useMemo(() => {
    if (!health.height || !health.weight) return '';
    const heightM = health.height / 100;
    if (!heightM) return '';
    const value = health.weight / (heightM * heightM);
    return Number.isFinite(value) ? value.toFixed(1) : '';
  }, [health.height, health.weight]);

  const completionPercent = useMemo(() => {
    const fields = [
      health.age,
      health.height,
      health.weight,
      health.cycleLength,
      health.periodDuration,
      health.menarcheAge,
      health.stressLevel,
      health.sleepHours,
      health.exerciseFrequency,
      health.goal,
    ];
    const filled = fields.filter((v) => v !== undefined && v !== null && v !== '').length;
    return Math.round((filled / fields.length) * 100);
  }, [health]);

  const completionSuggestions = useMemo(() => {
    const suggestions = [];
    if (!health.weight) suggestions.push('Add weight');
    if (!health.stressLevel) suggestions.push('Add stress level');
    if (!health.cycleLength) suggestions.push('Add cycle length');
    if (!health.sleepHours) suggestions.push('Add sleep hours');
    return suggestions;
  }, [health]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('conditions.')) {
      const key = name.split('.')[1];
      setHealth((prev) => ({
        ...prev,
        conditions: { ...prev.conditions, [key]: checked },
      }));
      return;
    }

    setHealth((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const payload = { ...health, bmi };
      await api.post('/profile/health-info', payload);

      // Keep user context in sync for quick dashboard access
      login({ ...user, age: health.age, cycleLength: health.cycleLength });

      setMessage('Health information saved successfully.');
    } catch (err) {
      console.error(err);
      setMessage('Could not save health info. Please try again later.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 py-12 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">

        {/* Header Cover */}
        <div className="h-32 bg-gradient-to-r from-soft-pink to-soft-lavender relative">
          <div className="absolute -bottom-12 left-8 border-4 border-white rounded-full bg-white shadow-md">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-4xl font-bold text-deep-pink">
              {user?.name?.charAt(0) || 'U'}
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-16 p-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{user?.name || 'Demo User'}</h1>
              <div className="mt-3 inline-flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  Free Plan Active
                </span>
              </div>
              <div className="mt-4 w-full md:max-w-sm rounded-full bg-gray-100 h-3 overflow-hidden">
                <div
                  className="h-full bg-deep-pink transition-all"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">Profile Completion: <span className="font-semibold text-gray-700">{completionPercent}%</span></p>
              {completionSuggestions.length > 0 && (
                <ul className="mt-2 text-xs text-gray-500">
                  {completionSuggestions.slice(0, 3).map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-deep-pink" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              className="flex items-center gap-2 text-gray-600 hover:text-deep-pink bg-gray-50 hover:bg-soft-pink/20 px-4 py-2 rounded-lg font-medium transition-smooth border border-gray-200"
              onClick={logout}
            >
              <Edit3 className="w-4 h-4" /> Sign Out
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-5 border border-gray-100 rounded-2xl bg-gray-50/50 flex items-start gap-4">
              <div className="p-3 bg-white rounded-full text-gray-400 shadow-sm">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Email Address</p>
                <p className="text-gray-800 font-semibold mt-1">{user?.email || 'user@example.com'}</p>
              </div>
            </div>

            <div className="p-5 border border-gray-100 rounded-2xl bg-gray-50/50 flex items-start gap-4">
              <div className="p-3 bg-white rounded-full text-gray-400 shadow-sm">
                <User className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Age</p>
                <p className="text-gray-800 font-semibold mt-1">{health.age} Years old</p>
              </div>
            </div>

            <div className="p-5 border border-gray-100 rounded-2xl bg-gray-50/50 flex items-start gap-4">
              <div className="p-3 bg-white rounded-full text-gray-400 shadow-sm">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Average Cycle Length</p>
                <p className="text-gray-800 font-semibold mt-1">{health.cycleLength} Days</p>
              </div>
            </div>

            <div className="p-5 border border-gray-100 rounded-2xl bg-gray-50/50 flex items-start gap-4">
              <div className="p-3 bg-white rounded-full text-gray-400 shadow-sm">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">BMI</p>
                <p className="text-gray-800 font-semibold mt-1">{bmi || '--'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-start justify-between mb-6 gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Health Information</h2>
                <p className="text-sm text-gray-500 mt-1">Share a few details so HerHealth AI can tailor insights for you.</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Sparkles className="w-4 h-4 text-deep-pink" />
                Tip: Keep this up-to-date for better predictions.
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input
                    name="age"
                    type="number"
                    min={10}
                    max={99}
                    value={health.age}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-deep-pink focus:border-transparent outline-none transition-smooth"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                  <input
                    name="height"
                    type="number"
                    min={100}
                    max={220}
                    value={health.height}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-deep-pink focus:border-transparent outline-none transition-smooth"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                  <input
                    name="weight"
                    type="number"
                    min={30}
                    max={200}
                    value={health.weight}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-deep-pink focus:border-transparent outline-none transition-smooth"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Average Cycle Length (days)</label>
                  <input
                    name="cycleLength"
                    type="number"
                    min={18}
                    max={45}
                    value={health.cycleLength}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-deep-pink focus:border-transparent outline-none transition-smooth"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Period Duration (days)</label>
                  <input
                    name="periodDuration"
                    type="number"
                    min={1}
                    max={15}
                    value={health.periodDuration}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-deep-pink focus:border-transparent outline-none transition-smooth"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age at First Period</label>
                  <input
                    name="menarcheAge"
                    type="number"
                    min={8}
                    max={25}
                    value={health.menarcheAge}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-deep-pink focus:border-transparent outline-none transition-smooth"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stress Level</label>
                  <select
                    name="stressLevel"
                    value={health.stressLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-deep-pink focus:border-transparent outline-none transition-smooth"
                  >
                    {stressOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sleep Hours</label>
                  <input
                    name="sleepHours"
                    type="number"
                    min={0}
                    max={16}
                    value={health.sleepHours}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-deep-pink focus:border-transparent outline-none transition-smooth"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Exercise Frequency</label>
                  <select
                    name="exerciseFrequency"
                    value={health.exerciseFrequency}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-deep-pink focus:border-transparent outline-none transition-smooth"
                  >
                    {exerciseOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Goal</label>
                  <select
                    name="goal"
                    value={health.goal}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-deep-pink focus:border-transparent outline-none transition-smooth"
                  >
                    {goalOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-3">
                  <p className="text-sm font-medium text-gray-700 mb-3">Health Conditions</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-3 transition-smooth hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        name="conditions.pcos"
                        checked={health.conditions.pcos}
                        onChange={handleChange}
                        className="h-4 w-4 text-deep-pink border-gray-300 rounded focus:ring-deep-pink"
                      />
                      <span className="text-sm text-gray-700">PCOS</span>
                    </label>

                    <label className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-3 transition-smooth hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        name="conditions.thyroid"
                        checked={health.conditions.thyroid}
                        onChange={handleChange}
                        className="h-4 w-4 text-deep-pink border-gray-300 rounded focus:ring-deep-pink"
                      />
                      <span className="text-sm text-gray-700">Thyroid Disorder</span>
                    </label>

                    <label className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-3 transition-smooth hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        name="conditions.diabetes"
                        checked={health.conditions.diabetes}
                        onChange={handleChange}
                        className="h-4 w-4 text-deep-pink border-gray-300 rounded focus:ring-deep-pink"
                      />
                      <span className="text-sm text-gray-700">Diabetes</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-deep-pink hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-xl transition-smooth shadow-md flex justify-center items-center"
                >
                  {saving ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  ) : (
                    'Save Health Info'
                  )}
                </button>
                {message && (
                  <p className="mt-3 text-sm text-gray-600">{message}</p>
                )}
              </div>
            </form>
          </div>

          <div className="border-t border-gray-100 pt-8 mt-4 flex justify-end">
            <button
              onClick={logout}
              className="text-red-500 font-medium hover:bg-red-50 px-6 py-2 rounded-lg transition-smooth border border-transparent hover:border-red-200"
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
