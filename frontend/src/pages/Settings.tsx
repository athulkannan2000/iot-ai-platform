import { useState } from 'react';
import {
  User,
  Bell,
  Palette,
  Code,
  Cpu,
  Shield,
  Download,
  Moon,
  Sun,
  Monitor,
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { useStore } from '@/store';

export default function Settings() {
  const { theme, setTheme, codeLanguage, setCodeLanguage } = useStore();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'editor', label: 'Editor', icon: Code },
    { id: 'devices', label: 'Devices', icon: Cpu },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const handleSave = () => {
    toast.success('Settings saved!');
  };

  return (
    <div className="p-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Settings</h1>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors',
                activeTab === tab.id
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-slate-600 hover:bg-slate-100'
              )}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="card">
              <h2 className="text-lg font-semibold text-slate-800 mb-6">Profile Settings</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <div>
                    <button className="btn btn-secondary mb-2">Change Avatar</button>
                    <p className="text-sm text-slate-500">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      First Name
                    </label>
                    <input type="text" className="input" defaultValue="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Last Name
                    </label>
                    <input type="text" className="input" defaultValue="Doe" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="input"
                    defaultValue="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    className="input min-h-[100px]"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <button onClick={handleSave} className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="card">
              <h2 className="text-lg font-semibold text-slate-800 mb-6">Preferences</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Theme
                  </label>
                  <div className="flex gap-3">
                    {[
                      { value: 'light', icon: Sun, label: 'Light' },
                      { value: 'dark', icon: Moon, label: 'Dark' },
                      { value: 'system', icon: Monitor, label: 'System' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setTheme(option.value as 'light' | 'dark')}
                        className={clsx(
                          'flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors',
                          theme === option.value
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-slate-200 hover:border-slate-300'
                        )}
                      >
                        <option.icon className="w-5 h-5" />
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Language
                  </label>
                  <select className="input w-64">
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Timezone
                  </label>
                  <select className="input w-64">
                    <option value="utc">UTC</option>
                    <option value="est">Eastern Time (EST)</option>
                    <option value="pst">Pacific Time (PST)</option>
                    <option value="ist">India Standard Time (IST)</option>
                  </select>
                </div>

                <button onClick={handleSave} className="btn btn-primary">
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {activeTab === 'editor' && (
            <div className="card">
              <h2 className="text-lg font-semibold text-slate-800 mb-6">Editor Settings</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Default Code Language
                  </label>
                  <select
                    className="input w-64"
                    value={codeLanguage}
                    onChange={(e) =>
                      setCodeLanguage(e.target.value as 'python' | 'cpp' | 'javascript')
                    }
                  >
                    <option value="python">Python</option>
                    <option value="cpp">Arduino C++</option>
                    <option value="javascript">JavaScript</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Font Size
                  </label>
                  <select className="input w-64" defaultValue="14">
                    <option value="12">12px</option>
                    <option value="14">14px</option>
                    <option value="16">16px</option>
                    <option value="18">18px</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-700">Auto-save</p>
                    <p className="text-sm text-slate-500">
                      Automatically save your work every 30 seconds
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-700">Show Grid</p>
                    <p className="text-sm text-slate-500">
                      Display grid lines in the block editor
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-700">Snap to Grid</p>
                    <p className="text-sm text-slate-500">
                      Blocks snap to grid when dragging
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <button onClick={handleSave} className="btn btn-primary">
                  Save Settings
                </button>
              </div>
            </div>
          )}

          {activeTab === 'devices' && (
            <div className="card">
              <h2 className="text-lg font-semibold text-slate-800 mb-6">Device Settings</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Default Board
                  </label>
                  <select className="input w-64" defaultValue="arduino-uno">
                    <option value="arduino-uno">Arduino UNO</option>
                    <option value="arduino-mega">Arduino Mega</option>
                    <option value="esp32">ESP32</option>
                    <option value="esp8266">ESP8266</option>
                    <option value="raspberry-pi">Raspberry Pi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Serial Port
                  </label>
                  <select className="input w-64" defaultValue="auto">
                    <option value="auto">Auto-detect</option>
                    <option value="com3">COM3</option>
                    <option value="com4">COM4</option>
                    <option value="usb0">/dev/ttyUSB0</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Baud Rate
                  </label>
                  <select className="input w-64" defaultValue="9600">
                    <option value="9600">9600</option>
                    <option value="115200">115200</option>
                    <option value="57600">57600</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-700">Auto-upload</p>
                    <p className="text-sm text-slate-500">
                      Automatically upload code when running
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <button onClick={handleSave} className="btn btn-primary">
                  Save Settings
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card">
              <h2 className="text-lg font-semibold text-slate-800 mb-6">
                Notification Settings
              </h2>
              <div className="space-y-4">
                {[
                  { title: 'Email notifications', desc: 'Receive updates via email' },
                  { title: 'Project updates', desc: 'When your projects are modified' },
                  { title: 'Device alerts', desc: 'When devices go offline' },
                  { title: 'Learning reminders', desc: 'Daily learning goals and streaks' },
                  { title: 'New features', desc: 'Announcements about new features' },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center justify-between py-3 border-b border-slate-100"
                  >
                    <div>
                      <p className="font-medium text-slate-700">{item.title}</p>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                ))}

                <button onClick={handleSave} className="btn btn-primary mt-4">
                  Save Settings
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card">
              <h2 className="text-lg font-semibold text-slate-800 mb-6">Security Settings</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Current Password
                  </label>
                  <input type="password" className="input w-full max-w-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    New Password
                  </label>
                  <input type="password" className="input w-full max-w-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Confirm New Password
                  </label>
                  <input type="password" className="input w-full max-w-md" />
                </div>

                <button onClick={handleSave} className="btn btn-primary">
                  Update Password
                </button>

                <hr className="my-6" />

                <div>
                  <h3 className="font-medium text-slate-800 mb-4">Two-Factor Authentication</h3>
                  <p className="text-sm text-slate-500 mb-4">
                    Add an extra layer of security to your account
                  </p>
                  <button className="btn btn-secondary">Enable 2FA</button>
                </div>

                <hr className="my-6" />

                <div>
                  <h3 className="font-medium text-red-600 mb-4">Danger Zone</h3>
                  <button className="btn bg-red-100 text-red-600 hover:bg-red-200">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
