import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/Header';
import redBgPic from './assets/red_bg.webp';
import './EditPage.css';

const ALL_TRAITS = ["Knowledge", "Guts", "Proficiency", "Kindness", "Charm"];

const TRAIT_COLORS = {
  Knowledge: '#4fc3f7',
  Guts:      '#ef5350',
  Proficiency:'#66bb6a',
  Kindness:  '#ffa726',
  Charm:     '#ce93d8',
};

export default function EditPage({ activities, setActivities }) {
  const navigate = useNavigate();

  const [draft, setDraft] = useState(() =>
    Object.fromEntries(activities.map(a => [a.name, [...a.traits]]))
  );
  const [newName, setNewName] = useState('');
  const [newTraits, setNewTraits] = useState([]);

  const toggleTrait = (activityName, trait) => {
    setDraft(prev => {
      const current = prev[activityName];
      const updated = current.includes(trait)
        ? current.filter(t => t !== trait)
        : [...current, trait];
      return { ...prev, [activityName]: updated };
    });
  };

  const toggleNewTrait = (trait) => {
    setNewTraits(prev =>
      prev.includes(trait) ? prev.filter(t => t !== trait) : [...prev, trait]
    );
  };

  const handleAddActivity = () => {
    if (!newName.trim()) return;
    const newActivity = { name: newName.trim(), traits: newTraits };
    setActivities(prev => [...prev, newActivity]);
    setDraft(prev => ({ ...prev, [newName.trim()]: newTraits }));
    setNewName('');
    setNewTraits([]);
  };

  const handleSave = () => {
    setActivities(prev => prev.map(a => ({ ...a, traits: draft[a.name] })));
    navigate(-1);
  };

  return (
    <div className='everything-container'>
      <img className='bg-image' src={redBgPic} />
      <Header />

      <div className='edit-page'>

        <div className='edit-section-label'>
          <span className='edit-label-text'>ACTIVITIES</span>
        </div>

        <div className='edit-card'>
          {activities.map((activity, i) => (
            <div key={activity.name} className={`edit-row ${i !== 0 ? 'edit-row--bordered' : ''}`}>
              <div className='edit-activity-name'>{activity.name}</div>
              <div className='edit-pills'>
                {ALL_TRAITS.map(trait => {
                  const active = draft[activity.name]?.includes(trait);
                  return (
                    <button
                      key={trait}
                      onClick={() => toggleTrait(activity.name, trait)}
                      className={`edit-pill ${active ? 'edit-pill--active' : ''}`}
                      style={active ? {
                        background: TRAIT_COLORS[trait],
                        borderColor: TRAIT_COLORS[trait],
                        color: '#111'
                      } : {}}
                    >
                      {trait}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className='edit-section-label edit-section-label--spaced'>
          <span className='edit-label-text'>NEW ACTIVITY</span>
        </div>

        <div className='edit-card'>
          <div className='edit-add-row'>
            <input
              className='edit-input'
              type='text'
              placeholder='Activity name...'
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddActivity()}
            />
            <button className='edit-add-btn' onClick={handleAddActivity}>＋ ADD</button>
          </div>
          <div className='edit-pills edit-pills--padded'>
            {ALL_TRAITS.map(trait => {
              const active = newTraits.includes(trait);
              return (
                <button
                  key={trait}
                  onClick={() => toggleNewTrait(trait)}
                  className={`edit-pill ${active ? 'edit-pill--active' : ''}`}
                  style={active ? {
                    background: TRAIT_COLORS[trait],
                    borderColor: TRAIT_COLORS[trait],
                    color: '#111'
                  } : {}}
                >
                  {trait}
                </button>
              );
            })}
          </div>
        </div>

        <div className='edit-actions'>
          <button className='edit-back-btn' onClick={() => navigate(-1)}>BACK</button>
          <button className='edit-save-btn' onClick={handleSave}>SAVE CHANGES</button>
        </div>

      </div>
    </div>
  );
}