import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart } from 'lucide-react';
import { authAPI } from '../services/api';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    age: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.signup({
        ...formData,
        age: parseInt(formData.age)
      });
      login(response.data.user, response.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12 bg-soft-lavender/20 min-h-[80vh]">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md glass-panel">
        <div className="flex flex-col items-center mb-6">
          <Heart className="text-deep-lavender w-12 h-12 mb-2" />
          <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-500 text-sm">Join us for better health tracking</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" name="full_name" required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-deep-lavender focus:ring-1 focus:ring-deep-lavender transition-smooth"
              onChange={handleChange} placeholder="Jane Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input 
              type="text" name="username" required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-deep-lavender focus:ring-1 focus:ring-deep-lavender transition-smooth"
              onChange={handleChange} placeholder="janedoe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" name="email" required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-deep-lavender focus:ring-1 focus:ring-deep-lavender transition-smooth"
              onChange={handleChange} placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <input 
              type="number" name="age" required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-deep-lavender focus:ring-1 focus:ring-deep-lavender transition-smooth"
              onChange={handleChange} placeholder="25"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" name="password" required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-deep-lavender focus:ring-1 focus:ring-deep-lavender transition-smooth"
              onChange={handleChange} placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-deep-lavender hover:bg-purple-600 text-white font-semibold py-2 rounded-lg transition-smooth shadow-md mt-2 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <a href="/login" className="text-deep-lavender font-semibold hover:underline">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
