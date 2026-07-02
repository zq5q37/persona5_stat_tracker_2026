import React, { useMemo, useCallback, useRef, useState, useEffect } from 'react';
import './Star.css'
import {
    Radar, RadarChart, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

import rankUpLogo from '../assets/rank-up.png'
import rankUpMaxLogo from '../assets/rank-up-max.png'

const RANK_NAMES = {
    Knowledge: ['Oblivious', 'Learned', 'Scholarly', 'Encyclopedic', 'Erudite'],
    Guts: ['Milquetoast', 'Bold', 'Staunch', 'Dauntless', 'Lionhearted'],
    Proficiency: ['Bumbling', 'Decent', 'Skilled', 'Masterful', 'Transcendent'],
    Kindness: ['Inoffensive', 'Considerate', 'Empathetic', 'Selfless', 'Angelic'],
    Charm: ['Existent', 'Head-turning', 'Suave', 'Charismatic', 'Debonair'],
};

const TickLabel = React.memo(function TickLabel({ x, y, payload, statLookup, rankNames }) {
    const statValue = statLookup[payload.value] ?? 0;
    const isMax = statValue >= 5;
    const label = `${payload.value}${isMax ? ' [MAX]' : ''}`;
    const rankIndex = Math.min(Math.max(Math.ceil(statValue) - 1, 0), 4);
    const rankName = rankNames[payload.value]?.[rankIndex] ?? '';

    const measureText = (text, font = '600 26px sans-serif') => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.font = font;
        return ctx.measureText(text).width;
    };

    const isSpaces = payload.value.trim() === '';
    if (isSpaces) return null;

    const boxWidth = measureText(label) + 7;
    const boxHeight = 35;

    return (
        <g transform={`translate(${x},${y})`}>
            <rect
                x={-boxWidth / 2}
                y={-(boxHeight / 2) - 11}
                width={boxWidth}
                height={boxHeight}
                fill="yellow"
                rx={1}
            />
            <text
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={25}
                fontWeight={600}
                fill="black"
                letterSpacing={-3}
                y={-10}
            >
                {label}
            </text>
            <text
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={18}
                fontWeight={600}
                fill="white"
                stroke="#353535"
                strokeWidth={4}
                paintOrder="stroke"
                y={20}
            >
                {rankName}
            </text>
        </g>
    );
});

const Star = React.memo(({ stats, expUp, isMax, suppressLevelUp, onLevelUpHandled }) => {

    const { Knowledge, Guts, Proficiency, Kindness, Charm } = stats;

    const prevStatsRef = useRef(stats);
    const [levelUp, setLevelUp] = useState(false);

    useEffect(() => {
        const prev = prevStatsRef.current;
        const anyLeveledUp = Object.keys(stats).some(
            (key) => stats[key].level > prev[key].level
        );
        if (anyLeveledUp && !suppressLevelUp) {
            setLevelUp(true);
        }
        prevStatsRef.current = stats;

        if (suppressLevelUp) {
            onLevelUpHandled?.();
        }
    }, [stats]);

    // reset levelUp once the expUp animation cycle ends
    useEffect(() => {
        if (!expUp) {
            setLevelUp(false);
        }
    }, [expUp]);

    // Recompute ONLY when the actual stat levels change — not on expUp toggles.
    const { outlineData, statLookup } = useMemo(() => {
        const data = [
            { name: 'Knowledge', x: Knowledge.level },
            { name: 'Guts', x: Guts.level },
            { name: 'Proficiency', x: Proficiency.level },
            { name: 'Kindness', x: Kindness.level },
            { name: 'Charm', x: Charm.level },
        ];

        const starData = [];
        for (let i = 0; i < data.length; i++) {
            starData.push(data[i]);
            const inBetweenValue = (data[i].x + data[(i + 1) % data.length].x);
            const fractionalValue = inBetweenValue * 0.18;
            const iName = ' '.repeat(i);
            starData.push({ name: iName, x: fractionalValue });
        }

        const gridData = [];
        for (let i = 0; i < data.length; i++) {
            gridData.push({ ...starData[i * 2], grid: 5 });
            const fractional = (5 * 2) * 0.18;
            gridData.push({ ...starData[i * 2 + 1], grid: fractional });
        }

        const outlineData = gridData.map(d => ({
            ...d,
            xOutline: d.x !== undefined ? (d.x * 0.5) : undefined,
        }));

        const statLookup = Object.fromEntries(data.map(d => [d.name, d.x]));

        return { outlineData, statLookup };
    }, [Knowledge.level, Guts.level, Proficiency.level, Kindness.level, Charm.level]);

    const renderTick = useCallback(
        (props) => (
            <TickLabel
                {...props}
                statLookup={statLookup}
                rankNames={RANK_NAMES}
            />
        ),
        [statLookup]
    );

    return (
        <div className='star-container'>
            <RadarChart height={500} width={500}
                outerRadius="70%" data={outlineData}>
                <PolarAngleAxis
                    dataKey="name"
                    tick={renderTick}
                />
                <PolarRadiusAxis domain={[0, 5]} tick={false} axisLine={false} />
                <Radar isAnimationActive={false} dataKey="grid" stroke="#000000" strokeWidth={13} fill="#353535" fillOpacity={1} />
                <Radar dataKey="x" stroke="none" fill="#E68C00" fillOpacity={1} />
                <Radar dataKey="xOutline" stroke="none" fill="#FEC901" fillOpacity={1} />
            </RadarChart>
            {levelUp && !isMax &&
                <div className={`rank-up-logo ${expUp ? 'animating' : ''}`}>
                    <img src={rankUpLogo}></img>
                </div>
            }
            {isMax &&
                <div className={`rank-up-logo rank-up-max-logo ${expUp ? 'animating' : ''}`}>
                    <img src={rankUpMaxLogo}></img>
                </div>
            }
        </div>
    );
});

export default Star;