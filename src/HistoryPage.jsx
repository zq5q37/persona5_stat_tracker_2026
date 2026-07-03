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
        <div className='edit-section-label'>
          <span className='edit-label-text'>LOG HISTORY</span>
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
    </div>
  );
}
