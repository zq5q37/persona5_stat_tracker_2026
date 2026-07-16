// components/YenDisplay.jsx
import './YenDisplay.css';

function YenDisplay({ yen }) {
    // let yen1 = 1000;
    return (
        <div className="yen-display">
            <span className="yen-icon">¥</span>
            <span className="yen-count">{yen.toLocaleString()}</span>
        </div>
    );
}

export default YenDisplay;