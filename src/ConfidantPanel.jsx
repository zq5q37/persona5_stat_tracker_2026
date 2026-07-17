import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import redBgPic from './assets/red_bg.webp';
import { CONFIDANT_LIST } from './confidants.js';
import './ConfidantPage.css';

const CHARACTER_OPTIONS = CONFIDANT_LIST;

export default function ConfidantPage({ selectedConfidant, onSelectConfidant }) {
    const navigate = useNavigate();

    return (
        <section className='character-page__panel'>
            <div className='character-page__header'>
            </div>

            <div className='character-grid'>
                {CHARACTER_OPTIONS.map((confidant) => (
                    <button
                        key={confidant.key}
                        type='button'
                        className={`character-card ${selectedConfidant === confidant.key ? 'selected' : ''}`}
                        onClick={() => {
                            onSelectConfidant(confidant.key);
                        }}
                    >
                        <div className='character-card__image'>
                            <img src={confidant.images.idle} alt={confidant.label} />
                        </div>
                    </button>
                ))}
            </div>
        </section>
    );
}
