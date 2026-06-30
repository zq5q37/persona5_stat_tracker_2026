import React from 'react';
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

const Star = React.memo(({ stats, expUp, isMax }) => {

    const data = [
        { name: 'Knowledge', x: stats.Knowledge.level },
        { name: 'Guts', x: stats.Guts.level },
        { name: 'Proficiency', x: stats.Proficiency.level },
        { name: 'Kindness', x: stats.Kindness.level },
        { name: 'Charm', x: stats.Charm.level },
    ];

    const starData = [];

    for (let i = 0; i < data.length; i++) {
        starData.push(data[i]);
        const inBetweenValue = (data[i].x + data[(i + 1) % data.length].x);
        const fractionalValue = inBetweenValue * 0.18;
        const iName = ' '.repeat(i);
        starData.push({ name: iName, x: fractionalValue })
    };

    const gridData = [];

    const inset = 0.3;
    for (let i = 0; i < data.length; i++) {
        gridData.push({ ...starData[i * 2], grid: 5 });
        const fractional = (5 * 2) * 0.18;
        gridData.push({ ...starData[i * 2 + 1], grid: fractional });
    }

    const outlineData = gridData.map(d => ({ ...d, xOutline: d.x !== undefined ? (d.x * 0.5) : undefined }));

    return (
        <div className='star-container'>
            <RadarChart height={500} width={500}
                outerRadius="80%" data={outlineData}>
                <PolarAngleAxis dataKey="name" tick={({ x, y, payload }) => {
                    const statValue = data.find(d => d.name === payload.value)?.x;
                    const isMax = statValue >= 5;
                    const label = `${payload.value}${isMax ? ' [MAX]' : ''}`;
                    const rankIndex = Math.min(Math.max(Math.ceil(statValue) - 1, 0), 4);
                    const rankName = RANK_NAMES[payload.value]?.[rankIndex] ?? '';

                    const measureText = (text, font = '600 26px sans-serif') => {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        ctx.font = font;
                        return ctx.measureText(text).width;
                    };

                    const measureTextSmall = (text, font = '500 18px sans-serif') => {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        ctx.font = font;
                        return ctx.measureText(text).width;
                    };

                    const isSpaces = payload.value.trim() === '';
                    if (isSpaces) return null;

                    const labelWidth = measureText(label) + 7;
                    const rankWidth = measureTextSmall(rankName) + 3;
                    const boxWidth = labelWidth;
                    const boxHeight = 38;

                    return (
                        <g transform={`translate(${x},${y})`}>
                            <rect
                                key={payload.value}
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
                                fontSize={27}
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
                }} />
                <PolarRadiusAxis domain={[0, 5]} tick={false} axisLine={false} />
                <Radar isAnimationActive={false} dataKey="grid" stroke="#000000" strokeWidth={13} fill="#353535" fillOpacity={1} />
                <Radar dataKey="x" stroke="none" fill="#E68C00" fillOpacity={1} />
                <Radar dataKey="xOutline" stroke="none" fill="#FEC901" fillOpacity={1} />
            </RadarChart>
            {isMax &&
                <div className={`rank-up-logo ${expUp ? 'animating' : ''}`}>
                    <img src={rankUpMaxLogo}></img>
                </div>
            }
        </div>

    );
});

export default Star;