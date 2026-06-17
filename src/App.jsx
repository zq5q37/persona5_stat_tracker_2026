import { useState, useEffect, useRef } from 'react'
import './App.css'
import Header from './components/Header'
import Star from './components/Star'
import Dialogue from './components/Dialogue'
import NotesVideo from './components/NotesVideo'

import redBgPic from './assets/red_bg.webp'


function App() {

  const [activitiesVisible, setActivitiesVisible] = useState(false);

  const [expUp, setExpUp] = useState(false)

  const initialStats = {
    Knowledge: 1,
    Guts: 1,
    Proficiency: 1,
    Kindness: 1,
    Charm: 1,
  };


  // const [stats, setStats] = useState(initialStats);
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('stats');
    return saved ? JSON.parse(saved) : initialStats;
  });

  useEffect(() => {
    localStorage.setItem('stats', JSON.stringify(stats));
  }, [stats]);

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
    handleExpUp();
  };

  const handleExpUp = () => {
    setExpUp(true);
    setTimeout(() => {
      setExpUp(false);
    }, 3000)
  }


  return (
    <>
      <div className='everything-container'>
        <img className='bg-image' src={redBgPic}></img>
        <Header onReset={resetStats} />
        <Star stats={stats} />
        <Dialogue activities={activities} onActivity={handleActivity} activitiesVisible={activitiesVisible}
          setActivitiesVisible={setActivitiesVisible} expUp={expUp} setExpUp={setExpUp} />
        {!('ontouchstart' in window) && <NotesVideo expUp={expUp} />}
      </div>
    </>
  )
}

export default App
