import { useState, useEffect } from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import HomePage from './HomePage.jsx'
import EditPage from './EditPage.jsx'
import HistoryPage from './HistoryPage.jsx'
import Layout from './Layout.jsx'
import useAuth from './hooks/useAuth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

const CONFIDANT_OPTIONS = ['morgana', 'futaba', 'makoto'];

const initialActivities = [
  { name: "Code", traits: ["Knowledge", "Proficiency"] },
  { name: "Exercise", traits: ["Guts"] },
  { name: "Clean", traits: ["Proficiency"] },
  { name: "Help someone", traits: ["Kindness"] },
  { name: "Socialize", traits: ["Charm"] },
];

const initialStats = {
  Knowledge: { level: 1, exp: 0 },
  Guts: { level: 1, exp: 0 },
  Proficiency: { level: 1, exp: 0 },
  Kindness: { level: 1, exp: 0 },
  Charm: { level: 1, exp: 0 },
};

const expToNextLevel = (level) => level * 20;

function Root() {
  const { user, authLoading, login, logout } = useAuth();

  const [expUp, setExpUp] = useState(false);
  const [isMax, setIsMax] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [suppressLevelUp, setSuppressLevelUp] = useState(false);

  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('activities');
    return saved ? JSON.parse(saved) : initialActivities;
  });

  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('stats');
    return saved ? JSON.parse(saved) : initialStats;
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('history');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedConfidant, setSelectedConfidant] = useState(() => {
    const saved = localStorage.getItem('selectedConfidant');
    return saved && CONFIDANT_OPTIONS.includes(saved) ? saved : 'morgana';
  });

  useEffect(() => {
    localStorage.setItem('activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('selectedConfidant', selectedConfidant);
  }, [selectedConfidant]);

  useEffect(() => {
    const setAppHeight = () => {
      document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
    };
    setAppHeight();
    window.addEventListener('resize', setAppHeight);
    return () => window.removeEventListener('resize', setAppHeight);
  }, []);

  useEffect(() => {
    if (!user) {
      setDataLoaded(false);
      return;
    }

    const loadData = async () => {
      const userDocRef = doc(db, 'users', user.uid);
      const snapshot = await getDoc(userDocRef);

      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.stats) {
          setSuppressLevelUp(true);
          setStats(data.stats);
        }
        if (data.activities) setActivities(data.activities);
        if (data.history) setHistory(data.history);
      } else {
        await setDoc(userDocRef, { stats, activities, history });
      }

      setDataLoaded(true);
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (!user || !dataLoaded) return;
    const userDocRef = doc(db, 'users', user.uid);
    setDoc(userDocRef, { stats }, { merge: true });
  }, [stats, user, dataLoaded]);

  useEffect(() => {
    if (!user || !dataLoaded) return;
    const userDocRef = doc(db, 'users', user.uid);
    setDoc(userDocRef, { activities }, { merge: true });
  }, [activities, user, dataLoaded]);

  useEffect(() => {
    if (!user || !dataLoaded) return;
    const userDocRef = doc(db, 'users', user.uid);
    setDoc(userDocRef, { history }, { merge: true });
  }, [history, user, dataLoaded]);

  const resetStats = () => {
    if (window.confirm('Reset all stats? This cannot be undone.')) {
      setStats(initialStats);
    }
  };

  const resetActivities = () => {
    if (window.confirm('Reset all activities? This cannot be undone.')) {
      setActivities(
        initialActivities.map(activity => ({
          ...activity,
          traits: [...activity.traits],
        }))
      );
    }
  };

  const handleExpUp = () => {
    setExpUp(true);
    setTimeout(() => setExpUp(false), 3500);
  };

  const handleActivity = (activity, intensityLabel) => {
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

    setHistory(prev => [
      { timestamp: Date.now(), activityName: activity.name, intensity: intensityLabel },
      ...prev,
    ]);
  };

  if (authLoading) {
    return <div className='everything-container'>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <Layout
              user={user}
              onLogin={login}
              onLogout={logout}
              selectedConfidant={selectedConfidant}
            />
          }
        >
          <Route
            path="/"
            element={
              <HomePage
                stats={stats}
                activities={activities}
                onActivity={handleActivity}
                expUp={expUp}
                isMax={isMax}
                selectedConfidant={selectedConfidant}
                suppressLevelUp={suppressLevelUp}
                onLevelUpHandled={() => setSuppressLevelUp(false)}
                onResetStats={resetStats}
              />
            }
          />
          <Route
            path="/edit"
            element={
              <EditPage
                activities={activities}
                setActivities={setActivities}
                initialActivities={initialActivities}
                selectedConfidant={selectedConfidant}
                setSelectedConfidant={setSelectedConfidant}
                onResetActivities={resetActivities}
              />
            }
          />
          <Route
            path="/history"
            element={<HistoryPage history={history} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode><Root /></StrictMode>
)