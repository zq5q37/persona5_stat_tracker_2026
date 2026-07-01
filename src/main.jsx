import { useState, useEffect } from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import EditPage from './EditPage.jsx'
import ConfidantPage from './ConfidantPage.jsx'

const CONFIDANT_OPTIONS = ['morgana', 'futaba', 'makoto'];

const initialActivities = [
  { name: "Code", traits: ["Knowledge", "Proficiency"] },
  { name: "Exercise", traits: ["Guts"] },
  { name: "Clean", traits: ["Proficiency"] },
  { name: "Help someone", traits: ["Kindness"] },
  { name: "Socialize", traits: ["Charm"] },
];

function Root() {
  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('activities');
    return saved ? JSON.parse(saved) : initialActivities;
  });

  useEffect(() => {
    localStorage.setItem('activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    const setAppHeight = () => {
      document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
    };

    setAppHeight();
    window.addEventListener('resize', setAppHeight);
    return () => window.removeEventListener('resize', setAppHeight);
  }, []);

  const [selectedConfidant, setSelectedConfidant] = useState(() => {
    const saved = localStorage.getItem('selectedConfidant');
    return saved && CONFIDANT_OPTIONS.includes(saved) ? saved : 'morgana';
  });

  useEffect(() => {
    localStorage.setItem('selectedConfidant', selectedConfidant);
  }, [selectedConfidant]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App activities={activities} setActivities={setActivities} selectedConfidant={selectedConfidant} />} />
        <Route path="/edit" element={<EditPage activities={activities} setActivities={setActivities} initialActivities={initialActivities} selectedConfidant={selectedConfidant} onSelectConfidant={setSelectedConfidant} setSelectedConfidant={setSelectedConfidant} />} />
        {/* <Route path="/confidants" element={<ConfidantPage selectedConfidant={selectedConfidant} onSelectConfidant={setSelectedConfidant} />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode><Root /></StrictMode>
)