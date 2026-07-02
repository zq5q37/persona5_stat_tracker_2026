import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import redBgPic from './assets/red_bg.webp'
import { useNavigate, useLocation } from 'react-router-dom'
import HomePage from './HomePage'
import EditPage from './EditPage'

function App({ activities, setActivities, initialActivities, selectedConfidant, setSelectedConfidant }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isEditPage = location.pathname === '/edit';
  const [expUp, setExpUp] = useState(false);
  const [isMax, setIsMax] = useState(false);

  const initialStats = {
    Knowledge: { level: 1, exp: 0 },
    Guts: { level: 1, exp: 0 },
    Proficiency: { level: 1, exp: 0 },
    Kindness: { level: 1, exp: 0 },
    Charm: { level: 1, exp: 0 },
  };

  const expToNextLevel = (level) => level * 20;

  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('stats');
    return saved ? JSON.parse(saved) : initialStats;
  });

  useEffect(() => {
    localStorage.setItem('stats', JSON.stringify(stats));
  }, [stats]);

  const resetStats = () => setStats(initialStats);

  const resetActivities = () => {
    setActivities(
      initialActivities.map(activity => ({
        ...activity,
        traits: [...activity.traits],
      }))
    );
  };

  const handleActivity = (activity) => {
    const { traits, exp: expGain } = activity;

    setStats(prev => {
      const updated = { ...prev };
      for (const trait of traits) {
        const stat = prev[trait];
        if (!stat || stat.level >= 5) continue;

        const newExp = stat.exp + expGain;
        const required = expToNextLevel(stat.level);

        updated[trait] = newExp >= required
          ? { level: stat.level + 1, exp: newExp - required }
          : { ...stat, exp: newExp };
      }
      return updated;
    });

    const willMax = traits.some(trait => {
      const stat = stats[trait];
      if (!stat || stat.level >= 5) return false;
      const expAfter = stat.exp + expGain;
      const willLevelUp = expAfter >= expToNextLevel(stat.level);
      return willLevelUp && stat.level === 4;
    });

    const anyGain = traits.some(trait => stats[trait]?.level < 5);
    if (anyGain) {
      setIsMax(willMax);
      handleExpUp();
    }
  };

  const handleExpUp = () => {
    setExpUp(true);
    setTimeout(() => setExpUp(false), 3500);
  };

  return (
    <div className='everything-container'>
      <img className='bg-image' src={redBgPic} alt="" />
      <Header
        onReset={isEditPage ? resetActivities : resetStats}
        // resetLabel={isEditPage ? 'Reset Activities' : 'Reset Stats'}
        onChangeConfidant={() => navigate('/confidants')}
        currentConfidant={selectedConfidant}
      />

      {isEditPage ? (
        <EditPage
          activities={activities}
          setActivities={setActivities}
          initialActivities={initialActivities}
          selectedConfidant={selectedConfidant}
          setSelectedConfidant={setSelectedConfidant}
        />
      ) : (
        <HomePage
          stats={stats}
          activities={activities}
          onActivity={handleActivity}
          expUp={expUp}
          isMax={isMax}
          selectedConfidant={selectedConfidant}
        />
      )}
    </div>
  );
}

export default App