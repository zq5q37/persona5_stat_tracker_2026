import { useState } from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import EditPage from './EditPage.jsx'


const initialActivities = [
  { name: "Code", traits: ["Knowledge", "Proficiency"] },
  { name: "Exercise", traits: ["Guts"] },
  { name: "Clean", traits: ["Proficiency"] },
  { name: "Help someone", traits: ["Kindness"] },
  { name: "Socialize", traits: ["Charm"] },
];

  function Root() {
  const [activities, setActivities] = useState(initialActivities);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App activities={activities} setActivities={setActivities} />} />
        <Route path="/edit" element={<EditPage activities={activities} setActivities={setActivities} />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode><Root /></StrictMode>
)