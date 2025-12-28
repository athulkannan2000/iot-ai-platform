import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Play,
  Clock,
  Star,
  ChevronRight,
  Lightbulb,
  Cpu,
  Brain,
  Wifi,
  CheckCircle,
  Lock,
} from 'lucide-react';
import clsx from 'clsx';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'iot' | 'ai' | 'basics';
  thumbnail: string;
  completed: boolean;
  locked: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
  lessons: number;
  duration: string;
  progress: number;
  icon: string;
}

const tutorials: Tutorial[] = [
  {
    id: '1',
    title: 'Your First Blink',
    description: 'Learn to control an LED with visual blocks',
    duration: '10 min',
    difficulty: 'beginner',
    category: 'iot',
    thumbnail: '💡',
    completed: true,
    locked: false,
  },
  {
    id: '2',
    title: 'Temperature Monitor',
    description: 'Read temperature sensor data and display it',
    duration: '15 min',
    difficulty: 'beginner',
    category: 'iot',
    thumbnail: '🌡️',
    completed: true,
    locked: false,
  },
  {
    id: '3',
    title: 'Smart Light System',
    description: 'Build an automatic light based on ambient sensor',
    duration: '20 min',
    difficulty: 'beginner',
    category: 'iot',
    thumbnail: '🔆',
    completed: false,
    locked: false,
  },
  {
    id: '4',
    title: 'WiFi Data Logger',
    description: 'Send sensor data to the cloud via WiFi',
    duration: '25 min',
    difficulty: 'intermediate',
    category: 'iot',
    thumbnail: '📡',
    completed: false,
    locked: false,
  },
  {
    id: '5',
    title: 'Image Classification 101',
    description: 'Use AI to classify objects in images',
    duration: '20 min',
    difficulty: 'beginner',
    category: 'ai',
    thumbnail: '🖼️',
    completed: false,
    locked: false,
  },
  {
    id: '6',
    title: 'Voice-Controlled LED',
    description: 'Control devices using voice commands',
    duration: '30 min',
    difficulty: 'intermediate',
    category: 'ai',
    thumbnail: '🎤',
    completed: false,
    locked: true,
  },
  {
    id: '7',
    title: 'Smart Security System',
    description: 'Build a face detection security system',
    duration: '45 min',
    difficulty: 'advanced',
    category: 'ai',
    thumbnail: '🔐',
    completed: false,
    locked: true,
  },
];

const courses: Course[] = [
  {
    id: '1',
    title: 'IoT Fundamentals',
    description: 'Master the basics of IoT development',
    lessons: 10,
    duration: '3 hours',
    progress: 80,
    icon: '🔌',
  },
  {
    id: '2',
    title: 'AI for Beginners',
    description: 'Introduction to AI and machine learning',
    lessons: 8,
    duration: '2.5 hours',
    progress: 45,
    icon: '🤖',
  },
  {
    id: '3',
    title: 'Advanced Projects',
    description: 'Complex IoT + AI integration projects',
    lessons: 6,
    duration: '4 hours',
    progress: 20,
    icon: '🚀',
  },
];

const difficultyColors = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
};

export default function Learn() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'iot' | 'ai' | 'basics'>('all');

  const filteredTutorials =
    activeCategory === 'all'
      ? tutorials
      : tutorials.filter((t) => t.category === activeCategory);

  return (
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Learn</h1>
        <p className="text-slate-500 mt-1">
          Interactive tutorials and courses to master IoT and AI
        </p>
      </div>

      {/* Learning Progress */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">Your Learning Journey</h2>
            <p className="text-primary-100">
              Keep going! You've completed 3 of 10 tutorials.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>3 Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>2.5 hrs spent</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                <span>150 XP earned</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-32 rounded-full border-8 border-white/20 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold">30%</div>
                <div className="text-sm text-primary-100">Complete</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Continue Learning</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div key={course.id} className="card card-hover">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl">{course.icon}</div>
                <div>
                  <h3 className="font-semibold text-slate-800">{course.title}</h3>
                  <p className="text-sm text-slate-500">{course.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {course.lessons} lessons
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {course.duration}
                </span>
              </div>
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-slate-500">Progress</span>
                  <span className="font-medium text-primary-600">{course.progress}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 rounded-full transition-all"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
              <button className="w-full btn btn-primary">
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tutorials */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Tutorials</h2>
          <div className="flex items-center gap-2">
            {(['all', 'iot', 'ai'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={clsx(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors uppercase',
                  activeCategory === cat
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTutorials.map((tutorial) => (
            <div
              key={tutorial.id}
              className={clsx(
                'card transition-all',
                tutorial.locked
                  ? 'opacity-60'
                  : 'card-hover cursor-pointer'
              )}
            >
              <div className="relative">
                <div className="text-5xl mb-4">{tutorial.thumbnail}</div>
                {tutorial.completed && (
                  <div className="absolute top-0 right-0">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                )}
                {tutorial.locked && (
                  <div className="absolute top-0 right-0">
                    <Lock className="w-6 h-6 text-slate-400" />
                  </div>
                )}
              </div>

              <h3 className="font-semibold text-slate-800 mb-1">{tutorial.title}</h3>
              <p className="text-sm text-slate-500 mb-4">{tutorial.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={clsx(
                      'px-2 py-0.5 rounded text-xs font-medium capitalize',
                      difficultyColors[tutorial.difficulty]
                    )}
                  >
                    {tutorial.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-slate-400">
                  <Clock className="w-3 h-3" />
                  {tutorial.duration}
                </div>
              </div>

              {!tutorial.locked && (
                <Link
                  to={`/editor?tutorial=${tutorial.id}`}
                  className="w-full btn btn-secondary mt-4"
                >
                  <Play className="w-4 h-4" />
                  {tutorial.completed ? 'Review' : 'Start'}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
