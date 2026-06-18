import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/Header';
import redBgPic from './assets/red_bg.webp';

const ALL_TRAITS = ["Knowledge", "Guts", "Proficiency", "Kindness", "Charm"];

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
        setActivities(prev =>
            prev.map(a => ({ ...a, traits: draft[a.name] }))
        );
        navigate(-1);
    };

    return (
        <div className='everything-container'>
            <img className='bg-image' src={redBgPic} />
            <Header />
            <div className='edit-page-container'>
            <div className='edit-actions'>
                <button className='dialogue-button' onClick={() => navigate(-1)}>← Back</button>
            </div>

            {/* <div className='header'>
                <h1>Edit Activities</h1>
            </div> */}

            {/* Existing activities */}
            <div className='activities-container'>
                <h2>Existing Activities:</h2>
                {activities.map(activity => (
                    <div key={activity.name} className='activity-edit-row'>
                        <span className='activity-edit-name'>{activity.name}</span>
                        <div className='trait-checkboxes'>
                            {ALL_TRAITS.map(trait => (
                                <label key={trait} className='trait-checkbox-label'>
                                    <input
                                        type='checkbox'
                                        checked={draft[activity.name]?.includes(trait)}
                                        onChange={() => toggleTrait(activity.name, trait)}
                                    />
                                    {trait}
                                </label>
                            ))}
                        </div>
                    </div>
                ))}

               
            </div>

            <div className='activities-container'>
                <h2>Add a new activity:</h2>
 {/* Add new activity */}
                <div className='activity-edit-row'>
                    <input
                        className='activity-name-input'
                        type='text'
                        placeholder='Activity name'
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                    />
                    <div className='trait-checkboxes'>
                        {ALL_TRAITS.map(trait => (
                            <label key={trait} className='trait-checkbox-label'>
                                <input
                                    type='checkbox'
                                    checked={newTraits.includes(trait)}
                                    onChange={() => toggleNewTrait(trait)}
                                />
                                {trait}
                            </label>
                        ))}
                    </div>
                    <button className='dialogue-button' onClick={handleAddActivity}>+ Add</button>
                </div>
            </div>



            <div className='save-container'>

                <button className='dialogue-button' onClick={handleSave}>Save</button>

            </div>
            </div>
        </div>
    );
}