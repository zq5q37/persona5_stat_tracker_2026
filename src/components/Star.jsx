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

    return (
        <div className='star-container'>
            <RadarChart height={500} width={500}
                outerRadius="80%" data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis />
                <Radar dataKey="x" stroke="orange"
                    fill="yellow" fillOpacity={0.9} />
            </RadarChart>
        </div>
    );
};

export default Star;