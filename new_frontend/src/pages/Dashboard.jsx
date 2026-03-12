import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Activity, AlertCircle, TrendingUp, BookOpen, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cyclesAPI } from '../services/api';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCycles();
  }, []);

  const fetchCycles = async () => {
    try {
      const response = await cyclesAPI.getAll();
      setCycles(response.data);
    } catch (err) {
      console.error('Error fetching cycles:', err);
    } finally {
      setLoading(false);
    }
  };

  const latestCycle = cycles[0];
  const cycleLength = latestCycle?.cycle_length || 28;
  
  const nextPeriodDate = latestCycle 
    ? new Date(new Date(latestCycle.date).getTime() + cycleLength * 24 * 60 * 60 * 1000)
    : new Date();

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  // Chart data
  const chartData = {
    labels: cycles.slice(0, 6).reverse().map((c, i) => `Cycle ${i + 1}`),
    datasets: [
      {
        label: 'Pain Level',
        data: cycles.slice(0, 6).reverse().map(c => c.pain_level),
        borderColor: 'rgb(236, 72, 153)',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Mood Changes',
        data: cycles.slice(0, 6).reverse().map(c => c.mood_changes),
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Cycle Trends' },
    },
    scales: {
      y: { beginAtZero: true, max: 5 },
    },
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Hello, {user?.username || 'User'}! 👋</h1>
          <p className="text-gray-500 mt-1">Here is your daily reproductive health overview.</p>
        </div>
        <button 
          onClick={() => navigate('/log-cycle')}
          className="bg-deep-pink hover:bg-pink-600 text-white px-6 py-2 rounded-full shadow-md transition-smooth font-medium flex items-center gap-2"
        >
          <Calendar className="w-5 h-5" />
          Log Cycle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-soft-pink/30 hover:shadow-md transition-smooth">
          <div className="flex items-center gap-3 mb-4 text-deep-pink">
            <Activity className="w-6 h-6" />
            <h2 className="text-xl font-semibold text-gray-800">Cycle Tracker</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-gray-500">Next Period</span>
              <span className="font-semibold text-gray-800">{formatDate(nextPeriodDate)}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-gray-500">Cycle Length</span>
              <span className="font-semibold text-gray-800">{cycleLength} Days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Logged Cycles</span>
              <span className="font-semibold text-gray-800">{cycles.length}</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-gradient-to-br from-soft-pink/30 to-soft-lavender/30 rounded-2xl p-6 shadow-sm border border-white">
          <div className="flex items-center gap-3 mb-4 text-deep-lavender">
            <TrendingUp className="w-6 h-6" />
            <h2 className="text-xl font-semibold text-gray-800">AI Health Insights</h2>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-deep-pink"></div>
            </div>
          ) : !latestCycle ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500 bg-white/50 rounded-xl">
              <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
              <p>Log a cycle to receive AI-powered health insights.</p>
            </div>
          ) : (
            <div className="bg-white/80 rounded-xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full ${
                  latestCycle.prediction === 'Normal Cycle' ? 'bg-green-100 text-green-600' :
                  latestCycle.prediction === 'Possible Irregularity' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{latestCycle.prediction}</h3>
                  <p className="text-gray-600 mt-2 leading-relaxed">{latestCycle.recommendation}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {cycles.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <Line data={chartData} options={chartOptions} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        <button onClick={() => navigate('/posts')} className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-deep-pink border border-transparent transition-smooth flex flex-col items-center justify-center text-center group">
          <div className="bg-soft-pink/50 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
            <BookOpen className="w-6 h-6 text-deep-pink" />
          </div>
          <span className="font-semibold text-gray-800">Doctor Posts</span>
          <span className="text-sm text-gray-500 mt-1">Read expert advice</span>
        </button>
        
        <button onClick={() => navigate('/quiz')} className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-deep-lavender border border-transparent transition-smooth flex flex-col items-center justify-center text-center group">
          <div className="bg-soft-lavender/50 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
            <Activity className="w-6 h-6 text-deep-lavender" />
          </div>
          <span className="font-semibold text-gray-800">Health Quiz</span>
          <span className="text-sm text-gray-500 mt-1">Test your knowledge</span>
        </button>

        <button onClick={() => navigate('/chat')} className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-300 border border-transparent transition-smooth flex flex-col items-center justify-center text-center group">
          <div className="bg-blue-100 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
            <MessageCircle className="w-6 h-6 text-blue-500" />
          </div>
          <span className="font-semibold text-gray-800">Community Chat</span>
          <span className="text-sm text-gray-500 mt-1">Connect with others</span>
        </button>
      </div>

    </div>
  );
};

export default Dashboard;
