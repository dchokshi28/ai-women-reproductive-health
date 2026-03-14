import { useAuth } from '../AuthContext';
import { User, Mail, Calendar, Edit3, ShieldCheck } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 py-12 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Header Cover */}
        <div className="h-32 bg-gradient-to-r from-soft-pink to-soft-lavender relative">
          <div className="absolute -bottom-12 left-8 border-4 border-white rounded-full bg-white shadow-md">
             <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-4xl font-bold text-deep-pink">
                {user?.name?.charAt(0) || 'U'}
             </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-16 p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{user?.name || 'Demo User'}</h1>
              <span className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                <ShieldCheck className="w-4 h-4" /> Free Plan Active
              </span>
            </div>
            <button className="flex items-center gap-2 text-gray-600 hover:text-deep-pink bg-gray-50 hover:bg-soft-pink/20 px-4 py-2 rounded-lg font-medium transition-smooth border border-gray-200">
               <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-5 border border-gray-100 rounded-2xl bg-gray-50/50 flex items-start gap-4">
              <div className="p-3 bg-white rounded-full text-gray-400 shadow-sm">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Email Address</p>
                <p className="text-gray-800 font-semibold mt-1">{user?.email || 'user@example.com'}</p>
              </div>
            </div>

            <div className="p-5 border border-gray-100 rounded-2xl bg-gray-50/50 flex items-start gap-4">
              <div className="p-3 bg-white rounded-full text-gray-400 shadow-sm">
                <User className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Age</p>
                <p className="text-gray-800 font-semibold mt-1">{user?.age || '25'} Years old</p>
              </div>
            </div>

            <div className="p-5 border border-gray-100 rounded-2xl bg-gray-50/50 flex items-start gap-4">
              <div className="p-3 bg-white rounded-full text-gray-400 shadow-sm">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Average Cycle Length</p>
                <p className="text-gray-800 font-semibold mt-1">{user?.cycleLength || '28'} Days</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-8 mt-4 flex justify-end">
             <button 
               onClick={logout}
               className="text-red-500 font-medium hover:bg-red-50 px-6 py-2 rounded-lg transition-smooth border border-transparent hover:border-red-200"
             >
               Sign Out
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
