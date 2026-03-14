import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart } from 'lucide-react';
import { authAPI } from '../services/api';

const inputCls = "w-full px-4 py-3 rounded-xl border text-sm outline-none transition-smooth bg-white placeholder-[#C4A0AE]";
const labelCls = "block text-xs font-semibold mb-1.5 uppercase tracking-wide";

const Signup = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', full_name: '', age: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.signup({ ...formData, age: parseInt(formData.age) });
      login(res.data.user, res.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle = { borderColor: '#FFCAD4', color: '#3A3A3A' };
  const onFocus = (e) => { e.target.style.borderColor = '#C94F7C'; e.target.style.boxShadow = '0 0 0 3px rgba(201,79,124,0.12)'; };
  const onBlur  = (e) => { e.target.style.borderColor = '#FFCAD4'; e.target.style.boxShadow = 'none'; };

  return (
    <div className="app-bg flex justify-center items-center min-h-[90vh] px-4 py-10">
      <div className="glass-card rounded-3xl p-8 w-full max-w-md animate-slide-up">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: '#FFCAD4' }}>
            <Heart className="w-8 h-8" style={{ color: '#C94F7C' }} fill="#C94F7C" />
          </div>
          <h2 className="text-2xl font-bold" style={{ fontFamily: 'Poppins, sans-serif', color: '#3A3A3A' }}>
            Create Account
          </h2>
          <p className="text-sm mt-1" style={{ color: '#9A6B7A' }}>Join us for better health tracking</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl mb-5 text-sm text-center border"
               style={{ background: '#FFF0F3', color: '#C94F7C', borderColor: '#FFCAD4' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Full Name', name: 'full_name', type: 'text',     placeholder: 'Jane Doe' },
            { label: 'Username',  name: 'username',  type: 'text',     placeholder: 'janedoe' },
            { label: 'Email',     name: 'email',     type: 'email',    placeholder: 'you@example.com' },
            { label: 'Age',       name: 'age',       type: 'number',   placeholder: '25' },
            { label: 'Password',  name: 'password',  type: 'password', placeholder: '••••••••' },
          ].map(({ label, name, type, placeholder }) => (
            <div key={name}>
              <label className={labelCls} style={{ color: '#9A6B7A' }}>{label}</label>
              <input
                type={type} name={name} required
                className={inputCls} style={fieldStyle}
                onFocus={onFocus} onBlur={onBlur}
                onChange={handleChange} placeholder={placeholder}
              />
            </div>
          ))}

          <button
            type="submit" disabled={loading}
            className="btn-primary w-full text-white font-semibold py-3 rounded-xl text-sm mt-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="dot-loader flex justify-center gap-1.5"><span /><span /><span /></span>
            ) : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm" style={{ color: '#9A6B7A' }}>
          Already have an account?{' '}
          <a href="/login" className="font-semibold hover:underline" style={{ color: '#C94F7C' }}>Log in</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
