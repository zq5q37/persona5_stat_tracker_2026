import React from 'react';
import './Star.css'
import {
    Radar, RadarChart, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const Star = ({stats}) => {

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
        const inBetweenValue = (data[i].x + data[(i+1)%data.length].x);
        const fractionalValue = inBetweenValue * 0.18;
        const iName = ' '.repeat(i);
        starData.push({name: iName, x: fractionalValue})
    };

    return (
        <div className='star-container'>
            <RadarChart height={500} width={500}
                outerRadius="80%" data={starData}>
                {/* <PolarGrid /> */}
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis domain={[0, 5]} tick={false} axisLine={false} />
                <Radar dataKey="x" stroke="orange"
                    fill="yellow" fillOpacity={0.9} />
            </RadarChart>
        </div>
    );
};

export default Star;