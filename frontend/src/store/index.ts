import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Project {
  id: string;
  name: string;
  description: string;
  blocks: string; // Blockly workspace XML
  createdAt: Date;
  updatedAt: Date;
  thumbnail?: string;
  tags: string[];
}

export interface Device {
  id: string;
  name: string;
  type: 'arduino' | 'esp32' | 'raspberry-pi' | 'simulator';
  status: 'online' | 'offline' | 'connecting';
  lastSeen?: Date;
  ip?: string;
  metadata?: Record<string, unknown>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'student' | 'educator' | 'admin';
}

interface AppState {
  // User
  user: User | null;
  setUser: (user: User | null) => void;

  // Projects
  projects: Project[];
  currentProject: Project | null;
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Devices
  devices: Device[];
  currentDevice: Device | null;
  setDevices: (devices: Device[]) => void;
  setCurrentDevice: (device: Device | null) => void;
  addDevice: (device: Device) => void;
  updateDevice: (id: string, updates: Partial<Device>) => void;
  removeDevice: (id: string) => void;

  // Editor state
  generatedCode: string;
  codeLanguage: 'python' | 'cpp' | 'javascript';
  setGeneratedCode: (code: string) => void;
  setCodeLanguage: (lang: 'python' | 'cpp' | 'javascript') => void;

  // UI state
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // User
      user: null,
      setUser: (user) => set({ user }),

      // Projects
      projects: [],
      currentProject: null,
      setProjects: (projects) => set({ projects }),
      setCurrentProject: (project) => set({ currentProject: project }),
      addProject: (project) =>
        set((state) => ({ projects: [...state.projects, project] })),
      updateProject: (id, updates) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
          ),
          currentProject:
            state.currentProject?.id === id
              ? { ...state.currentProject, ...updates, updatedAt: new Date() }
              : state.currentProject,
        })),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          currentProject:
            state.currentProject?.id === id ? null : state.currentProject,
        })),

      // Devices
      devices: [],
      currentDevice: null,
      setDevices: (devices) => set({ devices }),
      setCurrentDevice: (device) => set({ currentDevice: device }),
      addDevice: (device) =>
        set((state) => ({ devices: [...state.devices, device] })),
      updateDevice: (id, updates) =>
        set((state) => ({
          devices: state.devices.map((d) =>
            d.id === id ? { ...d, ...updates } : d
          ),
        })),
      removeDevice: (id) =>
        set((state) => ({
          devices: state.devices.filter((d) => d.id !== id),
          currentDevice:
            state.currentDevice?.id === id ? null : state.currentDevice,
        })),

      // Editor state
      generatedCode: '',
      codeLanguage: 'python',
      setGeneratedCode: (code) => set({ generatedCode: code }),
      setCodeLanguage: (lang) => set({ codeLanguage: lang }),

      // UI state
      sidebarCollapsed: false,
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      theme: 'light',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'iot-ai-platform-storage',
      partialize: (state) => ({
        user: state.user,
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        codeLanguage: state.codeLanguage,
      }),
    }
  )
);
