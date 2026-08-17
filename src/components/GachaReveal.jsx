import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CONFIDANTS } from '../confidants.js';
import { DUPLICATE_REFUND } from '../utils/gacha';
import packLogo from '../assets/Persona-5-Logo.png';
import './GachaReveal.css';

const PACK_SIZE = 5;
const CARDS = Array.from({ length: PACK_SIZE }, (_, i) => i);
const MIDDLE = Math.floor(PACK_SIZE / 2);

// Keep in sync with the flip transition in GachaReveal.css
const FLIP_MS = 750;

// The roll is already decided by the time this mounts — every card hides the
// same confidant, so whichever one the player picks reveals `result`.
export default function GachaReveal({ result, onDismiss }) {
    const confidant = CONFIDANTS[result.key];
    const trackRef = useRef(null);

    const [activeIndex, setActiveIndex] = useState(MIDDLE);
    const [pickedIndex, setPickedIndex] = useState(null);
    const [revealed, setRevealed] = useState(false);

    // Open on the middle card rather than the left edge
    useEffect(() => {
        const track = trackRef.current;
        const middle = track?.children[MIDDLE];
        if (!middle) return;
        track.scrollLeft = middle.offsetLeft + middle.offsetWidth / 2 - track.clientWidth / 2;
    }, []);

    // Whichever card is nearest the centre gets scaled up as you scroll
    const syncActive = useCallback(() => {
        const track = trackRef.current;
        if (!track) return;

        const centre = track.scrollLeft + track.clientWidth / 2;
        let nearest = 0;
        let smallestGap = Infinity;

        Array.from(track.children).forEach((card, i) => {
            const gap = Math.abs(card.offsetLeft + card.offsetWidth / 2 - centre);
            if (gap < smallestGap) {
                smallestGap = gap;
                nearest = i;
            }
        });

        setActiveIndex(nearest);
    }, []);

    const pickCard = (index) => {
        if (pickedIndex !== null) return;
        setPickedIndex(index);
        trackRef.current?.children[index]?.scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest',
        });
    };

    useEffect(() => {
        if (pickedIndex === null) return;
        const timer = setTimeout(() => setRevealed(true), FLIP_MS);
        return () => clearTimeout(timer);
    }, [pickedIndex]);

    // Locking the track swaps overflow to hidden, which can drop its scroll
    // offset — put the revealed card back in the middle either way
    useEffect(() => {
        if (!revealed || pickedIndex === null) return;
        const track = trackRef.current;
        const card = track?.children[pickedIndex];
        if (!card) return;
        track.scrollLeft = card.offsetLeft + card.offsetWidth / 2 - track.clientWidth / 2;
    }, [revealed, pickedIndex]);

    // Escape always closes, so the overlay can never trap the player
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') onDismiss();
        };
        window.addEventListener('keydown', handleKey);

        const bodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleKey);
            document.body.style.overflow = bodyOverflow;
        };
    }, [onDismiss]);

    const message = result.isDuplicate
        ? `${confidant.label} again — refunded ¥${DUPLICATE_REFUND}.`
        : `${confidant.label} joined you!`;

    return createPortal(
        <div className='gacha-reveal' role='dialog' aria-modal='true' aria-label='Card pack'>
            <button
                type='button'
                className='gacha-reveal__close'
                onClick={onDismiss}
                aria-label='Close'
            >
                ✕
            </button>

            <p className='gacha-reveal__prompt' aria-live='polite'>
                {revealed ? message : 'Pick a card'}
            </p>

            <div
                ref={trackRef}
                className={`gacha-reveal__track ${revealed ? 'is-locked' : ''}`}
                onScroll={syncActive}
            >
                {CARDS.map((i) => {
                    const isPicked = i === pickedIndex;
                    const classes = [
                        'gacha-card',
                        isPicked || (pickedIndex === null && i === activeIndex) ? 'is-active' : '',
                        isPicked ? 'is-flipped' : '',
                        pickedIndex !== null && !isPicked ? 'is-dimmed' : '',
                    ];

                    return (
                        <button
                            key={i}
                            type='button'
                            className={classes.filter(Boolean).join(' ')}
                            onClick={() => pickCard(i)}
                            disabled={pickedIndex !== null}
                            aria-label={isPicked ? confidant.label : `Card ${i + 1}`}
                        >
                            <div className='gacha-card__inner'>
                                <div className='gacha-card__face gacha-card__face--cover'>
                                    <img className='gacha-card__logo' src={packLogo} alt='' />
                                </div>
                                <div
                                    className={`gacha-card__face gacha-card__face--art ${result.isDuplicate ? '' : 'is-new'}`}
                                >
                                    <img
                                        className='gacha-card__art'
                                        src={confidant.images.idle}
                                        alt=''
                                    />
                                    <span className='gacha-card__name'>{confidant.label}</span>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {revealed && (
                <button
                    type='button'
                    className='dialogue-button gacha-reveal__continue'
                    onClick={onDismiss}
                >
                    Continue
                </button>
            )}
        </div>,
        document.body
    );
}
