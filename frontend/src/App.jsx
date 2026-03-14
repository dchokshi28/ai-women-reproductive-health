import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LayoutDashboard, Calendar, BookOpen, Activity, MessageCircle, Star, UserCircle, LogOut, Menu, X, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';

import Login        from './pages/Login';
import Signup       from './pages/Signup';
import Dashboard    from './pages/Dashboard';
import LogCycle     from './pages/LogCycle';
import Posts        from './pages/Posts';
import Quiz         from './pages/Quiz';
import CommunityChat from './pages/CommunityChat';
import Subscription from './pages/Subscription';
import Profile      from './pages/Profile';

/* ── Splash ── */
const SplashScreen = () => (
  <div className="splash-overlay">
    <div className="relative flex items-center justify-center">
      <div className="absolute w-28 h-28 rounded-full animate-glow-pulse" style={{ background: '#F7CAD0' }} />
      <div className="relative z-10 w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-md">
        <Heart className="w-10 h-10 animate-heartbeat" style={{ color: '#E87A9A' }} fill="#E87A9A" />
      </div>
    </div>
    <p className="mt-6 text-2xl font-semibold tracking-wide" style={{ fontFamily: 'Poppins, sans-serif', color: '#3A3A3A' }}>
      HerHealth <span style={{ color: '#E87A9A' }}>AI</span>
    </p>
    <p className="mt-1 text-xs tracking-widest uppercase" style={{ color: '#8C7A7F' }}>Your wellness companion</p>
  </div>
);

/* ── Navbar ── */
const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  if (!user) return null;

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Log Cycle',  path: '/log-cycle',   icon: Calendar      },
    { name: 'Posts',      path: '/posts',        icon: BookOpen      },
    { name: 'Quiz',       path: '/quiz',         icon: Activity      },
    { name: 'Community',  path: '/chat',         icon: MessageCircle },
    { name: 'Upgrade',    path: '/subscription', icon: Star          },
    { name: 'Profile',    path: '/profile',      icon: UserCircle    },
  ];

  const active = (p) => location.pathname === p;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b" style={{ borderColor: '#EED9DE' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">

        {/* Logo */}
        <div className="flex items-center gap-2 font-bold text-lg select-none" style={{ fontFamily: 'Poppins, sans-serif' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#E87A9A' }}>
            <Heart className="w-4 h-4 text-white" fill="white" />
          </div>
          <span style={{ color: '#3A3A3A' }}>HerHealth</span>
          <span style={{ color: '#E87A9A' }}>AI</span>
        </div>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-0.5">
          {links.map(({ name, path, icon: Icon }) => (
            <Link key={name} to={path}
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-smooth"
              style={active(path)
                ? { background: '#FFDDE2', color: '#E87A9A' }
                : { color: '#5A5052' }}
            >
              <Icon className="w-4 h-4" />{name}
            </Link>
          ))}
          <button onClick={logout} title="Logout"
            className="ml-2 p-2 rounded-xl transition-smooth"
            style={{ color: '#8C7A7F' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#E87A9A'; e.currentTarget.style.background = '#FFDDE2'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#8C7A7F'; e.currentTarget.style.background = 'transparent'; }}>
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 rounded-xl transition-smooth" style={{ color: '#5A5052' }}
                onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden absolute w-full bg-white border-t shadow-lg animate-slide-up" style={{ borderColor: '#EED9DE' }}>
          <div className="px-3 py-3 space-y-1">
            {links.map(({ name, path, icon: Icon }) => (
              <Link key={name} to={path} onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-smooth"
                style={active(path) ? { background: '#FFDDE2', color: '#E87A9A' } : { color: '#5A5052' }}>
                <Icon className="w-5 h-5" />{name}
              </Link>
            ))}
            <button onClick={() => { logout(); setOpen(false); }}
              className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium"
              style={{ color: '#E87A9A' }}>
              <LogOut className="w-5 h-5" />Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

/* ── Protected Route ── */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex justify-center items-center h-screen app-bg">
      <div className="dot-loader"><span /><span /><span /></div>
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  return children;
};

/* ── App ── */
function App() {
  const [showSplash, setShowSplash] = useState(true);
  useEffect(() => { const t = setTimeout(() => setShowSplash(false), 2900); return () => clearTimeout(t); }, []);

  return (
    <>
      {showSplash && <SplashScreen />}
      <Router>
        <AuthProvider>
          <div className="app-bg flex flex-col font-sans">
            <Navigation />
            <main className="flex-grow">
              <Routes>
                <Route path="/login"        element={<Login />} />
                <Route path="/signup"       element={<Signup />} />
                <Route path="/dashboard"    element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/log-cycle"    element={<ProtectedRoute><LogCycle /></ProtectedRoute>} />
                <Route path="/posts"        element={<ProtectedRoute><Posts /></ProtectedRoute>} />
                <Route path="/quiz"         element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
                <Route path="/chat"         element={<ProtectedRoute><CommunityChat /></ProtectedRoute>} />
                <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
                <Route path="/profile"      element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/"             element={<Navigate to="/dashboard" />} />
              </Routes>
            </main>
          </div>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
