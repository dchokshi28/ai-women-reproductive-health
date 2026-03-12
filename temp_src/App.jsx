import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { LayoutDashboard, Calendar, BookOpen, Activity, MessageCircle, Star, UserCircle, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import LogCycle from './pages/LogCycle';
import Posts from './pages/Posts';
import Quiz from './pages/Quiz';
import CommunityChat from './pages/CommunityChat';
import Subscription from './pages/Subscription';
import Profile from './pages/Profile';

const Navigation = () => {
    const { user, logout } = useAuth();
  
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    if (!user) return null;

    const navLinks = [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Log Cycle', path: '/log-cycle', icon: Calendar },
      { name: 'Posts', path: '/posts', icon: BookOpen },
      { name: 'Quiz', path: '/quiz', icon: Activity },
      { name: 'Community', path: '/chat', icon: MessageCircle },
      { name: 'Upgrade', path: '/subscription', icon: Star },
      { name: 'Profile', path: '/profile', icon: UserCircle },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                <div className="font-bold text-deep-pink text-xl flex items-center gap-2">
                  <Activity className="w-6 h-6" /> HerHealth AI
                </div>
                
                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-1">
                    {navLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <Link 
                          key={link.name}
                          to={link.path} 
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-smooth ${
                            isActive(link.path) 
                              ? 'bg-soft-pink/30 text-deep-pink' 
                              : 'text-gray-600 hover:bg-gray-50 hover:text-deep-pink'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {link.name}
                        </Link>
                      );
                    })}
                    <button 
                      onClick={logout} 
                      className="ml-4 text-gray-500 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
                      title="Logout"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center">
                  <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="text-gray-600 hover:text-deep-pink"
                  >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </button>
                </div>
            </div>

            {/* Mobile Menu Content */}
            {isMobileMenuOpen && (
              <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in absolute w-full shadow-lg">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link 
                        key={link.name}
                        to={link.path} 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 block px-3 py-3 rounded-xl text-base font-medium transition-smooth ${
                          isActive(link.path) 
                            ? 'bg-soft-pink/30 text-deep-pink' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-deep-pink'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {link.name}
                      </Link>
                    );
                  })}
                  <button 
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }} 
                    className="flex w-full items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-red-500 hover:bg-red-50 transition-smooth"
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
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep-pink"></div>
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans">
          <Navigation />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/log-cycle" element={<ProtectedRoute><LogCycle /></ProtectedRoute>} />
              <Route path="/posts" element={<ProtectedRoute><Posts /></ProtectedRoute>} />
              <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
              <Route path="/chat" element={<ProtectedRoute><CommunityChat /></ProtectedRoute>} />
              <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              
              {/* Default Redirect */}
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
