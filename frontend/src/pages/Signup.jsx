import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', age: '', cycleLength: '' });
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      login({ ...formData, age: Number(formData.age), cycleLength: Number(formData.cycleLength) || 28 });
      navigate('/dashboard');
    }
  };

  return (
    <div className="app-bg flex justify-center items-center min-h-[90vh] px-4 py-10">
      <div className="bg-white rounded-[24px] border p-8 w-full max-w-md animate-slide-up"
           style={{ borderColor: '#EED9DE', boxShadow: '0 10px 25px rgba(0,0,0,0.04)' }}>

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
               style={{ background: '#FFDDE2' }}>
            <Heart className="w-8 h-8 animate-heartbeat" style={{ color: '#E87A9A' }} fill="#E87A9A" />
          </div>
          <h2 className="text-2xl font-bold" style={{ color: '#3A3A3A', fontFamily: 'Poppins, sans-serif' }}>
            Create Account
          </h2>
          <p className="text-sm mt-1" style={{ color: '#5A5052' }}>Join us for better health tracking</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Full Name',     name: 'name',        type: 'text',     placeholder: 'Jane Doe' },
            { label: 'Email',         name: 'email',       type: 'email',    placeholder: 'you@example.com' },
          ].map(f => (
            <div key={f.name}>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#8C7A7F' }}>{f.label}</label>
              <input type={f.type} name={f.name} required className="input-base" onChange={handleChange} placeholder={f.placeholder} />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#8C7A7F' }}>Age</label>
              <input type="number" name="age" required className="input-base" onChange={handleChange} placeholder="25" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#8C7A7F' }}>Cycle Length</label>
              <input type="number" name="cycleLength" required className="input-base" onChange={handleChange} placeholder="28" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#8C7A7F' }}>Password</label>
            <input type="password" name="password" required className="input-base" onChange={handleChange} placeholder="••••••••" />
          </div>
          <button type="submit" className="btn-primary w-full font-semibold py-3 rounded-xl text-sm mt-2">
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm" style={{ color: '#8C7A7F' }}>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold hover:underline" style={{ color: '#E87A9A' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
