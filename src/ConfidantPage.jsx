import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import redBgPic from './assets/red_bg.webp';
import morganaAvatar from './assets/characters/morgana/morgana-normal.webp';
import futabaAvatar from './assets/characters/futaba/futaba_normal.png';
import makotoAvatar from './assets/characters/makoto/makoto_normal.png';
import './ConfidantPage.css';

const CHARACTER_OPTIONS = [
  { key: 'morgana', label: 'Morgana', image: morganaAvatar },
  { key: 'futaba', label: 'Futaba', image: futabaAvatar },
  { key: 'makoto', label: 'Makoto', image: makotoAvatar },
];

export default function ConfidantPage({ selectedConfidant, onSelectConfidant }) {
  const navigate = useNavigate();

  return (
    <div className='everything-container'>
      <img className='bg-image' src={redBgPic} />
      <Header onReset={() => {}} />

      <main className='character-page'>
        <section className='character-page__panel'>
          <div className='character-page__header'>
            <h1 className='character-page__title'>Choose your confidant</h1>
            {/* <p className='character-page__subtitle'>Click the avatar which you feel best represents you or create your own.</p> */}
          </div>

          <div className='character-grid'>
            {CHARACTER_OPTIONS.map((confidant) => (
              <button
                key={confidant.key}
                type='button'
                className={`character-card ${selectedConfidant === confidant.key ? 'selected' : ''}`}
                onClick={() => {
                  onSelectConfidant(confidant.key);
                  navigate('/');
                }}
              >
                <div className='character-card__image'>
                  <img src={confidant.image} alt={confidant.label} />
                </div>
                <span className='character-card__label'>{confidant.label}</span>
              </button>
            ))}
          </div>

          <div className='character-page__actions'>
            <button className='character-button' onClick={() => navigate('/')}>Continue</button>
          </div>
        </section>
      </main>
    </div>
  );
}
