import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart } from 'lucide-react';

const Login = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      login({ email, name: email.split('@')[0], age: 28, cycleLength: 28 });
      navigate('/dashboard');
    }
  };

  return (
    <div className="app-bg flex justify-center items-center min-h-[90vh] px-4">
      <div className="bg-white rounded-[24px] border p-8 w-full max-w-md animate-slide-up"
           style={{ borderColor: '#EED9DE', boxShadow: '0 10px 25px rgba(0,0,0,0.04)' }}>

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 animate-glow-pulse"
               style={{ background: '#FFDDE2' }}>
            <Heart className="w-8 h-8 animate-heartbeat" style={{ color: '#E87A9A' }} fill="#E87A9A" />
          </div>
          <h2 className="text-2xl font-bold" style={{ color: '#3A3A3A', fontFamily: 'Poppins, sans-serif' }}>
            Welcome Back
          </h2>
          <p className="text-sm mt-1" style={{ color: '#5A5052' }}>Sign in to track your health</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide"
                   style={{ color: '#8C7A7F' }}>Email</label>
            <input type="email" required className="input-base"
                   value={email} onChange={(e) => setEmail(e.target.value)}
                   placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide"
                   style={{ color: '#8C7A7F' }}>Password</label>
            <input type="password" required className="input-base"
                   value={password} onChange={(e) => setPassword(e.target.value)}
                   placeholder="••••••••" />
          </div>
          <button type="submit"
                  className="btn-primary w-full font-semibold py-3 rounded-xl text-sm mt-2">
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm" style={{ color: '#8C7A7F' }}>
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold hover:underline" style={{ color: '#E87A9A' }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
