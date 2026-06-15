import './Header.css'
import logoUrl from '../assets/Persona-5-Logo.png'

function Header() {
    return (
        <>
            <div className="header-bar">
                <div className='left'>
                    <div className="logo">
                        <img src={logoUrl}></img>
                    </div>
                    <h1>STATS</h1>
                </div>
                <div className='right'>
                    <button>Sound</button>
                </div>

            </div>
        </>
    )
}

export default Header