import './Header.css'
import p5Logo from '../assets/Persona-5-Logo.png'
import statsLogo from '../assets/stats-logo.png'

function Header() {
    return (
        <>
            <div className="header-bar">
                <div className='left'>
                    <div className="logo">
                        <img src={p5Logo}></img>
                    </div>
                    <h1>STATS</h1>
                    
                </div>
                <div className='right'>
                    {/* <button>Sound</button> */}
                    {/* <img className='stats-logo' src={statsLogo}></img> */}
                </div>

            </div>
        </>
    )
}

export default Header