import { BrowserRouter as Router, Link } from 'react-router-dom';
import Whatsapp from '@/assets/icons/whatsapp-svgrepo-com.svg?react';
import Linkedin from '@/assets/icons/linkedin-svgrepo-com.svg?react';
import Github from '@/assets/icons/github-142-svgrepo-com.svg?react';
import Home from '@/assets/icons/home-1-svgrepo-com.svg?react';
import HomeActive from '@/assets/icons/home-page-svgrepo-com.svg?react';
import Menu from '@/assets/icons/menu-rounded.svg?react';
import { data } from '@/data/links';
import { useState } from 'react';

import './style.scss';
function main() {
    const [activeLink, setActiveLink] = useState('/');
    return (
        <>
            <div className="main">
                <div className="menu">
                    <Menu style={{ width: '2.5pc', height: '2.5pc' }} />
                </div>
                <ul className='nav' >
                    {data.map((link) => (
                        <li key={link.url}>
                            <Link to={link.url} className={activeLink === link.url ? 'active' : ''} onClick={() => setActiveLink(link.url)}>
                                {link.url === '/' ? 
                                    (activeLink === link.url ? 
                                        <HomeActive style={{ width: '1.3pc', height: '2pc'}} /> 
                                        : <Home  style={{ width: '1.3pc', height: '1pc'}} />
                                    ) : <></>
                                }{link['label']}
                            </Link>
                        </li>
                    ))}
                </ul>
                <ul className='icons'>
                    <p><Whatsapp style={{ width: '2.5pc', height: '2.5pc' }} /></p>
                    <p><Linkedin style={{ width: '3.1pc', height: '3.1pc' }} /></p>
                    <p><Github style={{ width: '2.5pc', height: '2.5pc' }} /></p>
                </ul>
            </div>
        </>
    )
}

export default main