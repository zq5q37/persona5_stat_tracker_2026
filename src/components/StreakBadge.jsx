// components/StreakBadge.jsx
import './StreakBadge.css';
import FireIcon from '../assets/fire-icon.png'
function StreakBadge({ currentStreak }) {
    if (!currentStreak) return null

    return (
        <div className="streak-badge">
            <span className="streak-flame">
                <img src={FireIcon}></img>
            </span>
            <span className="streak-count">{currentStreak}</span>
        </div>
    )
}

export default StreakBadge