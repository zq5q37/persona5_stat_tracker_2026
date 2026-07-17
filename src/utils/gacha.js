import { CONFIDANT_LIST } from '../confidants.js';

export const GACHA_COST = 500;
export const DUPLICATE_REFUND = 100; // yen back if you roll one you already have

// Returns a random confidant key, uniform chance across all confidants
export const rollGacha = () => {
    const pick = CONFIDANT_LIST[Math.floor(Math.random() * CONFIDANT_LIST.length)];
    return pick.key;
};