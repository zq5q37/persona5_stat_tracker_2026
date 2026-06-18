// EditPage.jsx
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import redBgPic from './assets/red_bg.webp'


export default function EditPage({activities, setActivities}) {
    const navigate = useNavigate();

    const handleClick = () => {
        
    }

    return (
        <>
            <div className='everything-container'>
                <img className='bg-image' src={redBgPic}></img>
                <Header />
                <div className='header'>
                    <h1>Edit Activities</h1>
                </div>
                <div className='activities-container'>
                    {activities.map((activity)=> (
                        <button onClick={() => {handleClick();}}>{activity.name}</button>
                    ))}
                </div>
                <button onClick={() => navigate(-1)}>← Back</button>
            </div>
        </>
    );
}