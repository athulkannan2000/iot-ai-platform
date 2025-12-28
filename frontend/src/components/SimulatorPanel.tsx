import { useState } from 'react';
import {
  Play,
  Square,
  RotateCcw,
  Lightbulb,
  Thermometer,
  Droplets,
  Gauge,
  Wifi,
  WifiOff,
} from 'lucide-react';
import clsx from 'clsx';

interface SimulatorState {
  isRunning: boolean;
  pins: Record<number, boolean>;
  analogPins: Record<number, number>;
  temperature: number;
  humidity: number;
  lightLevel: number;
  distance: number;
  wifiConnected: boolean;
  serialOutput: string[];
}

export default function SimulatorPanel() {
  const [state, setState] = useState<SimulatorState>({
    isRunning: false,
    pins: {
      2: false,
      3: false,
      4: false,
      13: false,
    },
    analogPins: {
      0: 512,
      1: 256,
    },
    temperature: 25,
    humidity: 60,
    lightLevel: 750,
    distance: 100,
    wifiConnected: false,
    serialOutput: ['Simulator ready...'],
  });

  const togglePin = (pin: number) => {
    setState((prev) => ({
      ...prev,
      pins: {
        ...prev.pins,
        [pin]: !prev.pins[pin],
      },
      serialOutput: [
        ...prev.serialOutput,
        `Pin ${pin} set to ${!prev.pins[pin] ? 'HIGH' : 'LOW'}`,
      ],
    }));
  };

  const handleStart = () => {
    setState((prev) => ({
      ...prev,
      isRunning: true,
      serialOutput: [...prev.serialOutput, '▶ Program started'],
    }));
  };

  const handleStop = () => {
    setState((prev) => ({
      ...prev,
      isRunning: false,
      serialOutput: [...prev.serialOutput, '⏹ Program stopped'],
    }));
  };

  const handleReset = () => {
    setState({
      isRunning: false,
      pins: { 2: false, 3: false, 4: false, 13: false },
      analogPins: { 0: 512, 1: 256 },
      temperature: 25,
      humidity: 60,
      lightLevel: 750,
      distance: 100,
      wifiConnected: false,
      serialOutput: ['Simulator reset', 'Ready...'],
    });
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Controls */}
      <div className="flex items-center gap-2 p-3 bg-white border-b border-slate-200">
        {!state.isRunning ? (
          <button
            onClick={handleStart}
            className="flex items-center gap-1 px-3 py-1.5 bg-accent-600 text-white rounded-lg text-sm font-medium hover:bg-accent-700"
          >
            <Play className="w-4 h-4" />
            Start
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
          >
            <Square className="w-4 h-4" />
            Stop
          </button>
        )}
        <button
          onClick={handleReset}
          className="flex items-center gap-1 px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
        <div
          className={clsx(
            'ml-auto flex items-center gap-1 text-sm',
            state.isRunning ? 'text-accent-600' : 'text-slate-400'
          )}
        >
          <div
            className={clsx(
              'w-2 h-2 rounded-full',
              state.isRunning ? 'bg-accent-500 animate-pulse' : 'bg-slate-300'
            )}
          />
          {state.isRunning ? 'Running' : 'Stopped'}
        </div>
      </div>

      {/* Virtual Device */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Board Visualization */}
        <div className="bg-slate-800 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-300">
              Arduino UNO Simulator
            </span>
            <button
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  wifiConnected: !prev.wifiConnected,
                  serialOutput: [
                    ...prev.serialOutput,
                    prev.wifiConnected ? '📶 WiFi disconnected' : '📶 WiFi connected',
                  ],
                }))
              }
              className={clsx(
                'p-1.5 rounded-lg transition-colors',
                state.wifiConnected
                  ? 'bg-accent-600 text-white'
                  : 'bg-slate-700 text-slate-400'
              )}
            >
              {state.wifiConnected ? (
                <Wifi className="w-4 h-4" />
              ) : (
                <WifiOff className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* LED Pins */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            {Object.entries(state.pins).map(([pin, value]) => (
              <button
                key={pin}
                onClick={() => togglePin(Number(pin))}
                className={clsx(
                  'flex flex-col items-center gap-1 p-3 rounded-lg transition-all',
                  value
                    ? 'bg-yellow-500/20 border border-yellow-500'
                    : 'bg-slate-700 border border-slate-600'
                )}
              >
                <Lightbulb
                  className={clsx(
                    'w-6 h-6 transition-all',
                    value ? 'text-yellow-400 drop-shadow-lg' : 'text-slate-500'
                  )}
                  fill={value ? 'currentColor' : 'none'}
                />
                <span className="text-xs text-slate-400">Pin {pin}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sensor Values */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center gap-2 text-slate-600 mb-2">
              <Thermometer className="w-4 h-4 text-red-500" />
              <span className="text-sm">Temperature</span>
            </div>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-bold text-slate-800">
                {state.temperature}
              </span>
              <span className="text-slate-500 mb-1">°C</span>
            </div>
            <input
              type="range"
              min="-10"
              max="50"
              value={state.temperature}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  temperature: Number(e.target.value),
                }))
              }
              className="w-full mt-2 accent-red-500"
            />
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center gap-2 text-slate-600 mb-2">
              <Droplets className="w-4 h-4 text-blue-500" />
              <span className="text-sm">Humidity</span>
            </div>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-bold text-slate-800">
                {state.humidity}
              </span>
              <span className="text-slate-500 mb-1">%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={state.humidity}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  humidity: Number(e.target.value),
                }))
              }
              className="w-full mt-2 accent-blue-500"
            />
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center gap-2 text-slate-600 mb-2">
              <Gauge className="w-4 h-4 text-amber-500" />
              <span className="text-sm">Light Level</span>
            </div>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-bold text-slate-800">
                {state.lightLevel}
              </span>
              <span className="text-slate-500 mb-1">lux</span>
            </div>
            <input
              type="range"
              min="0"
              max="1023"
              value={state.lightLevel}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  lightLevel: Number(e.target.value),
                }))
              }
              className="w-full mt-2 accent-amber-500"
            />
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center gap-2 text-slate-600 mb-2">
              <Gauge className="w-4 h-4 text-purple-500" />
              <span className="text-sm">Distance</span>
            </div>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-bold text-slate-800">
                {state.distance}
              </span>
              <span className="text-slate-500 mb-1">cm</span>
            </div>
            <input
              type="range"
              min="2"
              max="400"
              value={state.distance}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  distance: Number(e.target.value),
                }))
              }
              className="w-full mt-2 accent-purple-500"
            />
          </div>
        </div>

        {/* Serial Monitor */}
        <div className="bg-slate-900 rounded-xl overflow-hidden">
          <div className="px-3 py-2 bg-slate-800 text-slate-400 text-sm font-medium">
            Serial Monitor
          </div>
          <div className="h-32 overflow-auto p-3 font-mono text-xs text-green-400">
            {state.serialOutput.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
