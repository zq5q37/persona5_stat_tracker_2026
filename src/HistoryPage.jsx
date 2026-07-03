import { useNavigate } from 'react-router-dom';
import redBgPic from './assets/red_bg.webp';
import './HistoryPage.css';

export default function HistoryPage({ activities }) {
  const navigate = useNavigate();

  return (
    <div
      className="history-page"
      style={{ backgroundImage: `url(${redBgPic})` }}
    >
      <div className="history-container">
        <h1>Activity History</h1>
        
        {activities && activities.length > 0 ? (
          <div className="activities-list">
            {activities.map((activity, index) => (
              <div key={index} className="activity-item">
                <h3>{activity.name}</h3>
                {activity.traits && activity.traits.length > 0 ? (
                  <div className="traits-list">
                    {activity.traits.map((trait, i) => (
                      <span key={i} className="trait-badge">
                        {trait}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p>No traits</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-activities">No activities logged yet.</p>
        )}

        <button
          className="dialogue-button back-button"
          onClick={() => {
            navigate('/');
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
}
