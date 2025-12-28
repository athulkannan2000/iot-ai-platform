import { Link } from 'react-router-dom';
import {
  Blocks,
  Cpu,
  Brain,
  TrendingUp,
  Clock,
  FolderKanban,
  Play,
  Plus,
} from 'lucide-react';
import { useStore } from '@/store';

export default function Dashboard() {
  const { projects, devices } = useStore();

  const stats = [
    {
      label: 'Total Projects',
      value: projects.length || 12,
      icon: FolderKanban,
      color: 'bg-primary-500',
      trend: '+3 this week',
    },
    {
      label: 'Connected Devices',
      value: devices.filter((d) => d.status === 'online').length || 4,
      icon: Cpu,
      color: 'bg-accent-500',
      trend: '2 active',
    },
    {
      label: 'AI Models Used',
      value: 8,
      icon: Brain,
      color: 'bg-purple-500',
      trend: '+2 new',
    },
    {
      label: 'Hours Learning',
      value: 24,
      icon: Clock,
      color: 'bg-amber-500',
      trend: '+5 this week',
    },
  ];

  const recentProjects = [
    {
      id: '1',
      name: 'Smart Home Controller',
      description: 'Control lights and temperature',
      updatedAt: '2 hours ago',
      thumbnail: '🏠',
    },
    {
      id: '2',
      name: 'Plant Monitor',
      description: 'Monitor soil moisture and sunlight',
      updatedAt: '1 day ago',
      thumbnail: '🌱',
    },
    {
      id: '3',
      name: 'Face Detection',
      description: 'AI-powered face recognition',
      updatedAt: '3 days ago',
      thumbnail: '👤',
    },
  ];

  const quickActions = [
    {
      label: 'New IoT Project',
      icon: Cpu,
      to: '/editor?template=iot',
      color: 'from-primary-500 to-blue-600',
    },
    {
      label: 'New AI Project',
      icon: Brain,
      to: '/editor?template=ai',
      color: 'from-purple-500 to-pink-600',
    },
    {
      label: 'Browse Templates',
      icon: Blocks,
      to: '/learn',
      color: 'from-accent-500 to-emerald-600',
    },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
        <p className="text-primary-100 text-lg mb-6">
          Ready to build something amazing with IoT and AI?
        </p>
        <div className="flex gap-4">
          <Link
            to="/editor"
            className="bg-white text-primary-700 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-primary-50 transition-colors"
          >
            <Play className="w-5 h-5" />
            Start Building
          </Link>
          <Link
            to="/learn"
            className="bg-white/20 backdrop-blur px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-white/30 transition-colors"
          >
            Explore Tutorials
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card card-hover">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-sm text-accent-600 flex items-center gap-1 mt-2">
                  <TrendingUp className="w-3 h-3" />
                  {stat.trend}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-xl`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">Quick Actions</h3>
          <div className="space-y-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className={`block p-4 rounded-xl bg-gradient-to-r ${action.color} text-white hover:opacity-90 transition-opacity`}
              >
                <div className="flex items-center gap-3">
                  <action.icon className="w-6 h-6" />
                  <span className="font-medium">{action.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Recent Projects</h3>
            <Link
              to="/projects"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentProjects.map((project) => (
              <Link
                key={project.id}
                to={`/editor/${project.id}`}
                className="card card-hover group"
              >
                <div className="text-4xl mb-3">{project.thumbnail}</div>
                <h4 className="font-semibold text-slate-800 group-hover:text-primary-600 transition-colors">
                  {project.name}
                </h4>
                <p className="text-sm text-slate-500 mt-1">{project.description}</p>
                <p className="text-xs text-slate-400 mt-3">{project.updatedAt}</p>
              </Link>
            ))}
            <Link
              to="/editor"
              className="card card-hover border-dashed border-2 flex flex-col items-center justify-center text-slate-400 hover:text-primary-600 hover:border-primary-300"
            >
              <Plus className="w-8 h-8 mb-2" />
              <span className="font-medium">New Project</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Learning Progress */}
      <div className="card">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Learning Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">IoT Basics</span>
              <span className="text-sm text-accent-600">80%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-accent-500 rounded-full" style={{ width: '80%' }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">AI Fundamentals</span>
              <span className="text-sm text-primary-600">45%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-primary-500 rounded-full" style={{ width: '45%' }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">Advanced Projects</span>
              <span className="text-sm text-purple-600">20%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: '20%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
