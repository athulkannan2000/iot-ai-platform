import { useEffect, useRef, useState } from 'react';
import {
  Play,
  Save,
  Download,
  Upload,
  Code,
  Eye,
  Settings,
  Cpu,
  RotateCcw,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import * as Blockly from 'blockly';
import { pythonGenerator } from 'blockly/python';
import { useStore } from '@/store';
import { initCustomBlocks } from '@/blocks';
import CodeView from '@/components/CodeView';
import SimulatorPanel from '@/components/SimulatorPanel';
import toast from 'react-hot-toast';
import clsx from 'clsx';

export default function Editor() {
  const blocklyRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const [activeTab, setActiveTab] = useState<'code' | 'simulator'>('code');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  const {
    generatedCode,
    setGeneratedCode,
    codeLanguage,
    setCodeLanguage,
    currentProject,
    updateProject,
  } = useStore();

  // Initialize Blockly
  useEffect(() => {
    if (!blocklyRef.current) return;

    // Initialize custom blocks before creating workspace
    initCustomBlocks();

    const workspace = Blockly.inject(blocklyRef.current, {
      toolbox: getToolbox(),
      theme: Blockly.Themes.Zelos,
      grid: {
        spacing: 20,
        length: 3,
        colour: '#e2e8f0',
        snap: true,
      },
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2,
      },
      trashcan: true,
      move: {
        scrollbars: true,
        drag: true,
        wheel: true,
      },
      renderer: 'zelos',
    });

    workspaceRef.current = workspace;

    // Generate code on workspace change
    workspace.addChangeListener(() => {
      try {
        const code = pythonGenerator.workspaceToCode(workspace);
        setGeneratedCode(code);
      } catch (error) {
        console.error('Code generation error:', error);
      }
    });

    // Load saved workspace if exists
    if (currentProject?.blocks) {
      try {
        const xml = Blockly.utils.xml.textToDom(currentProject.blocks);
        Blockly.Xml.domToWorkspace(xml, workspace);
      } catch (error) {
        console.error('Failed to load workspace:', error);
      }
    }

    return () => {
      workspace.dispose();
    };
  }, []);

  const handleSave = () => {
    if (!workspaceRef.current) return;

    const xml = Blockly.Xml.workspaceToDom(workspaceRef.current);
    const xmlText = Blockly.Xml.domToText(xml);

    if (currentProject) {
      updateProject(currentProject.id, { blocks: xmlText });
      toast.success('Project saved!');
    } else {
      toast.success('Workspace saved locally!');
    }
  };

  const handleRun = () => {
    toast.success('Running code on simulator...');
    setActiveTab('simulator');
  };

  const handleExport = () => {
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project.${codeLanguage === 'python' ? 'py' : codeLanguage === 'cpp' ? 'cpp' : 'js'}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Code exported!');
  };

  const handleReset = () => {
    if (!workspaceRef.current) return;
    workspaceRef.current.clear();
    toast.success('Workspace cleared!');
  };

  return (
    <div className={clsx('flex flex-col h-[calc(100vh-4rem)]', isFullscreen && 'fixed inset-0 z-50 bg-white')}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-slate-200">
        <div className="flex items-center gap-2">
          <button onClick={handleRun} className="btn btn-accent">
            <Play className="w-4 h-4" />
            Run
          </button>
          <button onClick={handleSave} className="btn btn-secondary">
            <Save className="w-4 h-4" />
            Save
          </button>
          <button onClick={handleExport} className="btn btn-secondary">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button onClick={handleReset} className="btn btn-secondary text-red-600 hover:bg-red-50">
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={codeLanguage}
            onChange={(e) => setCodeLanguage(e.target.value as 'python' | 'cpp' | 'javascript')}
            className="input w-40"
          >
            <option value="python">Python</option>
            <option value="cpp">Arduino C++</option>
            <option value="javascript">JavaScript</option>
          </select>
          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="btn btn-secondary"
          >
            {isPanelOpen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="btn btn-secondary"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Blockly Workspace */}
        <div className={clsx('flex-1 relative', isPanelOpen ? 'w-2/3' : 'w-full')}>
          <div ref={blocklyRef} className="absolute inset-0" />
        </div>

        {/* Side Panel */}
        {isPanelOpen && (
          <div className="w-1/3 border-l border-slate-200 flex flex-col bg-white">
            {/* Panel Tabs */}
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setActiveTab('code')}
                className={clsx(
                  'flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors',
                  activeTab === 'code'
                    ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                )}
              >
                <Code className="w-4 h-4" />
                Code
              </button>
              <button
                onClick={() => setActiveTab('simulator')}
                className={clsx(
                  'flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors',
                  activeTab === 'simulator'
                    ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                )}
              >
                <Cpu className="w-4 h-4" />
                Simulator
              </button>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-hidden">
              {activeTab === 'code' ? (
                <CodeView code={generatedCode} language={codeLanguage} />
              ) : (
                <SimulatorPanel />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getToolbox() {
  return {
    kind: 'categoryToolbox',
    contents: [
      {
        kind: 'category',
        name: 'Logic',
        colour: '#5b80a5',
        contents: [
          { kind: 'block', type: 'controls_if' },
          { kind: 'block', type: 'logic_compare' },
          { kind: 'block', type: 'logic_operation' },
          { kind: 'block', type: 'logic_negate' },
          { kind: 'block', type: 'logic_boolean' },
        ],
      },
      {
        kind: 'category',
        name: 'Loops',
        colour: '#5ba55b',
        contents: [
          { kind: 'block', type: 'controls_repeat_ext' },
          { kind: 'block', type: 'controls_whileUntil' },
          { kind: 'block', type: 'controls_for' },
          { kind: 'block', type: 'controls_forEach' },
        ],
      },
      {
        kind: 'category',
        name: 'Math',
        colour: '#5b67a5',
        contents: [
          { kind: 'block', type: 'math_number' },
          { kind: 'block', type: 'math_arithmetic' },
          { kind: 'block', type: 'math_single' },
          { kind: 'block', type: 'math_random_int' },
        ],
      },
      {
        kind: 'category',
        name: 'Text',
        colour: '#5ba58c',
        contents: [
          { kind: 'block', type: 'text' },
          { kind: 'block', type: 'text_join' },
          { kind: 'block', type: 'text_print' },
        ],
      },
      {
        kind: 'category',
        name: 'Variables',
        colour: '#a55b80',
        custom: 'VARIABLE',
      },
      {
        kind: 'category',
        name: 'Functions',
        colour: '#995ba5',
        custom: 'PROCEDURE',
      },
      { kind: 'sep' },
      {
        kind: 'category',
        name: '🔌 IoT - Digital',
        colour: '#0ea5e9',
        contents: [
          { kind: 'block', type: 'iot_digital_read' },
          { kind: 'block', type: 'iot_digital_write' },
          { kind: 'block', type: 'iot_pin_mode' },
        ],
      },
      {
        kind: 'category',
        name: '📊 IoT - Analog',
        colour: '#06b6d4',
        contents: [
          { kind: 'block', type: 'iot_analog_read' },
          { kind: 'block', type: 'iot_analog_write' },
        ],
      },
      {
        kind: 'category',
        name: '🌡️ IoT - Sensors',
        colour: '#14b8a6',
        contents: [
          { kind: 'block', type: 'iot_read_temperature' },
          { kind: 'block', type: 'iot_read_humidity' },
          { kind: 'block', type: 'iot_read_distance' },
          { kind: 'block', type: 'iot_read_light' },
          { kind: 'block', type: 'iot_read_motion' },
        ],
      },
      {
        kind: 'category',
        name: '💡 IoT - Actuators',
        colour: '#10b981',
        contents: [
          { kind: 'block', type: 'iot_led_set' },
          { kind: 'block', type: 'iot_servo_set' },
          { kind: 'block', type: 'iot_buzzer' },
          { kind: 'block', type: 'iot_motor_control' },
        ],
      },
      {
        kind: 'category',
        name: '📺 IoT - Display',
        colour: '#22c55e',
        contents: [
          { kind: 'block', type: 'iot_lcd_print' },
          { kind: 'block', type: 'iot_lcd_clear' },
          { kind: 'block', type: 'iot_oled_print' },
        ],
      },
      {
        kind: 'category',
        name: '🌐 IoT - Connectivity',
        colour: '#84cc16',
        contents: [
          { kind: 'block', type: 'iot_wifi_connect' },
          { kind: 'block', type: 'iot_mqtt_connect' },
          { kind: 'block', type: 'iot_mqtt_publish' },
          { kind: 'block', type: 'iot_mqtt_subscribe' },
          { kind: 'block', type: 'iot_http_get' },
          { kind: 'block', type: 'iot_http_post' },
        ],
      },
      { kind: 'sep' },
      {
        kind: 'category',
        name: '🤖 AI - Vision',
        colour: '#8b5cf6',
        contents: [
          { kind: 'block', type: 'ai_image_classify' },
          { kind: 'block', type: 'ai_object_detect' },
          { kind: 'block', type: 'ai_face_detect' },
          { kind: 'block', type: 'ai_capture_image' },
        ],
      },
      {
        kind: 'category',
        name: '🗣️ AI - Speech',
        colour: '#a855f7',
        contents: [
          { kind: 'block', type: 'ai_speech_to_text' },
          { kind: 'block', type: 'ai_text_to_speech' },
          { kind: 'block', type: 'ai_voice_command' },
        ],
      },
      {
        kind: 'category',
        name: '📈 AI - Prediction',
        colour: '#d946ef',
        contents: [
          { kind: 'block', type: 'ai_predict_value' },
          { kind: 'block', type: 'ai_classify_data' },
          { kind: 'block', type: 'ai_anomaly_detect' },
        ],
      },
      {
        kind: 'category',
        name: '🧠 AI - Model',
        colour: '#ec4899',
        contents: [
          { kind: 'block', type: 'ai_load_model' },
          { kind: 'block', type: 'ai_run_inference' },
          { kind: 'block', type: 'ai_train_model' },
        ],
      },
      { kind: 'sep' },
      {
        kind: 'category',
        name: '⏱️ Events',
        colour: '#f97316',
        contents: [
          { kind: 'block', type: 'event_on_start' },
          { kind: 'block', type: 'event_on_button' },
          { kind: 'block', type: 'event_on_sensor_change' },
          { kind: 'block', type: 'event_on_message' },
          { kind: 'block', type: 'event_timer' },
        ],
      },
      {
        kind: 'category',
        name: '⏰ Time',
        colour: '#fb923c',
        contents: [
          { kind: 'block', type: 'time_delay' },
          { kind: 'block', type: 'time_millis' },
          { kind: 'block', type: 'time_current' },
        ],
      },
    ],
  };
}
