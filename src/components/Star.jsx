import React from 'react';
import './Star.css'
import {
    Radar, RadarChart, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const Star = ({ stats }) => {

    const data = [
        { name: 'Knowledge', x: stats.Knowledge },
        { name: 'Guts', x: stats.Guts },
        { name: 'Proficiency', x: stats.Proficiency },
        { name: 'Kindness', x: stats.Kindness },
        { name: 'Charm', x: stats.Charm },
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
                outerRadius="80%" data={gridData}>
                {/* <PolarGrid /> */}
                <PolarAngleAxis dataKey="name" tick={({ x, y, payload }) => {
                    const isMax = data.find(d => d.name === payload.value)?.x >= 5;
                    const label = `${payload.value}${isMax ? ' [MAX]' : ''}`;
                    const width = label.length * 15;
                    const height = 35;

                    const isSpaces = payload.value.trim() === '';
                    if (isSpaces) return null; // skip rendering entirely

                    return (
                        <g transform={`translate(${x},${y})`}>
                            <rect
                                x={-width / 2}
                                y={-height / 2}
                                width={width}
                                height={height}
                                fill="yellow"
                                rx={3}
                            />
                            <text
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize={20}
                                fontWeight={600}
                                fill="black"
                            >
                                {label}
                            </text>
                        </g>
                    );
                }} />
                <PolarRadiusAxis domain={[0, 5]} tick={false} axisLine={false} />
                <Radar dataKey="grid" stroke="#000000" strokeWidth={5} fill="#2F2F2F" fillOpacity={1} />
                <Radar dataKey="x" stroke="#E68C00" strokeWidth={3} fill="#FEC901" fillOpacity={1} />
            </RadarChart>
        </div>
    );
};

export default Star;