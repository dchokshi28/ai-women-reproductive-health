import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart } from 'lucide-react';
import { authAPI } from '../services/api';

const Login = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login }   = useAuth();
  const navigate    = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.login({ email, password });
      login(res.data.user, res.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-3 rounded-xl border text-sm outline-none transition-smooth bg-white"
    + " focus:ring-2 placeholder-[#C4A0AE]";

  return (
    <div className="app-bg flex justify-center items-center min-h-[90vh] px-4">
      <div className="glass-card rounded-3xl p-8 w-full max-w-md animate-slide-up">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 animate-glow-pulse"
               style={{ background: '#FFCAD4' }}>
            <Heart className="w-8 h-8 animate-heartbeat" style={{ color: '#C94F7C' }} fill="#C94F7C" />
          </div>
          <h2 className="text-2xl font-bold" style={{ fontFamily: 'Poppins, sans-serif', color: '#3A3A3A' }}>
            Welcome Back
          </h2>
          <p className="text-sm mt-1" style={{ color: '#9A6B7A' }}>Sign in to track your health</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl mb-5 text-sm text-center border"
               style={{ background: '#FFF0F3', color: '#C94F7C', borderColor: '#FFCAD4' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#9A6B7A' }}>Email</label>
            <input
              type="email" required
              className={inputCls}
              style={{ borderColor: '#FFCAD4', color: '#3A3A3A' }}
              onFocus={e => { e.target.style.borderColor = '#C94F7C'; e.target.style.boxShadow = '0 0 0 3px rgba(201,79,124,0.12)'; }}
              onBlur={e => { e.target.style.borderColor = '#FFCAD4'; e.target.style.boxShadow = 'none'; }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#9A6B7A' }}>Password</label>
            <input
              type="password" required
              className={inputCls}
              style={{ borderColor: '#FFCAD4', color: '#3A3A3A' }}
              onFocus={e => { e.target.style.borderColor = '#C94F7C'; e.target.style.boxShadow = '0 0 0 3px rgba(201,79,124,0.12)'; }}
              onBlur={e => { e.target.style.borderColor = '#FFCAD4'; e.target.style.boxShadow = 'none'; }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="btn-primary w-full text-white font-semibold py-3 rounded-xl text-sm mt-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="dot-loader flex justify-center gap-1.5"><span /><span /><span /></span>
            ) : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm" style={{ color: '#9A6B7A' }}>
          Don't have an account?{' '}
          <a href="/signup" className="font-semibold hover:underline" style={{ color: '#C94F7C' }}>Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
