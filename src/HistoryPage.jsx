import { useNavigate } from 'react-router-dom';
import './HistoryPage.css';

const formatEntry = (entry) => {
  const d = new Date(entry.timestamp);
  const datePart = `${d.getMonth() + 1}/${d.getDate()}`;
  const timePart = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  return `[${datePart} ${timePart}] ${entry.activityName} (${entry.intensity} intensity)`;
};

export default function HistoryPage({ history }) {
  const navigate = useNavigate();

  return (
    <div className="history-container">
      <div className='edit-section-label'>
        <span className='edit-label-text'>LOG HISTORY</span>
      </div>

      <div className="history-list">
        {history.length === 0 ? (
          <p className="history-empty">No activities logged yet.</p>
        ) : (
          history.map((entry, i) => (
            <p key={entry.timestamp ?? i} className="history-entry">
              {formatEntry(entry)}
            </p>
          ))
        )}
      </div>

      <button
        className="dialogue-button back-button"
        onClick={() => {
          navigate('/');
        }}
      >
        Back
      </button>
    </div>
  );
}