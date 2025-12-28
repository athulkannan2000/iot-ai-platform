import { useState } from 'react';
import {
  Brain,
  Image,
  Mic,
  LineChart,
  Upload,
  Play,
  Settings,
  Download,
  Eye,
  Sparkles,
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

interface AIModel {
  id: string;
  name: string;
  type: 'vision' | 'speech' | 'prediction';
  description: string;
  accuracy: number;
  size: string;
  status: 'ready' | 'training' | 'loading';
  isPreTrained: boolean;
}

const mockModels: AIModel[] = [
  {
    id: '1',
    name: 'MobileNet v2',
    type: 'vision',
    description: 'General image classification (1000 classes)',
    accuracy: 92,
    size: '14 MB',
    status: 'ready',
    isPreTrained: true,
  },
  {
    id: '2',
    name: 'COCO-SSD',
    type: 'vision',
    description: 'Object detection (80 objects)',
    accuracy: 89,
    size: '22 MB',
    status: 'ready',
    isPreTrained: true,
  },
  {
    id: '3',
    name: 'Face Detection',
    type: 'vision',
    description: 'Detect faces in images',
    accuracy: 95,
    size: '8 MB',
    status: 'ready',
    isPreTrained: true,
  },
  {
    id: '4',
    name: 'Speech Commands',
    type: 'speech',
    description: 'Recognize 18 voice commands',
    accuracy: 88,
    size: '4 MB',
    status: 'ready',
    isPreTrained: true,
  },
  {
    id: '5',
    name: 'Plant Classifier',
    type: 'vision',
    description: 'Custom model for plant species',
    accuracy: 78,
    size: '12 MB',
    status: 'training',
    isPreTrained: false,
  },
  {
    id: '6',
    name: 'Temperature Predictor',
    type: 'prediction',
    description: 'Predict temperature from sensor data',
    accuracy: 85,
    size: '2 MB',
    status: 'ready',
    isPreTrained: false,
  },
];

const typeIcons = {
  vision: Image,
  speech: Mic,
  prediction: LineChart,
};

const typeColors = {
  vision: 'bg-purple-100 text-purple-600',
  speech: 'bg-pink-100 text-pink-600',
  prediction: 'bg-blue-100 text-blue-600',
};

export default function AIModels() {
  const [models, setModels] = useState<AIModel[]>(mockModels);
  const [activeTab, setActiveTab] = useState<'all' | 'vision' | 'speech' | 'prediction'>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const filteredModels =
    activeTab === 'all'
      ? models
      : models.filter((m) => m.type === activeTab);

  const handleTest = (model: AIModel) => {
    toast.success(`Testing ${model.name}...`);
  };

  const handleDownload = (model: AIModel) => {
    toast.success(`Downloading ${model.name}...`);
  };

  return (
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">AI Models</h1>
          <p className="text-slate-500 mt-1">
            Pre-trained and custom models for your projects
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-secondary">
            <Upload className="w-4 h-4" />
            Import Model
          </button>
          <button className="btn btn-primary">
            <Sparkles className="w-4 h-4" />
            Train New Model
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Models</p>
              <p className="text-2xl font-bold text-slate-800">{models.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className={clsx('p-3 rounded-xl', typeColors.vision)}>
              <Image className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Vision Models</p>
              <p className="text-2xl font-bold text-slate-800">
                {models.filter((m) => m.type === 'vision').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className={clsx('p-3 rounded-xl', typeColors.speech)}>
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Speech Models</p>
              <p className="text-2xl font-bold text-slate-800">
                {models.filter((m) => m.type === 'speech').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className={clsx('p-3 rounded-xl', typeColors.prediction)}>
              <LineChart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Prediction Models</p>
              <p className="text-2xl font-bold text-slate-800">
                {models.filter((m) => m.type === 'prediction').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {(['all', 'vision', 'speech', 'prediction'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize',
              activeTab === tab
                ? 'bg-primary-100 text-primary-700'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            )}
          >
            {tab === 'all' ? 'All Models' : tab}
          </button>
        ))}
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModels.map((model) => {
          const TypeIcon = typeIcons[model.type];
          return (
            <div key={model.id} className="card card-hover">
              <div className="flex items-start justify-between mb-4">
                <div className={clsx('p-3 rounded-xl', typeColors[model.type])}>
                  <TypeIcon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  {model.isPreTrained && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                      Pre-trained
                    </span>
                  )}
                  <span
                    className={clsx(
                      'px-2 py-1 rounded text-xs font-medium',
                      model.status === 'ready' && 'bg-green-100 text-green-700',
                      model.status === 'training' && 'bg-yellow-100 text-yellow-700',
                      model.status === 'loading' && 'bg-blue-100 text-blue-700'
                    )}
                  >
                    {model.status}
                  </span>
                </div>
              </div>

              <h3 className="font-semibold text-slate-800 mb-1">{model.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{model.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Accuracy</span>
                  <span className="font-medium text-slate-700">{model.accuracy}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={clsx(
                      'h-full rounded-full',
                      model.accuracy >= 90
                        ? 'bg-green-500'
                        : model.accuracy >= 80
                        ? 'bg-yellow-500'
                        : 'bg-orange-500'
                    )}
                    style={{ width: `${model.accuracy}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Size</span>
                  <span className="text-slate-700">{model.size}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleTest(model)}
                  disabled={model.status !== 'ready'}
                  className="flex-1 btn btn-primary text-sm disabled:opacity-50"
                >
                  <Play className="w-4 h-4" />
                  Test
                </button>
                <button
                  onClick={() => handleDownload(model)}
                  className="btn btn-secondary"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button className="btn btn-secondary">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Train New Model Card */}
        <div className="card border-dashed border-2 border-slate-300 flex flex-col items-center justify-center min-h-[300px] text-slate-400 hover:text-primary-600 hover:border-primary-300 cursor-pointer transition-colors">
          <Sparkles className="w-10 h-10 mb-2" />
          <span className="font-medium">Train New Model</span>
          <span className="text-sm mt-1 text-center px-4">
            Create custom AI models with your own data
          </span>
        </div>
      </div>
    </div>
  );
}
