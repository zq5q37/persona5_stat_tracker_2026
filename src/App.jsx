import { useState, useEffect, useRef } from 'react'
import './App.css'
import Header from './components/Header'
import Star from './components/Star'
import Dialogue from './components/Dialogue'
import NotesVideo from './components/NotesVideo'

import redBgPic from './assets/red_bg.webp'

const initialStats = {
  Knowledge: { level: 1, exp: 0 },
  Guts: { level: 1, exp: 0 },
  Proficiency: { level: 1, exp: 0 },
  Kindness: { level: 1, exp: 0 },
  Charm: { level: 1, exp: 0 },
};

const expToNextLevel = (level) => level * 20;

function App() {

  const [activitiesVisible, setActivitiesVisible] = useState(false);

  const [expUp, setExpUp] = useState(false)

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

  const handleExpUp = () => {
    setExpUp(true);
    setTimeout(() => {
      setExpUp(false);
    }, 3000)
  }



  const handleActivity = (activity) => {
    setStats(prev => {
      const stat = prev[activity.trait];
      if (stat.level >= 5) return prev;

      const newExp = stat.exp + 10;
      const required = expToNextLevel(stat.level);

      if (newExp >= required) {
        return {
          ...prev,
          [activity.trait]: { level: stat.level + 1, exp: newExp - required },
        };
      }
      return {
        ...prev,
        [activity.trait]: { ...stat, exp: newExp },
      };
    });
    setActivitiesVisible(false);
    handleExpUp();
  };

  const statLevels = Object.fromEntries(
    Object.entries(stats).map(([k, v]) => [k, v.level])
  );

  return (
    <>
      <div className='everything-container'>
        <img className='bg-image' src={redBgPic}></img>
        <Header onReset={resetStats} />
        <Star stats={stats} statLevels={statLevels} />
        <Dialogue activities={activities} onActivity={handleActivity} activitiesVisible={activitiesVisible}
          setActivitiesVisible={setActivitiesVisible} expUp={expUp} setExpUp={setExpUp} />
        {!('ontouchstart' in window) && <NotesVideo expUp={expUp} />}
      </div>
    </>
  )
}

export default App
