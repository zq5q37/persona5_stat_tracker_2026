// EditPage.jsx
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import redBgPic from './assets/red_bg.webp'


export default function EditPage() {
    const navigate = useNavigate();

    return (
        <>
            <div className='everything-container'>
                <img className='bg-image' src={redBgPic}></img>
                <Header />
                <div className='header'>
                    <h1>Edit Activities</h1>
                </div>
                <button onClick={() => navigate(-1)}>← Back</button>
            </div>
        </>
    );
}