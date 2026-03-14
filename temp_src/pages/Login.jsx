import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Activity } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      // Mock basic login
      login({ email, name: 'Demo User', age: 28, cycleLength: 28 });
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-soft-pink/20">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md glass-panel">
        <div className="flex flex-col items-center mb-6">
          <Activity className="text-deep-pink w-12 h-12 mb-2" />
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 text-sm">Sign in to track your health</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-pink focus:border-transparent outline-none transition-smooth"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-pink focus:border-transparent outline-none transition-smooth"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-deep-pink hover:bg-pink-600 text-white font-semibold py-2 rounded-lg transition-smooth shadow-md"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account? <a href="/signup" className="text-deep-pink font-semibold hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
