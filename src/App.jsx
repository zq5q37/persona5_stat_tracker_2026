import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Star from './components/Star'
import Dialogue from './components/Dialogue'

import redBgPic from './assets/red_bg.jpg'

function App() {

  const [activitiesVisible, setActivitiesVisible] = useState(false);

  const initialStats = {
    Knowledge: 1,
    Guts: 1,
    Proficiency: 1,
    Kindness: 1,
    Charm: 1,
  };

  const [stats, setStats] = useState(initialStats);

  const resetStats = () => setStats(initialStats);

  const activities = [
    { name: "Code", trait: "Knowledge" },
    { name: "Exercise", trait: "Guts" },
    { name: "Clean", trait: "Proficiency" },
    { name: "Help someone", trait: "Kindness" },
    { name: "Socialize", trait: "Charm" },
  ];

  const handleActivity = (activity) => {
    setStats(prev => {
      if (prev[activity.trait] >= 5) return prev; // no change
      return {
        ...prev,
        [activity.trait]: prev[activity.trait] + 1,
      };
    });
    setActivitiesVisible(false);
  };


  return (
    <>
      <div className='everything-container'>
        <img className='bg-image' src={redBgPic}></img>
        <Header onReset={resetStats} />
        <Star stats={stats} />
        <Dialogue activities={activities} onActivity={handleActivity} activitiesVisible={activitiesVisible}
          setActivitiesVisible={setActivitiesVisible} />
      </div>
    </>
  )
}

export default App
