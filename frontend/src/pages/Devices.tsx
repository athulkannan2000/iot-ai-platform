import { useState } from 'react';
import {
  Cpu,
  Wifi,
  WifiOff,
  Plus,
  Settings,
  Trash2,
  RefreshCw,
  Activity,
  MoreVertical,
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

interface Device {
  id: string;
  name: string;
  type: 'arduino' | 'esp32' | 'raspberry-pi' | 'simulator';
  status: 'online' | 'offline' | 'connecting';
  ip?: string;
  lastSeen?: string;
  firmware?: string;
}

const mockDevices: Device[] = [
  {
    id: '1',
    name: 'Living Room Arduino',
    type: 'arduino',
    status: 'online',
    ip: '192.168.1.101',
    lastSeen: 'Just now',
    firmware: 'v1.2.0',
  },
  {
    id: '2',
    name: 'Garden ESP32',
    type: 'esp32',
    status: 'online',
    ip: '192.168.1.102',
    lastSeen: '2 min ago',
    firmware: 'v2.0.1',
  },
  {
    id: '3',
    name: 'Raspberry Pi Hub',
    type: 'raspberry-pi',
    status: 'offline',
    ip: '192.168.1.103',
    lastSeen: '2 hours ago',
    firmware: 'v3.1.0',
  },
  {
    id: '4',
    name: 'Virtual Simulator',
    type: 'simulator',
    status: 'online',
    lastSeen: 'Always available',
  },
];

const deviceIcons: Record<string, string> = {
  arduino: '🔵',
  esp32: '🟢',
  'raspberry-pi': '🔴',
  simulator: '💻',
};

const deviceColors: Record<string, string> = {
  arduino: 'bg-blue-50 border-blue-200',
  esp32: 'bg-green-50 border-green-200',
  'raspberry-pi': 'bg-red-50 border-red-200',
  simulator: 'bg-purple-50 border-purple-200',
};

export default function Devices() {
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    toast.loading('Scanning for devices...');
    setTimeout(() => {
      setIsScanning(false);
      toast.dismiss();
      toast.success('Scan complete! No new devices found.');
    }, 3000);
  };

  const handleRemove = (id: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
    toast.success('Device removed');
  };

  const handleReconnect = (id: string) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'connecting' as const } : d))
    );
    toast.loading('Connecting...');
    setTimeout(() => {
      setDevices((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: 'online' as const } : d))
      );
      toast.dismiss();
      toast.success('Device connected!');
    }, 2000);
  };

  const onlineCount = devices.filter((d) => d.status === 'online').length;

  return (
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Devices</h1>
          <p className="text-slate-500 mt-1">
            {onlineCount} of {devices.length} devices online
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="btn btn-secondary"
          >
            <RefreshCw
              className={clsx('w-4 h-4', isScanning && 'animate-spin')}
            />
            Scan Network
          </button>
          <button className="btn btn-primary">
            <Plus className="w-4 h-4" />
            Add Device
          </button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <Wifi className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Online</p>
              <p className="text-2xl font-bold text-slate-800">{onlineCount}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-xl">
              <WifiOff className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Offline</p>
              <p className="text-2xl font-bold text-slate-800">
                {devices.filter((d) => d.status === 'offline').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Cpu className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Devices</p>
              <p className="text-2xl font-bold text-slate-800">{devices.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Simulators</p>
              <p className="text-2xl font-bold text-slate-800">
                {devices.filter((d) => d.type === 'simulator').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Device List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map((device) => (
          <div
            key={device.id}
            className={clsx(
              'card border-2 transition-all',
              deviceColors[device.type]
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{deviceIcons[device.type]}</span>
                <div>
                  <h3 className="font-semibold text-slate-800">{device.name}</h3>
                  <p className="text-sm text-slate-500 capitalize">
                    {device.type.replace('-', ' ')}
                  </p>
                </div>
              </div>
              <div
                className={clsx(
                  'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                  device.status === 'online' && 'bg-green-100 text-green-700',
                  device.status === 'offline' && 'bg-red-100 text-red-700',
                  device.status === 'connecting' && 'bg-yellow-100 text-yellow-700'
                )}
              >
                <div
                  className={clsx(
                    'w-2 h-2 rounded-full',
                    device.status === 'online' && 'bg-green-500',
                    device.status === 'offline' && 'bg-red-500',
                    device.status === 'connecting' && 'bg-yellow-500 animate-pulse'
                  )}
                />
                {device.status}
              </div>
            </div>

            <div className="space-y-2 text-sm">
              {device.ip && (
                <div className="flex justify-between">
                  <span className="text-slate-500">IP Address</span>
                  <span className="font-mono text-slate-700">{device.ip}</span>
                </div>
              )}
              {device.firmware && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Firmware</span>
                  <span className="text-slate-700">{device.firmware}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Last Seen</span>
                <span className="text-slate-700">{device.lastSeen}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200">
              {device.status === 'offline' && (
                <button
                  onClick={() => handleReconnect(device.id)}
                  className="flex-1 btn btn-secondary text-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reconnect
                </button>
              )}
              {device.status === 'online' && (
                <button className="flex-1 btn btn-primary text-sm">
                  <Settings className="w-4 h-4" />
                  Configure
                </button>
              )}
              <button
                onClick={() => handleRemove(device.id)}
                className="btn btn-secondary text-red-500 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {/* Add Device Card */}
        <div className="card border-dashed border-2 border-slate-300 flex flex-col items-center justify-center min-h-[250px] text-slate-400 hover:text-primary-600 hover:border-primary-300 cursor-pointer transition-colors">
          <Plus className="w-10 h-10 mb-2" />
          <span className="font-medium">Add New Device</span>
          <span className="text-sm mt-1">Arduino, ESP32, Raspberry Pi</span>
        </div>
      </div>
    </div>
  );
}
