import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import Projects from './pages/Projects';
import Devices from './pages/Devices';
import AIModels from './pages/AIModels';
import Learn from './pages/Learn';
import Settings from './pages/Settings';

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="editor" element={<Editor />} />
          <Route path="editor/:projectId" element={<Editor />} />
          <Route path="projects" element={<Projects />} />
          <Route path="devices" element={<Devices />} />
          <Route path="ai-models" element={<AIModels />} />
          <Route path="learn" element={<Learn />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
