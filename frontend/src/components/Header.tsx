import { Bell, Search, User, Plus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '@/store';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/editor': 'Block Editor',
  '/projects': 'Projects',
  '/devices': 'Devices',
  '/ai-models': 'AI Models',
  '/learn': 'Learn',
  '/settings': 'Settings',
};

export default function Header() {
  const location = useLocation();
  const user = useStore((state) => state.user);
  const pageTitle = pageTitles[location.pathname] || 'IoT & AI Platform';

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-slate-800">{pageTitle}</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects, blocks..."
            className="pl-10 pr-4 py-2 w-64 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
          />
        </div>

        {/* New Project Button */}
        <Link
          to="/editor"
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </Link>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User Menu */}
        <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-4 h-4 text-white" />
            )}
          </div>
          <span className="text-sm font-medium text-slate-700">
            {user?.name || 'Guest'}
          </span>
        </button>
      </div>
    </header>
  );
}
