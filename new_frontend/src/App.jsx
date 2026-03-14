import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LayoutDashboard, Calendar, BookOpen, Activity, MessageCircle, Star, UserCircle, LogOut, Menu, X, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import LogCycle from './pages/LogCycle';
import Posts from './pages/Posts';
import Quiz from './pages/Quiz';
import CommunityChat from './pages/CommunityChat';
import Subscription from './pages/Subscription';
import Profile from './pages/Profile';

const SplashScreen = () => (
  <div className="splash-overlay">
    <div className="relative flex items-center justify-center">
      <div className="absolute w-28 h-28 rounded-full animate-glow-pulse" style={{ background: '#FFCAD4' }} />
      <div className="relative z-10 w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-md">
        <Heart className="w-10 h-10 animate-heartbeat" style={{ color: '#C94F7C' }} fill="#C94F7C" />
      </div>
    </div>
    <p className="mt-6 text-2xl font-semibold tracking-wide" style={{ fontFamily: 'Poppins, sans-serif', color: '#3A3A3A' }}>
      HerHealth <span style={{ color: '#C94F7C' }}>AI</span>
    </p>
    <p className="mt-1 text-xs tracking-widest uppercase" style={{ color: '#C94F7C', opacity: 0.6 }}>Your wellness companion</p>
  </div>
);

const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user) return null;

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Log Cycle',  path: '/log-cycle',    icon: Calendar      },
    { name: 'Posts',      path: '/posts',         icon: BookOpen      },
    { name: 'Quiz',       path: '/quiz',          icon: Activity      },
    { name: 'Community',  path: '/chat',          icon: MessageCircle },
    { name: 'Upgrade',    path: '/subscription',  icon: Star          },
    { name: 'Profile',    path: '/profile',       icon: UserCircle    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b"
         style={{ background: 'rgba(255,245,247,0.92)', backdropFilter: 'blur(16px)', borderColor: '#FFCAD4' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">

        <div className="flex items-center gap-2 font-bold text-lg select-none" style={{ fontFamily: 'Poppins, sans-serif' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm" style={{ background: '#C94F7C' }}>
            <Heart className="w-4 h-4 text-white" fill="white" />
          </div>
          <span style={{ color: '#3A3A3A' }}>HerHealth</span>
          <span style={{ color: '#C94F7C' }}>AI</span>
        </div>

        <div className="hidden md:flex items-center gap-0.5">
          {navLinks.map(({ name, path, icon: Icon }) => (
            <Link
              key={name}
              to={path}
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-smooth"
              style={isActive(path)
                ? { background: '#FFCAD4', color: '#C94F7C' }
                : { color: '#9A6B7A' }}
            >
              <Icon className="w-4 h-4" />
              {name}
            </Link>
          ))}
          <button
            onClick={logout}
            className="ml-2 p-2 rounded-xl transition-smooth"
            style={{ color: '#9A6B7A' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#C94F7C'; e.currentTarget.style.background = '#FFCAD4'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#9A6B7A'; e.currentTarget.style.background = 'transparent'; }}
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <button
          className="md:hidden p-2 rounded-xl transition-smooth"
          style={{ color: '#9A6B7A' }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute w-full shadow-lg border-t animate-slide-up"
             style={{ background: 'rgba(255,245,247,0.97)', backdropFilter: 'blur(16px)', borderColor: '#FFCAD4' }}>
          <div className="px-3 py-3 space-y-1">
            {navLinks.map(({ name, path, icon: Icon }) => (
              <Link
                key={name}
                to={path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-smooth"
                style={isActive(path)
                  ? { background: '#FFCAD4', color: '#C94F7C' }
                  : { color: '#9A6B7A' }}
              >
                <Icon className="w-5 h-5" />
                {name}
              </Link>
            ))}
            <button
              onClick={() => { logout(); setIsMobileMenuOpen(false); }}
              className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-smooth"
              style={{ color: '#C94F7C' }}
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex justify-center items-center h-screen app-bg">
      <div className="dot-loader flex gap-2"><span /><span /><span /></div>
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  const [showSplash, setShowSplash] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 2900);
    return () => clearTimeout(t);
  }, []);

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
