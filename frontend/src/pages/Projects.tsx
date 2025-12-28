import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Plus,
  Filter,
  Grid3X3,
  List,
  MoreVertical,
  Trash2,
  Copy,
  Share2,
  Clock,
  Star,
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

interface Project {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  updatedAt: string;
  tags: string[];
  starred: boolean;
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Smart Home Controller',
    description: 'Control lights, temperature, and security from anywhere',
    thumbnail: '🏠',
    updatedAt: '2 hours ago',
    tags: ['IoT', 'Home Automation'],
    starred: true,
  },
  {
    id: '2',
    name: 'Plant Monitor System',
    description: 'Monitor soil moisture, light, and temperature for plants',
    thumbnail: '🌱',
    updatedAt: '1 day ago',
    tags: ['IoT', 'Sensors'],
    starred: false,
  },
  {
    id: '3',
    name: 'Face Detection Door Lock',
    description: 'AI-powered facial recognition door lock system',
    thumbnail: '👤',
    updatedAt: '3 days ago',
    tags: ['AI', 'Security'],
    starred: true,
  },
  {
    id: '4',
    name: 'Weather Station',
    description: 'Collect and display weather data from multiple sensors',
    thumbnail: '🌤️',
    updatedAt: '1 week ago',
    tags: ['IoT', 'Data'],
    starred: false,
  },
  {
    id: '5',
    name: 'Voice Assistant',
    description: 'Control IoT devices with voice commands',
    thumbnail: '🎤',
    updatedAt: '2 weeks ago',
    tags: ['AI', 'Speech'],
    starred: false,
  },
  {
    id: '6',
    name: 'Traffic Light Simulator',
    description: 'Learn about traffic systems with this simulation',
    thumbnail: '🚦',
    updatedAt: '1 month ago',
    tags: ['IoT', 'Education'],
    starred: false,
  },
];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = [...new Set(projects.flatMap((p) => p.tags))];

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || project.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const toggleStar = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, starred: !p.starred } : p))
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    toast.success('Project deleted');
  };

  const duplicateProject = (project: Project) => {
    const newProject = {
      ...project,
      id: Date.now().toString(),
      name: `${project.name} (Copy)`,
      updatedAt: 'Just now',
    };
    setProjects((prev) => [newProject, ...prev]);
    toast.success('Project duplicated');
  };

  return (
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Projects</h1>
          <p className="text-slate-500 mt-1">
            {filteredProjects.length} projects
          </p>
        </div>
        <Link to="/editor" className="btn btn-primary">
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                selectedTag === tag
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={clsx(
              'p-2 rounded-md transition-colors',
              viewMode === 'grid'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            )}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={clsx(
              'p-2 rounded-md transition-colors',
              viewMode === 'list'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Projects Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="card card-hover group relative"
            >
              <button
                onClick={() => toggleStar(project.id)}
                className="absolute top-4 right-4 z-10"
              >
                <Star
                  className={clsx(
                    'w-5 h-5 transition-colors',
                    project.starred
                      ? 'text-yellow-500 fill-yellow-500'
                      : 'text-slate-300 hover:text-yellow-500'
                  )}
                />
              </button>

              <Link to={`/editor/${project.id}`}>
                <div className="text-5xl mb-4">{project.thumbnail}</div>
                <h3 className="font-semibold text-slate-800 group-hover:text-primary-600 transition-colors">
                  {project.name}
                </h3>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                  {project.description}
                </p>
              </Link>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock className="w-3 h-3" />
                  {project.updatedAt}
                </div>
                <div className="flex items-center gap-1">
                  {project.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hover Actions */}
              <div className="absolute top-4 right-12 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                <button
                  onClick={() => duplicateProject(project)}
                  className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-slate-50"
                  title="Duplicate"
                >
                  <Copy className="w-4 h-4 text-slate-500" />
                </button>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-red-50"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}

          {/* New Project Card */}
          <Link
            to="/editor"
            className="card card-hover border-dashed border-2 flex flex-col items-center justify-center min-h-[200px] text-slate-400 hover:text-primary-600 hover:border-primary-300"
          >
            <Plus className="w-10 h-10 mb-2" />
            <span className="font-medium">Create New Project</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="card card-hover flex items-center gap-4 p-4"
            >
              <div className="text-3xl">{project.thumbnail}</div>
              <div className="flex-1">
                <Link
                  to={`/editor/${project.id}`}
                  className="font-semibold text-slate-800 hover:text-primary-600 transition-colors"
                >
                  {project.name}
                </Link>
                <p className="text-sm text-slate-500">{project.description}</p>
              </div>
              <div className="flex items-center gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Clock className="w-4 h-4" />
                {project.updatedAt}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleStar(project.id)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <Star
                    className={clsx(
                      'w-4 h-4',
                      project.starred
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-slate-300'
                    )}
                  />
                </button>
                <button
                  onClick={() => duplicateProject(project)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <Copy className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="p-2 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
