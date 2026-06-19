import { useState, useEffect, useRef } from 'react'
import './App.css'
import Header from './components/Header'
import Star from './components/Star'
import Dialogue from './components/Dialogue'
import NotesVideo from './components/NotesVideo'

import redBgPic from './assets/red_bg.webp'


function App({activities, setActivities}) {

  const [activitiesVisible, setActivitiesVisible] = useState(false);

  const [expUp, setExpUp] = useState(false)

  const initialStats = {
    Knowledge: 1,
    Guts: 1,
    Proficiency: 1,
    Kindness: 1,
    Charm: 1,
  };

  // localStorage.removeItem('stats');

  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('stats');
    return saved ? JSON.parse(saved) : initialStats;
  });

  useEffect(() => {
    localStorage.setItem('stats', JSON.stringify(stats));
  }, [stats]);

  const resetStats = () => setStats(initialStats);

  



const [isMax, setIsMax] = useState(false);

const handleActivity = (activity) => {
  setStats(prev => {
    const updated = { ...prev };
    activity.traits.forEach(trait => {
      if (updated[trait] < 5) updated[trait] += 1;
    });
    return updated;
  });

  setActivitiesVisible(false);

  if (activity.traits.some(trait => stats[trait] < 5)) {
    const willMax = activity.traits.some(trait => stats[trait] === 4);
    setIsMax(willMax);
    handleExpUp();
  }
};

  const handleExpUp = () => {
    setExpUp(true);
    setTimeout(() => {
      setExpUp(false);
    }, 3500)
  }


  return (
    <>
      <div className='everything-container'>
        <img className='bg-image' src={redBgPic}></img>
        <Header onReset={resetStats} />
        <Star stats={stats} expUp={expUp} isMax={isMax}/>
        <Dialogue stats={stats} activities={activities} onActivity={handleActivity} activitiesVisible={activitiesVisible}
          setActivitiesVisible={setActivitiesVisible} expUp={expUp} setExpUp={setExpUp} />
        {!('ontouchstart' in window) && <NotesVideo expUp={expUp} />}
      </div>
    </>
  )
}

export default App
