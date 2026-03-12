import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Heart } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    cycleLength: ''
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      login(formData);
      navigate('/dashboard');
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
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" name="name" required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-deep-lavender focus:ring-1 focus:ring-deep-lavender transition-smooth"
              onChange={handleChange} placeholder="Jane Doe"
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input 
                type="number" name="age" required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-deep-lavender focus:ring-1 focus:ring-deep-lavender transition-smooth"
                onChange={handleChange} placeholder="25"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cycle Length (Days)</label>
              <input 
                type="number" name="cycleLength" required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-deep-lavender focus:ring-1 focus:ring-deep-lavender transition-smooth"
                onChange={handleChange} placeholder="28"
              />
            </div>
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
            className="w-full bg-deep-lavender hover:bg-purple-600 text-white font-semibold py-2 rounded-lg transition-smooth shadow-md mt-2"
          >
            Sign Up
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
