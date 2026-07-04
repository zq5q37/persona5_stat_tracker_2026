import { Outlet, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import redBgPic from './assets/red_bg.webp';

function Layout({ user, onLogin, onLogout, selectedConfidant }) {
    const navigate = useNavigate();

    return (
        <div className='everything-container'>
            <img className='bg-image' src={redBgPic} alt="" />
            <Header
                onChangeConfidant={() => navigate('/confidants')}
                currentConfidant={selectedConfidant}
                user={user}
                onLogin={onLogin}
                onLogout={onLogout}
            />
            <Outlet />
        </div>
    );
}

export default Layout;