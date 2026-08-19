import { useNavigate } from 'react-router-dom';
import ActivityHeatmap from './components/ActivityHeatmap';
import './HistoryPage.css';

const formatDate = (timestamp) => {
  const d = new Date(timestamp);
  const datePart = `${d.getMonth() + 1}/${d.getDate()}`;
  const timePart = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${datePart} ${timePart}`;
};

export default function HistoryPage({ history, activities, onClearHistory }) {
  const navigate = useNavigate();

  return (
    <div className="history-container">
      <div className='edit-section-label'>
        <span className='edit-label-text'>LOG HISTORY</span>
      </div>

      {history.length > 0 && (
        <ActivityHeatmap history={history} activities={activities} />
      )}

      {history.length === 0 ? (
        <p className="history-empty">No activities logged yet.</p>
      ) : (
        <table className="history-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Activity</th>
              <th>Intensity</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry, i) => (
              <tr key={entry.timestamp ?? i}>
                <td>{formatDate(entry.timestamp)}</td>
                <td>{entry.activityName}</td>
                <td>{entry.intensity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {history.length > 0 && (
        <button
          className="dialogue-button back-button"
          onClick={onClearHistory}
        >
          Clear History
        </button>
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
  );
}