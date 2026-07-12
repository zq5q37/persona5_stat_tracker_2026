// components/StreakBadge.jsx
import './StreakBadge.css';

function StreakBadge({ currentStreak }) {
    if (!currentStreak) return null

    return (
        <div className="streak-badge">
            <span className="streak-flame">🔥</span>
            <span className="streak-count">{currentStreak}</span>
        </div>
    )
}

export default StreakBadge