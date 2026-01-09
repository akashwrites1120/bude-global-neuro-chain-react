import './styles/global.css';
import { useState, useEffect, useRef } from 'react';
import CanvasNetwork from './components/CanvasNetwork';
import TitleBlock from './components/TitleBlock';
import Legend from './components/Legend';
import Panel from './components/Panel';
import Controls from './components/Controls';
import Tooltip from './components/Tooltip';
import SearchBar from './components/SearchBar';
import Footer from './components/Footer';
import KeyboardHelp from './components/KeyboardHelp';
import Minimap from './components/Minimap';
import StatsPanel from './components/StatsPanel';
import ErrorBoundary from './components/ErrorBoundary';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';
import { config, validateEnv, debug } from './config/env';
import { parseShareLink } from './utils/exportHelpers';

// Import data
import clustersData from './data/clusters.json';
import nodesData from './data/nodes.json';
import edgesData from './data/edges.json';
import descriptionsData from './data/descriptions.json';

// Validate environment on startup
if (config.debugMode) {
  validateEnv();
  debug.log('App initialized with config:', config);
}

function App() {
  const [data, setData] = useState({
    clusters: clustersData,
    nodes: nodesData,
    edges: edgesData,
    descriptions: descriptionsData
  });
  
  const [hoveredNode, setHoveredNode] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [animating, setAnimating] = useState(true);
  const [cameraTarget, setCameraTarget] = useState({ x: 0, y: 0 });

  const searchInputRef = useRef(null);
  const canvasRef = useRef(null);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'ctrl+k': (e) => {
      e.preventDefault();
      searchInputRef.current?.focus();
    },
    'escape': () => {
      searchInputRef.current?.blur();
      setHoveredNode(null);
    },
    ' ': (e) => {
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        handleToggleAnimation();
      }
    },
    'r': () => {
      handleResetView();
    },
    'arrowup': (e) => {
      e.preventDefault();
      setCameraTarget(prev => ({ x: prev.x, y: prev.y + 50 }));
    },
    'arrowdown': (e) => {
      e.preventDefault();
      setCameraTarget(prev => ({ x: prev.x, y: prev.y - 50 }));
    },
    'arrowleft': (e) => {
      e.preventDefault();
      setCameraTarget(prev => ({ x: prev.x + 50, y: prev.y }));
    },
    'arrowright': (e) => {
      e.preventDefault();
      setCameraTarget(prev => ({ x: prev.x - 50, y: prev.y }));
    },
  });

  const handleDataUpdate = (key, newData) => {
    setData(prev => ({
      ...prev,
      [key]: newData
    }));
  };

  const handleFocusCluster = (clusterId) => {
    const clusterNodes = data.nodes.filter(n => n.cluster === clusterId);
    if (clusterNodes.length === 0) return;
    
    const avgX = clusterNodes.reduce((s, n) => s + n.x, 0) / clusterNodes.length;
    const avgY = clusterNodes.reduce((s, n) => s + n.y, 0) / clusterNodes.length;
    setCameraTarget({ x: -avgX, y: -avgY });
  };

  const handleNodeSelect = (node) => {
    setCameraTarget({ x: -node.x, y: -node.y });
    setHoveredNode(node);
    setTimeout(() => setHoveredNode(null), 2000);
  };

  const handleMinimapNavigate = (worldX, worldY) => {
    setCameraTarget({ x: -worldX, y: -worldY });
  };

  const handleResetView = () => {
    setCameraTarget({ x: 0, y: 0 });
  };

  const handleToggleAnimation = () => {
    setAnimating(prev => !prev);
  };

  const handleExportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'neuro-chain-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <CanvasNetwork
        data={data}
        hoveredNode={hoveredNode}
        setHoveredNode={setHoveredNode}
        setMousePos={setMousePos}
        animating={animating}
        cameraTarget={cameraTarget}
        canvasRef={canvasRef}
      />
      
      <TitleBlock />
      
      <SearchBar
        nodes={data.nodes}
        clusters={data.clusters}
        onNodeSelect={handleNodeSelect}
        inputRef={searchInputRef}
      />
      
      <Legend
        clusters={data.clusters}
        onFocusCluster={handleFocusCluster}
      />
      
      <Panel
        data={data}
        onDataUpdate={handleDataUpdate}
      />
      
      <Controls
        animating={animating}
        onResetView={handleResetView}
        onToggleAnimation={handleToggleAnimation}
        onExportData={handleExportData}
        canvasRef={canvasRef}
        nodes={data.nodes}
        edges={data.edges}
        clusters={data.clusters}
        camera={cameraTarget}
        zoom={1}
      />
      
      <Tooltip
        hoveredNode={hoveredNode}
        mousePos={mousePos}
        clusters={data.clusters}
        edges={data.edges}
      />
      
      <StatsPanel
        nodes={data.nodes}
        edges={data.edges}
        clusters={data.clusters}
      />
      
      <Minimap
        nodes={data.nodes}
        clusters={data.clusters}
        camera={cameraTarget}
        zoom={1}
        onNavigate={handleMinimapNavigate}
      />
      
      <KeyboardHelp />
      
      <Footer />
      
      <div style={{
        position: 'fixed',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '0.6rem',
        color: 'var(--text-muted)',
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        opacity: 0.4,
        zIndex: 10,
        pointerEvents: 'none'
      }}>
        ∞ Open-Ended Network ∞
      </div>
    </>
  );
}

export default App;
