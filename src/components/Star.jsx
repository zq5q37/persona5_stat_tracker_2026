import React from 'react';
import './Star.css'
import {
    Radar, RadarChart, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const Star = React.memo(({ stats, statLevels }) => {

    const data = [
        { name: 'Knowledge', x: statLevels.Knowledge },
        { name: 'Guts', x: statLevels.Guts },
        { name: 'Proficiency', x: statLevels.Proficiency },
        { name: 'Kindness', x: statLevels.Kindness },
        { name: 'Charm', x: statLevels.Charm },
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

    for (let i = 0; i < data.length; i++) {
        gridData.push({ ...starData[i * 2], grid: 5 });           // outer spike = 5
        const fractional = (5 * 2) * 0.18;                        // same formula as starData
        gridData.push({ ...starData[i * 2 + 1], grid: fractional }); // inner valley
    }

    return (
        <div className='star-container'>
            <RadarChart height={500} width={500}
                outerRadius="85%" data={gridData}>
                <PolarAngleAxis dataKey="name" tick={({ x, y, payload }) => {
                    const isSpaces = payload.value.trim() === '';
                    if (isSpaces) return null; // skip rendering entirely

                    const isMax = data.find(d => d.name === payload.value)?.x >= 5;
                    const statData = stats[payload.value];
                    console.log(statData)
                    const expNeeded = statData.level * 20;
                    const label = payload.value;
                    const subLabel = isMax ? '[MAX]' : `${statData.exp}/${expNeeded}`;

                    const measureText = (text, font = '600 26px sans-serif') => {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        ctx.font = font;
                        return ctx.measureText(text).width;
                    };

                    const width = measureText(label) + 3;
                    const height = 40;

                    return (
                        <g transform={`translate(${x},${y})`}>
                            <rect
                                x={-width / 2}
                                y={-(height / 2) - 5}
                                width={width}
                                height={height}
                                fill="yellow"
                                rx={1}
                            />
                            <text
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize={26}
                                fontWeight={600}
                                fill="black"
                                letterSpacing={-3}
                            >
                                {label}
                            </text>
                            <text
                                textAnchor="middle"
                                fontSize={18}
                                fill="black"
                                y={30}
                            >
                                {subLabel}
                            </text>
                        </g>
                    );
                }} />
                <PolarRadiusAxis domain={[0, 5]} tick={false} axisLine={false} />
                <Radar isAnimationActive={false} dataKey="grid" stroke="#000000" strokeWidth={13} fill="#2F2F2F" fillOpacity={1} />
                <Radar dataKey="x" stroke="#E68C00" strokeWidth={4} fill="#FEC901" fillOpacity={1} />
            </RadarChart>
        </div>
    );
});

export default Star;