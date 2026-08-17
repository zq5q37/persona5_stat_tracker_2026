import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import redBgPic from './assets/red_bg.webp';
import { CONFIDANT_LIST, DEFAULT_CONFIDANT } from './confidants.js';
import { GACHA_COST } from './utils/gacha';
import './ConfidantPage.css';
import YenDisplay from './components/YenDisplay.jsx';
import GachaReveal from './components/GachaReveal.jsx';

const CHARACTER_OPTIONS = CONFIDANT_LIST;

export default function ConfidantPage({
    selectedConfidant, onSelectConfidant,
    unlockedConfidants, yen, onGachaRoll, onResetConfidants,
    gachaResult, onDismissGachaResult,
}) {
    const navigate = useNavigate();

    const alreadyReset =
        unlockedConfidants.length === 1 &&
        unlockedConfidants[0] === DEFAULT_CONFIDANT &&
        selectedConfidant === DEFAULT_CONFIDANT;

    return (
        <>

            <section className='character-page__panel'>
                <div className='character-page__header'>
                    <YenDisplay yen={yen} />
                    <button
                        type='button'
                        className='dialogue-button'
                        onClick={onGachaRoll}
                        disabled={yen < GACHA_COST}
                    >
                        Roll for ¥{GACHA_COST}
                    </button>
                </div>

                <div className='character-grid'>
                    {CHARACTER_OPTIONS.map((confidant) => {
                        const isUnlocked = unlockedConfidants.includes(confidant.key);
                        return (
                            <button
                                key={confidant.key}
                                type='button'
                                disabled={!isUnlocked}
                                className={`character-card ${selectedConfidant === confidant.key ? 'selected' : ''} ${!isUnlocked ? 'locked' : ''}`}
                                onClick={() => isUnlocked && onSelectConfidant(confidant.key)}
                            >
                                <div className='character-card__image'>
                                    <img
                                        src={confidant.images.idle}
                                        alt={isUnlocked ? confidant.label : '???'}
                                        className={!isUnlocked ? 'silhouette' : ''}
                                    />
                                </div>
                            </button>
                        );
                    })}
                </div>

            </section>

            {gachaResult && (
                <GachaReveal result={gachaResult} onDismiss={onDismissGachaResult} />
            )}

            <div className='character-page__footer'>
                <button
                    type='button'
                    className='dialogue-button back-button'
                    onClick={onResetConfidants}
                    disabled={alreadyReset}
                >
                    Remove Confidants
                </button>
            </div>
        </>
    );
}