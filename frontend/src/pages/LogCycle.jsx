import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar as CalendarIcon, Droplet, Frown, Activity } from 'lucide-react';

const LogCycle = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    Age: user?.age || 25,
    Cycle_Length: user?.cycleLength || 28,
    Period_Duration: 5,
    Pain_Level: 3,
    Flow_Intensity: 2, // 1: Low, 2: Medium, 3: High
    Mood_Changes: 3, // 1-5
    lastPeriodDate: new Date().toISOString().split('T')[0] // yyyy-mm-dd
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === 'number' || e.target.type === 'range' 
        ? Number(e.target.value) 
        : e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate delay, then save to localStorage so the Dashboard can pick it up and request the API
    setTimeout(() => {
      localStorage.setItem('recentCycle', JSON.stringify(formData));
      setLoading(false);
      navigate('/dashboard');
    }, 600);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 py-12 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-lg border border-soft-pink/20 overflow-hidden">
        
        <div className="bg-gradient-to-r from-soft-pink to-soft-lavender p-8 text-center">
          <CalendarIcon className="w-12 h-12 text-white mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-white mb-2">Log Your Cycle</h2>
          <p className="text-pink-50 text-sm">Track your symptoms for accurate ML predictions</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Period Start Date</label>
              <input 
                type="date" 
                name="lastPeriodDate"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-deep-pink focus:border-transparent outline-none transition-smooth"
                value={formData.lastPeriodDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Period Duration (Days)</label>
              <input 
                type="number" 
                name="Period_Duration"
                min="1" max="15"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-deep-pink focus:border-transparent outline-none transition-smooth"
                value={formData.Period_Duration}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Activity className="w-4 h-4 text-deep-pink" /> Cramps & Pain Level
              </label>
              <span className="text-xs font-semibold text-deep-pink bg-soft-pink px-2 py-1 rounded-full">
                {formData.Pain_Level}/5
              </span>
            </div>
            <input 
              type="range" 
              name="Pain_Level"
              min="1" max="5"
              className="w-full accent-deep-pink h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              value={formData.Pain_Level}
              onChange={handleChange}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>None</span>
              <span>Mild</span>
              <span>Moderate</span>
              <span>Severe</span>
              <span>Extreme</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Droplet className="w-4 h-4 text-blue-500" /> Flow Intensity
            </label>
            <div className="flex gap-4">
              {[
                { value: 1, label: 'Light' },
                { value: 2, label: 'Medium' },
                { value: 3, label: 'Heavy' }
              ].map((option) => (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => setFormData({...formData, Flow_Intensity: option.value})}
                  className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-smooth ${
                    formData.Flow_Intensity === option.value 
                      ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' 
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Frown className="w-4 h-4 text-deep-lavender" /> Mood Alterations
              </label>
              <span className="text-xs font-semibold text-deep-lavender bg-soft-lavender px-2 py-1 rounded-full">
                {formData.Mood_Changes}/5
              </span>
            </div>
            <input 
              type="range" 
              name="Mood_Changes"
              min="1" max="5"
              className="w-full accent-deep-lavender h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              value={formData.Mood_Changes}
              onChange={handleChange}
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-deep-pink hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-xl transition-smooth shadow-md flex justify-center items-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : "Save Entry & Get ML Insights"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default LogCycle;
